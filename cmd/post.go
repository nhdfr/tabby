package cmd

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/spf13/cobra"
)

var (
	postData        string
	postContentType string
	postHeaders     []string
)

var postCmd = &cobra.Command{
	Use:   "post [url]",
	Short: "tabby post <url> -d <data> -H <header>",
	Long:  `Make a POST request to the specified URL with optional data and headers.`,
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		url := args[0]

		var bodyReader io.Reader
		if postData != "" {
			bodyReader = bytes.NewBufferString(postData)
		}

		req, err := http.NewRequest("POST", url, bodyReader)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error creating POST request: %v\n", err)
			os.Exit(1)
		}

		if postContentType != "" {
			req.Header.Set("Content-Type", postContentType)
		}

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
			os.Exit(1)
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error reading response: %v\n", err)
			os.Exit(1)
		}

		fmt.Printf("Status: %s\n", resp.Status)
		fmt.Printf("Content-Type: %s\n\n", resp.Header.Get("Content-Type"))

		contentType := resp.Header.Get("Content-Type")
		if strings.Contains(contentType, "application/json") {
			var jsonData interface{}
			if err := json.Unmarshal(body, &jsonData); err == nil {
				prettyJSON, err := json.MarshalIndent(jsonData, "", "  ")
				if err == nil {
					fmt.Println(string(prettyJSON))
					return
				}
			}
		}

		fmt.Println(string(body))
	},
}

func init() {
	rootCmd.AddCommand(postCmd)

	postCmd.Flags().StringVarP(&postData, "data", "d", "", "Data to send in POST request")
	postCmd.Flags().StringVarP(&postContentType, "content-type", "H", "application/json", "Content-Type header")
	postCmd.Flags().StringSliceVar(&postHeaders, "header", []string{}, "Additional headers (can be used multiple times: --header \"Key: Value\")")
}
