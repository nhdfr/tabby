package cmd

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/spf13/cobra"
)

var (
	postData        string
	postContentType string
)

var postCmd = &cobra.Command{
	Use:   "post [url]",
	Short: "tabby post <url> -d <data> -H <header>",
	Long:  ``,
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		url := args[0]

		curlArgs := []string{"-s", "-X", "POST"}

		if postContentType != "" {
			curlArgs = append(curlArgs, "-H", fmt.Sprintf("Content-Type: %s", postContentType))
		}

		if postData != "" {
			curlArgs = append(curlArgs, "-d", postData)
		}

		curlArgs = append(curlArgs, url)

		curlCmd := exec.Command("curl", curlArgs...)
		curlCmd.Stdout = os.Stdout
		curlCmd.Stderr = os.Stderr

		err := curlCmd.Run()
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error executing curl: %v\n", err)
			os.Exit(1)
		}
	},
}

func init() {
	rootCmd.AddCommand(postCmd)

	postCmd.Flags().StringVarP(&postData, "data", "d", "", "Data to send in POST request")
	postCmd.Flags().StringVarP(&postContentType, "content-type", "H", "application/json", "Content-Type header")
}
