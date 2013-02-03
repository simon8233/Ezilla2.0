#!/bin/bash
# Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
# License: GPL
## ----------------------------------------------------------------
## Setup Libvirt
### configure libvirtd.conf
libvirtd_conf="/etc/libvirt/libvirtd.conf"
if [ -e $libvirtd_conf ] && [ -e /etc/debian_version ]; then
	sed -i -e 's/unix_sock_group = \"libvirtd\"/unix_sock_group = \"oneadmin\"/g' -e 's/#mdns_adv/mdns_adv/g' $libvirtd_conf
elif [ -e $libvirtd_conf ] && [ -e /etc/redhat-release ]; then
        sed -i -e 's/#unix_sock_group = \"libvirt\"/unix_sock_group = \"oneadmin\"/g' -e 's/#unix_sock_rw_perms/unix_sock_rw_perms/g' -e 's/#auth_unix_ro/auth_unix_ro/g' -e 's/#auth_unix_rw/auth_unix_rw/g' -e 's/#mdns_adv/mdns_adv/g' $libvirtd_conf


fi

qemu_conf="/etc/libvirt/qemu.conf"
if [ -e $qemu_conf ]; then
        sed -i -e 's/#user = \"root\"/user = \"oneadmin\"/g' -e 's/#group = \"root\"/group = \"oneadmin\"/g'  -e 's/#dynamic_ownership = 1/dynamic_ownership = 0/g' $qemu_conf


fi

### remove virbr0
autostart_xml="/etc/libvirt/qemu/networks/autostart/default.xml"
if [ -e $autostart_xml ]; then
	rm /etc/libvirt/qemu/networks/autostart/default.xml
fi

virbr_xml="/etc/libvirt/qemu/networks/default.xml"
if [ -e $virbr_xml ]; then
	rm /etc/libvirt/qemu/networks/default.xml
fi

### setup HVM modules
#Ubuntu 12.04
modules_file="/etc/modules" 
if [ -e $modules_file ]; then
        cat $modules_file | grep '# modified by ezilla' >> /dev/null
        if [  $? != 0 ]; then
		echo "# modified by ezilla" >> /etc/modules
		echo "kvm" >> /etc/modules
		echo "kvm_amd" >> /etc/modules
		echo "kvm_intel" >> /etc/modules
	fi
#CentOS
#elif [ -e 	]; then


fi

### setup /var/run/libvirt folder
mkdir -p /var/run/libvirt
chown -R oneadmin:oneadmin /var/run/libvirt
chmod g+w /var/run/libvirt
