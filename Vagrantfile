# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = "lucid32"

  #setup network
  config.vm.network :private_network, ip: "192.168.127.100"

  config.vm.provision :shell, :path => "./Vagrantdata/setup.sh"
end
