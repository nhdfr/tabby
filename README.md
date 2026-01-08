# Tabby

A powerful terminal-based HTTP testing and stress testing tool with automated data generation capabilities.

## Features

- **GET & POST Requests** - Simple HTTP request handling
- **Random Data Generation** - Built-in template system with placeholders
- **Loop Mode** - Automated stress testing with configurable intervals
- **JSON Pretty Printing** - Automatic response formatting
- **Custom Headers** - Full control over request headers
- **Template Files** - Load complex request bodies from files

## Installation

```bash
go install github.com/nhdfr/tabby@latest
```

Or build from source:

```bash
git clone https://github.com/nhdfr/tabby
cd tabby
go build -o tabby
```

## Usage

### GET Request

```bash
# Basic GET request
tabby get https://api.example.com/users

# Response includes status, content-type, and formatted body
```

### POST Request

```bash
# Simple POST with data
tabby post https://api.example.com/users -d '{"name":"John","email":"john@example.com"}'

# POST with custom headers
tabby post https://api.example.com/users \
  -d '{"name":"John"}' \
  --header "Authorization: Bearer token123" \
  --header "X-Custom-Header: value"

# POST with custom content type
tabby post https://api.example.com/users \
  -d '{"name":"John"}' \
  -H "application/x-www-form-urlencoded"
```

### Template-Based Data Generation

Tabby supports powerful placeholders for generating random data:

```bash
# Inline template
tabby post https://api.example.com/users \
  -d '{"name":"{{name}}","email":"{{email}}","age":{{number:18:65}}}'

# Using a template file
tabby post https://api.example.com/users -t template.json
```

**Available Placeholders:**

| Placeholder | Description | Example |
|------------|-------------|---------|
| `{{name}}` or `{{fullname}}` | Random full name | "John Smith" |
| `{{firstname}}` | Random first name | "John" |
| `{{lastname}}` | Random last name | "Smith" |
| `{{email}}` | Random email address | "johnsmith@example.com" |
| `{{phone}}` or `{{mobile}}` | Random phone number | "+1-555-123-4567" |
| `{{number}}` or `{{int}}` | Random number (1-100) | "42" |
| `{{number:min:max}}` | Random number in range | "25" (for `{{number:10:50}}`) |
| `{{text}}` or `{{paragraph}}` | Random paragraph | Lorem ipsum style text |
| `{{sentence}}` | Random sentence | "Looking forward to your response." |
| `{{uuid}}` | Random UUID v4 | "550e8400-e29b-41d4-a716-446655440000" |
| `{{bool}}` or `{{boolean}}` | Random boolean | "true" or "false" |
| `{{date}}` | Random date (past year) | "2024-03-15" |
| `{{word}}` | Random word | "lorem" |

**Example Template File (`test-template.json`):**

```json
{
  "user": {
    "firstName": "{{firstname}}",
    "lastName": "{{lastname}}",
    "email": "{{email}}",
    "phone": "{{phone}}",
    "age": {{number:18:80}},
    "bio": "{{text}}",
    "isActive": {{bool}},
    "registeredAt": "{{date}}",
    "userId": "{{uuid}}"
  }
}
```

### Stress Testing / Loop Mode

```bash
# Infinite loop (press Ctrl+C to stop)
tabby post https://api.example.com/users \
  -d '{"name":"{{name}}","email":"{{email}}"}' \
  --loop

# Limited number of requests
tabby post https://api.example.com/users \
  -d '{"name":"{{name}}"}' \
  --loop \
  --count 100

# Custom interval between requests
tabby post https://api.example.com/users \
  -d '{"name":"{{name}}"}' \
  --loop \
  --interval 500ms

# Complete stress test example
tabby post https://api.example.com/users \
  -t template.json \
  --loop \
  --count 1000 \
  --interval 100ms \
  --header "Authorization: Bearer token123"
```

**Loop Mode Features:**
- Shows request counter and timestamp for each request
- Truncates large responses (>200 chars) for better readability
- Displays total request count on completion
- Each request generates fresh random data from templates

## Command Reference

### GET Command

```bash
tabby get [url]
```

**Flags:**
- None currently

### POST Command

```bash
tabby post [url] [flags]
```

**Flags:**

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--data` | `-d` | Request body (supports placeholders) | "" |
| `--content-type` | `-H` | Content-Type header | "application/json" |
| `--header` | - | Additional headers (repeatable) | [] |
| `--template` | `-t` | Template file path | "" |
| `--loop` | `-l` | Enable loop mode | false |
| `--count` | `-c` | Number of requests (0=infinite) | 0 |
| `--interval` | `-i` | Interval between requests | "1s" |

**Interval Format:**
- `500ms` - 500 milliseconds
- `1s` - 1 second
- `2m` - 2 minutes
- `1h` - 1 hour

## Examples

### Basic API Testing

```bash
# Test user creation endpoint
tabby post https://api.example.com/users \
  -d '{"username":"testuser","email":"test@example.com"}'
```

### Load Testing

```bash
# Send 500 requests with random user data, 100ms apart
tabby post https://api.example.com/users \
  -d '{"username":"user_{{number:1000:9999}}","email":"{{email}}"}' \
  --loop \
  --count 500 \
  --interval 100ms
```

### Complex Template Testing

Create `user-template.json`:
```json
{
  "profile": {
    "name": "{{name}}",
    "email": "{{email}}",
    "phone": "{{phone}}",
    "age": {{number:18:65}},
    "bio": "{{sentence}}",
    "preferences": {
      "newsletter": {{bool}},
      "notifications": {{bool}}
    }
  },
  "metadata": {
    "createdAt": "{{date}}",
    "userId": "{{uuid}}"
  }
}
```

Then run:
```bash
tabby post https://api.example.com/users -t user-template.json --loop --count 10
```

## Output Format

### Single Request
```
Status: 200 OK
Content-Type: application/json

{
  "id": 123,
  "name": "John Smith",
  "email": "john@example.com"
}
```

### Loop Mode
```
[Request #1] 14:30:45
Status: 201 Created
{
  "id": 1,
  "created": true
}

[Request #2] 14:30:46
Status: 201 Created
{
  "id": 2,
  "created": true
}

Completed 2 requests
```

## Building from Source

```bash
# Clone the repository
git clone https://github.com/nhdfr/tabby
cd tabby

# Build
go build -o tabby

# Run
./tabby --help
```


## Future Roadmap

- Support for PUT, PATCH, DELETE requests
- Request history and replay
- Performance metrics and statistics
- Authentication helpers (OAuth, JWT, etc.)
- Request collections and workspaces
- Environment variables and configuration files

## License

See [LICENSE](LICENSE) file for details.
