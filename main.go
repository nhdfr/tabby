package main

import (
	"os"

	"github.com/nhdfr/tabby/cmd"
	"github.com/nhdfr/tabby/tui"
)

func main() {
	if len(os.Args) == 1 {
		tui.Run()
		return
	}

	cmd.Execute()
}
