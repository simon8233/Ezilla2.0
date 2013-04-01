#!/bin/bash
#-------------------------------------------------------------------------------
# Copyright (C) 2013
#
# This file is part of ezilla.
#
# This program is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the GNU General Public License
# for more details.
#
# You should have received a copy of the GNU General Public License along with
# this program. If not, see <http://www.gnu.org/licenses/>
#
# Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
#         Hsi-En Yu <yun _at_  nchc narl org tw>
#         Hui-Shan Chen  <chwhs _at_ nchc narl org tw>
#         Kuo-Yang Cheng  <kycheng _at_ nchc narl org tw>
#         CHI-MING Chen <jonchen _at_ nchc narl org tw>
#-------------------------------------------------------------------------------
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
