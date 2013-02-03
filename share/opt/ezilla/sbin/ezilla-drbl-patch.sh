#!/bin/bash
# Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
# License: GPL
##-------------------------------------------------------------
## DRBL patch for Ezilla
## Adding support of KVM physical network sharing bridge


# check diskver dir , if dir exist then exec (function 4) multi-net_card ,else exec all function

##1. Patch /usr/lib/mkpxeinitrd-net/initrd-skel/linuxrc-or-init
function patchLinuxrc_or_init(){

linuxrc_or_init="/usr/lib/mkpxeinitrd-net/initrd-skel/linuxrc-or-init"
#linuxrc_or_init="linuxrc-or-init"
if [ -e $linuxrc_or_init ]; then
	cat $linuxrc_or_init | grep '# modified by ezilla' >> /dev/null
	if [  $? != 0 ]; then
		cp $linuxrc_or_init "$linuxrc_or_init".dpkg
		declare -i modify_line=$(cat -n $linuxrc_or_init | grep 'route add -net 127.0.0.0 netmask 255.0.0.0 lo' | awk 'NR==1 {print $1}')
		# insert mark
		modify_line=$modify_line+2
		sed -i "${modify_line}i\# modified by ezilla" $linuxrc_or_init
		# insert bridge interface for eth0
		modify_line=$modify_line+1
		sed -i "${modify_line}i\brctl addbr br0" $linuxrc_or_init
        	modify_line=$modify_line+1
        	sed -i "${modify_line}i\brctl addif br0 eth0" $linuxrc_or_init
        	modify_line=$modify_line+1
        	sed -i "${modify_line}i\ifconfig eth0 0.0.0.0" $linuxrc_or_init
        	modify_line=$modify_line+1
        	sed -i "${modify_line}i\ifconfig br0 0.0.0.0\\n" $linuxrc_or_init
	fi
fi
}
function patchMkpxeinitrdi_net(){
##2.Patch /usr/bin/mkpxeinitrd-net
mkpxeinitrd_net="/usr/bin/mkpxeinitrd-net"
#mkpxeinitrd_net="mkpxeinitrd-net"
if [ -e $mkpxeinitrd_net ]; then
	cat $mkpxeinitrd_net | grep '# modified by ezilla' >> /dev/null
	if [  $? != 0 ]; then
		cp $mkpxeinitrd_net "$mkpxeinitrd_net".dpkg
        	declare -i modify_line=$(cat -n $mkpxeinitrd_net | grep 'include_bin_prog_from_server="sleep lspci insmod modprobe rmmod lsmod pkill strings mount umount mount.nfs umount.nfs"' | awk 'NR==1 {print $1}')
        	# insert mark
        	sed -i "${modify_line}c\# modified by ezilla\\ninclude_bin_prog_from_server=\\\"sleep lspci insmod modprobe rmmod lsmod pkill strings mount umount mount.nfs umount.nfs brctl\\\"" $mkpxeinitrd_net
        	# insert bridge module
		declare -i modify_line=$(cat -n $mkpxeinitrd_net | grep '# Deal with firmwares!' | awk 'NR==1 {print $1}')
		modify_line=$modify_line-1
		sed -i "${modify_line}i\\\n   # modified by ezilla\\n   cp -a --parents kernel/net/802/stp.ko \$initrd/lib/modules/\$kernel_ver/\\n   cp -a --parents kernel/net/bridge/bridge.ko \$initrd/lib/modules/\$kernel_ver/" $mkpxeinitrd_net
	fi
fi
}
function patchInit_drbl(){
##3.Patch /opt/drbl/setup/files/misc/init.drbl
init_drbl="/usr/share/drbl/setup/files/misc/init.drbl"
#init_drbl="init.drbl"
if [ -e $init_drbl ]; then
        cat $init_drbl | grep '# modified by ezilla' >> /dev/null
        if [  $? != 0 ]; then
                cp $init_drbl "$init_drbl".dpkg
                declare -i modify_line=$(cat -n $init_drbl | grep 'eth.:|tr.:' | awk 'NR==1 {print $1}')
                # insert mark
                sed -i "${modify_line}c\# modified by ezilla\\nNETDEVICES=\\\"\$(cat /proc/net/dev | awk -F: \'/eth.:|tr.:|br.:/{print \$1}\')\\\""  $init_drbl 
                declare -i modify_line=$(cat -n $init_drbl | grep '# only DRBL SSI mode, not in clonezilla box mode, use NFS' | awk 'NR==1 {print $1}')
		modify_line=$modify_line+1
		sed -i "${modify_line}i\    # modified by ezilla\\n    echo -n \"Mounting NFS dir /var/lib/one... \" \\n    do_nfs_mount \$nfsserver:/var/lib/one /var/lib/one \$RW_NFS_EXTRA_OPT \$NFS_OPT_TO_ADD" $init_drbl
        fi
fi
}
function patchOcs_live_netcfg(){
##4.Patch /opt/drbl/sbin/ocs-live-netcfg
ocs_live_netcfg="/usr/sbin/ocs-live-netcfg"
#ocs_live_netcfg="ocs-live-netcfg"
if [ -e $ocs_live_netcfg ]; then
        cat $ocs_live_netcfg | grep '# modified by ezilla' >> /dev/null
        if [  $? != 0 ]; then
                cp $ocs_live_netcfg "$ocs_live_netcfg".dpkg
                declare -i modify_line=$(cat -n $ocs_live_netcfg | grep 'eth.:|tr.:|wlan.:' | awk 'NR==1 {print $1}')
                # insert mark
                sed -i "${modify_line}c\# modified by ezilla\\nNETDEVICES=\"\$(cat /proc/net/dev | awk -F: '/eth.:|tr.:|usb.:|wlan.:/{print \$1}\' | sort)\""  $ocs_live_netcfg
        fi
fi
}
##5. Patch /opt/drbl/sbin/drbl-nfs-exports
function patchDrbl_nfs_exports(){
drbl_nfs_exports="/usr/sbin/drbl-nfs-exports"
if [ -e $drbl_nfs_exports ]; then
        cat $drbl_nfs_exports | grep '# modified by ezilla' >> /dev/null
        if [  $? != 0 ]; then
		cp $drbl_nfs_exports "$drbl_nfs_exports".dpkg
     		declare -i modify_line=$(cat -n $drbl_nfs_exports | grep '/var/spool/mail $ip($EXPORTS_NFS_RW_RS_OPT)' | awk 'NR==1 {print $1}')
                modify_line=$modify_line+1
                sed -i "${modify_line}i\# modified by ezilla\\n/var/lib/one \$ip(\$EXPORTS_NFS_RW_RS_OPT)" $drbl_nfs_exports
        fi
fi
}
##6. Add /opt/drbl/conf/client-append-fstab
#client_append_fstab="/opt/drbl/conf/client-append-fstab"
#if [ ! -e $drbl_nfs_exports ]; then
#	touch $client_append_fstab
#	cat '10.0.0.254:/var/lib/one  /var/lib/one nfs rw,hard,intr,nfsvers=3,tcp,,defaults 0 0' >> $client_append_fstab  
#fi

##-------------------------------------------------------------
### config network alias for DHCP server
function patchNet_interface_alias(){
net_interface="/etc/network/interfaces"
if [ -e $net_interface ]; then
	cat $net_interface | grep '# modified by ezilla' >> /dev/null
	if [  $? != 0 ]; then
cat >> /etc/network/interfaces << EOF
# modified by ezilla
## setup eth0:1 as ethernet alias
auto eth0:1
iface eth0:1 inet static
address 10.0.0.254
netmask 255.0.0.0
EOF
	fi

fi
}

function ip_toHostname(){
    Slave_ip_hostname_file=/etc/drbl/client-ip-hostname
    touch $Slave_ip_hostname_file

    if [ -z "`cat $Slave_ip_hostname_file | grep \"ezilla hosts files generator\"`" ];then
        hostname ezilla-master
        sed -i -e "/HOSTNAME=*/d" -e "1a HOSTNAME=ezilla-master" /etc/sysconfig/network
            echo 10.0.0.254 ezilla-master > $Slave_ip_hostname_file
            for IP in $(seq 1 100)
            do
                echo 10.0.0.$IP ezilla-slave-$IP >> $Slave_ip_hostname_file
            done
            echo "#ezilla hosts files generator" >> $Slave_ip_hostname_file
    fi
}


if [ -d /usr/share/one/auto-installation ];then
    patchOcs_live_netcfg
    ip_toHostname
else
    patchLinuxrc_or_init
    patchMkpxeinitrdi_net
    patchInit_drbl
    patchOcs_live_netcfg
    patchDrbl_nfs_exports
    patchNet_interface_alias
    ip_toHostname
fi

