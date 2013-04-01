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
AUTO_INSTALL_WORKSPACE=
if [ -z "$ONE_LOCATION" ];then
    AUTO_INSTALL_WORKSPACE="/usr/share/one/auto-installation"
else
    AUTO_INSTALL_WORKSPACE="$ONE_LOCATION/share/auto-installation"
fi
export AUTO_INSTALL_WORKSPACE
source "$AUTO_INSTALL_WORKSPACE/ezilla-slave-variable"
source "$AUTO_INSTALL_WORKSPACE/ezilla-slave-config"

# $1 = install_mode 
# $2 = disk num..
# $3 = disk id
# $4 = file_system  
# $5 = net_card num
# ezilla-slave-init initial script
# ezilla-slave-disk setup slave disk env
# ezilla-slave-filesystem  setup filesystem env
# ezilla-slave-network  setup network env
# ezilla-slave-config used record slave node setup variable
if [ -d $AUTO_INSTALL_WORKSPACE ];then
    if [ ! -e $SLAVE_DISK ];then
        echo "Your lose $SLAVE_DISK installation." 
    fi
    if [ ! -e $SLAVE_FILESYSTEM ];then
        echo "Your lose $SLAVE_FILESYSTEM installation." 
    fi
    if [ ! -e $SLAVE_NETWORK ];then 
        echo "Your lose $SLAVE_NETWORK installation." 
    fi

    # check env variable file.
    # check slave variable files.
fi
# user identify 
#if [ `whoami` == "oneadmin" ];then 
#fi
if [ -e $SLAVE_EXAMPLE_KICKSTART ]; then
    /bin/cp $SLAVE_EXAMPLE_KICKSTART $SLAVE_KICKSTART
fi

# install_mode choose
if [ $INSTALL_MODE == "default" ];then
    echo "Default Installation was beginning"
    /bin/bash $MASTER_SETUP
    /bin/bash $SLAVE_SETUP
    /bin/bash $SLAVE_DISK
    /bin/bash $SLAVE_FILESYSTEM 
    /bin/bash $SLAVE_NETWORK 
elif [ $INSTALL_MODE == "custom" ];then  
    echo "Custom Installation  was beginning"
    /bin/bash $MASTER_SETUP
    /bin/bash $SLAVE_SETUP
    /bin/bash $SLAVE_DISK
    /bin/bash $SLAVE_FILESYSTEM 
    /bin/bash $SLAVE_NETWORK
else
    echo "You Choose Installation model is error , You must reconfigure your slave node."
    return -1;
    exit 0;
fi

#update kickstart files , on web server.
if [ ! -d $SLAVE_WEB_KICKSTART_DIR ];then
    mkdir -p $SLAVE_WEB_KICKSTART_DIR
    /bin/cp $SLAVE_KICKSTART $SLAVE_WEB_KICKSTART
    chown -R apache:apache $SLAVE_WEB_KICKSTART_DIR
    /etc/init.d/httpd restart
else
    /bin/cp $SLAVE_KICKSTART $SLAVE_WEB_KICKSTART
    /bin/cp $SLAVE_KICKSTART $SLAVE_WEB_KICKSTART
    chown -R apache:apache $SLAVE_WEB_KICKSTART_DIR
    /etc/init.d/httpd restart
fi



### cancel environment variable
unset AUTO_INSTALL_WORKSPACE
