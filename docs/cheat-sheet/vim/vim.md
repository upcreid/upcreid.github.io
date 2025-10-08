# � Vim Cheat Sheet

---

## ⚙️ Modes
| Mode | Description | How to enter |
|------|--------------|--------------|
| **Normal** | Default mode (navigate, edit commands) | Press `Esc` |
| **Insert** | Type and insert text | `i`, `I`, `a`, or `A` |
| **Visual** | Select text | `v` (character), `V` (line), `Ctrl+v` (block) |
| **Command-line** | Run commands (save, quit, etc.) | `:` from Normal mode |

---

## � Navigation
| Command | Action |
|----------|---------|
| `h` / `j` / `k` / `l` | Move left / down / up / right |
| `0` | Beginning of line |
| `$` | End of line |
| `w` / `b` | Next / previous word |
| `gg` | Go to start of file |
| `G` | Go to end of file |
| `:n` | Go to line *n* (e.g., `:42`) |
| `Ctrl+d` / `Ctrl+u` | Scroll half page down / up |
| `Ctrl+f` / `Ctrl+b` | Scroll full page down / up |

---

## ✏️ Insert Mode
| Command | Action |
|----------|---------|
| `i` | Insert before cursor |
| `I` | Insert at beginning of line |
| `a` | Append after cursor |
| `A` | Append at end of line |
| `o` | Open new line below |
| `O` | Open new line above |
| `Esc` | Return to Normal mode |

---

## � Editing
| Command | Action |
|----------|---------|
| `x` | Delete character under cursor |
| `dd` | Delete current line |
| `D` | Delete to end of line |
| `dw` | Delete word |
| `u` | Undo |
| `Ctrl+r` | Redo |
| `yy` | Yank (copy) current line |
| `p` | Paste below |
| `P` | Paste above |
| `r<char>` | Replace single character |
| `cw` | Change word (delete + insert) |
| `cc` | Change entire line |
| `J` | Join current and next line |

---

## � Search & Replace
| Command | Action |
|----------|---------|
| `/pattern` | Search forward |
| `?pattern` | Search backward |
| `n` / `N` | Next / previous match |
| `:%s/old/new/g` | Replace all in file |
| `:s/old/new/g` | Replace all in current line |
| `:%s/old/new/gc` | Replace all (confirm each) |

---

## � Files & Saving
| Command | Action |
|----------|---------|
| `:w` | Save file |
| `:q` | Quit |
| `:wq` or `:x` | Save and quit |
| `:q!` | Quit without saving |
| `:e filename` | Open file |
| `:saveas newfile` | Save as new file |
| `:ls` | List open buffers |
| `:bn` / `:bp` | Next / previous buffer |

---

## ⚡ Useful Tricks
| Command | Action |
|----------|---------|
| `.` | Repeat last command |
| `>>` / `<<` | Indent / unindent line |
| `=` | Auto-indent selection |
| `Ctrl+g` | Show file info |
| `%` | Jump to matching bracket/parenthesis |
| `:help <command>` | Open Vim help for a command |

---

## � Example Workflow
1. Open file → `vim myfile.txt`
2. Move to a line → `gg` or `/word`
3. Edit → `i` (insert mode), then `Esc`
4. Save → `:w`
5. Quit → `:q`

---

✅ **Tip:** You can combine counts with commands —  
For example, `3dd` deletes 3 lines, `5w` moves forward 5 words.
