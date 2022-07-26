---
title: "ansible"
description: "ansible commands"
lead: "ansible commands."
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

## Doc

[Doc](https://docs.ansible.com/ansible/latest/installation_guide/index.html)

## Playbook Example:

```yml
---
- hosts: all
  become: yes

  tasks:
    # Docker Compose
    - name: Check Docker compose bin file presence
      stat: path=/usr/local/bin/docker-compose
      register: dockercompose

    - name: Install docker compose
      shell: curl -L https://github.com/docker/compose/releases/download/1.5.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
      when: dockercompose.stat.exists == false

    - name: Apply executable permission
      file: path=/usr/local/bin/docker-compose mode="u+x,g+x"

    - name: docker port ouverture => kitematic conf
      command: echo DOCKER_OPTS="-H unix:///var/run/docker.sock -H tcp://0.0.0.0:2375" > /etc/default/docker
    # command: service docker restart

    - name: Enable i386 architecture
      command: dpkg --add-architecture i386

    - name: Ensure apt cache is up to date
      apt: upgrade
      apt: update_cache=yes

    - name: Install unzip
      apt:
        name: unzip
        state: installed
        update_cache: true

    - name: Install Open JDK
      apt:
        name: openjdk-8-jdk
        command: chmod -R +x $JAVA_HOME
```
