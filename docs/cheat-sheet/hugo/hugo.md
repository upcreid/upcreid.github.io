# Hugo Cheat Sheet

## Overview

Hugo is the world's fastest framework for building static websites, written in Go.

**Key Features:**
- Extremely fast build times (< 1ms per page)
- Simple and easy to use
- No dependencies (single binary)
- Flexible content organization
- Powerful templating system
- Built-in live reload
- Multilingual support

## Installation

### macOS
```bash
# Using Homebrew
brew install hugo

# Extended version (with Sass/SCSS support)
brew install hugo
```

### Linux
```bash
# Debian/Ubuntu
sudo apt install hugo

# Arch Linux
sudo pacman -S hugo

# Snap
sudo snap install hugo
```

### Windows
```bash
# Using Chocolatey
choco install hugo-extended

# Using Scoop
scoop install hugo-extended
```

### From Binary
Download from https://github.com/gohugoio/hugo/releases

### Verify Installation
```bash
hugo version
```

## Quick Start

### Create New Site
```bash
hugo new site mysite
cd mysite
```

### Initialize Git
```bash
git init
```

### Add a Theme
```bash
# Add theme as Git submodule
git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/ananke

# Set theme in config
echo "theme = 'ananke'" >> hugo.toml
```

### Create Content
```bash
hugo new posts/my-first-post.md
```

### Start Development Server
```bash
hugo server

# With drafts
hugo server -D

# With custom port
hugo server -p 1313
```

### Build Site
```bash
hugo

# Include drafts
hugo -D

# Clean before build
hugo --cleanDestinationDir
```

## Directory Structure

```
mysite/
├── archetypes/          # Content templates
│   └── default.md
├── assets/              # Files to be processed (SCSS, JS)
├── content/             # All content (markdown files)
│   ├── posts/
│   └── about.md
├── data/                # Data files (JSON, YAML, TOML)
├── layouts/             # Templates and views
│   ├── _default/
│   ├── partials/
│   └── shortcodes/
├── static/              # Static files (images, CSS, JS)
│   ├── images/
│   └── css/
├── themes/              # Themes directory
├── hugo.toml           # Main configuration file
└── public/             # Generated site (gitignored)
```

## Configuration

### Configuration File (hugo.toml)

```toml
baseURL = 'https://example.com/'
languageCode = 'en-us'
title = 'My Hugo Site'
theme = 'ananke'

[params]
  description = 'A Hugo site'
  author = 'John Doe'

[menu]
  [[menu.main]]
    name = 'Home'
    url = '/'
    weight = 1
  [[menu.main]]
    name = 'Posts'
    url = '/posts/'
    weight = 2
  [[menu.main]]
    name = 'About'
    url = '/about/'
    weight = 3
```

### Configuration (YAML)

```yaml
baseURL: https://example.com/
languageCode: en-us
title: My Hugo Site
theme: ananke

params:
  description: A Hugo site
  author: John Doe

menu:
  main:
    - name: Home
      url: /
      weight: 1
    - name: Posts
      url: /posts/
      weight: 2
    - name: About
      url: /about/
      weight: 3
```

### Important Configuration Options

```toml
baseURL = 'https://example.com/'
title = 'My Site'
theme = 'mytheme'
languageCode = 'en-us'
defaultContentLanguage = 'en'

# Content
contentDir = 'content'
dataDir = 'data'
layoutDir = 'layouts'
publishDir = 'public'

# Build
buildDrafts = false
buildFuture = false
buildExpired = false

# Server
disableLiveReload = false

# Permalinks
[permalinks]
  posts = '/:year/:month/:slug/'

# Taxonomies
[taxonomies]
  tag = 'tags'
  category = 'categories'
  series = 'series'

# Markup
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true  # Allow HTML in markdown

# Params (custom variables)
[params]
  dateFormat = 'January 2, 2006'
  description = 'Site description'
  author = 'Author Name'
```

## Front Matter

### YAML Front Matter

```yaml
---
title: "My First Post"
date: 2025-01-15T10:00:00Z
draft: false
description: "This is my first post"
tags: ["hugo", "blogging"]
categories: ["tutorial"]
author: "John Doe"
image: "/images/post-1.jpg"
weight: 1
---

Your content here...
```

### TOML Front Matter

```toml
+++
title = "My First Post"
date = 2025-01-15T10:00:00Z
draft = false
description = "This is my first post"
tags = ["hugo", "blogging"]
categories = ["tutorial"]
author = "John Doe"
image = "/images/post-1.jpg"
weight = 1
+++

Your content here...
```

### JSON Front Matter

```json
{
  "title": "My First Post",
  "date": "2025-01-15T10:00:00Z",
  "draft": false,
  "description": "This is my first post",
  "tags": ["hugo", "blogging"],
  "categories": ["tutorial"],
  "author": "John Doe",
  "image": "/images/post-1.jpg",
  "weight": 1
}

Your content here...
```

### Common Front Matter Variables

```yaml
---
# Required
title: "Post Title"
date: 2025-01-15

# Publishing
draft: false              # Don't publish if true
publishDate: 2025-01-15  # Publish on this date
expiryDate: 2026-01-15   # Unpublish after this date

# Organization
weight: 10               # Order in lists
slug: "my-custom-url"    # Custom URL slug
aliases: ["/old-url/"]   # URL redirects

# Taxonomies
tags: ["tag1", "tag2"]
categories: ["category1"]

# Display
description: "Meta description"
summary: "Custom summary"
images: ["/img/cover.jpg"]

# Custom params
author: "Author Name"
featured: true
---
```

## Content Management

### Create Content

```bash
# Create post
hugo new posts/my-post.md

# Create page
hugo new about.md

# Create in section
hugo new blog/article-1.md

# Use custom archetype
hugo new --kind chapter docs/chapter1.md
```

### Content Organization

```
content/
├── _index.md              # Home page content
├── about.md              # Single page
├── posts/
│   ├── _index.md         # Posts list page
│   ├── post-1.md
│   └── post-2.md
└── docs/
    ├── _index.md
    ├── getting-started/
    │   ├── _index.md
    │   └── installation.md
    └── advanced/
        └── configuration.md
```

### Page Bundles

#### Leaf Bundle
```
content/
└── posts/
    └── my-post/
        ├── index.md      # The content file
        ├── image1.jpg
        └── image2.jpg
```

#### Branch Bundle
```
content/
└── posts/
    ├── _index.md        # List page
    ├── post-1.md
    └── post-2.md
```

## Archetypes

### Default Archetype (archetypes/default.md)

```yaml
---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true
tags: []
categories: []
---
```

### Custom Archetype (archetypes/posts.md)

```yaml
---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: false
author: "{{ .Site.Params.author }}"
tags: []
categories: []
featured_image: ""
description: ""
---

## Introduction

Your content here...
```

### Use Custom Archetype

```bash
hugo new posts/my-post.md --kind posts
```

## Templates

### Basic Template Structure

```
layouts/
├── _default/
│   ├── baseof.html      # Base template
│   ├── list.html        # List pages
│   ├── single.html      # Single pages
│   └── index.html       # Home page
├── partials/
│   ├── header.html
│   ├── footer.html
│   └── head.html
├── shortcodes/
│   └── myshortcode.html
└── index.html
```

### Base Template (baseof.html)

```html
<!DOCTYPE html>
<html lang="{{ .Site.LanguageCode }}">
<head>
    {{ partial "head.html" . }}
</head>
<body>
    {{ partial "header.html" . }}

    <main>
        {{ block "main" . }}{{ end }}
    </main>

    {{ partial "footer.html" . }}
</body>
</html>
```

### Single Page Template (single.html)

```html
{{ define "main" }}
<article>
    <h1>{{ .Title }}</h1>
    <time>{{ .Date.Format "January 2, 2006" }}</time>

    {{ .Content }}

    <div class="tags">
        {{ range .Params.tags }}
        <a href="{{ "/tags/" | relURL }}{{ . | urlize }}">{{ . }}</a>
        {{ end }}
    </div>
</article>
{{ end }}
```

### List Template (list.html)

```html
{{ define "main" }}
<h1>{{ .Title }}</h1>

{{ .Content }}

<ul>
{{ range .Pages }}
    <li>
        <a href="{{ .RelPermalink }}">{{ .Title }}</a>
        <time>{{ .Date.Format "Jan 2, 2006" }}</time>
        <p>{{ .Summary }}</p>
    </li>
{{ end }}
</ul>
{{ end }}
```

### Home Page Template (index.html)

```html
{{ define "main" }}
<h1>Welcome to {{ .Site.Title }}</h1>

<section class="recent-posts">
    <h2>Recent Posts</h2>
    {{ range first 5 (where .Site.RegularPages "Type" "posts") }}
    <article>
        <h3><a href="{{ .RelPermalink }}">{{ .Title }}</a></h3>
        <time>{{ .Date.Format "January 2, 2006" }}</time>
        <p>{{ .Summary }}</p>
    </article>
    {{ end }}
</section>
{{ end }}
```

### Partial Template (partials/header.html)

```html
<header>
    <nav>
        <a href="{{ .Site.BaseURL }}">{{ .Site.Title }}</a>
        {{ range .Site.Menus.main }}
        <a href="{{ .URL }}">{{ .Name }}</a>
        {{ end }}
    </nav>
</header>
```

## Variables

### Site Variables

```html
{{ .Site.Title }}
{{ .Site.BaseURL }}
{{ .Site.Params.description }}
{{ .Site.LanguageCode }}
{{ .Site.LastChange }}
{{ .Site.Pages }}
{{ .Site.RegularPages }}
```

### Page Variables

```html
{{ .Title }}
{{ .Content }}
{{ .Summary }}
{{ .Description }}
{{ .Date }}
{{ .PublishDate }}
{{ .Permalink }}
{{ .RelPermalink }}
{{ .WordCount }}
{{ .ReadingTime }}
{{ .Params.author }}
```

### Page Collections

```html
{{ range .Pages }}
    {{ .Title }}
{{ end }}

{{ range .Site.RegularPages }}
    {{ .Title }}
{{ end }}

{{ range first 5 .Site.RegularPages }}
    {{ .Title }}
{{ end }}

{{ range where .Site.RegularPages "Type" "posts" }}
    {{ .Title }}
{{ end }}
```

## Functions

### Common Functions

```html
<!-- String functions -->
{{ upper "hello" }}          <!-- HELLO -->
{{ lower "HELLO" }}          <!-- hello -->
{{ title "hello world" }}    <!-- Hello World -->
{{ replace "hello" "l" "w" }} <!-- hewwo -->

<!-- Math functions -->
{{ add 1 2 }}                <!-- 3 -->
{{ sub 5 3 }}                <!-- 2 -->
{{ mul 2 3 }}                <!-- 6 -->
{{ div 10 2 }}               <!-- 5 -->

<!-- Date functions -->
{{ .Date.Format "January 2, 2006" }}
{{ now.Format "2006-01-02" }}
{{ dateFormat "2006-01-02" .Date }}

<!-- Conditionals -->
{{ if .Params.featured }}
    Featured post
{{ end }}

{{ if eq .Type "posts" }}
    This is a post
{{ else }}
    This is a page
{{ end }}

<!-- Range -->
{{ range .Pages }}
    {{ .Title }}
{{ end }}

<!-- With -->
{{ with .Params.author }}
    Author: {{ . }}
{{ end }}

<!-- Slice functions -->
{{ range first 5 .Pages }}
    {{ .Title }}
{{ end }}

{{ range after 5 .Pages }}
    {{ .Title }}
{{ end }}

<!-- Where -->
{{ range where .Site.RegularPages "Type" "posts" }}
    {{ .Title }}
{{ end }}

{{ range where .Pages ".Params.featured" true }}
    {{ .Title }}
{{ end }}

<!-- URLs -->
{{ .Permalink }}
{{ .RelPermalink }}
{{ relURL "about" }}
{{ absURL "about" }}
```

## Shortcodes

### Built-in Shortcodes

```markdown
<!-- YouTube video -->
{{< youtube VIDEO_ID >}}

<!-- Vimeo video -->
{{< vimeo VIDEO_ID >}}

<!-- Tweet -->
{{< twitter TWEET_ID >}}

<!-- Instagram -->
{{< instagram POST_ID >}}

<!-- Gist -->
{{< gist USERNAME GIST_ID >}}

<!-- Figure (image with caption) -->
{{< figure src="/images/photo.jpg" title="Photo Title" >}}

<!-- Highlight (syntax highlighting) -->
{{< highlight python >}}
def hello():
    print("Hello")
{{< /highlight >}}

<!-- Ref (reference to page) -->
{{< ref "about.md" >}}

<!-- Relref (relative reference) -->
{{< relref "posts/my-post.md" >}}
```

### Custom Shortcode (layouts/shortcodes/button.html)

```html
<a href="{{ .Get "url" }}" class="button">
    {{ .Inner }}
</a>
```

**Usage:**
```markdown
{{< button url="/contact" >}}Contact Us{{< /button >}}
```

### Shortcode with Named Parameters

```html
<!-- layouts/shortcodes/alert.html -->
<div class="alert alert-{{ .Get "type" }}">
    {{ .Inner }}
</div>
```

**Usage:**
```markdown
{{< alert type="warning" >}}
This is a warning message!
{{< /alert >}}
```

### Shortcode with Positional Parameters

```html
<!-- layouts/shortcodes/image.html -->
<img src="{{ .Get 0 }}" alt="{{ .Get 1 }}">
```

**Usage:**
```markdown
{{< image "/images/photo.jpg" "Photo description" >}}
```

## Taxonomies

### Configure Taxonomies (hugo.toml)

```toml
[taxonomies]
  tag = 'tags'
  category = 'categories'
  author = 'authors'
```

### Use in Front Matter

```yaml
---
title: "My Post"
tags: ["hugo", "web"]
categories: ["tutorial"]
authors: ["john"]
---
```

### List Taxonomy Terms

```html
<!-- List all tags -->
<ul>
{{ range .Site.Taxonomies.tags }}
    <li><a href="{{ .Page.Permalink }}">{{ .Page.Title }}</a> ({{ .Count }})</li>
{{ end }}
</ul>
```

### Display Terms on Page

```html
<div class="tags">
{{ range .Params.tags }}
    <a href="{{ "tags" | relURL }}/{{ . | urlize }}">{{ . }}</a>
{{ end }}
</div>
```

## Menus

### Configure in hugo.toml

```toml
[[menu.main]]
  name = 'Home'
  url = '/'
  weight = 1

[[menu.main]]
  name = 'Posts'
  url = '/posts/'
  weight = 2

[[menu.main]]
  name = 'About'
  url = '/about/'
  weight = 3
```

### Configure in Front Matter

```yaml
---
title: "About"
menu:
  main:
    name: "About"
    weight: 3
---
```

### Render Menu

```html
<nav>
{{ range .Site.Menus.main }}
    <a href="{{ .URL }}">{{ .Name }}</a>
{{ end }}
</nav>
```

## Data Files

### JSON Data File (data/authors.json)

```json
{
  "john": {
    "name": "John Doe",
    "bio": "Software Developer",
    "twitter": "@johndoe"
  },
  "jane": {
    "name": "Jane Smith",
    "bio": "Designer",
    "twitter": "@janesmith"
  }
}
```

### Use in Templates

```html
{{ $author := index .Site.Data.authors .Params.author }}
<div class="author">
    <h3>{{ $author.name }}</h3>
    <p>{{ $author.bio }}</p>
    <a href="https://twitter.com/{{ $author.twitter }}">Twitter</a>
</div>
```

### YAML Data File (data/social.yaml)

```yaml
twitter: https://twitter.com/username
github: https://github.com/username
linkedin: https://linkedin.com/in/username
```

### Use in Templates

```html
<div class="social">
{{ range $name, $url := .Site.Data.social }}
    <a href="{{ $url }}">{{ $name }}</a>
{{ end }}
</div>
```

## Image Processing

### Using Page Resources

```html
{{ with .Resources.GetMatch "featured.jpg" }}
  {{ $image := .Resize "600x" }}
  <img src="{{ $image.RelPermalink }}" width="{{ $image.Width }}" height="{{ $image.Height }}">
{{ end }}
```

### Image Operations

```html
{{ $image := resources.Get "images/photo.jpg" }}

<!-- Resize -->
{{ $resized := $image.Resize "600x" }}

<!-- Fit (crop to exact dimensions) -->
{{ $fitted := $image.Fit "300x300" }}

<!-- Fill (crop and resize) -->
{{ $filled := $image.Fill "400x300" }}

<!-- Filters -->
{{ $grayscale := $image | images.Grayscale }}
{{ $blurred := $image | images.GaussianBlur 5 }}
```

## Deployment

### Build for Production

```bash
# Basic build
hugo

# Build with minification
hugo --minify

# Set base URL
hugo --baseURL https://example.com/
```

### Deploy to Netlify

**netlify.toml:**
```toml
[build]
  publish = "public"
  command = "hugo --gc --minify"

[build.environment]
  HUGO_VERSION = "0.121.0"
  HUGO_ENV = "production"

[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301
```

### Deploy to GitHub Pages

**.github/workflows/hugo.yml:**
```yaml
name: Deploy Hugo site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          extended: true

      - name: Build
        run: hugo --minify

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Deploy to Vercel

**vercel.json:**
```json
{
  "build": {
    "env": {
      "HUGO_VERSION": "0.121.0"
    }
  }
}
```

### Deploy to Cloudflare Pages

Build settings:
- Build command: `hugo --minify`
- Build output directory: `public`

## Command Line

### Common Commands

```bash
# Create new site
hugo new site mysite

# Create new content
hugo new posts/my-post.md

# Start dev server
hugo server

# Start with drafts
hugo server -D

# Build site
hugo

# Build with options
hugo --minify --gc

# List content
hugo list all
hugo list drafts
hugo list future

# Check configuration
hugo config

# Create new theme
hugo new theme mytheme

# Convert content
hugo convert toTOML
hugo convert toYAML
hugo convert toJSON

# Run benchmarks
hugo benchmark
```

### Environment Variables

```bash
# Set environment
HUGO_ENV=production hugo

# Set log level
HUGO_LOG_LEVEL=debug hugo server
```

## Best Practices

### Content Organization
- Use page bundles for posts with images
- Organize content into logical sections
- Use consistent front matter
- Add descriptions for SEO

### Performance
- Optimize images before adding to `static/`
- Use Hugo's image processing for responsive images
- Minify output with `hugo --minify`
- Use `--gc` flag to clean cache

### Development
- Use `hugo server -D` during development
- Test with different base URLs
- Version control your theme
- Use `.gitignore` for `public/` and `resources/`

### Templates
- Keep templates DRY (Don't Repeat Yourself)
- Use partials for reusable components
- Cache partial results when possible
- Use `.Scratch` for complex operations

## Resources

- Official documentation: https://gohugo.io/documentation/
- Themes: https://themes.gohugo.io/
- Community forum: https://discourse.gohugo.io/
- GitHub: https://github.com/gohugoio/hugo
- Quick start: https://gohugo.io/getting-started/quick-start/
