#!/bin/bash
# Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
#	  Jonathan CHI-Ming Chen <jonchen _at_ nchc narl org tw >
# License: GPL
ezilla_deb=Ubuntu-12.04-opennebula_3.6.0-1-ezilla_amd64.deb
ezilla_rpm=opennebula-3.6.0-1.x86_64.rpm
MASTER_MOOSEFS_RPM="/opt/ezilla/share/moosefs/mfs*.rpm"
if [ -e /etc/debian_version ] ; then
# must prepare for DRBL KEYS
        if [ -z "`apt-key|grep DRBL`" ] ; then
                wget -q http://drbl.nchc.org.tw/GPG-KEY-DRBL -O- | sudo apt-key add -
        fi
        if [ -z "`cat /etc/apt/sources.list|grep drbl-core`" ];then
                echo "deb http://free.nchc.org.tw/drbl-core drbl stable" >> /etc/apt/sources.list
        fi
        apt-get update
        apt-get -y install vim openssh-server sudo qemu-kvm screen debconf kvm libvirt-bin libvirt0 virtinst virt-viewer virt-manager vnc4server openbox ruby util-linux tar gzip bzip2 lzop pigz pbzip2 procps dialog rsync parted pciutils tcpdump bc gawk hdparm sdparm netcat file ethtool etherwake ssh syslinux mtools reiserfsprogs e2fsprogs psmisc locales wget disktype zip unzip patch iproute traceroute iputils-ping binutils expect ntfsprogs partimage udpcast initscripts tftpd-hpa nfs-kernel-server curl lftp iptables udev memtest86+ aoetools btrfs-tools dhcp3-server dmraid fgetty hfsprogs hfsutils hwinfo dhcp3-server kpartx lbzip2 libdmraid1.0.0.rc16 libhd16 lshw lzip lzma runit tofrodos ufsutils vblade vblade-persist bridge-utils uml-utilities sysrqd imagemagick libnokogiri-ruby tofrodos libsqlite3-dev libxmlrpc-c3-dev g++ libruby libssl-dev ruby-dev libxml2-dev libmysqlclient-dev libmysql++-dev libsqlite3-ruby libexpat1-dev rubygems libxml-parser-ruby1.8 libxslt1-dev genisoimage libxml-parser-ruby1.8 scons drbl clonezilla mkswap-uuid partclone drbl-chntpw mkpxeinitrd-net gpxe freedos ipxe python-software-properties apg ruby-json ruby-sinatra thin1.8 lvm2 ruby-mysql ruby-password ruby-sequel libjpeg62
        if [ ! -e /root/$ezilla_deb ];then
		wget http://140.110.28.227/ks/$ezilla_deb -O /root/$ezilla_deb
	fi

elif [ -e /etc/redhat-release ]; then
	if [ ! -e /root/$ezilla_rpm ];then
		 wget http://140.110.28.227/ks/$ezilla_rpm -O /root/$ezilla_rpm
	fi
    yum -y install $MASTER_MOOSEFS_RPM
    /etc/init.d/mfsmaster stop
    /etc/init.d/mfschunkserver stop
	/sbin/chkconfig  mfsmaster off
    /sbin/chkconfig  mfschunkserver off
fi
