package cmd

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/nhdfr/tabby/internal/generator"
	"github.com/spf13/cobra"
)

var (
	postData        string
	postContentType string
	postHeaders     []string
	postTemplate    string
	postLoop        bool
	postCount       int
	postInterval    string
)

var postCmd = &cobra.Command{
	Use:   "post [url]",
	Short: "tabby post <url> -d <data> -H <header>",
	Long: `Make a POST request to the specified URL with optional data and headers.
	
Supports random data generation using templates with placeholders:
  {{name}}          - Random full name
  {{firstname}}     - Random first name
  {{lastname}}      - Random last name
  {{email}}         - Random email address
  {{phone}}         - Random phone number
  {{number}}        - Random number (1-100)
  {{number:1:50}}   - Random number with range
  {{float}}         - Random float (0-100, 2 decimals)
  {{float:1:50:3}}  - Random float with range and decimal places
  {{price}}         - Random price ending in .99 (1-100)
  {{price:5:50}}    - Random price with range
  {{text}}          - Random paragraph
  {{sentence}}      - Random sentence
  {{uuid}}          - Random UUID
  {{bool}}          - Random boolean
  {{date}}          - Random date

Note: For numeric JSON fields, don't wrap placeholders in quotes:
  ✓ "price": {{price}}
  ✗ "price": "{{price}}"`,
	Args: cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		url := args[0]

		var intervalDuration time.Duration
		if postInterval != "" {
			var err error
			intervalDuration, err = time.ParseDuration(postInterval)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Invalid interval format: %v\n", err)
				os.Exit(1)
			}
		} else {
			intervalDuration = 1 * time.Second
		}

		requestCount := 1
		if postLoop {
			if postCount > 0 {
				requestCount = postCount
			} else {
				requestCount = -1
			}
		}

		gen := generator.New()

		count := 0
		for {
			count++

			var bodyReader io.Reader
			var requestData string

			if postTemplate != "" {
				templateBytes, err := os.ReadFile(postTemplate)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Error reading template file: %v\n", err)
					os.Exit(1)
				}

				generated, err := gen.Generate(string(templateBytes))
				if err != nil {
					fmt.Fprintf(os.Stderr, "Error generating data: %v\n", err)
					os.Exit(1)
				}
				requestData = generated
			} else if postData != "" {
				generated, err := gen.Generate(postData)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Error generating data: %v\n", err)
					os.Exit(1)
				}
				requestData = generated
			}

			if requestData != "" {
				bodyReader = bytes.NewBufferString(requestData)
			}

			req, err := http.NewRequest("POST", url, bodyReader)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error creating POST request: %v\n", err)
				os.Exit(1)
			}

			req.Header.Set("Content-Type", postContentType)

			for _, header := range postHeaders {
				parts := strings.SplitN(header, ":", 2)
				if len(parts) == 2 {
					req.Header.Set(strings.TrimSpace(parts[0]), strings.TrimSpace(parts[1]))
				}
			}

			client := &http.Client{}
			resp, err := client.Do(req)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error making POST request: %v\n", err)
				if postLoop && requestCount == -1 {
					time.Sleep(intervalDuration)
					continue
				}
				os.Exit(1)
			}

			body, err := io.ReadAll(resp.Body)
			resp.Body.Close()
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error reading response: %v\n", err)
				if postLoop && requestCount == -1 {
					time.Sleep(intervalDuration)
					continue
				}
				os.Exit(1)
			}

			if postLoop {
				fmt.Printf("\n[Request #%d] %s\n", count, time.Now().Format("15:04:05"))
			}
			fmt.Printf("Status: %s\n", resp.Status)

			if postLoop {
				contentType := resp.Header.Get("Content-Type")
				if strings.Contains(contentType, "application/json") {
					var jsonData interface{}
					if err := json.Unmarshal(body, &jsonData); err == nil {
						prettyJSON, _ := json.MarshalIndent(jsonData, "", "  ")
						fmt.Println(string(prettyJSON))
					} else {
						fmt.Println(string(body))
					}
				} else {
					if len(body) > 200 {
						fmt.Printf("%s... (truncated)\n", string(body[:200]))
					} else {
						fmt.Println(string(body))
					}
				}
			} else {
				fmt.Printf("Content-Type: %s\n\n", resp.Header.Get("Content-Type"))
				contentType := resp.Header.Get("Content-Type")
				if strings.Contains(contentType, "application/json") {
					var jsonData interface{}
					if err := json.Unmarshal(body, &jsonData); err == nil {
						prettyJSON, _ := json.MarshalIndent(jsonData, "", "  ")
						fmt.Println(string(prettyJSON))
					} else {
						fmt.Println(string(body))
					}
				} else {
					fmt.Println(string(body))
				}
			}

			if !postLoop || (requestCount > 0 && count >= requestCount) {
				break
			}

			if postLoop {
				time.Sleep(intervalDuration)
			}
		}

		if postLoop {
			fmt.Printf("\n Completed %d requests\n", count)
		}
	},
}

func init() {
	rootCmd.AddCommand(postCmd)

	postCmd.Flags().StringVarP(&postData, "data", "d", "", "Data to send in POST request (supports placeholders)")
	postCmd.Flags().StringVarP(&postContentType, "content-type", "H", "application/json", "Content-Type header")
	postCmd.Flags().StringSliceVar(&postHeaders, "header", []string{}, "Additional headers (can be used multiple times: --header \"Key: Value\")")
	postCmd.Flags().StringVarP(&postTemplate, "template", "t", "", "Template file with placeholders for random data generation")
	postCmd.Flags().BoolVarP(&postLoop, "loop", "l", false, "Send requests in a loop")
	postCmd.Flags().IntVarP(&postCount, "count", "c", 0, "Number of requests to send in loop mode (0 = infinite)")
	postCmd.Flags().StringVarP(&postInterval, "interval", "i", "1s", "Interval between requests in loop mode (e.g., 1s, 500ms, 2m)")
}
