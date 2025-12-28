package tui

import (
	"fmt"
	"os"

	"github.com/charmbracelet/huh"
	"github.com/charmbracelet/lipgloss"
)

var (
	titleStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(lipgloss.Color("#7D56F4")).
			MarginTop(1).
			MarginBottom(1)

	successStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#04B575")).
			Bold(true)

	errorStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#FF0000")).
			Bold(true)

	headerStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(lipgloss.Color("#FFB86C"))
)

func Run() {
	fmt.Println(titleStyle.Render("tabby"))

	var method string

	methodForm := huh.NewForm(
		huh.NewGroup(
			huh.NewSelect[string]().
				Title("Choose HTTP Method").
				Options(
					huh.NewOption("GET Request", "get"),
					huh.NewOption("POST Request", "post"),
				).
				Value(&method),
		),
	)

	err := methodForm.Run()
	if err != nil {
		fmt.Println(errorStyle.Render("Error: "), err)
		os.Exit(1)
	}

	switch method {
	case "get":
		handleGet()
	case "post":
		handlePost()
	default:
		fmt.Println(errorStyle.Render("Invalid method selected"))
		os.Exit(1)
	}
}
