---
draft: true
date: 12-06-2024
tag: Devops
---

# Building a Debian template in Proxmox with cloud-init and Packer
___

::ArticleHeader

::
---

## What is Packer ? 

**Packer** is a tool made by Hashicorp. It allows you to make identical images for multiple platforms using a single source configuration.

## Packer + Proxmox = 💖

**Packer** allow to build image faster and make the build reproducible across cloud provider. I wanted to use **Packer** and **Proxmox** to be able to make my Homelab reproducible. 

**Packer** let me create a template image with all the tools I need inside this image.

With **Packer**, I can provision the VM template with shell or ansible. This make the build reproducible and testable.

### Creating the template with Packer 

Let's dive into Packer, let's create a Debian template.

First we need to import the required plugins to make packer work with proxmox. 

Create a debian.pkr.hcl file and add the following inside the file

```hcl
packer {
	required_plugins {
		proxmox = {
			version = "~> 1"
			source = "github.com/hashicorp/proxmox"
		}
	}
}
```

Next, we will need to defined variables related to our proxmox server.
We need to specified:
- proxmox_url
- proxmox_token
- proxmox_username

inside a variables.pkr.hcl, add the following

```hcl
variable "proxmox_url" {
	type = string
}

variable "proxmox_token" {
  type = string
}

variable "proxmox_username" {
  type = string
}
```

Next, we need to define a debian.auto.pkvars.hcl file, this file will allow us to set the value for the variables we defined earlier.


```hcl
proxmox_url   = "https://<proxmox-ip>:8006/api2/json"
proxmox_token = "<proxmox_token>"
proxmox_username = "<proxmox_username>"
```

::beautyBlockquote{title="The magic of debian.auto.pkvars.hcl"}
You can create a template.auto.pkvars.hcl file in your directory and it will load the variable automatically without having to specify the filename or variable as arguments to the packer CLI. Replace `template` by the name of your variable file. Here I used `debian.auto.pkvars.hcl`
::

The `proxmox_username` should be in the following format: `user@pam!packer_token`

::beautyBlockquote{title="proxmox_password & proxmox_token"}
You can also use `proxmox_password` instead of `proxmox_token`. If you use `proxmox_token` and `proxmox_password`, `proxmox_token` will be the variable used.
::

### Defining the source

The source is the block that contains the parameters and settings required to create the proxmox VM.

We will define the iso and the spec of the VM. By using a preseed.cfg file, we can automate the installation of the Debian VM.

Now, we will define a `proxmox-iso` source where we can put all our configuration to create a new vm template.

```hcl
source "proxmox-iso" "debian-bookworm" {
  proxmox_url              = var.proxmox_url
  username                 = var.proxmox_username
  token                    = var.proxmox_token
  insecure_skip_tls_verify = true
  node                     = "proxmox"


  iso_checksum = "33c08e56c83d13007e4a5511b9bf2c4926c4aa12fd5dd56d493c0653aecbab380988c5bf1671dbaea75c582827797d98c4a611f7fb2b131fbde2c677d5258ec9"
  #iso_url =  "https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-12.5.0-amd64-netinst.iso"
  iso_file         = "local:iso/debian-12.5.0-amd64-netinst.iso"
  iso_storage_pool = "local"

  #VM Configuration
  vm_name = "debian-bookworm"
  cores   = 2
  os      = "l26"

  # VM Network Settings
  network_adapters {
    model    = "virtio"
    bridge   = "vmbr0"
    firewall = false
  }

  # VM disk
  disks {
    disk_size    = "5G"
    storage_pool = "local-lvm"
    type         = "scsi"
  }

  memory = "2048"

  efi_config {
    efi_storage_pool  = "local-lvm"
    efi_type          = "4m"
    pre_enrolled_keys = true
  }

  # Preseed
  http_directory = "http"

  boot_command = [
    "<esc><wait>",
    "install <wait>",
    " auto=true",
    " priority=critical",
    " preseed/url=http://{{ .HTTPIP }}:{{ .HTTPPort }}/preseed.cfg<wait>",
    " -- <wait>",
    "<enter><wait>"
  ]

  boot_wait = "10s"

  # SSH Configuration
  ssh_username = "packer"
  ssh_password = "packer"
  ssh_timeout  = "10m"

  http_bind_address = "<your_local_ip_address>"

  unmount_iso = true

  # Cloud init
  cloud_init              = true
  cloud_init_storage_pool = "local-lvm"
}
```

the `preseed.cfg`file should be in a `http` directory next to your `debian.pkr.hcl` template file. This will be use by the VM to automate the installation ( Creating user, partitioning, ect ... )

### Preseed debian & Cloud init

When we use packer build, it will create a VM template inside of our proxmox server.

If we want to change the username/password and also change the ip address of the VM, we need to install cloud-init using the preseed.cfg file.

::beautyBlockquote{title="Cloud-init"}
Make sure to install cloud-init using the presseed.cfg. Using cloud-init will allow you to modify the username later when cloning the VM inside of proxmox
::

Here an example of preseed file : 

```ini
d-i debian-installer/locale string fr_FR
d-i keyboard-configuration/xkb-keymap select fr(latin9)
d-i netcfg/choose_interface select auto
d-i netcfg/hostname string debian
d-i mirror/protocol string ftp
d-i mirror/country string manual
d-i mirror/http/hostname string ftp.fr.debian.org
d-i mirror/http/directory string /debian
d-i mirror/http/proxy string
d-i passwd/root-password password r00tme
d-i passwd/root-password-again password r00tme

d-i passwd/user-fullname string packer
d-i passwd/username string packer
d-i passwd/user-password password packer
d-i passwd/user-password-again password packer

d-i clock-setup/utc boolean true

d-i time/zone string Europe/Paris

d-i clock-setup/ntp boolean true
d-i partman-auto/method string lvm

d-i partman-auto-lvm/guided_size string max

d-i partman-lvm/device_remove_lvm boolean true
d-i partman-md/device_remove_md boolean true
d-i partman-lvm/confirm boolean true
d-i partman-lvm/confirm_nooverwrite boolean true

d-i partman-auto/choose_recipe select atomic

d-i partman-partitioning/confirm_write_new_label boolean true
d-i partman/choose_partition select finish
d-i partman/confirm boolean true
d-i partman/confirm_nooverwrite boolean true

d-i partman-md/confirm boolean true
d-i partman-partitioning/confirm_write_new_label boolean true
d-i partman/choose_partition select finish
d-i partman/confirm boolean true
d-i partman/confirm_nooverwrite boolean true

d-i apt-setup/cdrom/set-first boolean false
d-i apt-setup/use_mirror boolean false
d-i apt-setup/services-select multiselect security, updates
d-i apt-setup/security_host string security.debian.org
d-i apt-setup/local0/repository string \
        http://deb.debian.org/debian bookworm main non-free-firmware
d-i apt-setup/local0/source boolean true

d-i pkgsel/include string openssh-server cloud-init
d-i pkgsel/upgrade select safe-upgrade

d-i grub-installer/only_debian boolean true

d-i grub-installer/with_other_os boolean true

d-i grub-installer/bootdev  string default

d-i finish-install/reboot_in_progress note
```

### Building the VM template

Once we have everything setup with our `source` block, it's time to build the VM

This block should be added to the end of `debian.pkr.hcl` 

```hcl
build {
  name = "debian-bookworm"
  sources = [
    "source.proxmox-iso.debian-bookworm"
  ]
}
```

You can then run the following command inside the folder where your `pkr.hcl` live

```bash
packer build .
```

You will see the following output

```bash
debian-bookworm.proxmox-iso.debian-bookworm: output will be in this color.

==> debian-bookworm.proxmox-iso.debian-bookworm: Creating VM
==> debian-bookworm.proxmox-iso.debian-bookworm: No VM ID given, getting next free from Proxmox
==> debian-bookworm.proxmox-iso.debian-bookworm: Starting VM
==> debian-bookworm.proxmox-iso.debian-bookworm: Starting HTTP server on port 8200
==> debian-bookworm.proxmox-iso.debian-bookworm: Waiting 10s for boot
==> debian-bookworm.proxmox-iso.debian-bookworm: Typing the boot command
==> debian-bookworm.proxmox-iso.debian-bookworm: Waiting for SSH to become available...
==> debian-bookworm.proxmox-iso.debian-bookworm: Connected to SSH!
==> debian-bookworm.proxmox-iso.debian-bookworm: Stopping VM
==> debian-bookworm.proxmox-iso.debian-bookworm: Converting VM to template
==> debian-bookworm.proxmox-iso.debian-bookworm: Adding a cloud-init cdrom in storage pool local-lvm
Build 'debian-bookworm.proxmox-iso.debian-bookworm' finished after 7 minutes 13 seconds.

==> Wait completed after 7 minutes 13 seconds
```

And voila ! Your new vm Template should be available inside your proxmox server. You can now use Terraform or OpenTofu to automate the creation of your infrastructure using your template.
