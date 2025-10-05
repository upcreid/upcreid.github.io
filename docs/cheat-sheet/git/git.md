# Git - Complete Guide

Git is a powerful and flexible distributed version control system, essential for any modern developer.

## Installation

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git

git --version
```

### macOS
```bash
brew install git

# Or via Xcode Command Line Tools
xcode-select --install
```

### Windows
```powershell
choco install git
# Or download from https://git-scm.com/download/win
```

## Initial Configuration

### Identity
```bash
git config --global user.name "Your Name"
git config --global user.email "email@example.com"

# Verify
git config --list
git config user.name
```

### Editor and Tools
```bash
git config --global core.editor "vim"
git config --global core.editor "code --wait"  # VS Code
git config --global diff.tool vimdiff
git config --global merge.tool vimdiff
git config --global color.ui auto
```

### Multi-Account Management
```bash
# ~/.gitconfig
[includeIf "gitdir:~/perso/"]
    path = ~/perso/.gitconfig

[includeIf "gitdir:~/work/"]
    path = ~/work/.gitconfig
```

```bash
# ~/perso/.gitconfig
[user]
    email = perso@example.com
    name = Personal Name
```

### Useful Aliases
```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.lg "log --graph --pretty=tformat:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%an %cr)%Creset' --abbrev-commit"
git config --global alias.amend 'commit --amend --no-edit'
```

## Basic Commands

### Initialization
```bash
git init
git init my-project

git clone https://github.com/user/repo.git
git clone https://github.com/user/repo.git my-folder
git clone --depth 1 https://github.com/user/repo.git  # Shallow clone
git clone --branch develop https://github.com/user/repo.git
```

### Status and Differences
```bash
git status
git status -s              # Short format

git diff                   # Unstaged modifications
git diff --staged          # Staged modifications
git diff HEAD              # All modifications
git diff main..develop     # Between branches
git diff --stat            # Statistics
git diff --color-words     # Word-by-word differences
```

### Staging and Commits
```bash
git add file.txt
git add *.js
git add .
git add -A                 # All (additions, modifications, deletions)
git add -u                 # Only modifications/deletions
git add -p                 # Interactive mode

git reset HEAD file.txt
git restore --staged file.txt

git commit -m "Message"
git commit -am "Message"   # Add + commit
git commit --amend         # Modify the last commit
git commit --amend --no-edit
```

## Advanced Interactive Rebase

### Basic Syntax
```bash
# Rebase the last N commits
git rebase -i HEAD~5
git rebase -i main

# Available actions:
# pick   = use commit
# reword = modify the message
# edit   = stop to amend
# squash = merge with previous
# fixup  = like squash but ignore the message
# drop   = delete the commit
```

### Complete Interactive Rebase Example
```bash
# Situation: 5 commits to clean up
git log --oneline -5
# abc123 Fix typo
# def456 Add feature X
# ghi789 WIP
# jkl012 Add tests
# mno345 Update docs

# Start the rebase
git rebase -i HEAD~5

# In the editor:
pick mno345 Update docs
reword jkl012 Add tests              # Modify the message
squash ghi789 WIP                    # Merge with jkl012
fixup def456 Add feature X           # Merge with ghi789 without message
drop abc123 Fix typo                 # Delete this commit

# Result: 2 clean commits instead of 5
```

### Squashing - Merging Commits
```bash
# Method 1: Interactive rebase
git rebase -i HEAD~3
# Mark commits with 'squash' or 'fixup'

# Method 2: Soft reset
git reset --soft HEAD~3
git commit -m "Single message for the 3 commits"

# Method 3: Merge --squash
git checkout main
git merge --squash feature-branch
git commit -m "Feature: complete description"
```

### Splitting - Separating a Commit
```bash
# Split a large commit into several smaller ones
git rebase -i HEAD~3

# Mark the commit with 'edit'
# When the rebase stops:
git reset HEAD^          # Undo the commit, keep the changes

# Create several commits
git add file1.txt
git commit -m "First part: file1"

git add file2.txt
git commit -m "Second part: file2"

git add file3.txt
git commit -m "Third part: file3"

git rebase --continue
```

### Editing - Modifying a Commit
```bash
git rebase -i HEAD~5

# Mark with 'edit' the commit to modify
# The rebase stops on this commit

# Make the modifications
git add modified-file.txt
git commit --amend

# Or add a new commit
git add new-file.txt
git commit -m "Forgotten addition"

git rebase --continue
```

### Reordering - Reorganizing Commits
```bash
git rebase -i HEAD~5

# In the editor, change the order of lines:
# Before:
# pick abc123 Commit A
# pick def456 Commit B
# pick ghi789 Commit C
#
# After (reversed order):
# pick ghi789 Commit C
# pick def456 Commit B
# pick abc123 Commit A
```

### Fixup and Autosquash
```bash
# Create a fixup commit
git add file.txt
git commit --fixup HEAD~2
# Automatic message: "fixup! Message of commit HEAD~2"

# Create a squash commit
git commit --squash abc123

# Rebase with autosquash
git rebase -i --autosquash HEAD~10
# The fixup/squash commits are automatically placed

# Enable autosquash by default
git config --global rebase.autosquash true

# Complete workflow
# 1. Make a commit
git commit -m "Add feature"

# 2. Find a bug in this commit
git add fix.txt
git commit --fixup HEAD

# 3. Make other commits
git commit -m "Other work"

# 4. Clean up the history
git rebase -i --autosquash HEAD~10
# The fixup will be automatically merged with the right commit
```

### Rebasing with Conflict Resolution
```bash
git rebase main

# If conflict:
git status  # See conflicting files

# Manually resolve the files
# (edit the markers <<<<<<<, =======, >>>>>>>)

git add resolved-file.txt
git rebase --continue

# Or abort
git rebase --abort

# Or skip the problematic commit
git rebase --skip

# Resolution strategies
git rebase -X theirs main    # Take their version in case of conflict
git rebase -X ours main      # Take our version
```

### Rebase --onto (Complex Cases)
```bash
# Syntax: git rebase --onto <newbase> <upstream> <branch>

# Example 1: Move a branch
# State: main <- featureA <- featureB
# Goal: main <- featureB (without commits from featureA)
git rebase --onto main featureA featureB

# Example 2: Remove intermediate commits
# Remove commits between abc123 and def456
git rebase --onto abc123 def456

# Example 3: Move a series of commits
# Move commits E-F from D to C
#     A - B - C        (main)
#      \
#       D - E - F      (topic)
git rebase --onto C D F

# Result:
#     A - B - C - E' - F'
```

### Cherry-picking and Rebase
```bash
# Cherry-pick a specific commit
git cherry-pick abc123
git cherry-pick abc123 def456     # Multiple
git cherry-pick abc123^..def456   # Range

# Without automatic commit
git cherry-pick -n abc123

# Edit the message
git cherry-pick -e abc123

# With signature
git cherry-pick -x abc123

# In case of conflict
git cherry-pick --continue
git cherry-pick --abort

# Cherry-pick a series via rebase
git rebase --onto target-branch start-commit end-commit
```

## Git Workflows

### GitHub Flow
```bash
# 1. Create a branch
git checkout main
git pull
git checkout -b feature/new-feature

# 2. Commits
git add .
git commit -m "feat: new feature"
git push -u origin feature/new-feature

# 3. Pull Request
gh pr create --title "New feature"

# 4. Review and merge
gh pr merge --squash

# 5. Cleanup
git checkout main
git pull
git branch -d feature/new-feature
```

### Gitflow
```bash
# Branches: main, develop, feature/*, release/*, hotfix/*

# Feature
git checkout develop
git checkout -b feature/my-feature
# ... development ...
git checkout develop
git merge --no-ff feature/my-feature
git branch -d feature/my-feature

# Release
git checkout develop
git checkout -b release/1.0.0
# ... bump version ...
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0 -m "Version 1.0.0"
git checkout develop
git merge --no-ff release/1.0.0
git branch -d release/1.0.0

# Hotfix
git checkout main
git checkout -b hotfix/critical-bug
# ... fix ...
git checkout main
git merge --no-ff hotfix/critical-bug
git tag -a v1.0.1 -m "Hotfix 1.0.1"
git checkout develop
git merge --no-ff hotfix/critical-bug
git branch -d hotfix/critical-bug
```

## History and Investigation

### Advanced git log
```bash
# Formats
git log --oneline
git log --graph --oneline --all
git log --stat
git log -p                 # With diffs
git log -p -2              # Last 2 with diffs

# Time filters
git log --since="2 weeks ago"
git log --since="2024-01-01" --until="2024-02-01"

# Author filters
git log --author="Name"
git log --committer="Name"

# Message filters
git log --grep="fix"
git log --grep="bug" --grep="issue" --all-match

# File filters
git log -- file.txt
git log --follow -- file.txt    # Follow renames
git log -- '*.js'

# Content filters
git log -S "function"      # Commits modifying this text
git log -G "regex.*pattern"

# Custom format
git log --pretty=format:"%h - %an, %ar : %s"
git log --pretty=format:"%C(yellow)%h%Creset %C(blue)%ad%Creset | %s %C(green)[%an]%Creset" --date=short

# Log between branches
git log main..develop
git log main...develop
```

### git reflog - Recovery
```bash
# View complete history of movements
git reflog
git reflog show HEAD

# Recover a "lost" commit
git reflog
git checkout HEAD@{5}
git checkout -b recovered-branch HEAD@{5}

# Recover a deleted branch
git reflog
git checkout -b recovered-branch abc123

# Undo a failed rebase
git reflog
git reset --hard HEAD@{5}

# Clean up
git reflog expire --expire=90.days.ago --all
```

### git bisect - Finding a Bug
```bash
# Start binary search
git bisect start
git bisect bad                # Current commit is bad
git bisect good v1.0.0        # v1.0.0 was good

# Test each commit
# Git automatically checks out the middle
git bisect good    # or
git bisect bad

# Git finds the faulty commit
# Result: "abc123 is the first bad commit"

git bisect reset   # Finish

# Automated bisect
git bisect start HEAD v1.0.0
git bisect run ./test.sh

# test.sh must return:
# 0 = good
# 1-127 (except 125) = bad
# 125 = skip (not testable)
```

### git blame - Annotations
```bash
# Who modified each line
git blame file.txt

# Specific lines
git blame -L 10,20 file.txt

# With more info
git blame -l file.txt       # Full SHA
git blame -e file.txt       # Emails
git blame -w file.txt       # Ignore whitespace

# Track movements
git blame -M file.txt       # Within the file
git blame -C file.txt       # Within the commit
git blame -C -C file.txt    # Since creation

# At a specific commit
git blame abc123 -- file.txt

# Ignore commits (reformatting)
git blame --ignore-rev abc123 file.txt
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

## Branches and Merges

### Branch Management
```bash
# Create
git branch new-branch
git checkout -b new-branch
git switch -c new-branch    # New syntax

# List
git branch
git branch -a          # All (local + remote)
git branch -v          # With last commit
git branch -vv         # With tracking

# Switch
git checkout main
git switch main

# Rename
git branch -m old-name new-name

# Delete
git branch -d branch          # If merged
git branch -D branch          # Force
git push origin --delete branch

# Tracking
git checkout -b local-branch origin/remote-branch
git branch -u origin/remote-branch
```

### Merges
```bash
# Basic merge
git merge feature

# Without fast-forward
git merge --no-ff feature

# With squash
git merge --squash feature
git commit -m "Merge feature"

# Strategies
git merge -X ours feature
git merge -X theirs feature

# Undo
git merge --abort
git reset --merge

# Merged branches
git branch --merged
git branch --no-merged
```

### Conflict Resolution
```bash
# Conflicting files
git status
git diff --name-only --diff-filter=U

# Choose a version
git checkout --ours file.txt
git checkout --theirs file.txt

# Mergetool
git mergetool
git mergetool --tool=vimdiff

# After resolution
git add resolved-file.txt
git commit
```

## Stashing

### Usage
```bash
# Save
git stash
git stash save "Message"
git stash push -m "Message"

# With untracked files
git stash -u
git stash --include-untracked

# List
git stash list

# Apply
git stash apply
git stash apply stash@{0}
git stash pop              # Apply and remove

# Remove
git stash drop stash@{1}
git stash clear
```

### Advanced Stashing
```bash
# Specific files
git stash push -m "Msg" file1.txt file2.txt

# Interactive
git stash -p

# View content
git stash show
git stash show -p

# Create branch from stash
git stash branch new-branch stash@{0}

# Stash only staged
git stash --keep-index
git stash --staged
```

## Git Hooks

### Pre-commit
```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "Running linter..."
npm run lint
if [ $? -ne 0 ]; then
    echo "Linting failed"
    exit 1
fi

echo "Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "Tests failed"
    exit 1
fi
EOF

chmod +x .git/hooks/pre-commit
```

### Commit-msg
```bash
cat > .git/hooks/commit-msg << 'EOF'
#!/bin/bash

commit_msg=$(cat "$1")

if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore): .+"; then
    echo "Error: Required format: type: description"
    exit 1
fi
EOF

chmod +x .git/hooks/commit-msg
```

### Pre-push
```bash
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [[ $branch =~ ^(main|master|develop)$ ]]; then
    read -p "Push to $branch. Continue? [y|n] " -n 1 -r < /dev/tty
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
EOF

chmod +x .git/hooks/pre-push
```

### Husky (Node.js)
```bash
npm install --save-dev husky
npx husky install
npm set-script prepare "husky install"

npx husky add .husky/pre-commit "npm test"
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

## Best Practices

### Commit Messages
```bash
# Conventional Commits Format
<type>(<scope>): <subject>

# Types:
# feat     : new feature
# fix      : bug fix
# docs     : documentation
# style    : formatting
# refactor : refactoring
# test     : tests
# chore    : maintenance
# perf     : performance
# ci       : CI/CD

# Examples:
git commit -m "feat(auth): add JWT authentication"
git commit -m "fix(api): handle null pointer in user service"
git commit -m "docs(readme): update installation instructions"

# With body and footer:
git commit -m "feat(shopping-cart): add quantity selector

- Add increment/decrement buttons
- Update cart total in real-time
- Validate maximum quantity

Closes #123"

# Breaking changes:
git commit -m "feat(api): change auth endpoint

BREAKING CHANGE: /auth renamed to /authenticate"
```

### Golden Rules
```bash
# 1. Atomic commits
# One commit = one logical change

# 2. Clear messages
# ✅ "fix(login): prevent SQL injection"
# ❌ "fix stuff"

# 3. Imperative
# ✅ "add feature"
# ❌ "added feature"

# 4. Size
# Subject <= 50 characters
# Body <= 72 characters/line

# 5. Explain the WHY
# Not the WHAT (visible in the diff)

# 6. Reference issues
# "Fixes #456"
# "Related to #123"

# 7. No secrets
# Use .gitignore

# 8. Commit regularly
# Small frequent commits > large rare commits

# 9. Squash before merge
# Clean up with rebase -i

# 10. Rebase or merge?
# Rebase: personal branches, clean history
# Merge: public branches, preserve history
```

### Commit Template
```bash
cat > ~/.gitmessage << 'EOF'
# <type>(<scope>): <subject>
#
# <body>
#
# <footer>
#
# Types: feat, fix, docs, style, refactor, test, chore
# Scope: auth, api, ui, db
# Subject: <= 50 chars
# Body: why, <= 72 chars/line
# Footer: Fixes #123, BREAKING CHANGE
EOF

git config --global commit.template ~/.gitmessage
```

## Cleanup and Maintenance

### Cleanup
```bash
# Untracked files
git clean -n           # Dry run
git clean -f           # Remove
git clean -fd          # Files and directories
git clean -fX          # Only ignored

# Garbage collection
git gc
git gc --aggressive --prune=now

# Verify integrity
git fsck

# Used space
git count-objects -vH
```

### Search
```bash
# In code
git grep "function"
git grep -n "function"     # With line
git grep -i "function"     # Case insensitive

# In history
git log -S "function"
git log -G "regex"

# Author stats
git shortlog -sn
```

## Tags

```bash
# Create
git tag v1.0.0
git tag -a v1.0.0 -m "Version 1.0.0"
git tag -a v1.0.0 abc123 -m "Version 1.0.0"

# List
git tag
git tag -l "v1.*"

# View
git show v1.0.0

# Push
git push origin v1.0.0
git push origin --tags
git push --follow-tags

# Delete
git tag -d v1.0.0
git push origin --delete v1.0.0

# Checkout
git checkout v1.0.0
git checkout -b branch-from-tag v1.0.0
```

## Remotes

```bash
# Add
git remote add origin https://github.com/user/repo.git

# List
git remote -v

# Multiple remotes
git remote add gitlab https://gitlab.com/user/repo.git

# Push to multiple
git push origin main
git push gitlab main

# Or configure multiple URLs
git remote set-url --add --push origin https://github.com/user/repo.git
git remote set-url --add --push origin https://gitlab.com/user/repo.git

# Fetch from all
git fetch --all
```

## Submodules

```bash
# Add
git submodule add https://github.com/user/repo.git path/to/submodule

# Clone with submodules
git clone --recurse-submodules https://github.com/user/repo.git

# Or after clone
git submodule init
git submodule update

# Update
git submodule update --remote
git submodule update --remote --merge

# Command in all submodules
git submodule foreach 'git pull origin main'

# Remove
git submodule deinit path/to/submodule
git rm path/to/submodule
```

## Resources

- **Documentation**: https://git-scm.com/doc
- **Pro Git Book**: https://git-scm.com/book/en/v2
- **Learn Git Branching**: https://learngitbranching.js.org/
- **Conventional Commits**: https://www.conventionalcommits.org/
- **Oh Shit Git**: https://ohshitgit.com/

---

*This complete Git guide covers all advanced rebasing techniques, modern workflows, history management, and best practices. Mastering these concepts is essential for professional development.*
