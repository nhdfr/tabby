package cmd

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/spf13/cobra"
)

var getCmd = &cobra.Command{
	Use:   "get [url]",
	Short: "tabby get <url>",
	Long: ``,

	Args: cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		url := args[0]
		
		curlCmd := exec.Command("curl", "-s", url)
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
	rootCmd.AddCommand(getCmd)

}
