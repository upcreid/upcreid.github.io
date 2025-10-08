# Linux Filesystem Cheat Sheet

## Overview

The Linux filesystem follows the Filesystem Hierarchy Standard (FHS), which defines the directory structure and contents in Unix-like operating systems.

**Key Principles:**
- Everything is a file (including devices)
- Single root directory (/)
- Case-sensitive filenames
- Hidden files start with dot (.)
- No file extensions required

## Filesystem Hierarchy Standard (FHS)

### Root Directory (/)
The top-level directory from which all other directories branch.

```bash
/
├── bin     -> usr/bin    # Essential user binaries
├── boot                  # Boot loader files
├── dev                   # Device files
├── etc                   # System configuration files
├── home                  # User home directories
├── lib     -> usr/lib    # Shared libraries
├── media                 # Mount points for removable media
├── mnt                   # Temporary mount points
├── opt                   # Optional/third-party software
├── proc                  # Process and kernel information
├── root                  # Root user home directory
├── run                   # Runtime data
├── sbin    -> usr/sbin   # System binaries
├── srv                   # Service data
├── sys                   # Kernel and system information
├── tmp                   # Temporary files
├── usr                   # User programs and data
└── var                   # Variable data files
```

### /bin - Essential User Binaries
```bash
# Symlinked to /usr/bin on modern systems
ls /bin
# Common binaries: bash, cat, cp, ls, mv, rm, echo, grep, etc.
```

### /boot - Boot Loader Files
```bash
/boot/
├── vmlinuz-*          # Linux kernel
├── initrd.img-*       # Initial RAM disk
├── grub/              # GRUB bootloader
└── config-*           # Kernel configuration
```

### /dev - Device Files
```bash
/dev/
├── sda, sdb           # SATA/SCSI disks
├── sda1, sda2         # Disk partitions
├── nvme0n1            # NVMe drives
├── tty*               # Terminals
├── null               # Null device (discards all data)
├── zero               # Zero device (provides zeros)
├── random, urandom    # Random number generators
└── loop*              # Loop devices

# Examples
ls -l /dev/sda         # View disk device
ls -l /dev/tty1        # View terminal device
```

### /etc - System Configuration
```bash
/etc/
├── passwd             # User account information
├── shadow             # Encrypted passwords
├── group              # Group information
├── fstab              # Filesystem mount table
├── hosts              # Static hostname lookup
├── hostname           # System hostname
├── resolv.conf        # DNS resolver configuration
├── network/           # Network configuration
├── ssh/               # SSH configuration
├── systemd/           # Systemd configuration
├── apt/               # APT configuration (Debian/Ubuntu)
├── yum/               # YUM configuration (RHEL/CentOS)
└── cron.d/            # Cron job configurations

# Examples
cat /etc/passwd        # View user accounts
cat /etc/hosts         # View hostname mappings
cat /etc/fstab         # View filesystem mounts
```

### /home - User Home Directories
```bash
/home/
├── user1/
│   ├── .bashrc        # Bash configuration
│   ├── .profile       # Shell profile
│   ├── .ssh/          # SSH keys
│   ├── Documents/
│   ├── Downloads/
│   └── .local/        # User-specific data
└── user2/

# User home directory shortcut
echo $HOME             # /home/username
cd ~                   # Go to home directory
cd ~/Documents         # Go to Documents
```

### /lib - Shared Libraries
```bash
# Symlinked to /usr/lib on modern systems
/lib/
├── modules/           # Kernel modules
├── firmware/          # Hardware firmware
└── *.so               # Shared library files

# Examples
ls /lib/modules/$(uname -r)/  # Current kernel modules
```

### /media - Removable Media
```bash
/media/
├── username/
│   ├── USB_DRIVE/
│   └── CDROM/

# Auto-mounted removable devices
```

### /mnt - Temporary Mounts
```bash
# Manual mount point for temporary filesystems
sudo mount /dev/sdb1 /mnt
sudo umount /mnt
```

### /opt - Optional Software
```bash
/opt/
├── google/            # Google Chrome
├── teamviewer/
└── custom-app/

# Third-party applications that don't follow FHS
```

### /proc - Process Information
```bash
/proc/
├── 1234/              # Process ID directory
├── cpuinfo            # CPU information
├── meminfo            # Memory information
├── version            # Kernel version
└── uptime             # System uptime

# Examples
cat /proc/cpuinfo      # View CPU info
cat /proc/meminfo      # View memory info
cat /proc/version      # View kernel version
ls /proc/1/            # View init process info
```

### /root - Root Home Directory
```bash
# Home directory for root user
/root/
├── .bashrc
├── .ssh/
└── scripts/

# Access
sudo -i                # Switch to root
```

### /run - Runtime Data
```bash
/run/
├── systemd/           # Systemd runtime data
├── user/              # User runtime directories
└── lock/              # Lock files

# Cleared on reboot
```

### /srv - Service Data
```bash
/srv/
├── www/               # Web server data
├── ftp/               # FTP server data
└── git/               # Git repositories

# Data for services provided by the system
```

### /sys - Kernel/Hardware Info
```bash
/sys/
├── block/             # Block devices
├── bus/               # Bus types
├── class/             # Device classes
├── devices/           # Physical devices
└── module/            # Kernel modules

# Examples
cat /sys/class/power_supply/BAT0/capacity  # Battery level
cat /sys/class/thermal/thermal_zone0/temp   # CPU temperature
```

### /tmp - Temporary Files
```bash
/tmp/
# Cleared periodically (usually on reboot)
# World-writable with sticky bit

# Create temp file
mktemp /tmp/myfile.XXXXXX

# Permissions
ls -ld /tmp
# drwxrwxrwt (sticky bit set)
```

### /usr - User Programs
```bash
/usr/
├── bin/               # User commands
├── sbin/              # System administration commands
├── lib/               # Libraries
├── share/             # Architecture-independent data
│   ├── man/           # Manual pages
│   ├── doc/           # Documentation
│   └── applications/  # Desktop entries
├── local/             # Locally installed software
│   ├── bin/
│   ├── lib/
│   └── share/
├── include/           # C header files
└── src/               # Source code

# Examples
ls /usr/bin            # User binaries
man -k keyword         # Search man pages
```

### /var - Variable Data
```bash
/var/
├── log/               # Log files
│   ├── syslog         # System log
│   ├── auth.log       # Authentication log
│   ├── kern.log       # Kernel log
│   └── apache2/       # Apache logs
├── cache/             # Application cache
├── tmp/               # Temporary files (preserved across reboots)
├── spool/             # Spool files
│   ├── cron/          # Cron jobs
│   └── mail/          # Mail queue
├── lib/               # Variable state information
│   ├── dpkg/          # Package manager database
│   └── mysql/         # MySQL databases
├── www/               # Web server files
└── run/               # Runtime data (symlink to /run)

# Examples
tail -f /var/log/syslog          # Monitor system log
ls /var/cache/apt/archives/      # APT package cache
```

## File Permissions

### Permission Types

```bash
# Format: type|owner|group|others
# drwxr-xr-x
# d = directory
# rwx = read, write, execute for owner
# r-x = read, execute for group
# r-x = read, execute for others

# Permission values
r (read)    = 4
w (write)   = 2
x (execute) = 1
- (none)    = 0
```

### Viewing Permissions

```bash
# Long listing
ls -l file.txt
# -rw-r--r-- 1 user group 1234 Jan 15 10:00 file.txt

# Just permissions
stat -c '%A' file.txt
# -rw-r--r--

# Numeric permissions
stat -c '%a' file.txt
# 644
```

### chmod - Change Mode

```bash
# Symbolic mode
chmod u+x file.sh          # Add execute for user
chmod g-w file.txt         # Remove write for group
chmod o+r file.txt         # Add read for others
chmod a+x file.sh          # Add execute for all
chmod u=rw,g=r,o=r file    # Set exact permissions

# Numeric mode
chmod 755 file.sh          # rwxr-xr-x
chmod 644 file.txt         # rw-r--r--
chmod 600 private.key      # rw-------
chmod 777 script.sh        # rwxrwxrwx (avoid!)

# Recursive
chmod -R 755 directory/    # Apply to directory and contents

# Common permissions
chmod 755 script.sh        # Executable script
chmod 644 file.txt         # Regular file
chmod 600 ~/.ssh/id_rsa    # Private key
chmod 700 ~/.ssh           # SSH directory
chmod 1777 /tmp            # Sticky bit directory
```

### chown - Change Ownership

```bash
# Change owner
sudo chown user file.txt

# Change owner and group
sudo chown user:group file.txt

# Change only group
sudo chown :group file.txt
# or
sudo chgrp group file.txt

# Recursive
sudo chown -R user:group directory/

# Examples
sudo chown www-data:www-data /var/www/html/
sudo chown -R $USER:$USER ~/project/
```

### Special Permissions

```bash
# Setuid (4) - Execute as file owner
chmod u+s file             # or chmod 4755 file
# Example: /usr/bin/passwd

# Setgid (2) - Execute as group / inherit directory group
chmod g+s directory        # or chmod 2755 directory
# Files created inherit directory group

# Sticky bit (1) - Only owner can delete
chmod +t directory         # or chmod 1777 directory
# Example: /tmp
```

### umask - Default Permissions

```bash
# View current umask
umask
# 0022

# Set umask
umask 0027               # Files: 640, Directories: 750

# Calculate default permissions
# Files: 666 - umask
# Directories: 777 - umask

# Examples
umask 0022               # Files: 644, Dirs: 755 (default user)
umask 0077               # Files: 600, Dirs: 700 (private)
umask 0002               # Files: 664, Dirs: 775 (group writable)

# Set permanently in ~/.bashrc
echo "umask 0027" >> ~/.bashrc
```

## Access Control Lists (ACL)

### View ACL

```bash
# Check if ACL is supported
mount | grep acl

# View ACL
getfacl file.txt
```

### Set ACL

```bash
# Give user read/write
setfacl -m u:username:rw file.txt

# Give group read
setfacl -m g:groupname:r file.txt

# Set default ACL for directory
setfacl -d -m u:username:rwx directory/

# Remove ACL
setfacl -x u:username file.txt

# Remove all ACL
setfacl -b file.txt

# Recursive
setfacl -R -m u:username:rwx directory/

# Copy ACL
getfacl file1 | setfacl --set-file=- file2
```

## Filesystem Types

### Common Filesystems

```bash
# ext4 - Fourth Extended Filesystem (default on most Linux)
# xfs - XFS filesystem (default on RHEL/CentOS 7+)
# btrfs - B-tree filesystem (CoW, snapshots)
# f2fs - Flash-Friendly Filesystem (for SSDs)
# zfs - ZFS filesystem (advanced features)
# vfat/exfat - FAT filesystems (Windows compatibility)
# ntfs - NTFS filesystem (Windows)

# Check filesystem type
df -T
lsblk -f
blkid /dev/sda1
```

### Mount/Unmount

```bash
# Mount filesystem
sudo mount /dev/sdb1 /mnt
sudo mount -t ext4 /dev/sdb1 /mnt

# Mount with options
sudo mount -o ro /dev/sdb1 /mnt           # Read-only
sudo mount -o rw,noexec /dev/sdb1 /mnt    # No execution

# Unmount
sudo umount /mnt
sudo umount /dev/sdb1

# Force unmount
sudo umount -f /mnt
sudo umount -l /mnt                        # Lazy unmount

# Check what's using the mount
lsof +D /mnt
fuser -m /mnt
```

### /etc/fstab - Permanent Mounts

```bash
# Format: device  mountpoint  type  options  dump  pass
UUID=xxx  /data  ext4  defaults  0  2
/dev/sdb1  /backup  ext4  defaults,noatime  0  2
//server/share  /mnt/smb  cifs  credentials=/root/.smbcred  0  0
tmpfs  /tmp  tmpfs  defaults,noatime,mode=1777  0  0

# Mount all from fstab
sudo mount -a

# Reload systemd after fstab changes
sudo systemctl daemon-reload
```

## Disk Management

### Disk Information

```bash
# List block devices
lsblk
lsblk -f                   # With filesystem info

# Disk usage
df -h                      # Human-readable
df -i                      # Inode usage
df -T                      # Filesystem type

# Directory size
du -sh directory/          # Summary
du -h --max-depth=1 .      # First level subdirs
du -hac directory/         # All with total

# Largest directories
du -hx / | sort -rh | head -20

# Find large files
find / -type f -size +100M 2>/dev/null
find / -type f -size +1G -exec ls -lh {} \; 2>/dev/null
```

### Partition Management

```bash
# List partitions
sudo fdisk -l
sudo parted -l
lsblk

# Create partition (fdisk)
sudo fdisk /dev/sdb
# n (new), p (primary), w (write)

# Create partition (parted)
sudo parted /dev/sdb
# mklabel gpt
# mkpart primary ext4 0% 100%

# Format partition
sudo mkfs.ext4 /dev/sdb1
sudo mkfs.xfs /dev/sdb1
sudo mkfs.vfat -F 32 /dev/sdb1
```

### Filesystem Check and Repair

```bash
# Check filesystem (unmounted!)
sudo fsck /dev/sda1
sudo e2fsck -f /dev/sda1   # ext2/3/4
sudo xfs_repair /dev/sda1   # XFS

# Force check on next reboot
sudo touch /forcefsck

# Disk check with badblocks
sudo badblocks -v /dev/sda
```

## Symbolic and Hard Links

### Symbolic Links (Soft Links)

```bash
# Create symlink
ln -s /path/to/original /path/to/link

# Examples
ln -s /usr/bin/python3 ~/bin/python
ln -s /var/www/html ~/www
ln -s ../../../file.txt relative-link.txt

# View symlink
ls -l link
# lrwxrwxrwx 1 user group 15 Jan 15 10:00 link -> /path/to/original

# Read symlink target
readlink link
readlink -f link           # Follow all symlinks

# Remove symlink
rm link                    # Don't use trailing slash!
unlink link
```

### Hard Links

```bash
# Create hard link
ln /path/to/original /path/to/link

# View inode
ls -li file
# 1234567 -rw-r--r-- 2 user group 100 Jan 15 10:00 file

# Hard link count in ls output
ls -l file
# -rw-r--r-- 2 user group ...
#            ^ link count

# Find all hard links to file
find / -inum 1234567 2>/dev/null
```

### Differences

```bash
# Symbolic Link:
# - Can link to directories
# - Can cross filesystems
# - Breaks if original is deleted
# - Shows -> in ls output

# Hard Link:
# - Cannot link to directories
# - Must be on same filesystem
# - Remains valid if original is deleted
# - All links are equal (no "original")
```

## File Attributes

### Extended Attributes

```bash
# View attributes
lsattr file.txt

# Set attributes
sudo chattr +i file.txt    # Immutable (can't modify/delete)
sudo chattr +a file.txt    # Append only
sudo chattr -i file.txt    # Remove immutable

# Common attributes
# i = immutable
# a = append only
# A = no atime update
# d = no dump
# s = secure deletion
```

### File Capabilities

```bash
# View capabilities
getcap /usr/bin/ping

# Set capability
sudo setcap cap_net_raw+ep /usr/bin/ping

# Remove capability
sudo setcap -r /usr/bin/ping

# Common capabilities
# cap_net_raw = raw network access
# cap_net_admin = network admin
# cap_sys_admin = system admin
```

## Finding Files

### find Command

```bash
# By name
find /path -name "*.txt"
find /path -iname "*.TXT"      # Case-insensitive

# By type
find /path -type f             # Files
find /path -type d             # Directories
find /path -type l             # Symlinks

# By size
find /path -size +100M         # Larger than 100MB
find /path -size -1M           # Smaller than 1MB

# By modification time
find /path -mtime -7           # Modified in last 7 days
find /path -mtime +30          # Modified more than 30 days ago
find /path -mmin -60           # Modified in last 60 minutes

# By permissions
find /path -perm 644
find /path -perm -u+w          # User writable

# By owner
find /path -user username
find /path -group groupname

# Execute command
find /path -name "*.log" -exec rm {} \;
find /path -name "*.txt" -delete

# Combine conditions
find /path -name "*.log" -size +10M -mtime +30
```

### locate Command

```bash
# Update database
sudo updatedb

# Search
locate filename
locate -i filename         # Case-insensitive
locate -n 10 filename      # Limit results

# Count matches
locate -c filename
```

## Best Practices

### Permissions
- Use least privilege principle
- Avoid 777 permissions
- Use ACL for fine-grained control
- Protect sensitive files (600 or 400)
- Use sticky bit on shared directories

### Organization
- Follow FHS standards
- Keep user data in /home
- Use /opt for third-party software
- Store logs in /var/log
- Use /tmp for temporary files

### Security
- Regularly check permissions on sensitive files
- Monitor /etc for unauthorized changes
- Use immutable attribute on critical files
- Audit setuid/setgid binaries
- Keep /tmp with noexec option

### Maintenance
- Monitor disk usage regularly
- Clean old logs from /var/log
- Remove unused packages
- Check for orphaned files
- Backup /etc configuration

## Resources

- FHS 3.0: https://refspecs.linuxfoundation.org/FHS_3.0/
- Linux Documentation Project: https://tldp.org/
- Arch Wiki: https://wiki.archlinux.org/
- man pages: `man hier`, `man chmod`, `man mount`
