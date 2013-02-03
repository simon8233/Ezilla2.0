#!/bin/bash
#
#
#
#
IFACE=`route -n | grep UG | awk '{FS="\t"} {print $8}'`
ipaddr=`ifconfig $IFACE |grep "inet addr" | awk '{print $2}'`
ipaddr=${ipaddr##*:}
ipcount=${ipaddr##*.}
netmask=`ifconfig $IFACE |grep "inet addr" | awk '{print $4}'`
netmask=${netmask#*:}
gateway=`route -n | grep UG | awk '{print $2}'`
network_scripts=/etc/sysconfig/network-scripts

sed -i -e 's/ONBOOT=\"no\"/ONBOOT=\"yes\"/g' -e '/TYPE/d' -e '/BOOTPROTO/d' -e '/GATEWAY/d' -e '/IPADDR/d' -e '/NETMASK/d' -e 's/NM_CONTROLLED=\"yes\"/NM_CONTROLLED=\"no\"/g' -e '/BRIDGE/d' -e '/DHCP_HOSTNAME/d' -e '/DNS/d' /etc/sysconfig/network-scripts/ifcfg-$IFACE
echo -e 'BRIDGE=br0' >> /etc/sysconfig/network-scripts/ifcfg-$IFACE
echo -e "DEVICE=br0\\nONBOOT=yes\\nTYPE=Bridge\\nBOOTPROTO=none\\nIPADDR=$ipaddr\\nNETMASK=$netmask\\nGATEWAY=$gateway\\nDELAY=0 "> /etc/sysconfig/network-scripts/ifcfg-br0
/etc/init.d/network restart
