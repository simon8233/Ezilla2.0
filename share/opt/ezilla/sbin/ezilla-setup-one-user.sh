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
## ----------------------------------------------------------------
## Setup SSH client Global variable
ssh_config="/etc/ssh/ssh_config"
sudoers="/etc/sudoers"
#linuxrc_or_init="linuxrc-or-init"
if [ -e $ssh_config ]; then
        cat $ssh_config | grep '# modified by ezilla' >> /dev/null
        if [  $? != 0 ]; then
                cp $ssh_config "$ssh_config".dpkg
		echo "    # modified by ezilla" >> /etc/ssh/ssh_config
		echo "    StrictHostKeyChecking no" >> /etc/ssh/ssh_config
        fi
fi

if [ ! -z "`cat /etc/passwd | grep /root`" ];then
    ### Setup SSH private Key for user 'root'
    if [ ! -f  "/root/.ssh/id_rsa" ]; then
        ssh-keygen -t rsa -f /root/.ssh/id_rsa -q -N ""
        cp -p -f /root/.ssh/id_rsa.pub /root/.ssh/authorized_keys
    else
        cp -p -f /root/.ssh/id_rsa.pub /root/.ssh/authorized_keys
    fi
fi 
if [ ! -z "`cat /etc/passwd | grep /home/one`" ];then

	## Setup SSH private key for user 'one'
	if [ ! -f "/home/one/.ssh/id_rsa" ]; then
		su one -s /bin/bash -c "ssh-keygen -t rsa -f /home/one/.ssh/id_rsa -q -N \"\""
		### ssh-copy-host for user 'one'
		#### use -p to preserve permission : (X) root:root -> (O) one:one
		cp -p -f /home/one/.ssh/id_rsa.pub /home/one/.ssh/authorized_keys
	fi
fi
if [ ! -z "`cat /etc/passwd |grep /var/lib/one`" ];then
	
	if [ ! -s "/var/lib/one/.ssh/authorized_keys" ]; then
        	### ssh-copy-host for user 'oneadmin'
	        su oneadmin -s /bin/bash -c "ssh-keygen -t rsa -f /var/lib/one/.ssh/id_rsa -q -N \"\""
        	cp -p -f /var/lib/one/.ssh/id_rsa.pub /var/lib/one/.ssh/authorized_keys
	fi	
fi
if [ -d /etc/sudoers.d ];then

    if [ -z $ONE_LOCATION ];then
        echo "oneadmin ALL=(ALL) NOPASSWD:/usr/share/one/auto-installation/ezilla-slave-init.sh" > /etc/sudoers.d/oneadmin
        echo "oneadmin ALL=(ALL) NOPASSWD:/usr/share/one/auto-installation/ezilla-autoinstall-server" >> /etc/sudoers.d/oneadmin
    else
        echo "oneadmin ALL=(ALL) NOPASSWD:$ONE_LOCATION/share/auto-installation/ezilla-slave-init.sh" > /etc/sudoers.d/oneadmin
        echo "oneadmin ALL=(ALL) NOPASSWD:$ONE_LOCATION/share/auto-installation/ezilla-autoinstall-server" >> /etc/sudoers.d/oneadmin

    fi
        chmod 0440 /etc/sudoers.d/oneadmin
    if [  -e  /etc/sudoers ];then
        sed -i 's/Defaults    requiretty/#Default    requiretty/g'  /etc/sudoers 
    fi
fi
