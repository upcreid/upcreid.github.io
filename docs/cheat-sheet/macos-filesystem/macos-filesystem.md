# macOS Filesystem Cheat Sheet

## Overview

macOS uses APFS (Apple File System) by default since macOS High Sierra (10.13). The filesystem structure combines Unix/BSD traditions with Apple-specific directories.

**Key Features:**
- APFS with snapshots, encryption, and space sharing
- Case-insensitive by default (case-preserving)
- Extended attributes for metadata
- Resource forks (legacy)
- Gatekeeper quarantine attributes

## Filesystem Hierarchy

### Root Directory (/)

```bash
/
├── Applications/         # Installed applications
├── Library/             # System-wide libraries and support files
├── System/              # macOS system files (read-only)
├── Users/               # User home directories
├── Volumes/             # Mounted volumes
├── bin -> usr/bin       # Essential binaries (symlink)
├── dev/                 # Device files
├── etc -> private/etc   # System configuration (symlink)
├── home -> /System/Volumes/Data/home  # Legacy
├── opt/                 # Optional software
├── private/             # Private system files
├── sbin -> usr/sbin     # System binaries (symlink)
├── tmp -> private/tmp   # Temporary files (symlink)
├── usr/                 # Unix system resources
└── var -> private/var   # Variable data (symlink)
```

### /Applications - Installed Apps

```bash
/Applications/
├── Safari.app
├── Mail.app
├── TextEdit.app
└── Utilities/

# User-specific applications
~/Applications/

# View app bundle
ls -la /Applications/Safari.app/
# Contents/
#   MacOS/        # Executable
#   Resources/    # Icons, nibs, etc.
#   Info.plist    # App metadata
```

### /Library - System Libraries

```bash
/Library/
├── Application Support/  # App support files
├── Caches/              # System caches
├── Fonts/               # System-wide fonts
├── Frameworks/          # Shared frameworks
├── LaunchAgents/        # User launch agents
├── LaunchDaemons/       # System launch daemons
├── Preferences/         # System preferences
├── Logs/                # System logs
└── Developer/           # Developer tools

# Examples
ls /Library/LaunchDaemons/
ls /Library/Fonts/
```

### /System - macOS System

```bash
/System/
├── Applications/        # System apps (Mail, Safari, etc.)
├── Library/            # System libraries
│   ├── Frameworks/     # System frameworks
│   ├── CoreServices/   # Core system services
│   ├── Extensions/     # Kernel extensions
│   └── LaunchDaemons/  # System daemons
└── Volumes/
    └── Data/           # User data volume

# Read-only system volume (macOS Catalina 10.15+)
# Mounted separately from user data
```

### /Users - User Home Directories

```bash
/Users/
├── Shared/             # Shared files between users
└── username/
    ├── Desktop/
    ├── Documents/
    ├── Downloads/
    ├── Library/        # User-specific library
    │   ├── Application Support/
    │   ├── Caches/
    │   ├── Preferences/
    │   ├── Logs/
    │   └── Mobile Documents/  # iCloud Drive
    ├── Movies/
    ├── Music/
    ├── Pictures/
    └── Public/

# Shortcuts
echo $HOME              # /Users/username
cd ~                    # Go to home directory
cd ~/Documents          # Go to Documents
```

### ~/Library - User Library

```bash
~/Library/
├── Application Support/  # App data
│   ├── com.apple.Safari/
│   ├── Google/
│   └── Code/
├── Caches/              # User caches
├── Containers/          # Sandboxed app data
├── Group Containers/    # Shared containers
├── Keychains/           # Keychain files
├── Preferences/         # User preferences (.plist files)
├── Safari/              # Safari data
├── Mail/                # Mail data
├── Messages/            # Messages data
├── Logs/                # User logs
├── Saved Application State/
└── Developer/           # Xcode data

# View preferences
defaults read com.apple.finder
ls ~/Library/Preferences/

# Hidden by default (since macOS Lion)
chflags nohidden ~/Library
```

### /Volumes - Mounted Volumes

```bash
/Volumes/
├── Macintosh HD/        # Main volume (symlinked to /)
├── Time Machine/        # Time Machine backup
├── USB Drive/           # External drives
└── Network Shares/      # Network mounts

# List volumes
ls /Volumes/
diskutil list
```

### /private - Private System Files

```bash
/private/
├── etc/                 # System configuration
│   ├── hosts
│   ├── ssh/
│   ├── apache2/
│   └── paths
├── tmp/                 # Temporary files
└── var/                 # Variable data
    ├── log/             # System logs
    ├── db/              # Databases
    ├── folders/         # Temporary folders
    └── root/            # Root user home

# Symlinks point here
/etc -> /private/etc
/tmp -> /private/tmp
/var -> /private/var
```

### /usr - Unix System Resources

```bash
/usr/
├── bin/                 # User binaries
├── lib/                 # Libraries
├── local/               # Locally installed software
│   ├── bin/
│   ├── lib/
│   └── Cellar/          # Homebrew packages
├── sbin/                # System binaries
├── share/               # Shared data
│   ├── man/             # Manual pages
│   └── doc/
└── standalone/          # Standalone tools
```

## File Permissions

### Standard Unix Permissions

```bash
# View permissions
ls -l file.txt
# -rw-r--r--  1 user  staff  1234 Jan 15 10:00 file.txt

# Change permissions
chmod 755 file.sh
chmod u+x file.sh
chmod -R 755 directory/

# Change ownership
sudo chown user:staff file.txt
sudo chown -R user:staff directory/
```

### macOS-Specific Flags

```bash
# View flags
ls -lO file.txt
# -rw-r--r--  1 user staff hidden 1234 Jan 15 10:00 file.txt

# Set hidden flag
chflags hidden file.txt
chflags nohidden file.txt

# Set locked flag
chflags uchg file.txt      # User immutable
chflags schg file.txt      # System immutable
chflags nouchg file.txt    # Remove immutable

# Common flags
# hidden      - Hide from Finder
# uchg        - User immutable
# schg        - System immutable
# nodump      - Exclude from Time Machine
```

## Extended Attributes (xattr)

### View Extended Attributes

```bash
# List files with extended attributes
ls -l@
# -rw-r--r--@ 1 user staff 1234 Jan 15 10:00 file.txt

# List all extended attributes
xattr file.txt

# View specific attribute
xattr -p com.apple.quarantine file.txt

# Show all attributes with values
xattr -l file.txt
```

### Common Extended Attributes

```bash
# Quarantine (Gatekeeper)
com.apple.quarantine       # Downloaded from internet

# Finder info
com.apple.FinderInfo       # Finder metadata

# Metadata
com.apple.metadata:kMDItemWhereFroms  # Download source

# Resource fork
com.apple.ResourceFork     # Legacy resource fork

# Text encoding
com.apple.TextEncoding     # Text file encoding
```

### Manage Extended Attributes

```bash
# Remove specific attribute
xattr -d com.apple.quarantine file.txt

# Remove all extended attributes
xattr -c file.txt

# Recursively remove quarantine
xattr -dr com.apple.quarantine /path/to/app.app

# Copy with attributes
cp -p file1.txt file2.txt

# Preserve attributes when archiving
tar -c --xattrs -f archive.tar directory/
```

### Gatekeeper Quarantine

```bash
# View quarantine attribute
xattr -p com.apple.quarantine downloaded-file

# Remove quarantine (allow app to run)
xattr -d com.apple.quarantine /Applications/App.app

# Alternative: remove recursively
sudo xattr -rd com.apple.quarantine /Applications/App.app

# Verify removal
spctl --assess --verbose /Applications/App.app
```

## APFS (Apple File System)

### APFS Features

```bash
# Space sharing between volumes
# Copy-on-write (CoW) cloning
# Snapshots
# Encryption (FileVault)
# Crash protection

# View APFS containers
diskutil apfs list

# Container structure
diskutil list
# /dev/disk1 (synthesized):
#    0: APFS Container         disk1
#    1: APFS Volume ⁨Macintosh HD⁩
#    2: APFS Volume ⁨Preboot⁩
#    3: APFS Volume ⁨Recovery⁩
#    4: APFS Volume ⁨Data⁩
```

### APFS Snapshots

```bash
# List snapshots
tmutil listlocalsnapshots /

# Create snapshot
tmutil localsnapshot

# Delete snapshot
tmutil deletelocalsnapshots 2025-01-15-123456

# Mount snapshot
mkdir ~/snapshot
mount_apfs -s com.apple.TimeMachine.2025-01-15-123456 / ~/snapshot

# Unmount
umount ~/snapshot
```

### APFS Clones (Instant Copy)

```bash
# Clone file (instant, space-efficient)
cp -c original.file cloned.file

# or
cp -cpR original/ cloned/

# Verify clone
ls -li original.file cloned.file
# Different inodes, but shared data blocks
```

## Disk Management

### Disk Utility Commands

```bash
# List all disks
diskutil list

# Information about disk
diskutil info disk0
diskutil info /

# Erase disk
diskutil eraseDisk APFS "New Volume" disk2

# Partition disk
diskutil partitionDisk disk2 1 GPT APFS "Data" 100%

# Mount/Unmount
diskutil mount disk2s1
diskutil unmount disk2s1
diskutil unmountDisk disk2

# Repair disk
diskutil verifyVolume /
diskutil repairVolume /
```

### Disk Usage

```bash
# Disk usage
df -h
diskutil info / | grep "Volume Free Space"

# Directory size
du -sh directory/
du -h -d 1 .

# Largest directories
du -hd 1 / | sort -rh | head -20

# Storage management
# System Preferences > General > Storage
# or
open ~/Library/Messages  # Check iMessage storage
```

## Spotlight and Metadata

### Spotlight

```bash
# Search with Spotlight
mdfind "kind:image"
mdfind "kind:pdf date:today"
mdfind -name "document.pdf"
mdfind -onlyin ~/Documents "project"

# Metadata query
mdls file.pdf

# Common attributes
kMDItemKind
kMDItemContentType
kMDItemWhereFroms
kMDItemDateAdded

# Rebuild Spotlight index
sudo mdutil -E /
sudo mdutil -i on /
```

### Disable Spotlight

```bash
# Disable indexing
sudo mdutil -i off /

# Delete index
sudo mdutil -E /

# Prevent indexing (create .metadata_never_index)
touch /Volumes/Drive/.metadata_never_index
```

## File System Case Sensitivity

### Default: Case-Insensitive

```bash
# macOS default is case-insensitive but case-preserving
# FILE.txt and file.txt are the same file

# Test
touch FILE.txt
ls file.txt
# FILE.txt (can access with any case)
```

### Case-Sensitive APFS

```bash
# Create case-sensitive volume
diskutil apfs addVolume disk1 "Case-sensitive APFS" "CaseSensitive"

# Format options
# APFS                    - Case-insensitive
# "Case-sensitive APFS"   - Case-sensitive
# "APFS (Encrypted)"      - Encrypted, case-insensitive
# "Case-sensitive APFS (Encrypted)"  - Encrypted, case-sensitive
```

## Special Directories

### Application Support

```bash
# System
/Library/Application Support/

# User
~/Library/Application Support/

# Example paths
~/Library/Application Support/Code/
~/Library/Application Support/Google/Chrome/
~/Library/Application Support/Sublime Text/
```

### Preferences

```bash
# Stored as .plist files
~/Library/Preferences/com.apple.Safari.plist
~/Library/Preferences/com.apple.finder.plist

# Read preferences
defaults read com.apple.finder

# Write preferences
defaults write com.apple.finder AppleShowAllFiles true

# Delete preference
defaults delete com.apple.finder AppleShowAllFiles

# Reload Finder
killall Finder
```

### Caches

```bash
# System cache
/Library/Caches/
/System/Library/Caches/

# User cache
~/Library/Caches/

# Clear user caches
rm -rf ~/Library/Caches/*

# Clear system caches (requires sudo)
sudo rm -rf /Library/Caches/*
```

## Hidden Files

### View Hidden Files

```bash
# In Finder
# Press: Cmd + Shift + .

# In Terminal (always visible)
ls -la

# Show all files in Finder (permanently)
defaults write com.apple.finder AppleShowAllFiles true
killall Finder

# Hide again
defaults write com.apple.finder AppleShowAllFiles false
killall Finder
```

### Common Hidden Files

```bash
~/.bashrc, ~/.zshrc      # Shell configuration
~/.ssh/                  # SSH keys
~/.config/               # XDG config
~/.Trash/                # User trash
.DS_Store                # Finder metadata
.localized               # Localization hint
```

## System Integrity Protection (SIP)

### Check SIP Status

```bash
csrutil status
# System Integrity Protection status: enabled
```

### Protected Directories

```bash
# SIP protects these even from root:
/System
/usr (except /usr/local)
/bin
/sbin
/var

# Can't modify even with sudo
sudo rm /System/Library/SomeFile
# Operation not permitted
```

### Disable SIP (not recommended)

```bash
# 1. Boot into Recovery Mode (Cmd+R)
# 2. Open Terminal
csrutil disable
# 3. Reboot

# Re-enable
csrutil enable
```

## Finder Integration

### Open in Finder

```bash
# Open current directory
open .

# Open specific directory
open ~/Documents

# Open with application
open -a "Visual Studio Code" file.txt
open -a Safari https://example.com

# Reveal in Finder
open -R file.txt
```

### Quick Look

```bash
# Preview file
qlmanage -p file.pdf

# Clear Quick Look cache
qlmanage -r
qlmanage -r cache
```

## Time Machine

### Time Machine Directories

```bash
# Local snapshots
/.MobileBackups/

# Backups on external drive
/Volumes/Time Machine/Backups.backupdb/ComputerName/

# Exclude from backup
tmutil addexclusion ~/large-directory/
tmutil removeexclusion ~/large-directory/

# List exclusions
tmutil isexcluded ~/directory/
```

## Best Practices

### Organization
- Store user files in ~/Documents, ~/Downloads, etc.
- Use ~/Library/Application Support for app data
- Keep ~/Library clean (many apps don't clean up)
- Use iCloud Drive for cloud storage

### Security
- Remove quarantine only from trusted apps
- Be cautious with sudo commands
- Keep SIP enabled
- Use FileVault for disk encryption
- Regular Time Machine backups

### Performance
- Clear caches periodically
- Use APFS snapshots before major changes
- Monitor disk space
- Disable Spotlight on external drives if not needed

### Maintenance
- Clean ~/Library/Caches regularly
- Remove old iOS backups from ~/Library/Application Support/MobileSync/
- Check ~/Downloads for old files
- Use Storage Management (About This Mac > Storage)

## Resources

- Apple File System Reference: https://developer.apple.com/documentation/foundation/file_system
- File System Programming Guide: https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/
- man pages: `man xattr`, `man diskutil`, `man tmutil`
- APFS documentation: https://support.apple.com/guide/disk-utility/
