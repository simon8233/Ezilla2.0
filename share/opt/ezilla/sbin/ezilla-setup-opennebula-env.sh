#!/bin/bash
# Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
#	  Jonathan CHI-Ming Chen <jonchen _at_ nchc narl org tw>
# License: GPL
## ----------------------------------------------------------------
## Setup OpenNebula
##
ezadmin=oneadmin
if [ -e /etc/debian_version ] ;then		
	usermod -a -G libvirtd $ezadmin
elif [ -e /etc/redhat-release ] ; then
	groupadd libvirt
	usermod -a -G libvirt $ezadmin
else
	echo "We don't support your OS"
fi

### create oneadmin home , log , image pool for opennebula
chown -R oneadmin:oneadmin /var/lib/one
chown -R oneadmin:oneadmin /var/log/one
chown -R oneadmin:oneadmin /usr/lib/one
usermod -a -G kvm $ezadmin
gem install --no-ri --no-rdoc json thin sequel sqlite3 nokogiri  sinatra
sunstone_server_conf="/etc/one/sunstone-server.conf"
if [ -d  /etc/one/ ];then
    chown -R oneadmin:oneadmin /etc/one/
fi 
if [ -e $sunstone_server_conf ]; then
    sed -i -e 's/:host: 127.0.0.1/:host: 0.0.0.0/g' $sunstone_server_conf
fi


##check auto-installation directory 
#if [ ! -d /usr/share/one/auto-installation ];then
#    mkdir -p /usr/share/one/auto-installation 
#    cp /opt/ezilla/sbin/diskver/* /usr/share/one/auto-installation
#    chown -R oneadmin:oneadmin /usr/share/one/auto-installation
#fi  move to ezilla-init
if [ -e /etc/crontab ];then
    
    if [ -z "`cat /etc/crontab|grep ezilla`" ];then 
        echo "ezilla modify" >> /etc/crontab
        echo "  *  *  *  *  0 root (/usr/sbin/ntpdate tock.stdtime.gov.tw && /sbin/hwclock -w) &> /dev/null"  >> /etc/crontab
    fi
    /usr/sbin/ntpdate tock.stdtime.gov.tw 
    /sbin/hwclock -w
fi
### support private IP use ipv4.forward
if [ -e /etc/sysctl.conf ];then
    sed -i -e 's/net.ipv4.ip_forward = 0/net.ipv4.ip_forward = 1/g' /etc/sysctl.conf
    /sbin/sysctl -p
fi

### iptables setup start
#IPTABLES=/sbin/iptables
#IPTABLES_SAVE=/sbin/iptables-save
#IFACE=`route -n | grep UG | awk '{FS="\t"} {print $8}'`
#$IPTABLES -F
#$IPTABLES -X
#$IPTABLES -Z
#$IPTABLES -t nat -A POSTROUTING -s 10.0.0.0/8 -o ${IFACE} -j MASQUERADE
#$IPTABLES_SAVE > /etc/sysconfig/iptables
#service iptables restart
IFACE=`route -n | grep UG | awk '{FS="\t"} {print $8}'`
echo "/sbin/iptables -t nat -A POSTROUTING -s 10.0.0.0/8 -o ${IFACE} -j MASQUERADE" >> /etc/rc.local
### iptables setup end


### opennebula only using /usr/bin/kvm
if [ ! -e  /usr/bin/kvm ];then
    ln -s /usr/libexec/qemu-kvm /usr/bin/kvm
fi 
### using bridge interface  , bridge all vnet ineterface.(Private IP used)

netcard_num=`cat /proc/net/dev | grep eth | wc -l`
IFACE=`route -n | grep UG | awk '{FS="\t"} {print $8}'`

if [ $netcard_num -ge 2 ];then
    IFACE=(`cat /proc/net/dev |grep eth|grep -v $IFACE|awk 'BEGIN{FS=":"} {print $1}'`) #other interface
    IFACE=${IFACE[0]} # using first device
    interface=/etc/sysconfig/network-scripts/ifcfg-$IFACE

    if [ -z `cat $interface |grep "ezilla modify" ` ];then
        sed -i -e 's/ONBOOT=\"no\"/ONBOOT=\"yes\"/g'  -e '/BOOTPROTO/d' -e '/GATEWAY/d' -e '/IPADDR/d' -e '/NETMASK/d' -e 's/NM_CONTROLLED=\"yes\"/NM_CONTROLLED=\"no\"/g' -e '/BRIDGE/d' -e '/DHCP_HOSTNAME/d' -e '/DNS/d' $interface
        echo -e "IPADDR=10.0.0.254\\nNETMASK=255.0.0.0\\nBOOTPROTO=none\\n" >> $interface
        echo "#ezilla modify" >>  $interface
    fi
else
    /bin/cp /etc/sysconfig/network-scripts/ifcfg-$IFACE /etc/sysconfig/network-scripts/ifcfg-$IFACE:0
    interface=/etc/sysconfig/network-scripts/ifcfg-$IFACE:0

    if  [ -z `cat $interface |grep "ezilla modify" ` ];then
        sed -i -e 's/ONBOOT=\"no\"/ONBOOT=\"yes\"/g' -e '/BROADCAST/d' -e '/BOOTPROTO/d' -e '/GATEWAY/d' -e '/IPADDR/d' -e '/NETMASK/d' -e 's/NM_CONTROLLED=\"yes\"/NM_CONTROLLED=\"no\"/g' -e '/BRIDGE/d' -e '/DHCP_HOSTNAME/d' -e '/DNS/d' $interface
        echo -e "DEVICE=$IFACE:0\\nIPADDR=10.0.0.254\\nNETMASK=255.0.0.0\\nBOOTPROTO=none\\n" >> $interface
        echo "#ezilla modify" >>  $interface
    fi
fi
### using br0 because support ezilla-master node.
if [ ! -e /etc/sysconfig/network-scripts/ifcfg-br0 ]; then    
    echo -e "DEVICE=br0\\nIPADDR=10.0.0.254\\nNETMASK=255.0.0.0\\nBOOTPROTO=none\\nONBOOT=yes\\n" >> /etc/sysconfig/network-scripts/ifcfg-br0
fi
service network restart

### support NFSv4 permission
if [ -e /etc/idmapd.conf ];then
    sed -i -e 's/#Verbosity = 0/Verbosity = 1/g' -e 's/#Domain = local.domain.edu/Domain = ezilla/g' -e 's/Nobody-User = nobody/#Nobody-User = nobody/g' -e 's/Nobody-Group = nobody/#Nobody-Group = nobody/g' /etc/idmapd.conf
    service rpcidmapd start
    chkconfig rpcidmapd --level 345 on
fi
# support Moose file system.
# Ezilla about MooseFileSystem config files
if [ -z "$ONE_LOCATION" ];then
    MASTER_TM_MODULE_DIR="/var/lib/one/remotes/tm"
    MASTER_ONED_CONF="/etc/one/oned.conf"
else
    MASTER_TM_MODULE_DIR="$ONE_LOCATION/var/remotes/tm"
    MASTER_ONED_CONF="$ONE_LOCATION/etc/oned.conf"
    
fi
QCOW2_DATASTORE_FILE="/opt/ezilla/share/config/datastore_qcow.one"

# prepare support moosefs , To avoid reload oned process.
if [ ! -d "$MASTER_TM_MODULE_DIR/moosefs" ];then
     mkdir -p "$MASTER_TM_MODULE_DIR/moosefs"
     /bin/cp $MASTER_TM_MODULE_DIR/shared/*  $MASTER_TM_MODULE_DIR/moosefs/
     sed -i 's/cp -r/\/usr\/bin\/mfsmakesnapshot -o/g' "$MASTER_TM_MODULE_DIR/moosefs/clone"
     sed -i 's/cp -R/\/usr\/bin\/mfsmakesnapshot -o/g' "$MASTER_TM_MODULE_DIR/moosefs/context"
     sed -i 's/iscsi" ]/iscsi,moosefs" ]/g' "$MASTER_ONED_CONF"
fi
# support qcow images, create os_raw2qcow2_datastore
if [ -e "$QCOW2_DATASTORE_FILE" ];then
        su oneadmin -s /bin/bash -c "/usr/bin/onedatastore create $QCOW2_DATASTORE_FILE" 
fi

