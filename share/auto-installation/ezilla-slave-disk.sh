#!/bin/bash
# Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
#         Jonathan CHI-Ming Chen <jonchen _at_ nchc narl org tw>
# License:GPL
# $DISK_NUM How many the Disk will installed os?
# $DISK Disk ( Need to format disk , install ezilla slave. )
# example: sda,sdb,hda.......
source "$AUTO_INSTALL_WORKSPACE/ezilla-slave-variable"
source "$AUTO_INSTALL_WORKSPACE/ezilla-slave-config"

if [ -e $SLAVE_KICKSTART ];then

    if [ "$DISK_NUM" -eq "2" ];then
        partition=$DISK
        part_A=`echo $DISK | awk -F "," '{print $1}'` # format disk idA
        part_B=`echo $DISK | awk -F "," '{print $2}'` # format disk idB
        declare -i modify_line=$(cat -n $SLAVE_KICKSTART | grep '###Partition Disk' | awk 'NR==1 {print $1}')
        start_line=`expr ${modify_line} + 1`
        sed -i "${start_line}i \clearpart --all --initlabel --drives=$partition \npart /boot --fstype=ext4 --size=500 --ondisk=$part_A \npart / --fstype=ext4 --grow --size=1 --ondisk=$part_A \npart swap --recommended \npart /mnt/mfschunk1 --fstype=ext4 --grow --size=1 --ondisk=$part_B" $SLAVE_KICKSTART
	else
        partition=$DISK
		declare -i modify_line=$(cat -n $SLAVE_KICKSTART | grep '###Partition Disk' | awk 'NR==1 {print $1}')		
	    start_line=`expr ${modify_line} + 1`
		sed -i "${start_line}i \clearpart --all --initlabel --drives=$partition \npart /boot --fstype=ext4 --size=500 --ondisk=$partition \npart / --fstype=ext4 --grow --size=1 --ondisk=$partition \npart swap --recommended" $SLAVE_KICKSTART
	fi
    

fi





