# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal documentation website built with MkDocs Material, hosted on GitHub Pages at https://upcreid.github.io. The site contains technical documentation, cheat sheets, blog posts, and gaming guides in French.

## Build & Development Commands

### Building the site
```bash
mkdocs build
```
This generates the static site in the `site/` directory.

### Local development server
```bash
mkdocs serve
```
This starts a local development server with live reload at http://127.0.0.1:8000/.

### Deploying to GitHub Pages
```bash
mkdocs gh-deploy
```
This builds the site and pushes it to the `gh-pages` branch.

## Architecture

### Content Structure
- `docs/` - All markdown content and assets
  - `cheat-sheet/` - Technical cheat sheets (Ansible, Docker, Git, K9s, Kubectl, Shell, SQL, Tmux, Vagrant, VSCode)
  - `games/` - Gaming guides (Path of Exile 2, StarCraft 2)
  - `blog/` - Blog posts
  - `assets/` - Images and static assets
  - `javascripts/` - Custom JavaScript (currently only MathJax configuration)
  - `stylesheets/` - Custom CSS for layout and styling
- `includes/` - Snippets auto-appended to all pages (via pymdownx.snippets)
- `mkdocs.yml` - Complete site configuration
- `site/` - Generated static site (gitignored)
- `venv/` - Python virtual environment (gitignored)

### Theme Configuration
The site uses Material for MkDocs with extensive customization:
- **Responsive design** with sticky navigation tabs and sections
- **Dark/light mode** toggle using indigo color palette
- **Custom CSS** (`docs/stylesheets/extra.css`) for full-width layout, professional styling, and responsive design
- **MathJax support** configured in `docs/javascripts/mathjax.js` for mathematical notation
- **Extensive Markdown extensions** including admonitions, tabs, code highlighting, Mermaid diagrams, and task lists
- **Navigation features** include instant loading, prefetch, progress indicators, and table of contents integration

### Navigation Structure
Navigation is manually defined in `mkdocs.yml` under the `nav:` section. The structure mirrors the docs directory but must be explicitly maintained:
- Top-level tabs: Home, Blog, CheatSheet, Games
- Nested sections for organized content (e.g., CheatSheet items, Game-specific guides)

## Working with Content

### Adding new cheat sheets
1. Create a new directory under `docs/cheat-sheet/<topic>/`
2. Add the markdown file (e.g., `<topic>.md`)
3. Update `mkdocs.yml` navigation to include the new entry

### Adding new game guides
1. Create structure under `docs/games/<game-name>/`
2. Common subdirectories: `builds/`, `params/`
3. Update `mkdocs.yml` navigation

### Markdown Features
All standard Material for MkDocs extensions are enabled:
- Admonitions for notes/warnings
- Code blocks with syntax highlighting and copy buttons
- Tabbed content
- Task lists
- Footnotes
- Emoji support (using twemoji)
- Mermaid diagrams
- Mathematical notation via MathJax

## Python Environment

This project uses a Python virtual environment (`venv/`). Key dependencies:
- mkdocs
- mkdocs-material
- pymdown-extensions
- Additional Material theme dependencies

To activate the virtual environment:
```bash
source venv/bin/activate  # On macOS/Linux
```

## Git Workflow

The repository uses a simple main branch (`master`) workflow:
- Changes are committed directly to master
- Deployment to GitHub Pages is handled via `mkdocs gh-deploy`
- The `site/` directory is gitignored as it's generated

## File Naming Conventions

- Markdown files use lowercase with hyphens (e.g., `path-of-exile-2.md`)
- Directory names use lowercase with hyphens
- Asset files stored in `docs/assets/`

## Important Notes

- **Navigation is manual**: When adding new pages, always update `mkdocs.yml` navigation
- **Custom styling**: Layout uses full-width design (120rem max) defined in `extra.css`
- **Auto-append snippets**: Content in `includes/mkdocs.md` is automatically appended to all pages
- **French content**: Documentation is primarily in French
- **GitHub Pages**: Site is automatically generated and hosted from the repository
