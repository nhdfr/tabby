package cmd

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/spf13/cobra"
)

var getCmd = &cobra.Command{
	Use:   "get [url]",
	Short: "tabby get <url>",
	Long:  `Make a GET request to the specified URL and display the formatted response.`,
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		url := args[0]

		resp, err := http.Get(url)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error making GET request: %v\n", err)
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
	rootCmd.AddCommand(getCmd)
}
