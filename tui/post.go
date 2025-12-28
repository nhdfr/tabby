package tui

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/charmbracelet/huh"
	"github.com/nhdfr/tabby/internal/generator"
)

func handlePost() {
	var (
		url         string
		data        string
		contentType string
		useTemplate bool
	)

	form := huh.NewForm(
		huh.NewGroup(
			huh.NewInput().
				Title("enter URL").
				Placeholder("https://example.com/").
				Value(&url).
				Validate(func(s string) error {
					if s == "" {
						return fmt.Errorf("URL cannot be empty")
					}
					if !strings.HasPrefix(s, "http://") && !strings.HasPrefix(s, "https://") {
						return fmt.Errorf("URL must start with http:// or https://")
					}
					return nil
				}),

			huh.NewText().
				Title("Request Body").
				Placeholder(`{"name": "{{name}}", "email": "{{email}}"}`).
				Description("Use {{placeholders}} for random data: {{name}}, {{email}}, {{phone}}, {{number}}, {{uuid}}").
				CharLimit(2000).
				Value(&data).
				Validate(func(s string) error {
					if s == "" {
						return fmt.Errorf("Request body cannot be empty")
					}
					return nil
				}),

			huh.NewSelect[string]().
				Title("Content-Type").
				Options(
					huh.NewOption("application/json", "application/json"),
					huh.NewOption("application/x-www-form-urlencoded", "application/x-www-form-urlencoded"),
					huh.NewOption("text/plain", "text/plain"),
				).
				Value(&contentType),

			huh.NewConfirm().
				Title("Use template placeholders?").
				Description("Generate random data from {{placeholders}} in your request body").
				Value(&useTemplate),
		),
	)

	err := form.Run()
	if err != nil {
		fmt.Println(errorStyle.Render("Error: "), err)
		os.Exit(1)
	}

	fmt.Println("\n" + headerStyle.Render("sending POST request....."))
	executePost(url, data, contentType, useTemplate)
}

func executePost(url, data, contentType string, useTemplate bool) {
	var requestData string

	if useTemplate {
		gen := generator.New()
		generated, err := gen.Generate(data)
		if err != nil {
			fmt.Println(errorStyle.Render("error generating data: "), err)
			os.Exit(1)
		}
		requestData = generated
		fmt.Println(headerStyle.Render("Generated data:"))
		fmt.Println(requestData)
		fmt.Println()
	} else {
		requestData = data
	}

	req, err := http.NewRequest("POST", url, bytes.NewBufferString(requestData))
	if err != nil {
		fmt.Println(errorStyle.Render("error creating request: "), err)
		os.Exit(1)
	}

	if contentType != "" {
		req.Header.Set("Content-Type", contentType)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(errorStyle.Render("✗ Request failed: "), err)
		os.Exit(1)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(errorStyle.Render("✗ Error reading response: "), err)
		os.Exit(1)
	}

	fmt.Println(successStyle.Render("Response received"))
	fmt.Println(headerStyle.Render("Status: ") + (resp.Status))
	fmt.Println(headerStyle.Render("Content-Type: ") + resp.Header.Get("Content-Type"))

	respContentType := resp.Header.Get("Content-Type")
	var output string

	if strings.Contains(respContentType, "application/json") {
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
