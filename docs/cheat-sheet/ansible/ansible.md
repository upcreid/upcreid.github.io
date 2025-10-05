# Ansible - Complete Guide

Ansible is an open-source IT automation tool that allows you to manage configuration, deploy applications, and orchestrate tasks across multiple servers.

## Installation

### Linux (Ubuntu/Debian)
```bash
# Via APT
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository --yes --update ppa:ansible/ansible
sudo apt install ansible

# Via pip
python3 -m pip install --user ansible

# Check installation
ansible --version
```

### macOS
```bash
# Via Homebrew
brew install ansible

# Via pip
python3 -m pip install --user ansible
```

### CentOS/RHEL
```bash
# Via DNF/YUM
sudo dnf install ansible
# or
sudo yum install ansible

# Via pip
python3 -m pip install --user ansible
```

## Initial Configuration

### Configuration File
```bash
# Global configuration
/etc/ansible/ansible.cfg

# User configuration
~/.ansible.cfg

# Project configuration
./ansible.cfg
```

### Basic ansible.cfg
```ini
[defaults]
inventory = ./inventory
remote_user = admin
host_key_checking = False
retry_files_enabled = False
gathering = smart
fact_caching = jsonfile
fact_caching_connection = /tmp/ansible_facts
fact_caching_timeout = 3600

[privilege_escalation]
become = True
become_method = sudo
become_user = root
become_ask_pass = False

[ssh_connection]
pipelining = True
```

### Inventory
```ini
# inventory/production
[webservers]
web01.example.com
web02.example.com ansible_host=192.168.1.10

[dbservers]
db01.example.com ansible_port=2222
db02.example.com

[production:children]
webservers
dbservers

[production:vars]
ansible_user=admin
ansible_become=yes
```

## Ad-Hoc Commands

### Basic Syntax
```bash
ansible [pattern] -m [module] -a "[module options]"
```

### Practical Examples
```bash
# Ping all servers
ansible all -m ping

# Check uptime
ansible all -m command -a "uptime"
ansible all -a "uptime"  # command is the default module

# Copy a file
ansible webservers -m copy -a "src=/tmp/file dest=/tmp/file"

# Install a package
ansible webservers -m apt -a "name=nginx state=present" -b
ansible dbservers -m dnf -a "name=postgresql state=latest" -b

# Restart a service
ansible webservers -m service -a "name=nginx state=restarted" -b

# Create a user
ansible all -m user -a "name=john state=present" -b

# Get facts
ansible all -m setup
ansible all -m setup -a "filter=ansible_distribution*"

# Execute in parallel (10 servers at a time)
ansible webservers -a "/sbin/reboot" -f 10 -b

# Use a specific inventory
ansible all -i inventory/staging -m ping
```

## Playbooks

### Basic Structure
```yaml
---
- name: Configure web servers
  hosts: webservers
  become: yes
  vars:
    http_port: 80
    max_clients: 200

  tasks:
    - name: Install Nginx
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: yes

    - name: Start Nginx
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: yes
```

### Complete Playbook with Variables and Handlers
```yaml
---
- name: Deploy web application
  hosts: webservers
  become: yes

  vars:
    app_name: myapp
    app_port: 8080

  vars_files:
    - vars/common.yml
    - vars/secrets.yml  # Encrypted with Ansible Vault

  tasks:
    - name: Install dependencies
      ansible.builtin.apt:
        name:
          - nginx
          - python3
          - python3-pip
        state: present
        update_cache: yes

    - name: Create application directory
      ansible.builtin.file:
        path: "/opt/{{ app_name }}"
        state: directory
        owner: www-data
        group: www-data
        mode: '0755'

    - name: Deploy Nginx configuration
      ansible.builtin.template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/sites-available/{{ app_name }}
        owner: root
        group: root
        mode: '0644'
      notify: Reload Nginx

    - name: Enable site
      ansible.builtin.file:
        src: /etc/nginx/sites-available/{{ app_name }}
        dest: /etc/nginx/sites-enabled/{{ app_name }}
        state: link
      notify: Reload Nginx

  handlers:
    - name: Reload Nginx
      ansible.builtin.service:
        name: nginx
        state: reloaded

    - name: Restart Nginx
      ansible.builtin.service:
        name: nginx
        state: restarted
```

### Executing Playbooks
```bash
# Execute a playbook
ansible-playbook site.yml

# Dry-run mode (simulation)
ansible-playbook site.yml --check

# Show differences
ansible-playbook site.yml --check --diff

# Limit to specific hosts
ansible-playbook site.yml --limit web01.example.com
ansible-playbook site.yml --limit webservers

# Use tags
ansible-playbook site.yml --tags configuration
ansible-playbook site.yml --skip-tags packages

# Verbose mode
ansible-playbook site.yml -v    # Verbose
ansible-playbook site.yml -vv   # More verbose
ansible-playbook site.yml -vvv  # Very verbose

# With additional variables
ansible-playbook site.yml -e "version=1.2.3"
ansible-playbook site.yml -e "@vars/extra.yml"

# Ask for sudo password
ansible-playbook site.yml --ask-become-pass
```

## Roles

### Role Structure
```
roles/
  webserver/
    tasks/
      main.yml      # Main tasks
    handlers/
      main.yml      # Handlers
    templates/
      nginx.conf.j2
    files/
      index.html
    vars/
      main.yml      # Variables (high priority)
    defaults/
      main.yml      # Default variables (low priority)
    meta/
      main.yml      # Dependencies and metadata
```

### Role Example - tasks/main.yml
```yaml
---
# roles/webserver/tasks/main.yml
- name: Install Nginx
  ansible.builtin.apt:
    name: nginx
    state: present
    update_cache: yes

- name: Copy configuration
  ansible.builtin.template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    owner: root
    group: root
    mode: '0644'
  notify: Reload Nginx

- name: Deploy website
  ansible.builtin.copy:
    src: index.html
    dest: /var/www/html/index.html
    owner: www-data
    group: www-data
    mode: '0644'

- name: Ensure Nginx is started
  ansible.builtin.service:
    name: nginx
    state: started
    enabled: yes
```

### Using Roles
```yaml
---
- name: Configure servers
  hosts: all
  become: yes

  roles:
    - common
    - webserver
    - monitoring

- name: Configuration with variables
  hosts: webservers
  become: yes

  roles:
    - role: nginx
      vars:
        nginx_port: 8080
        nginx_user: www-data

- name: Dynamic inclusion
  hosts: all
  tasks:
    - name: Include role conditionally
      include_role:
        name: apache
      when: ansible_facts['os_family'] == "Debian"
```

### Role Dependencies - meta/main.yml
```yaml
---
# roles/webserver/meta/main.yml
dependencies:
  - role: common
  - role: firewall
    vars:
      firewall_allowed_ports:
        - 80
        - 443
```

## Variables

### Defining Variables
```yaml
# In a playbook
vars:
  http_port: 80
  server_name: web01

# From a file
vars_files:
  - vars/common.yml
  - vars/{{ ansible_facts['distribution'] }}.yml

# From command line
ansible-playbook site.yml -e "version=1.2.3"
ansible-playbook site.yml -e "@vars/extra.yml"
```

### Variable Types
```yaml
# Simple
app_name: myapp

# List
packages:
  - nginx
  - php
  - mysql-server

# Dictionary
user:
  name: john
  uid: 1000
  shell: /bin/bash
  groups:
    - sudo
    - docker

# Usage
- name: Install packages
  apt:
    name: "{{ packages }}"
    state: present

- name: Create user
  user:
    name: "{{ user.name }}"
    uid: "{{ user.uid }}"
    shell: "{{ user.shell }}"
    groups: "{{ user.groups }}"
```

### group_vars and host_vars
```bash
# Structure
inventory/
  production
group_vars/
  all.yml
  webservers.yml
  dbservers.yml
host_vars/
  web01.example.com.yml
  db01.example.com.yml
```

```yaml
# group_vars/webservers.yml
---
http_port: 80
max_clients: 200
enable_ssl: true

# host_vars/web01.example.com.yml
---
server_id: 1
local_ip: 192.168.1.10
```

### Ansible Facts
```yaml
# Using facts
- name: Display operating system
  debug:
    msg: "OS: {{ ansible_facts['distribution'] }} {{ ansible_facts['distribution_version'] }}"

# Commonly used facts
ansible_facts['hostname']
ansible_facts['fqdn']
ansible_facts['default_ipv4']['address']
ansible_facts['os_family']  # Debian, RedHat, etc.
ansible_facts['distribution']  # Ubuntu, CentOS, etc.
ansible_facts['distribution_major_version']
ansible_facts['processor_cores']
ansible_facts['memtotal_mb']
ansible_facts['mounts']

# Disable fact gathering
- hosts: all
  gather_facts: no

# Gather manually
- name: Gather facts
  setup:
```

### Registered Variables
```yaml
- name: Check if file exists
  stat:
    path: /etc/myapp/config.conf
  register: config_file

- name: Create file if it doesn't exist
  file:
    path: /etc/myapp/config.conf
    state: touch
  when: not config_file.stat.exists

- name: Execute a command
  command: /usr/bin/mycommand
  register: result

- name: Display result
  debug:
    var: result.stdout_lines
```

## Jinja2 Templates

### Basic Template
```jinja2
{# templates/nginx.conf.j2 #}
# Nginx configuration for {{ ansible_facts['hostname'] }}
user {{ nginx_user }};
worker_processes {{ ansible_facts['processor_cores'] }};

events {
    worker_connections {{ worker_connections | default(1024) }};
}

http {
    server {
        listen {{ http_port }};
        server_name {{ server_name }};

        {% if enable_ssl %}
        listen 443 ssl;
        ssl_certificate {{ ssl_cert_path }};
        ssl_certificate_key {{ ssl_key_path }};
        {% endif %}

        location / {
            root /var/www/html;
            index index.html;
        }
    }

    {% for backend in backend_servers %}
    upstream {{ backend.name }} {
        server {{ backend.host }}:{{ backend.port }};
    }
    {% endfor %}
}
```

### Common Jinja2 Filters
```jinja2
# String manipulation
{{ 'hello' | upper }}  # HELLO
{{ 'HELLO' | lower }}  # hello
{{ path | basename }}  # Filename
{{ path | dirname }}   # Directory

# Default values
{{ variable | default('default_value') }}
{{ variable | default(omit) }}  # Omit if not defined

# List operations
{{ [1,2,3,4,5] | max }}  # 5
{{ [1,2,3,4,5] | min }}  # 1
{{ list | unique }}     # Deduplicate
{{ list | sort }}       # Sort
{{ list | length }}     # Length

# Type conversions
{{ '42' | int }}        # Integer
{{ 42 | string }}       # String
{{ 'yes' | bool }}      # Boolean

# Hashing and encoding
{{ 'password' | hash('sha256') }}
{{ 'text' | b64encode }}
{{ encoded | b64decode }}

# Dictionary manipulation
{{ dict | dict2items }}
{{ list | items2dict }}

# Random
{{ ['a', 'b', 'c'] | random }}
{{ 100 | random }}  # Between 0 and 100
```

### Conditionals and Loops
```jinja2
{% if ansible_facts['os_family'] == "Debian" %}
  # Debian configuration
{% elif ansible_facts['os_family'] == "RedHat" %}
  # RedHat configuration
{% else %}
  # Default configuration
{% endif %}

{% for user in users %}
User {{ user.name }} {
    uid = {{ user.uid }}
    shell = {{ user.shell }}
}
{% endfor %}

{% for key, value in dict.items() %}
{{ key }} = {{ value }}
{% endfor %}
```

## Handlers

### Definition and Usage
```yaml
# In a playbook
handlers:
  - name: Reload Nginx
    service:
      name: nginx
      state: reloaded

  - name: Restart Nginx
    service:
      name: nginx
      state: restarted

tasks:
  - name: Copy configuration
    copy:
      src: nginx.conf
      dest: /etc/nginx/nginx.conf
    notify:
      - Reload Nginx

  - name: Update SSL certificate
    copy:
      src: cert.pem
      dest: /etc/ssl/cert.pem
    notify:
      - Restart Nginx
```

### Force Immediate Execution
```yaml
- name: Update configuration
  template:
    src: config.j2
    dest: /etc/app/config.conf
  notify: Restart app

- name: Force handler execution
  meta: flush_handlers

- name: This task runs after handler
  debug:
    msg: "Handler executed"
```

### Grouping with Listen
```yaml
handlers:
  - name: Restart web services
    service:
      name: "{{ item }}"
      state: restarted
    loop:
      - nginx
      - php-fpm
    listen: "restart web stack"

tasks:
  - name: Update configuration
    template:
      src: config.j2
      dest: /etc/config.conf
    notify: restart web stack
```

## Conditionals

### Basic Conditions
```yaml
- name: Install Apache on Debian
  apt:
    name: apache2
    state: present
  when: ansible_facts['os_family'] == "Debian"

- name: Install Apache on RedHat
  dnf:
    name: httpd
    state: present
  when: ansible_facts['os_family'] == "RedHat"

- name: Multiple conditions (AND)
  command: /bin/something
  when:
    - ansible_facts['distribution'] == "Ubuntu"
    - ansible_facts['distribution_major_version'] == "20"

- name: Multiple conditions (OR)
  command: /bin/something
  when: >
    ansible_facts['distribution'] == "Ubuntu" or
    ansible_facts['distribution'] == "Debian"
```

### Variable Tests
```yaml
- name: Variable defined
  debug:
    msg: "Variable exists"
  when: my_variable is defined

- name: Variable not defined
  debug:
    msg: "Variable doesn't exist"
  when: my_variable is not defined

- name: Test if list is empty
  debug:
    msg: "Empty list"
  when: my_list | length == 0

- name: Test boolean
  debug:
    msg: "Enabled"
  when: enable_feature | bool

- name: Test command result
  command: /usr/bin/test -f /tmp/file
  register: result
  ignore_errors: yes

- name: Use result
  debug:
    msg: "File exists"
  when: result.rc == 0
```

## Loops

### Simple Loops
```yaml
- name: Create multiple users
  user:
    name: "{{ item }}"
    state: present
  loop:
    - alice
    - bob
    - charlie

- name: Install multiple packages
  apt:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - php
    - mysql-server
```

### Loops with Dictionaries
```yaml
- name: Create users with details
  user:
    name: "{{ item.name }}"
    uid: "{{ item.uid }}"
    groups: "{{ item.groups }}"
  loop:
    - { name: 'alice', uid: 1001, groups: 'wheel' }
    - { name: 'bob', uid: 1002, groups: 'users' }

- name: Iterate over dictionary
  debug:
    msg: "{{ item.key }} = {{ item.value }}"
  loop: "{{ my_dict | dict2items }}"
```

### Advanced Loops
```yaml
- name: Loop with index
  debug:
    msg: "Index {{ item.0 }}: {{ item.1 }}"
  loop: "{{ list | zip(range(list|length)) | list }}"

- name: Nested loops
  debug:
    msg: "{{ item.0 }} - {{ item.1 }}"
  loop: "{{ list1 | product(list2) | list }}"

- name: Loop until condition
  shell: /usr/bin/check_status
  register: result
  until: result.stdout.find("ready") != -1
  retries: 5
  delay: 10
```

## Error Handling

### Blocks (Try/Catch)
```yaml
- block:
    - name: Task that may fail
      command: /bin/false

    - name: This task won't run if previous fails
      debug:
        msg: "Success"
  rescue:
    - name: Handle error
      debug:
        msg: "An error occurred"

    - name: Corrective actions
      command: /bin/fix_problem
  always:
    - name: Always executed (cleanup)
      debug:
        msg: "Cleanup"
```

### Ignoring Errors
```yaml
- name: This task may fail
  command: /bin/might_fail
  ignore_errors: yes

- name: Change failure status
  command: /usr/bin/check
  register: result
  failed_when: "'FAILED' in result.stderr"

- name: Define when it's a change
  command: /usr/bin/update
  register: result
  changed_when: "'Updated' in result.stdout"
```

## Essential Modules

### File Management

#### ansible.builtin.copy
```yaml
- name: Copy a file
  copy:
    src: /source/file
    dest: /dest/file
    owner: root
    group: root
    mode: '0644'
    backup: yes

- name: Copy with inline content
  copy:
    content: |
      Line 1
      Line 2
    dest: /etc/myfile.conf
```

#### ansible.builtin.file
```yaml
- name: Create directory
  file:
    path: /etc/myapp
    state: directory
    mode: '0755'

- name: Create symbolic link
  file:
    src: /original/path
    dest: /link/path
    state: link

- name: Delete file
  file:
    path: /tmp/file
    state: absent

- name: Change permissions
  file:
    path: /etc/myfile
    mode: '0644'
    owner: root
    group: root
```

#### ansible.builtin.lineinfile
```yaml
- name: Ensure line exists
  lineinfile:
    path: /etc/hosts
    line: '192.168.1.100 server.example.com'
    state: present

- name: Replace line via regex
  lineinfile:
    path: /etc/selinux/config
    regexp: '^SELINUX='
    line: 'SELINUX=enforcing'

- name: Add after pattern
  lineinfile:
    path: /etc/hosts
    line: '192.168.1.100 myserver'
    insertafter: '^127\.0\.0\.1'

- name: Remove line
  lineinfile:
    path: /etc/hosts
    regexp: '^192\.168\.1\.100'
    state: absent
```

#### ansible.builtin.blockinfile
```yaml
- name: Add configuration block
  blockinfile:
    path: /etc/hosts
    block: |
      192.168.1.10 web01
      192.168.1.11 web02
      192.168.1.20 db01
    marker: "# {mark} ANSIBLE MANAGED BLOCK"
```

### Package Management

#### ansible.builtin.apt (Debian/Ubuntu)
```yaml
- name: Install package
  apt:
    name: nginx
    state: present
    update_cache: yes

- name: Install multiple packages
  apt:
    name:
      - nginx
      - php
      - mysql-server
    state: present

- name: Update all packages
  apt:
    name: "*"
    state: latest
    update_cache: yes

- name: Remove package
  apt:
    name: apache2
    state: absent
    purge: yes
```

#### ansible.builtin.dnf/yum (RedHat/CentOS)
```yaml
- name: Install package
  dnf:
    name: httpd
    state: present

- name: Install specific version
  dnf:
    name: httpd-2.4.6
    state: present

- name: Update all packages
  dnf:
    name: "*"
    state: latest

- name: Remove package
  dnf:
    name: httpd
    state: absent
```

### Service Management

```yaml
- name: Start service
  service:
    name: nginx
    state: started

- name: Stop service
  service:
    name: nginx
    state: stopped

- name: Restart service
  service:
    name: nginx
    state: restarted

- name: Reload service
  service:
    name: nginx
    state: reloaded

- name: Enable at boot
  service:
    name: nginx
    enabled: yes

- name: Start and enable
  service:
    name: nginx
    state: started
    enabled: yes
```

### User and Group Management

```yaml
- name: Create user
  user:
    name: johnd
    uid: 1040
    group: admin
    groups: docker,sudo
    shell: /bin/bash
    create_home: yes
    password: "{{ 'password' | password_hash('sha512') }}"

- name: Remove user
  user:
    name: johnd
    state: absent
    remove: yes

- name: Generate SSH key
  user:
    name: jsmith
    generate_ssh_key: yes
    ssh_key_bits: 4096

- name: Create group
  group:
    name: developers
    gid: 1050
    state: present
```

### Command Execution

```yaml
- name: Simple command
  command: /usr/bin/mycommand arg1 arg2

- name: With working directory
  command:
    cmd: ls -la
    chdir: /tmp

- name: Don't execute if file exists
  command: /usr/bin/create_file
  args:
    creates: /path/to/file

- name: Shell with pipes
  shell: ls -l | grep log

- name: Script with environment variables
  shell: mycommand
  environment:
    PATH: "/custom/path:{{ ansible_env.PATH }}"
    DB_PASSWORD: "{{ db_password }}"
```

### Git
```yaml
- name: Clone repository
  git:
    repo: 'https://github.com/user/repo.git'
    dest: /opt/myapp
    version: main

- name: Update to specific tag
  git:
    repo: 'https://github.com/user/repo.git'
    dest: /opt/myapp
    version: v1.2.3
    force: yes

- name: Clone with authentication
  git:
    repo: 'https://{{ github_token }}@github.com/user/private-repo.git'
    dest: /opt/myapp
```

## Ansible Vault (Encryption)

### Vault Commands
```bash
# Create encrypted file
ansible-vault create secrets.yml

# Edit encrypted file
ansible-vault edit secrets.yml

# Encrypt existing file
ansible-vault encrypt vars.yml

# Decrypt file
ansible-vault decrypt vars.yml

# View encrypted file content
ansible-vault view secrets.yml

# Change password
ansible-vault rekey secrets.yml

# Encrypt string
ansible-vault encrypt_string 'secret_password' --name 'db_password'
```

### Using in Playbooks
```yaml
# vars/secrets.yml (encrypted)
---
db_password: secret123
api_key: abc123xyz

# playbook.yml
- hosts: all
  vars_files:
    - vars/secrets.yml
  tasks:
    - name: Use secret
      debug:
        msg: "Password: {{ db_password }}"
```

### Executing with Vault
```bash
# Ask for password
ansible-playbook site.yml --ask-vault-pass

# Use password file
ansible-playbook site.yml --vault-password-file ~/.vault_pass

# With multiple vault IDs
ansible-playbook site.yml --vault-id prod@prompt --vault-id dev@~/.vault_dev
```

## Tags

### Definition and Usage
```yaml
- name: Server configuration
  hosts: all
  tasks:
    - name: Install packages
      apt:
        name: nginx
        state: present
      tags:
        - packages
        - nginx

    - name: Configure application
      template:
        src: config.j2
        dest: /etc/app/config.conf
      tags:
        - configuration
        - app

    - name: Start services
      service:
        name: nginx
        state: started
      tags:
        - services
        - nginx
```

### Executing with Tags
```bash
# Execute only tasks with a tag
ansible-playbook site.yml --tags configuration

# Execute multiple tags
ansible-playbook site.yml --tags "packages,services"

# Skip certain tags
ansible-playbook site.yml --skip-tags configuration

# List all available tags
ansible-playbook site.yml --list-tags

# Special tags
ansible-playbook site.yml --tags always    # Always executed
ansible-playbook site.yml --tags never     # Never executed
```

## Best Practices

### Recommended Project Structure
```
production/
  ansible.cfg
  inventory/
    production
    staging
  group_vars/
    all.yml
    webservers.yml
    dbservers.yml
  host_vars/
    web01.example.com.yml
  roles/
    common/
    webserver/
    database/
  playbooks/
    site.yml
    webservers.yml
    dbservers.yml
  vars/
    common.yml
    secrets.yml
  files/
  templates/
```

### General Principles

1. **Always name plays and tasks**
```yaml
# ✅ Good
- name: Install and configure Nginx
  hosts: webservers
  tasks:
    - name: Install Nginx
      apt: name=nginx state=present

# ❌ Bad
- hosts: webservers
  tasks:
    - apt: name=nginx state=present
```

2. **Use modules instead of commands**
```yaml
# ✅ Good
- name: Create directory
  file:
    path: /opt/app
    state: directory

# ❌ Bad
- name: Create directory
  command: mkdir -p /opt/app
```

3. **Make playbooks idempotent**
```yaml
# ✅ Good - Idempotent
- name: Ensure file exists
  file:
    path: /tmp/file
    state: touch
    modification_time: preserve
    access_time: preserve

# ❌ Bad - Not idempotent
- name: Create file
  command: touch /tmp/file
```

4. **Use Ansible Vault for secrets**
```bash
# Encrypt sensitive files
ansible-vault encrypt group_vars/production/vault.yml

# Never commit secrets in clear text
echo "vault.yml" >> .gitignore
```

5. **Test before deploying**
```bash
# Syntax check
ansible-playbook site.yml --syntax-check

# Dry run
ansible-playbook site.yml --check --diff

# Linter
ansible-lint site.yml
```

6. **Document and comment**
```yaml
# Document roles in README.md
# Comment complex code
- name: Complex configuration
  # This task configures XYZ because...
  template:
    src: complex.j2
    dest: /etc/app/config.conf
```

7. **Use version control**
```bash
git init
git add .
git commit -m "Initial Ansible setup"
```

## Practical Examples

### LAMP Deployment
```yaml
---
- name: Deploy LAMP stack
  hosts: webservers
  become: yes

  vars:
    mysql_root_password: "{{ vault_mysql_root_password }}"

  tasks:
    - name: Install packages
      apt:
        name:
          - apache2
          - mysql-server
          - php
          - libapache2-mod-php
          - php-mysql
          - python3-pymysql
        state: present
        update_cache: yes

    - name: Start and enable Apache
      service:
        name: apache2
        state: started
        enabled: yes

    - name: Configure MySQL root password
      mysql_user:
        name: root
        password: "{{ mysql_root_password }}"
        login_unix_socket: /var/run/mysqld/mysqld.sock

    - name: Deploy site
      copy:
        src: files/index.php
        dest: /var/www/html/index.php
        owner: www-data
        group: www-data
        mode: '0644'
```

### System Update
```yaml
---
- name: System update
  hosts: all
  become: yes
  serial: 2  # 2 servers at a time

  tasks:
    - name: Update APT cache
      apt:
        update_cache: yes
      when: ansible_facts['os_family'] == "Debian"

    - name: Update all packages
      apt:
        name: "*"
        state: latest
      when: ansible_facts['os_family'] == "Debian"

    - name: Check if reboot is required
      stat:
        path: /var/run/reboot-required
      register: reboot_required

    - name: Reboot server
      reboot:
        msg: "Reboot for system update"
        reboot_timeout: 300
      when: reboot_required.stat.exists

    - name: Wait for server to be ready
      wait_for_connection:
        delay: 60
        timeout: 300
      when: reboot_required.stat.exists
```

## Resources

- **Official documentation**: https://docs.ansible.com/
- **Ansible Galaxy**: https://galaxy.ansible.com/
- **Ansible Lint**: https://ansible-lint.readthedocs.io/
- **Best Practices**: https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html
- **Community**: https://www.ansible.com/community

---

*This Ansible guide covers essential and advanced concepts to effectively automate the management of your infrastructures. Mastering these practices will allow you to manage your servers in a reproducible and reliable manner.*
