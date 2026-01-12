<div align="center">
  <img src="web/public/images/tabby.png" alt="Tabby" width="350" height="350"" />
  <p>A powerful terminal-based HTTP testing and stress testing tool with automated data generation capabilities.</p>

  <p>
    <a href="https://github.com/nhdfr/tabby/actions/workflows/release.yml">
      <img src="https://github.com/nhdfr/tabby/actions/workflows/release.yml/badge.svg" alt="Release" />
    </a>
    <a href="https://github.com/nhdfr/tabby/releases/latest">
      <img src="https://img.shields.io/github/v/release/nhdfr/tabby?style=flat&color=blue" alt="Latest Release" />
    </a>
    <a href="https://pkg.go.dev/github.com/nhdfr/tabby">
      <img src="https://pkg.go.dev/badge/github.com/nhdfr/tabby.svg" alt="Go Reference" />
    </a>
    <a href="https://github.com/nhdfr/tabby/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/nhdfr/tabby?style=flat" alt="License" />
    </a>
    <a href="https://github.com/nhdfr/tabby/stargazers">
      <img src="https://img.shields.io/github/stars/nhdfr/tabby?style=flat" alt="Stars" />
    </a>
  </p>

  <p>
    <a href="https://tabby.nhdfr.foo/docs">Documentation</a>
    <span> | </span>
    <a href="https://tabby.nhdfr.foo/docs/installation">Installation</a>
    <span> | </span>
    <a href="https://tabby.nhdfr.foo/playground">Playground</a>
  </p>
</div>

---

## Features

- **GET and POST Requests** - Simple and intuitive HTTP request handling
- **Random Data Generation** - Built-in template system with powerful placeholders
- **Loop Mode** - Automated stress testing with configurable intervals
- **JSON Pretty Printing** - Automatic response formatting for readability
- **Custom Headers** - Full control over request headers
- **Template Files** - Load complex request bodies from external files

## Quick Start


### Installation

#### From AUR (Arch Linux)

```bash
yay -S tabby-cli
```

#### Go (latest)

```bash
go install github.com/nhdfr/tabby@latest
```

Or build from source:

```bash
git clone https://github.com/nhdfr/tabby
cd tabby
go build -o tabby
```

### Basic Usage

```bash
# GET request
tabby get https://api.example.com/users

# POST request with data
tabby post https://api.example.com/users -d '{"name":"John","email":"john@example.com"}'

# POST with random data generation
tabby post https://api.example.com/users -d '{"name":"{{name}}","email":"{{email}}"}'

# Stress testing with loop mode
tabby post https://api.example.com/users -d '{"name":"{{name}}"}' --loop --count 100 --interval 100ms
```

## Documentation

For comprehensive documentation, guides, and examples, visit the official documentation site:

**[https://tabby.nhdfr.com](https://tabby.nhdfr.com)**

The documentation covers:

- [Installation Guide](https://tabby.nhdfr.com/docs/installation) - Multiple installation methods and requirements
- [GET Requests](https://tabby.nhdfr.com/docs/get-requests) - Making GET requests with Tabby
- [POST Requests](https://tabby.nhdfr.com/docs/post-requests) - POST requests with headers and body data
- [Templates](https://tabby.nhdfr.com/docs/templates) - All available placeholders for data generation
- [Loop Mode](https://tabby.nhdfr.com/docs/loop-mode) - Stress testing and automated request loops

## Available Placeholders

Tabby supports a variety of placeholders for generating random data:

| Placeholder          | Description            |
| -------------------- | ---------------------- |
| `{{name}}`           | Random full name       |
| `{{firstname}}`      | Random first name      |
| `{{lastname}}`       | Random last name       |
| `{{email}}`          | Random email address   |
| `{{phone}}`          | Random phone number    |
| `{{number:min:max}}` | Random number in range |
| `{{float}}`          | Random floating number |
| `{{uuid}}`           | Random UUID v4         |
| `{{bool}}`           | Random boolean         |
| `{{date}}`           | Random date            |
| `{{text}}`           | Random paragraph       |
| `{{price}}`          | Random price           |

For a complete list of placeholders and usage examples, see the [Templates documentation](https://tabby.nhdfr.com/docs/templates).

## License

This project is licensed under the AGPL-3.0 License. See the [LICENSE](LICENSE) file for details.
