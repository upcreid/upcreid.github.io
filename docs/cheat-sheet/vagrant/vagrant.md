# Vagrant - Complete Guide

Vagrant is a development virtual machine management tool that allows you to create and configure reproducible environments.

## Installation

### macOS
```bash
# Via Homebrew Cask
brew install --cask vagrant

# Install VirtualBox (default provider)
brew install --cask virtualbox

# Check installation
vagrant --version
```

### Linux (Ubuntu/Debian)
```bash
# Download from official website
wget https://releases.hashicorp.com/vagrant/2.4.0/vagrant_2.4.0-1_amd64.deb
sudo dpkg -i vagrant_2.4.0-1_amd64.deb

# Install VirtualBox
sudo apt update
sudo apt install virtualbox

# Check
vagrant --version
```

### Windows
```powershell
# Via Chocolatey
choco install vagrant

# Or download the installer from
# https://www.vagrantup.com/downloads
```

## Essential Commands

### Initialization and Startup
```bash
# Initialize a new Vagrant project
vagrant init ubuntu/focal64
vagrant init hashicorp/bionic64

# Start the virtual machine
vagrant up

# Start with a specific provider
vagrant up --provider=virtualbox
vagrant up --provider=vmware_desktop

# Start and force provisioning
vagrant up --provision

# Connect via SSH
vagrant ssh

# Execute a command via SSH
vagrant ssh -c "ls -la"
```

### Lifecycle Management
```bash
# Display status
vagrant status                 # Current machine
vagrant global-status          # All machines

# Restart
vagrant reload                 # Restart
vagrant reload --provision     # With re-provisioning

# Stop
vagrant halt                   # Clean shutdown
vagrant suspend                # Suspend (faster)

# Start after suspend
vagrant resume

# Completely remove
vagrant destroy
vagrant destroy -f             # Without confirmation

# Clean up old machines
vagrant global-status --prune
```

### Box Management
```bash
# List installed boxes
vagrant box list

# Add a box
vagrant box add ubuntu/focal64
vagrant box add hashicorp/bionic64

# Update a box
vagrant box update

# Remove a box
vagrant box remove ubuntu/focal64
vagrant box remove ubuntu/focal64 --box-version 20230215.0.0

# Remove old versions
vagrant box prune
```

### Snapshots
```bash
# Create a snapshot
vagrant snapshot save snapshot_name

# List snapshots
vagrant snapshot list

# Restore a snapshot
vagrant snapshot restore snapshot_name

# Delete a snapshot
vagrant snapshot delete snapshot_name

# Return to the last snapshot
vagrant snapshot pop
```

### Provisioning
```bash
# Provision a running machine
vagrant provision

# Provision with a specific provisioner
vagrant provision --provision-with shell
vagrant provision --provision-with ansible
```

### Networking and SSH
```bash
# View SSH config
vagrant ssh-config

# Use with standard SSH
vagrant ssh-config >> ~/.ssh/config
ssh default

# Forward ports manually
vagrant port
```

## Vagrantfile - Configuration

### Basic Structure
```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # Box selection
  config.vm.box = "ubuntu/focal64"
  config.vm.box_version = "20230215.0.0"

  # Machine name
  config.vm.hostname = "dev-server"

  # Network configuration
  config.vm.network "forwarded_port", guest: 80, host: 8080

  # VirtualBox provider
  config.vm.provider "virtualbox" do |vb|
    vb.name = "dev-vm"
    vb.memory = "2048"
    vb.cpus = 2
  end

  # Provisioning
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y nginx
  SHELL
end
```

### Network Configuration

#### Port Forwarding
```ruby
# Simple port forwarding
config.vm.network "forwarded_port", guest: 80, host: 8080

# Multiple ports
config.vm.network "forwarded_port", guest: 80, host: 8080
config.vm.network "forwarded_port", guest: 443, host: 8443
config.vm.network "forwarded_port", guest: 3306, host: 3306

# With specific protocol
config.vm.network "forwarded_port", guest: 80, host: 8080, protocol: "tcp"

# On a specific interface
config.vm.network "forwarded_port", guest: 80, host: 8080, host_ip: "127.0.0.1"

# Avoid collisions
config.vm.network "forwarded_port", guest: 80, host: 8080, auto_correct: true
```

#### Private Network
```ruby
# Static IP
config.vm.network "private_network", ip: "192.168.33.10"

# DHCP
config.vm.network "private_network", type: "dhcp"

# With network name
config.vm.network "private_network",
  ip: "192.168.33.10",
  virtualbox__intnet: "my_network"
```

#### Public Network
```ruby
# Public DHCP
config.vm.network "public_network"

# Bridge on a specific interface
config.vm.network "public_network", bridge: "en0: Wi-Fi (Wireless)"

# Static IP on public network
config.vm.network "public_network", ip: "192.168.1.100"
```

### Shared Folders
```ruby
# Default mount (./  => /vagrant)
config.vm.synced_folder ".", "/vagrant"

# Custom folder
config.vm.synced_folder "./src", "/var/www/html"

# Multiple folders
config.vm.synced_folder "./app", "/opt/app"
config.vm.synced_folder "./data", "/data"

# Specific mount type
config.vm.synced_folder ".", "/vagrant", type: "nfs"
config.vm.synced_folder ".", "/vagrant", type: "rsync"

# Mount options
config.vm.synced_folder ".", "/vagrant",
  owner: "www-data",
  group: "www-data",
  mount_options: ["dmode=775,fmode=664"]

# Disable default folder
config.vm.synced_folder ".", "/vagrant", disabled: true

# NFS (more performant on Mac/Linux)
config.vm.synced_folder ".", "/vagrant",
  type: "nfs",
  nfs_version: 4,
  nfs_udp: false

# Rsync (unidirectional)
config.vm.synced_folder ".", "/vagrant",
  type: "rsync",
  rsync__exclude: [".git/", "node_modules/"]
```

### Provider Configuration

#### VirtualBox
```ruby
config.vm.provider "virtualbox" do |vb|
  # VM name
  vb.name = "my-dev-vm"

  # Resources
  vb.memory = "4096"
  vb.cpus = 2

  # Graphical interface
  vb.gui = false

  # Advanced customizations
  vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
  vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
  vb.customize ["modifyvm", :id, "--ioapic", "on"]

  # Linked clone (faster)
  vb.linked_clone = true
end
```

#### VMware
```ruby
config.vm.provider "vmware_desktop" do |vmware|
  vmware.vmx["memsize"] = "4096"
  vmware.vmx["numvcpus"] = "2"
  vmware.gui = false
end
```

### Provisioning

#### Inline Shell Script
```ruby
config.vm.provision "shell", inline: <<-SHELL
  apt-get update
  apt-get install -y nginx
  systemctl enable nginx
  systemctl start nginx
SHELL
```

#### External Shell Script
```ruby
config.vm.provision "shell", path: "scripts/setup.sh"

# With arguments
config.vm.provision "shell",
  path: "scripts/setup.sh",
  args: ["arg1", "arg2"]

# As a specific user
config.vm.provision "shell",
  path: "scripts/setup.sh",
  privileged: false  # Execute as vagrant user
```

#### Ansible
```ruby
config.vm.provision "ansible" do |ansible|
  ansible.playbook = "playbook.yml"
  ansible.inventory_path = "inventory"
  ansible.limit = "all"
  ansible.verbose = "v"

  ansible.extra_vars = {
    env: "development",
    version: "1.0.0"
  }
end
```

#### Docker
```ruby
# Install Docker
config.vm.provision "docker"

# Pull images
config.vm.provision "docker" do |d|
  d.pull_images "nginx"
  d.pull_images "postgres:15"
  d.pull_images "redis:7-alpine"
end

# Run containers
config.vm.provision "docker" do |d|
  d.run "nginx",
    args: "-p 80:80 -v /vagrant:/usr/share/nginx/html"
end

# Docker Compose
config.vm.provision "docker_compose" do |docker_compose|
  docker_compose.yml = "/vagrant/docker-compose.yml"
  docker_compose.rebuild = true
  docker_compose.run = "always"
end
```

#### Multiple Provisioning
```ruby
# Execution order
config.vm.provision "shell", inline: "echo 'First'"
config.vm.provision "shell", inline: "echo 'Second'"

# With names
config.vm.provision "bootstrap", type: "shell", inline: "apt-get update"
config.vm.provision "install", type: "shell", inline: "apt-get install -y nginx"

# Run only specific ones
# vagrant provision --provision-with bootstrap
```

### Multi-Machine
```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"

  # Web machine
  config.vm.define "web" do |web|
    web.vm.hostname = "web-server"
    web.vm.network "private_network", ip: "192.168.33.10"

    web.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
      vb.cpus = 1
    end

    web.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y nginx
    SHELL
  end

  # Database machine
  config.vm.define "db" do |db|
    db.vm.hostname = "db-server"
    db.vm.network "private_network", ip: "192.168.33.11"

    db.vm.provider "virtualbox" do |vb|
      vb.memory = "2048"
      vb.cpus = 2
    end

    db.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y postgresql
    SHELL
  end
end
```

### Conditional Configuration
```ruby
Vagrant.configure("2") do |config|
  # Based on host OS
  if Vagrant::Util::Platform.windows?
    config.vm.synced_folder ".", "/vagrant", type: "smb"
  elsif Vagrant::Util::Platform.darwin?
    config.vm.synced_folder ".", "/vagrant", type: "nfs"
  else
    config.vm.synced_folder ".", "/vagrant", type: "virtualbox"
  end

  # Environment variables
  memory = ENV['VAGRANT_MEMORY'] || "1024"
  cpus = ENV['VAGRANT_CPUS'] || "1"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = memory
    vb.cpus = cpus
  end
end
```

## Practical Examples

### LAMP Stack
```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"
  config.vm.hostname = "lamp-server"

  config.vm.network "private_network", ip: "192.168.33.10"
  config.vm.network "forwarded_port", guest: 80, host: 8080

  config.vm.synced_folder "./www", "/var/www/html",
    owner: "www-data",
    group: "www-data"

  config.vm.provider "virtualbox" do |vb|
    vb.name = "LAMP-Dev"
    vb.memory = "2048"
    vb.cpus = 2
  end

  config.vm.provision "shell", inline: <<-SHELL
    # Update
    apt-get update

    # Apache
    apt-get install -y apache2

    # MySQL
    debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
    debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'
    apt-get install -y mysql-server

    # PHP
    apt-get install -y php libapache2-mod-php php-mysql

    # Enable mod_rewrite
    a2enmod rewrite
    systemctl restart apache2
  SHELL
end
```

### Docker Environment
```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"
  config.vm.hostname = "docker-host"

  config.vm.network "private_network", ip: "192.168.33.20"

  config.vm.provider "virtualbox" do |vb|
    vb.name = "Docker-Dev"
    vb.memory = "4096"
    vb.cpus = 2
  end

  # Install Docker
  config.vm.provision "docker"

  # Install Docker Compose
  config.vm.provision "shell", inline: <<-SHELL
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
      -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
  SHELL

  # Start containers
  config.vm.provision "docker_compose" do |compose|
    compose.yml = "/vagrant/docker-compose.yml"
  end
end
```

### Multi-Node Cluster
```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"

  # Define number of workers
  NUM_WORKERS = 3

  # Master node
  config.vm.define "master" do |master|
    master.vm.hostname = "k8s-master"
    master.vm.network "private_network", ip: "192.168.33.10"

    master.vm.provider "virtualbox" do |vb|
      vb.memory = "2048"
      vb.cpus = 2
    end

    master.vm.provision "shell", path: "scripts/k8s-master.sh"
  end

  # Worker nodes
  (1..NUM_WORKERS).each do |i|
    config.vm.define "worker-#{i}" do |worker|
      worker.vm.hostname = "k8s-worker-#{i}"
      worker.vm.network "private_network", ip: "192.168.33.#{10 + i}"

      worker.vm.provider "virtualbox" do |vb|
        vb.memory = "1024"
        vb.cpus = 1
      end

      worker.vm.provision "shell", path: "scripts/k8s-worker.sh"
    end
  end
end
```

## Useful Plugins

### Plugin Installation
```bash
# Install a plugin
vagrant plugin install vagrant-vbguest

# List plugins
vagrant plugin list

# Update plugins
vagrant plugin update

# Uninstall a plugin
vagrant plugin uninstall vagrant-vbguest
```

### Popular Plugins
```bash
# vagrant-vbguest: Automatically updates Guest Additions
vagrant plugin install vagrant-vbguest

# vagrant-hostmanager: Manages /etc/hosts automatically
vagrant plugin install vagrant-hostmanager

# vagrant-disksize: Resize disks
vagrant plugin install vagrant-disksize

# vagrant-env: Load variables from .env
vagrant plugin install vagrant-env
```

### Plugin Usage

#### vagrant-vbguest
```ruby
config.vbguest.auto_update = true
config.vbguest.no_remote = false
```

#### vagrant-hostmanager
```ruby
config.hostmanager.enabled = true
config.hostmanager.manage_host = true
config.hostmanager.manage_guest = true

config.vm.define "web" do |web|
  web.vm.hostname = "web.local"
  web.vm.network "private_network", ip: "192.168.33.10"
end
```

#### vagrant-disksize
```ruby
config.disksize.size = "50GB"
```

## Best Practices

### Project Organization
```
project/
  Vagrantfile
  README.md
  .vagrant/          # Generated, ignore in git
  scripts/
    setup.sh
    provision.sh
  ansible/
    playbook.yml
  docker/
    docker-compose.yml
```

### .gitignore File
```gitignore
.vagrant/
*.box
.DS_Store
```

### Environment Variables
```ruby
# .env
VAGRANT_MEMORY=2048
VAGRANT_CPUS=2
```

```ruby
# Vagrantfile
require 'dotenv'
Dotenv.load

Vagrant.configure("2") do |config|
  config.vm.provider "virtualbox" do |vb|
    vb.memory = ENV['VAGRANT_MEMORY'] || "1024"
    vb.cpus = ENV['VAGRANT_CPUS'] || "1"
  end
end
```

### Performance Optimization

#### NFS for Shared Folders (Mac/Linux)
```ruby
config.vm.synced_folder ".", "/vagrant",
  type: "nfs",
  nfs_version: 4,
  nfs_udp: false
```

#### Package Cache
```ruby
# With vagrant-cachier plugin
if Vagrant.has_plugin?("vagrant-cachier")
  config.cache.scope = :box
end
```

#### Linked Clones
```ruby
config.vm.provider "virtualbox" do |vb|
  vb.linked_clone = true
end
```

## Troubleshooting

### Common Issues
```bash
# Completely reset
vagrant destroy -f
vagrant box remove ubuntu/focal64
vagrant up

# Network issues
vagrant reload --provision

# Shared folder issues
vagrant plugin install vagrant-vbguest
vagrant vbguest --do install --no-cleanup

# Check logs
vagrant up --debug 2>&1 | tee vagrant.log

# Clean up old machines
vagrant global-status --prune
```

### Debug Commands
```bash
# Full debug mode
VAGRANT_LOG=debug vagrant up

# View SSH details
vagrant ssh-config

# Verify configuration
vagrant validate
```

## Resources

- **Official documentation**: https://www.vagrantup.com/docs
- **Vagrant Cloud (Boxes)**: https://app.vagrantup.com/boxes/search
- **GitHub**: https://github.com/hashicorp/vagrant
- **Community**: https://discuss.hashicorp.com/c/vagrant

---

*This Vagrant guide covers the essentials for creating and efficiently managing reproducible virtualized development environments.*
