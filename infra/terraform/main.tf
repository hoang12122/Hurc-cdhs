# HURC1 INFRASTRUCTURE AS CODE (TERRAFORM)
# Provisioning a Hardened Docker Host for Air-Gapped Environment

terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.1"
    }
  }
}

# 1. Generate SSH Key for the Secure Host
resource "local_file" "ssh_config" {
  filename = "${path.module}/ssh_config"
  content  = <<EOT
Host hurc1-production
    HostName 192.168.1.10
    User nonroot
    IdentityFile ~/.ssh/id_rsa_hurc
EOT
}

# 2. Provisioning Data Directories (Simulated for Local/Remote Setup)
resource "null_resource" "setup_dirs" {
  provisioner "local-exec" {
    command = <<EOT
      mkdir -p ./data/postgres ./data/offline ./logs ./backups ./audit_reports
    EOT
  }
}

# 3. Output Deployment Info
output "deployment_target" {
  value = "Ready to deploy on 192.168.1.10 (Air-Gapped Mode)"
}
