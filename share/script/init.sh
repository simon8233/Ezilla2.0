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

DEBIAN_ETH_FILE="/etc/network/interfaces"
HOSTS_FILE="hosts"
ROOT_PRIKEY="id_rsa"
USER_PRIKEY="id_rsa"

if [ ! -f /etc/.ezilla ]
then

	if [ -f /etc/init.d/iptables ]
	then
		/etc/init.d/iptables stop
	fi

	if [ -f /mnt/context.sh ]
	then
	  . /mnt/context.sh
	fi

	if [ -f /mnt/$HOSTS_FILE ]; then
        	cp /mnt/$HOSTS_FILE /etc/
	fi

	if [ -f /mnt/$MPI_PACKAGE ]; then
        	tar zxvf /mnt/$MPI_PACKAGE -C /opt/
	fi

	if [ -f /mnt/$ROOT_PUBKEY ]; then
		mkdir -p /root/.ssh
		cat /mnt/$ROOT_PUBKEY >> /root/.ssh/authorized_keys
        	echo "Host *" > /root/.ssh/config
        	echo "StrictHostKeyChecking no" >> /root/.ssh/config
		chmod -R 600 /root/.ssh
	fi

	if [ -f /mnt/$ROOT_PRIKEY ]; then
        	cp /mnt/$ROOT_PRIKEY /root/.ssh/
        	chmod -R 600 /root/.ssh
	fi

	if [ -n "$USERNAME" ]; then
		if [ -e "$DEBIAN_ETH_FILE" ]; then
                	if [ -n "$USER_PASSWD" ]; then
                        	useradd -s /bin/bash -m $USERNAME -p "$USER_PASSWD"
                        	echo $USERNAME:"$USER_PASSWD" | chpasswd
                        	echo "root:$USER_PASSWD" | chpasswd
                	else
                        	useradd -s /bin/bash -m $USERNAME
                	fi
			#install request packages for debian
			#apt-get -y -f install sshfs
			if [ -n "$DEBIAN_DEB" ]; then 
				/usr/bin/dpkg -i /mnt/*.deb
			fi
		else
			if [ -n "$USER_PASSWD" ]; then
				useradd -s /bin/bash -m $USERNAME -p "$USER_PASSWD"
				echo "$USER_PASSWD" | passwd $USERNAME --stdin
				echo "$USER_PASSWD" | passwd root --stdin
			else
				useradd -s /bin/bash -m $USERNAME
			fi
		fi

		if [ -f /mnt/$USER_PUBKEY ]; then
			mkdir -p /home/$USERNAME/.ssh/
			cat /mnt/$USER_PUBKEY >> /home/$USERNAME/.ssh/authorized_keys
			echo "Host *" > /home/$USERNAME/.ssh/config
  			echo "StrictHostKeyChecking no" >> /home/$USERNAME/.ssh/config
			chown -R $USERNAME:$USERNAME /home/$USERNAME/.ssh
			chmod -R 700 /home/$USERNAME/.ssh
		fi

        	if [ -f /mnt/$USER_PRIKEY ]; then
                	cp /mnt/$USER_PRIKEY /home/$USERNAME/.ssh/
                	chown -R $USERNAME:$USERNAME /home/$USERNAME/.ssh
                	chmod -R 700 /home/$USERNAME/.ssh
        	fi
	
	fi
	touch /etc/.ezilla
fi
