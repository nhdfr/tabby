package tui

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/charmbracelet/huh"
	"github.com/charmbracelet/lipgloss"
)

var (
	headerStyle = lipgloss.NewStyle().
		Bold(true).
		Foreground(lipgloss.Color("#FFB86C"))
)

func handleGet() {
	var url string

	form := huh.NewForm(
		huh.NewGroup(
			huh.NewInput().
				Title("enter URL").
				Placeholder("https://example.com/").
				Value(&url).
				Validate(func(s string) error {
					if s == "" {
						return fmt.Errorf("empty url")
					}
					if !strings.HasPrefix(s, "http://") && !strings.HasPrefix(s, "https://") {
						return fmt.Errorf("URL must start with http:// or https://")
					}
					return nil
				}),
		),
	)

	err := form.Run()
	if err != nil {
		fmt.Println(errorStyle.Render("Error: "), err)
		os.Exit(1)
	}

	fmt.Println("\n" + headerStyle.Render("sending GET request..."))
	executeGet(url)
}

func executeGet(url string) {
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println(errorStyle.Render("request failed: "), err)
		os.Exit(1)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		// fmt.Println(errorStyle.Render("error reading response: "), err)
		os.Exit(1)
	}

	fmt.Println(successStyle.Render("Response received"))
	fmt.Println(headerStyle.Render("Status: ") + (resp.Status))
	fmt.Println(headerStyle.Render("Content-Type: ") + resp.Header.Get("Content-Type"))

	contentType := resp.Header.Get("Content-Type")
	var output string

	if strings.Contains(contentType, "application/json") {
		var jsonData interface{}
		if err := json.Unmarshal(body, &jsonData); err == nil {
			prettyJSON, err := json.MarshalIndent(jsonData, "", "  ")
			if err == nil {
				output = string(prettyJSON)
			} else {
				output = string(body)
			}
		} else {
			output = string(body)
		}
	} else {
		output = string(body)
	}

	fmt.Println((output))
}
