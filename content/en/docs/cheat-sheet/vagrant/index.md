---
title: "vagrant"
description: "vagrant commands"
lead: "vagrant commands."
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  docs:
    parent: "cheat-sheet"
weight: 130
toc: true
---

## Exemple de conf Vagrantfile:

```vagrantfile
# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "ubuntu/xenial64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  config.vm.box_check_update = false

  # fsnotify
  config.vm.synced_folder ".", "/vagrant", fsnotify: true

  config.vm.provider "virtualbox" do |vb|
    vb.name = "default"
    # vb.gui = true
    vb.cpus = 2
    vb.memory = "5120"
  end

  # Port Main Application
  config.vm.network "forwarded_port", guest: 80, host: 80
  
  # Port docker Engine
  config.vm.network "forwarded_port", guest: 2375, host: 2375
  
  # Port Mongo
  config.vm.network "forwarded_port", guest: 27017, host: 27017
  
  # Ionic
  # Ionic serve
  config.vm.network "forwarded_port", guest: 8100, host: 8100
  # Ionic livereload
  config.vm.network "forwarded_port", guest: 35729, host: 35729
  config.vm.network "forwarded_port", guest: 53703, host: 53703
  
  # Port NodeJS
  config.vm.network "forwarded_port", guest: 8400, host: 8400

  # Vagrant provision
  # Docker container
  config.vm.provision "docker" do |docker|
    docker.pull_images 'mongo'
    docker.pull_images 'node'
  end

  config.vm.provision "shell", path: "vagrant-provision/setup.sh"

end

```
