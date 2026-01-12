package cmd

import (
	"os"

	"github.com/spf13/cobra"
)

var Version = "0.1.2"

var rootCmd = &cobra.Command{
	Use:     "tabby",
	Short:   "A powerful terminal-based HTTP testing and stress testing tool",
	Version: Version,
	Long: `Tabby is a terminal-based HTTP testing and stress testing tool with automated data generation capabilities.

Features:
  • GET & POST requests with custom headers
  • Random data generation with template placeholders
  • Loop mode for stress testing
  • JSON pretty printing
  • Template file support for complex request bodies`,
}

func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
}
