# Go Ecosystem Cheat Sheet

## Overview

Go (Golang) is a statically typed, compiled programming language designed at Google. This cheat sheet focuses on the Go ecosystem: build, test, modules, and tooling.

**Key Features:**
- Fast compilation
- Built-in concurrency
- Garbage collection
- Static typing with type inference
- Comprehensive standard library
- Built-in testing and benchmarking
- Cross-platform compilation

## Installation

### macOS
```bash
# Using Homebrew
brew install go

# Verify installation
go version
```

### Linux
```bash
# Download from go.dev
wget https://go.dev/dl/go1.24.0.linux-amd64.tar.gz

# Extract
sudo tar -C /usr/local -xzf go1.24.0.linux-amd64.tar.gz

# Add to PATH in ~/.profile or ~/.bashrc
export PATH=$PATH:/usr/local/go/bin

# Verify
go version
```

### Windows
Download installer from https://go.dev/dl/ and run it.

### Environment Variables
```bash
# GOPATH - workspace directory
export GOPATH=$HOME/go

# GOBIN - where 'go install' will place binaries
export GOBIN=$GOPATH/bin

# Add GOBIN to PATH
export PATH=$PATH:$GOBIN

# GOOS and GOARCH for cross-compilation
export GOOS=linux
export GOARCH=amd64
```

## Go Modules

### Initialize Module
```bash
# Create new module
go mod init example.com/myproject

# Creates go.mod file
```

### go.mod File
```go
module example.com/myproject

go 1.24

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/stretchr/testify v1.8.4
)

require (
    // Indirect dependencies
    github.com/bytedance/sonic v1.9.1 // indirect
)

replace github.com/old/repo => github.com/new/repo v1.0.0

exclude github.com/broken/package v0.1.0
```

### Module Commands

```bash
# Add dependencies and remove unused
go mod tidy

# Download modules to local cache
go mod download

# Copy dependencies to vendor directory
go mod vendor

# Print module dependency graph
go mod graph

# Verify dependencies
go mod verify

# Explain why packages are needed
go mod why github.com/some/package

# Edit go.mod file
go mod edit -require=github.com/new/package@v1.2.3
go mod edit -droprequire=github.com/old/package
go mod edit -replace=github.com/old/repo=github.com/new/repo@v1.0.0
```

### Adding Dependencies

```bash
# Add/upgrade dependency
go get github.com/gin-gonic/gin

# Get specific version
go get github.com/gin-gonic/gin@v1.9.1

# Get latest version
go get github.com/gin-gonic/gin@latest

# Upgrade all dependencies
go get -u ./...

# Upgrade minor/patch versions
go get -u=patch ./...
```

### go.sum File
```
github.com/gin-gonic/gin v1.9.1 h1:4idEAncQnU5cB7BeOkPtxjfCSye0AAm1R0RVIqJ+Jmg=
github.com/gin-gonic/gin v1.9.1/go.mod h1:hPrL7YrpYKXt5YId3A/Tnip5kqbEAP+KLuI3SUcPTeU=
```

**Always commit go.sum to version control!**

## Workspaces (Go 1.18+)

### Initialize Workspace
```bash
# Create workspace with modules
go work init ./module1 ./module2

# Creates go.work file
```

### go.work File
```go
go 1.24

use (
    ./module1
    ./module2
    ./shared
)

replace github.com/external/package => ./local/package
```

### Workspace Commands

```bash
# Add module to workspace
go work use ./module3

# Remove module from workspace
go work edit -dropuse=./module3

# Sync workspace dependencies to modules
go work sync

# Print workspace info
go env GOWORK
```

## Building

### Basic Build

```bash
# Build current package
go build

# Build with output name
go build -o myapp

# Build specific package
go build ./cmd/myapp

# Build all packages
go build ./...
```

### Build Options

```bash
# Verbose output
go build -v

# Print commands
go build -x

# Disable optimizations (for debugging)
go build -gcflags="all=-N -l"

# Static linking
go build -ldflags="-extldflags=-static"

# Strip debug info (smaller binary)
go build -ldflags="-s -w"

# Set version info
go build -ldflags="-X main.version=1.0.0"

# Race detector
go build -race

# Memory sanitizer
go build -msan

# Build tags
go build -tags=integration,prod
```

### Cross-Compilation

```bash
# Linux
GOOS=linux GOARCH=amd64 go build

# Windows
GOOS=windows GOARCH=amd64 go build

# macOS
GOOS=darwin GOARCH=amd64 go build

# ARM64
GOARCH=arm64 go build

# List supported platforms
go tool dist list
```

### Install

```bash
# Build and install to $GOBIN
go install

# Install specific version
go install github.com/user/tool@latest
go install github.com/user/tool@v1.2.3
```

## Running

```bash
# Run package
go run main.go

# Run with arguments
go run main.go arg1 arg2

# Run package in directory
go run ./cmd/myapp

# Run with build flags
go run -race main.go
```

## Testing

### Test File Structure
```go
// main.go
package main

func Add(a, b int) int {
    return a + b
}

// main_test.go
package main

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    expected := 5
    if result != expected {
        t.Errorf("Add(2, 3) = %d; want %d", result, expected)
    }
}
```

### Running Tests

```bash
# Run all tests in current directory
go test

# Run all tests in project
go test ./...

# Verbose output
go test -v

# Run specific test
go test -run TestAdd

# Run tests matching pattern
go test -run TestAdd.*

# Short mode (skip long tests)
go test -short

# Parallel tests
go test -parallel 4

# Timeout
go test -timeout 30s

# Run tests multiple times
go test -count 5

# Fail fast (stop on first failure)
go test -failfast
```

### Table-Driven Tests

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"negative numbers", -2, -3, -5},
        {"mixed", -2, 3, 1},
        {"zeros", 0, 0, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d",
                    tt.a, tt.b, result, tt.expected)
            }
        })
    }
}
```

### Test Coverage

```bash
# Run tests with coverage
go test -cover

# Generate coverage profile
go test -coverprofile=coverage.out

# View coverage in HTML
go tool cover -html=coverage.out

# Coverage for all packages
go test -coverprofile=coverage.out ./...

# Coverage with details
go test -coverprofile=coverage.out -covermode=count

# Set coverage threshold
go test -cover -coverpkg=./...
```

### Benchmarking

```go
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(2, 3)
    }
}

func BenchmarkAddParallel(b *testing.B) {
    b.RunParallel(func(pb *testing.PB) {
        for pb.Next() {
            Add(2, 3)
        }
    })
}
```

**Run benchmarks:**
```bash
# Run all benchmarks
go test -bench=.

# Run specific benchmark
go test -bench=BenchmarkAdd

# With memory stats
go test -bench=. -benchmem

# Run for longer duration
go test -bench=. -benchtime=10s

# Number of iterations
go test -bench=. -benchtime=1000000x

# Compare benchmarks
go test -bench=. > old.txt
# Make changes
go test -bench=. > new.txt
benchstat old.txt new.txt
```

### Testing Examples

```go
func ExampleAdd() {
    result := Add(2, 3)
    fmt.Println(result)
    // Output: 5
}

func ExampleAdd_negative() {
    result := Add(-2, -3)
    fmt.Println(result)
    // Output: -5
}
```

### Test Helpers

```go
func TestHelper(t *testing.T) {
    helper := func(t *testing.T, input int) {
        t.Helper() // Mark as helper
        if input < 0 {
            t.Fatal("input must be positive")
        }
    }

    helper(t, 5)
}
```

### Subtests

```go
func TestFoo(t *testing.T) {
    t.Run("subtest1", func(t *testing.T) {
        // Test logic
    })

    t.Run("subtest2", func(t *testing.T) {
        // Test logic
    })
}
```

## Profiling

### CPU Profiling

```bash
# Generate CPU profile
go test -cpuprofile=cpu.prof -bench=.

# Analyze profile
go tool pprof cpu.prof

# Web interface
go tool pprof -http=:8080 cpu.prof
```

### Memory Profiling

```bash
# Generate memory profile
go test -memprofile=mem.prof -bench=.

# Analyze
go tool pprof mem.prof
go tool pprof -http=:8080 mem.prof

# Allocation profile
go test -memprofile=mem.prof -memprofilerate=1 -bench=.
```

### HTTP Profiling

```go
import _ "net/http/pprof"

func main() {
    go func() {
        log.Println(http.ListenAndServe("localhost:6060", nil))
    }()
    // Your application code
}
```

**View profiles:**
```bash
# CPU profile
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30

# Heap profile
go tool pprof http://localhost:6060/debug/pprof/heap

# Goroutine profile
go tool pprof http://localhost:6060/debug/pprof/goroutine

# Block profile
go tool pprof http://localhost:6060/debug/pprof/block

# Mutex profile
go tool pprof http://localhost:6060/debug/pprof/mutex
```

### Trace

```bash
# Generate trace
go test -trace=trace.out -bench=.

# View trace
go tool trace trace.out
```

## Go Tools

### go fmt

```bash
# Format current directory
go fmt

# Format all packages
go fmt ./...

# Check without modifying (returns non-zero if changes needed)
gofmt -l .

# Write changes
gofmt -w .

# Diff without modifying
gofmt -d .
```

### go vet

```bash
# Vet current package
go vet

# Vet all packages
go vet ./...

# Specific checks
go vet -printf ./...

# List available checks
go tool vet help
```

### go fix

```bash
# Update code to use newer APIs
go fix
go fix ./...
```

### go doc

```bash
# View package documentation
go doc fmt

# View function documentation
go doc fmt.Println

# View all documentation
go doc -all fmt

# Start documentation server
godoc -http=:6060
```

### go list

```bash
# List packages
go list ./...

# List with format
go list -f '{{.Name}}' ./...

# List dependencies
go list -m all

# List module info
go list -m -json github.com/gin-gonic/gin

# Find outdated dependencies
go list -u -m all
```

### go generate

```go
//go:generate stringer -type=Status
type Status int

const (
    Pending Status = iota
    Active
    Completed
)
```

```bash
# Run generate
go generate ./...

# With verbose output
go generate -v ./...
```

### go clean

```bash
# Clean build cache
go clean

# Clean test cache
go clean -testcache

# Clean module cache
go clean -modcache

# Clean everything
go clean -cache -modcache -testcache

# Dry run
go clean -n
```

## Linters and Static Analysis

### staticcheck

```bash
# Install
go install honnef.co/go/tools/cmd/staticcheck@latest

# Run on current package
staticcheck

# Run on all packages
staticcheck ./...

# Specific checks
staticcheck -checks=SA1000 ./...

# Exclude checks
staticcheck -checks=all,-ST1000 ./...
```

### golangci-lint

```bash
# Install
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Run
golangci-lint run

# Run with all linters
golangci-lint run --enable-all

# Configuration file (.golangci.yml)
```

**.golangci.yml example:**
```yaml
linters:
  enable:
    - govet
    - errcheck
    - staticcheck
    - unused
    - gosimple
    - structcheck
    - varcheck
    - ineffassign
    - deadcode
    - typecheck

linters-settings:
  govet:
    check-shadowing: true
  gocyclo:
    min-complexity: 15

run:
  timeout: 5m
  tests: false

issues:
  exclude-use-default: false
```

### go-critic

```bash
# Install
go install github.com/go-critic/go-critic/cmd/gocritic@latest

# Run
gocritic check ./...

# List checks
gocritic check -help
```

## Build Tags

### Define Build Tags

```go
//go:build linux && amd64
// +build linux,amd64

package main

func platformSpecific() {
    // Linux AMD64 specific code
}
```

```go
//go:build !windows
// +build !windows

package main

func unixOnly() {
    // Non-Windows code
}
```

### Build with Tags

```bash
# Build with tag
go build -tags=integration

# Multiple tags
go build -tags='integration e2e'

# Test with tags
go test -tags=integration ./...
```

### Common Build Tags

```go
//go:build integration
//go:build unit
//go:build e2e
//go:build prod
//go:build dev
//go:build linux
//go:build darwin
//go:build windows
//go:build amd64
//go:build arm64
```

## Project Structure

### Standard Layout

```
myproject/
├── cmd/
│   ├── myapp/
│   │   └── main.go
│   └── tool/
│       └── main.go
├── internal/
│   ├── auth/
│   │   ├── auth.go
│   │   └── auth_test.go
│   └── database/
│       ├── db.go
│       └── db_test.go
├── pkg/
│   └── utils/
│       ├── utils.go
│       └── utils_test.go
├── api/
│   └── openapi.yaml
├── web/
│   └── templates/
├── configs/
│   └── config.yaml
├── scripts/
│   └── build.sh
├── test/
│   └── integration/
├── docs/
├── go.mod
├── go.sum
├── Makefile
├── Dockerfile
└── README.md
```

### Makefile Example

```makefile
.PHONY: build test clean install lint fmt vet

build:
	go build -o bin/myapp ./cmd/myapp

test:
	go test -v -race -coverprofile=coverage.out ./...

coverage:
	go tool cover -html=coverage.out

bench:
	go test -bench=. -benchmem ./...

clean:
	go clean
	rm -rf bin/

install:
	go install ./cmd/myapp

lint:
	golangci-lint run

fmt:
	go fmt ./...

vet:
	go vet ./...

tidy:
	go mod tidy

run:
	go run ./cmd/myapp

docker-build:
	docker build -t myapp:latest .

all: fmt vet lint test build
```

## Docker

### Dockerfile (Multi-stage)

```dockerfile
# Build stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/myapp

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
```

### .dockerignore

```
.git
.gitignore
README.md
Makefile
*.md
bin/
vendor/
.env
```

## CI/CD Examples

### GitHub Actions

**.github/workflows/go.yml:**
```yaml
name: Go CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Set up Go
      uses: actions/setup-go@v5
      with:
        go-version: '1.24'

    - name: Build
      run: go build -v ./...

    - name: Test
      run: go test -v -race -coverprofile=coverage.out ./...

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage.out

    - name: Vet
      run: go vet ./...

    - name: staticcheck
      uses: dominikh/staticcheck-action@v1
      with:
        version: "latest"
```

### GitLab CI

**.gitlab-ci.yml:**
```yaml
image: golang:1.24

stages:
  - test
  - build

before_script:
  - go mod download

test:
  stage: test
  script:
    - go fmt ./...
    - go vet ./...
    - go test -race -coverprofile=coverage.out ./...
    - go tool cover -func=coverage.out

build:
  stage: build
  script:
    - go build -o myapp ./cmd/myapp
  artifacts:
    paths:
      - myapp
```

## Go Tool Dependencies (Go 1.24+)

### Manage Tool Dependencies

**go.mod:**
```go
module example.com/myproject

go 1.24

require (
    github.com/gin-gonic/gin v1.9.1
)

tool (
    golang.org/x/tools/cmd/goimports
    honnef.co/go/tools/cmd/staticcheck
)
```

**Run tools:**
```bash
# Run tool from go.mod
go tool goimports -w .
go tool staticcheck ./...
```

## Best Practices

### Module Management
- Always run `go mod tidy` before committing
- Commit both `go.mod` and `go.sum`
- Use `go mod vendor` for reproducible builds
- Pin tool versions in `go.mod` (Go 1.24+)

### Testing
- Write table-driven tests
- Use subtests for better organization
- Aim for >80% code coverage
- Use `-race` flag regularly
- Write benchmarks for performance-critical code

### Code Quality
- Run `go fmt` before committing
- Use `go vet` to catch common mistakes
- Use static analyzers (`staticcheck`, `golangci-lint`)
- Keep functions small and focused
- Use meaningful names

### Build & Deploy
- Use multi-stage Docker builds
- Build with `-ldflags="-s -w"` for smaller binaries
- Cross-compile for target platforms
- Use build tags for environment-specific code
- Version your releases

### Performance
- Profile before optimizing
- Use `pprof` for CPU and memory profiling
- Use `-benchmem` to track allocations
- Avoid premature optimization
- Use sync.Pool for frequent allocations

## Resources

- Official documentation: https://go.dev/doc/
- Go modules reference: https://go.dev/ref/mod
- Effective Go: https://go.dev/doc/effective_go
- Go wiki: https://go.dev/wiki/
- Standard library: https://pkg.go.dev/std
- Go playground: https://go.dev/play/
- Go by Example: https://gobyexample.com/
