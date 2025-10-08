# Slidev Cheat Sheet

## Installation

### Create a new project
```bash
# Recommended with pnpm
pnpm create slidev

# Alternatives
npm init slidev@latest
yarn create slidev
bun create slidev
```

### Prerequisites
- Node.js >= 18.0

## Basic commands

```bash
slidev                  # Start development server
slidev export          # Export to PDF/PPTX/PNG
slidev build           # Build static web application
slidev format          # Format slides
slidev --help          # Show help
```

## Basic structure

### slides.md file
```markdown
---
theme: seriph
title: My presentation
background: /background.jpg
---

# Presentation title
Subtitle or description

---

# Second slide

Slide content
```

## Slide separation

```markdown
---
# New slide with triple dash separator

---

# Another slide
```

## Frontmatter

### Global configuration (first slide)
```yaml
---
theme: default              # Theme
background: /cover.jpg      # Background image
class: text-center          # CSS classes
highlighter: shiki          # Syntax highlighter
lineNumbers: false          # Line numbering
info: |                     # Metadata
  ## My presentation
  Additional information
drawings:
  persist: false            # Drawing persistence
transition: slide-left      # Slide transitions
title: Title                # Presentation title
mdc: true                   # Enable MDC syntax
---
```

### Per-slide configuration
```yaml
---
layout: center              # Slide layout
background: /image.jpg      # Specific background
class: text-white           # CSS classes
transition: fade            # Specific transition
clicks: 3                   # Number of clicks
---
```

## Built-in layouts

### Layout center
```markdown
---
layout: center
---

# Centered content
Text in the center of the screen
```

### Layout cover (cover page)
```markdown
---
layout: cover
background: /cover.jpg
---

# Main title
Presentation description
```

### Layout two-cols (two columns)
```markdown
---
layout: two-cols
---

# Left column
Left content

::right::

# Right column
Right content
```

### Layout image-left / image-right
```markdown
---
layout: image-left
image: /path/to/image.jpg
---

# Content on the right
Image displays on the left
```

```markdown
---
layout: image-right
image: /path/to/image.jpg
---

# Content on the left
Image displays on the right
```

### Layout quote
```markdown
---
layout: quote
---

# "Important quote"
— Author
```

### Layout section
```markdown
---
layout: section
---

# New section
Marks the beginning of a new section
```

### Layout fact
```markdown
---
layout: fact
---

# 1,000,000+
Active users
```

### Layout iframe-left / iframe-right
```markdown
---
layout: iframe-right
url: https://example.com
---

# Embed a website
Iframe displays on the right
```

### Layout statement
```markdown
---
layout: statement
---

# Important statement
Key message of the presentation
```

### Layout default
```markdown
---
layout: default
---

# Default layout
Standard content
```

### Layout full
```markdown
---
layout: full
---

# Full screen
Uses all available space
```

### Layout none
```markdown
---
layout: none
---

No style applied
```

### Layout intro
```markdown
---
layout: intro
---

# Introduction title
## Author
Description
```

### Layout end
```markdown
---
layout: end
---

# Thank you!
Questions?
```

## Code blocks

### Basic code with syntax highlighting
```markdown
​```python
def hello():
    print("Hello Slidev!")
​```
```

### Code with line highlighting
```markdown
​```python {2-3}
def hello():
    print("Hello Slidev!")  # Highlighted line
    print("Line 3")         # Highlighted line
    print("Line 4")
​```
```

### Code with multiple highlighting steps
```markdown
​```python {2|3|all}
def hello():
    print("Step 1")  # Displayed on 1st click
    print("Step 2")  # Displayed on 2nd click
                    # 'all' displays everything on 3rd click
​```
```

### Monaco editor (interactive code)
```markdown
​```ts {monaco}
console.log('Editable code!')
​```
```

### Monaco editor with execution
```markdown
​```ts {monaco-run}
console.log('Executable code')
​```
```

## Animations

### v-click (show on click)
```markdown
<v-click>

Appears on first click

</v-click>

<v-click>

Appears on second click

</v-click>
```

### v-after (show after previous)
```markdown
<v-click>Element 1</v-click>
<v-after>Element 2 (appears right after)</v-after>
```

### v-click with hiding
```markdown
<v-click :hide="true">

This element disappears on click

</v-click>
```

### v-clicks (animate a list)
```markdown
<v-clicks>

- Item 1 (click 1)
- Item 2 (click 2)
- Item 3 (click 3)

</v-clicks>
```

### v-clicks with depth
```markdown
<v-clicks depth="2">

- Level 1 (click 1)
  - Level 2 (click 2)
  - Level 2 (click 3)

</v-clicks>
```

### v-click on inline element
```markdown
Normal text <span v-click>appearing text</span> normal text
```

### v-click with precise timing
```markdown
<div v-click="1">Appears on click 1</div>
<div v-click="3">Appears on click 3</div>
<div v-click="2">Appears on click 2</div>
```

### v-click with range
```markdown
<div v-click="[2, 4]">
  Visible between clicks 2 and 4
</div>
```

## Motion animations (v-motion)

### Basic animation
```markdown
<div
  v-motion
  :initial="{ x: -80 }"
  :enter="{ x: 0 }">
  Slide from the left
</div>
```

### Complete animation with clicks
```markdown
<div
  v-motion
  :initial="{ x: -80, opacity: 0 }"
  :enter="{ x: 0, opacity: 1, transition: { delay: 100 } }"
  :click-1="{ x: 80 }"
  :click-2="{ y: -50, opacity: 0 }"
  :leave="{ x: 1000 }">
  Complex animation
</div>
```

### Available animation properties
```markdown
<div
  v-motion
  :initial="{
    x: 0,           # X position
    y: 0,           # Y position
    scale: 1,       # Scale
    rotate: 0,      # Rotation (degrees)
    opacity: 1      # Opacity
  }"
  :enter="{
    x: 100,
    transition: {
      duration: 500,  # Duration in ms
      delay: 100,     # Delay in ms
      ease: 'easeOut' # Easing type
    }
  }">
  Animated element
</div>
```

## Slide transitions

### Global transitions
```yaml
---
transition: slide-left    # fade, slide-left, slide-right, slide-up, slide-down
---
```

### Per-slide transitions
```yaml
---
transition: fade
---
```

### Custom transitions (forward/backward)
```yaml
---
transition: slide-left|slide-right  # slide-left forward, slide-right backward
---
```

## Built-in components

### Arrow
```markdown
<Arrow x1="10" y1="20" x2="100" y2="200" />
```

### AutoFitText (adaptive text)
```markdown
<AutoFitText :max="200" :min="100" modelValue="Large text" />
```

### LightOrDark (light/dark theme conditional)
```markdown
<LightOrDark>
  <template #dark>Dark mode content</template>
  <template #light>Light mode content</template>
</LightOrDark>
```

### Link
```markdown
<Link to="5">Go to slide 5</Link>
<Link to="5" title="Link title" />
```

### RenderWhen (conditional rendering)
```markdown
<RenderWhen context="main">
  Displayed only in main presentation
</RenderWhen>

<RenderWhen context="presenter">
  Displayed only in presenter mode
</RenderWhen>
```

### SlideCurrentNo (slide number)
```markdown
Slide <SlideCurrentNo /> / <SlidesTotal />
```

### Toc / TocList (table of contents)
```markdown
<Toc />

# Or with options
<TocList maxDepth="2" minDepth="1" />
```

### Transform
```markdown
<Transform :scale="0.5">
  <YourElements />
</Transform>

<Transform :rotate="45" origin="top left">
  Rotated element
</Transform>
```

### Tweet (embed tweet)
```markdown
<Tweet id="1234567890" />
```

### VueSlideCore (custom Vue slide)
```markdown
<VueSlideCore :page="5" />
```

### Youtube (YouTube video)
```markdown
<Youtube id="dQw4w9WgXcQ" width="100%" height="400px" />
```

## Presenter notes

```markdown
---
layout: center
---

# My slide

Visible content

<!--
This is a presenter note
Visible only in presenter mode
-->
```

## Mathematical formulas (LaTeX)

### Inline
```markdown
Inline formula: $E = mc^2$
```

### Block
```markdown
$$
\frac{d}{dx}\left( \int_{0}^{x} f(u)\,du\right)=f(x)
$$
```

## Diagrams

### Mermaid
```markdown
​```mermaid
graph TD
  A[Start] --> B[Process]
  B --> C[End]
​```
```

### PlantUML
```markdown
​```plantuml
@startuml
Alice -> Bob: Hello
Bob -> Alice: Hi!
@enduml
​```
```

## Style and CSS

### Global CSS classes
```yaml
---
class: text-center text-2xl
---
```

### Slide-scoped CSS
```markdown
---
layout: center
---

# My slide

<style>
h1 {
  color: red;
}
</style>
```

### UnoCSS classes
```markdown
<div class="text-3xl text-blue-500 font-bold">
  Text styled with UnoCSS
</div>
```

## MDC syntax (Markdown Components)

### Add classes and attributes
```markdown
# Title {.text-red-500}

[Link]{.text-blue-500 target="_blank"}

![Image](/img.jpg){.rounded-lg .shadow-xl}
```

### Components with props
```markdown
::component-name{prop1="value" prop2="value"}
Content
::
```

## Icons

### With UnoCSS
```markdown
<div class="i-carbon-logo-github" />
<div class="i-mdi-account text-3xl text-red-500" />
```

## Backgrounds

### Background image
```yaml
---
background: /path/to/image.jpg
---
```

### Background color
```yaml
---
background: '#1e1e1e'
---
```

### Gradient
```yaml
---
background: linear-gradient(to right, #ff0000, #0000ff)
---
```

### Video background
```yaml
---
background: /video.mp4
---
```

## Import external slides

### Import a file
```markdown
---
src: ./external-slides.md
---
```

### Import a range of slides
```markdown
---
src: ./external-slides.md
pages: 1-5
---
```

## Presenter mode

- Press `?` to see all keyboard shortcuts
- Presenter notes visible only in presentation mode
- Next slide preview
- Timer and clock

## Essential keyboard shortcuts

| Key | Action |
|--------|--------|
| `Space` / `→` | Next slide |
| `←` | Previous slide |
| `↑` | Previous slide (no animations) |
| `↓` | Next slide (no animations) |
| `Home` | First slide |
| `End` | Last slide |
| `f` | Fullscreen |
| `o` | Overview |
| `d` | Dark mode |
| `g` | Show/hide camera |
| `r` | Recording |
| `e` | Drawing mode |
| `c` | Presenter notes |
| `?` | Show all shortcuts |

## Export

### PDF
```bash
slidev export

# With options
slidev export --format pdf --output slides.pdf
```

### PNG
```bash
slidev export --format png
```

### PPTX
```bash
slidev export --format pptx
```

### Export options
```bash
slidev export --dark           # Dark mode
slidev export --with-clicks    # Include animations
slidev export --timeout 30000  # Render timeout
```

## Build for production

```bash
slidev build

# With base path
slidev build --base /slides/
```

### Hosting
Built slides can be hosted on any static server:
- GitHub Pages
- Netlify
- Vercel
- Custom server

## Advanced configuration

### vite.config.ts file
```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  slidev: {
    // Slidev options
  }
})
```

### Custom themes
```yaml
---
theme: ./custom-theme
---
```

### Addons
Install addons via npm and configure them in frontmatter:
```yaml
---
addons:
  - slidev-addon-example
---
```

## Tips

### Disable animations
```yaml
---
clicks: 0  # No clicks on this slide
---
```

### Aspect ratio
```yaml
---
aspectRatio: '16/9'  # or '4/3'
---
```

### Global line numbering
```yaml
---
lineNumbers: true
---
```

### Custom favicon
Place `public/favicon.ico` in the project

### Custom fonts
```yaml
---
fonts:
  sans: 'Robot'
  serif: 'Robot Slab'
  mono: 'Fira Code'
---
```

## Resources

- Official documentation: https://sli.dev
- GitHub: https://github.com/slidevjs/slidev
- Themes: https://sli.dev/themes/gallery.html
- Addons: https://sli.dev/addons/use.html
