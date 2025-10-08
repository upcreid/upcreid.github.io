# �️ Terraform Cheat Sheet

> **Filename suggestion:** `TERRAFORM_CHEATSHEET.md`  
> Quick reference for HashiCorp Terraform (HCL & CLI). Covers commands, configuration patterns, state, modules, and best practices.

---

## ⚙️ CLI Basics
```bash
terraform init        # Initialize working directory (providers, backend)
terraform validate    # Validate configuration
terraform fmt         # Reformat files to canonical HCL style
terraform plan        # Show execution plan
terraform apply       # Apply changes (use -auto-approve to skip prompt)
terraform destroy     # Destroy managed infrastructure
terraform fmt -recursive
```

Common flags:
- `-var 'name=value'` pass variable on CLI
- `-var-file="filename.tfvars"` pass variables file
- `-target=resource` focus plan/apply to specific resource (use rarely)
- `-out=tfplan` save plan to file
- `-lock=false` disable state locking (careful)

---

## �️ File layout (recommended)
```
.
├── main.tf          # resources & provider configuration
├── variables.tf     # variable declarations
├── outputs.tf       # outputs
├── providers.tf     # provider blocks (optional split)
├── versions.tf      # required Terraform and provider versions
├── terraform.tfvars # default variable values (gitignored for secrets)
└── modules/         # local modules
```

---

## � HCL Basics

### Providers
```hcl
terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.region
}
```

### Resources
```hcl
resource "aws_instance" "web" {
  ami           = var.ami
  instance_type = "t3.micro"

  tags = {
    Name = "web-${var.env}"
  }
}
```

### Data sources
```hcl
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  filter {
    name   = "name"
    values = ["ubuntu/images/*ubuntu-focal-20.04-amd64-server-*"]
  }
}
```

### Variables
```hcl
variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "allowed_ips" {
  type = list(string)
}
```

Pass via `terraform.tfvars` or CLI:
```hcl
region = "eu-west-1"
```

### Outputs
```hcl
output "instance_ip" {
  description = "Public IP of web"
  value       = aws_instance.web.public_ip
  sensitive   = false
}
```

---

## � Expressions, Interpolation & Functions

- String interpolation: `${var.name}` (HCL2 supports direct expressions: `var.name`)
- Conditionals: `count = var.create ? 1 : 0`
- For expressions:
  ```hcl
  tags = { for k,v in local.base_tags : k => v }
  subnet_ids = [for s in aws_subnet.all : s.id]
  ```
- Common functions: `lookup()`, `concat()`, `join()`, `split()`, `element()`, `length()`, `replace()`, `file()`, `filebase64()`, `terraform.workspace`

---

## � Count, For_each, Dynamic Blocks

### `count`
```hcl
resource "aws_instance" "app" {
  count = var.instance_count
  ami = var.ami
  instance_type = "t3.micro"
  tags = { Name = "app-${count.index}" }
}
```

### `for_each`
```hcl
resource "aws_s3_bucket" "b" {
  for_each = toset(var.bucket_names)
  bucket = each.value
}
```

### Dynamic blocks
```hcl
resource "aws_security_group" "sg" {
  # ...
  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.from
      to_port     = ingress.value.to
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }
}
```

---

## � State & Backends

### Local state (default)
State stored in `terraform.tfstate` (don't commit to VCS).

### Remote backends (recommended for teams)
Examples: S3 (AWS) with DynamoDB lock, Terraform Cloud, Azure Blob, GCS.

Example S3 backend with locking:
```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

Commands for remote state:
```bash
terraform init            # configure backend
terraform state list      # list resources in state
terraform state show aws_instance.web
terraform state pull      # fetch remote state
terraform state push      # push state (use carefully)
terraform refresh         # update state with real-world resources
```

---

## � Workspaces
- `terraform workspace list`
- `terraform workspace new dev`
- `terraform workspace select prod`
- `terraform.workspace` gives current workspace in expressions

Workspaces are namespace for state — use with caution; not a substitute for separate environments when resources differ.

---

## � Modules

Create reusable modules under `modules/` or use registry modules.

Call a module:
```hcl
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = ">= 3.0"
  name = "my-vpc"
  cidr = "10.0.0.0/16"
  azs  = ["eu-west-1a","eu-west-1b"]
}
```

Local module:
```hcl
module "app" {
  source = "./modules/app"
  env    = var.env
}
```

Best practices:
- Keep modules small and focused.
- Version registry modules via `version`.
- Use inputs/outputs; avoid hard-coded ARNs.

---

## � Provisioners (last resort)
Use `remote-exec` or `local-exec` only when necessary (immutable infra preferred).

Example:
```hcl
resource "aws_instance" "app" {
  # ...
  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "sudo apt install -y nginx"
    ]
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file(var.private_key_path)
      host        = self.public_ip
    }
  }
}
```

---

## � Importing existing resources
```bash
terraform import aws_instance.web i-0123456789abcdef0
```
Then add the corresponding resource block to config and run `terraform plan` to align.

---

## ⚠️ Lifecycle meta-arguments
```hcl
resource "aws_instance" "db" {
  # ...
  lifecycle {
    prevent_destroy = true        # protect resource from destroy
    create_before_destroy = true  # replace without downtime
    ignore_changes = [ "tags" ]   # ignore specific attribute changes
  }
}
```

---

## � Locks & Concurrency
- Use backend with locking (DynamoDB for S3, Terraform Cloud, etc.).
- `terraform force-unlock LOCK_ID` to recover from stale locks.

---

## � Debugging & Logs
- `TF_LOG=TRACE terraform apply` (very verbose)
- `TF_LOG=DEBUG` or `INFO` for less noise
- `TF_CLI_ARGS_plan="-out=tfplan"` to persist plans

---

## � Secrets & Sensitive Data
- Mark outputs/variables as `sensitive = true`.
- Avoid storing secrets in `terraform.tfstate` (state can contain secrets).
- Use secret stores: AWS Secrets Manager, Vault (HashiCorp Vault provider), SSM Parameter Store.
- Use environment variables for provider creds (`AWS_PROFILE`, `GOOGLE_APPLICATION_CREDENTIALS`, etc.).

---

## ✅ Best practices
- Keep `terraform.tfstate` in secure remote backend (not in Git).
- Use `terraform fmt` and `validate` in CI.
- Pin provider versions in `required_providers`.
- Break infra into small modules.
- Prefer immutable infra patterns (replace rather than mutate).
- Use `create_before_destroy` for critical resources needing replacement.
- Review plans (`terraform plan`) before `apply` in CI/CD.

---

## � CI/CD Tips
- In CI, run:
```bash
terraform init -input=false
terraform plan -input=false -out=tfplan
terraform show -no-color tfplan > tfplan.txt
# human review or automated checks
terraform apply -input=false tfplan
```
- Consider Terraform Cloud or Atlantis for PR-driven workflows.

---

## � Useful Commands Summary
```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan -out=tfplan
terraform apply tfplan
terraform apply -auto-approve
terraform destroy
terraform import <type.name> <id>
terraform state list
terraform state show <address>
terraform workspace list
terraform workspace new <name>
terraform providers
```

---

## � Further resources
- Official docs: https://developer.hashicorp.com/terraform
- Terraform Registry: https://registry.terraform.io
- Style guides & community modules on the registry

---

*End of Terraform cheat sheet.*
