# curl - Cheat Sheet

## Overview

curl (Client URL) is a command-line tool for transferring data using various protocols (HTTP, HTTPS, FTP, etc.). It's one of the most versatile tools for testing APIs and downloading files.

## Basic Usage

### Simple GET Request

```bash
# Basic GET request
curl https://api.example.com

# GET with output to file
curl https://example.com -o page.html
curl https://example.com --output page.html

# Download with original filename
curl -O https://example.com/file.zip

# Follow redirects
curl -L https://example.com
```

### Verbose and Silent Modes

```bash
# Verbose mode (show detailed info)
curl -v https://api.example.com

# Silent mode (no progress bar)
curl -s https://api.example.com

# Show only HTTP headers
curl -I https://api.example.com
curl --head https://api.example.com
```

## HTTP Methods

### GET Request

```bash
# Simple GET
curl https://api.example.com/users

# GET with query parameters
curl "https://api.example.com/users?page=1&limit=10"

# GET with headers
curl -H "Authorization: Bearer TOKEN" https://api.example.com/users
```

### POST Request

```bash
# POST with JSON data
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'

# POST with data from file
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d @data.json

# POST form data
curl -X POST https://api.example.com/login \
  -d "username=john" \
  -d "password=secret"

# POST multipart form (file upload)
curl -X POST https://api.example.com/upload \
  -F "file=@document.pdf" \
  -F "description=My document"
```

### PUT Request

```bash
# PUT to update a resource
curl -X PUT https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

### PATCH Request

```bash
# PATCH to partially update
curl -X PATCH https://api.example.com/users/123 \
  -H "Content-Type: application/json" \
  -d '{"email":"newemail@example.com"}'
```

### DELETE Request

```bash
# DELETE a resource
curl -X DELETE https://api.example.com/users/123

# DELETE with authentication
curl -X DELETE https://api.example.com/users/123 \
  -H "Authorization: Bearer TOKEN"
```

## Headers

### Setting Headers

```bash
# Single header
curl -H "Authorization: Bearer TOKEN" https://api.example.com

# Multiple headers
curl -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     https://api.example.com

# User-Agent
curl -A "MyApp/1.0" https://api.example.com
curl --user-agent "MyApp/1.0" https://api.example.com
```

### Viewing Response Headers

```bash
# Headers only
curl -I https://api.example.com

# Headers + body
curl -i https://api.example.com

# Verbose (request + response headers)
curl -v https://api.example.com
```

## Authentication

### Basic Authentication

```bash
# Basic auth
curl -u username:password https://api.example.com

# Basic auth (interactive password prompt)
curl -u username https://api.example.com
```

### Bearer Token

```bash
# Bearer token
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.example.com
```

### API Key

```bash
# API key in header
curl -H "X-API-Key: YOUR_API_KEY" https://api.example.com

# API key in query parameter
curl "https://api.example.com/data?api_key=YOUR_API_KEY"
```

## Data Formats

### JSON

```bash
# Send JSON data
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","age":30}'

# JSON from file
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d @user.json

# Pretty print JSON response (with jq)
curl https://api.example.com/users | jq
```

### Form Data

```bash
# URL-encoded form data
curl -X POST https://api.example.com/login \
  -d "username=john" \
  -d "password=secret"

# Equivalent with --data-urlencode
curl -X POST https://api.example.com/search \
  --data-urlencode "query=hello world" \
  --data-urlencode "page=1"
```

### File Upload

```bash
# Upload a file
curl -X POST https://api.example.com/upload \
  -F "file=@document.pdf"

# Upload with additional fields
curl -X POST https://api.example.com/upload \
  -F "file=@image.jpg" \
  -F "title=My Image" \
  -F "description=A beautiful sunset"

# Multiple files
curl -X POST https://api.example.com/upload \
  -F "file1=@doc1.pdf" \
  -F "file2=@doc2.pdf"
```

## Response Handling

### Save Response

```bash
# Save to file
curl https://api.example.com/data -o data.json

# Use remote filename
curl -O https://example.com/file.zip

# Save headers to file
curl -D headers.txt https://api.example.com
```

### Filter Response

```bash
# Get only HTTP status code
curl -s -o /dev/null -w "%{http_code}" https://api.example.com

# Get response time
curl -s -o /dev/null -w "%{time_total}" https://api.example.com

# Multiple format variables
curl -s -o /dev/null -w "Status: %{http_code}\nTime: %{time_total}s\n" \
  https://api.example.com
```

## Cookies

### Send Cookies

```bash
# Send cookie
curl -b "session=abc123" https://api.example.com

# Send from cookie file
curl -b cookies.txt https://api.example.com
```

### Save Cookies

```bash
# Save cookies to file
curl -c cookies.txt https://api.example.com

# Use and update cookies
curl -b cookies.txt -c cookies.txt https://api.example.com/login \
  -d "username=john&password=secret"
```

## Advanced Options

### Timeout

```bash
# Connection timeout (seconds)
curl --connect-timeout 10 https://api.example.com

# Max time for entire operation
curl --max-time 30 https://api.example.com

# Both
curl --connect-timeout 10 --max-time 30 https://api.example.com
```

### Retry

```bash
# Retry on failure
curl --retry 3 https://api.example.com

# Retry with delay
curl --retry 3 --retry-delay 2 https://api.example.com

# Retry on specific HTTP codes
curl --retry 3 --retry-connrefused https://api.example.com
```

### Proxy

```bash
# Use HTTP proxy
curl -x http://proxy.example.com:8080 https://api.example.com

# Proxy with authentication
curl -x http://user:pass@proxy.example.com:8080 https://api.example.com

# SOCKS5 proxy
curl --socks5 localhost:1080 https://api.example.com
```

### SSL/TLS

```bash
# Ignore SSL certificate verification (insecure!)
curl -k https://self-signed.example.com
curl --insecure https://self-signed.example.com

# Specify CA certificate
curl --cacert ca-bundle.crt https://api.example.com

# Use client certificate
curl --cert client.pem --key client-key.pem https://api.example.com
```

## Common Use Cases

### Test API Endpoint

```bash
# Check if API is up
curl -I https://api.example.com/health

# Test with authentication
curl -H "Authorization: Bearer TOKEN" \
     -H "Accept: application/json" \
     https://api.example.com/users | jq
```

### Download File

```bash
# Download with progress bar
curl -O https://example.com/file.zip

# Resume interrupted download
curl -C - -O https://example.com/largefile.zip

# Download multiple files
curl -O https://example.com/file1.zip -O https://example.com/file2.zip
```

### Debug API Call

```bash
# Full verbose output
curl -v https://api.example.com/users

# Show only request headers
curl -v https://api.example.com/users 2>&1 | grep "^>"

# Show only response headers
curl -v https://api.example.com/users 2>&1 | grep "^<"
```

### Performance Testing

```bash
# Measure request time
curl -w "@curl-format.txt" -o /dev/null -s https://api.example.com

# Create curl-format.txt:
cat > curl-format.txt << 'EOF'
    time_namelookup:  %{time_namelookup}s\n
       time_connect:  %{time_connect}s\n
    time_appconnect:  %{time_appconnect}s\n
   time_pretransfer:  %{time_pretransfer}s\n
      time_redirect:  %{time_redirect}s\n
 time_starttransfer:  %{time_starttransfer}s\n
                    ----------\n
         time_total:  %{time_total}s\n
EOF
```

### GraphQL Query

```bash
# GraphQL request
curl -X POST https://api.example.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ users { id name email } }"
  }'

# With variables
curl -X POST https://api.example.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUser($id: ID!) { user(id: $id) { name email } }",
    "variables": {"id": "123"}
  }'
```

## Useful Format Variables

```bash
# Common format variables for -w option:
%{http_code}           # HTTP status code
%{time_total}          # Total time in seconds
%{time_namelookup}     # DNS lookup time
%{time_connect}        # TCP connect time
%{time_starttransfer}  # Time to first byte
%{size_download}       # Downloaded bytes
%{speed_download}      # Download speed (bytes/sec)
%{url_effective}       # Final URL after redirects

# Example usage:
curl -w "Status: %{http_code}\nTime: %{time_total}s\n" \
  -o /dev/null -s https://api.example.com
```

## Tips & Tricks

### Create Alias

```bash
# Add to ~/.bashrc or ~/.zshrc
alias curljson='curl -H "Content-Type: application/json"'
alias curlpost='curl -X POST -H "Content-Type: application/json"'

# Usage
curljson https://api.example.com/users
curlpost https://api.example.com/users -d '{"name":"John"}'
```

### Config File

```bash
# Create ~/.curlrc with default options
# Example ~/.curlrc:
user-agent = "MyApp/1.0"
connect-timeout = 10
max-time = 30
```

### Parallel Requests

```bash
# Multiple requests in parallel (with GNU parallel)
cat urls.txt | parallel -j 10 curl -O

# Or with xargs
cat urls.txt | xargs -P 10 -n 1 curl -O
```

## Common Options Summary

| Option | Description |
|--------|-------------|
| `-X, --request` | HTTP method (GET, POST, PUT, DELETE, etc.) |
| `-d, --data` | Send data in POST request |
| `-H, --header` | Add custom header |
| `-o, --output` | Write output to file |
| `-O, --remote-name` | Save with remote filename |
| `-i, --include` | Include response headers in output |
| `-I, --head` | Show headers only |
| `-v, --verbose` | Verbose mode |
| `-s, --silent` | Silent mode |
| `-L, --location` | Follow redirects |
| `-u, --user` | User authentication |
| `-b, --cookie` | Send cookies |
| `-c, --cookie-jar` | Save cookies |
| `-A, --user-agent` | Set user agent |
| `-F, --form` | Multipart form data |
| `-w, --write-out` | Format output |
| `-k, --insecure` | Skip SSL verification |

## Resources

- [curl Documentation](https://curl.se/docs/)
- [curl Manual](https://curl.se/docs/manpage.html)
- [Everything curl Book](https://everything.curl.dev/)
