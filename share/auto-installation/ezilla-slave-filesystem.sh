#!/bin/bash
# Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
#         Jonathan CHI-Ming Chen <jonchen _at_ nchc narl org tw>
# License:GPL
# $FILESYSTEM Total options have 
# 1. SCP
# 2. NFS
# 3. moosefs

source "$AUTO_INSTALL_WORKSPACE/ezilla-slave-variable"
source "$AUTO_INSTALL_WORKSPACE/ezilla-slave-config"
function SetupMasterFileSystem(){

    if [ $FILESYSTEM  == "moosefs" ];then 

# ezilla server must installed mfs master server ,  metalogger server  , chunk servers.
    #yum install -y $MASTER_MOOSEFS_RPM , comment prepare with ezilla-pkg-install.sh 
    if [ ! -d "$SLAVE_WEB_KICKSTART_DIR" ];then
        mkdir -p $SLAVE_WEB_KICKSTART_DIR
    fi        
    /bin/cp $MASTER_MOOSEFS_RPM $SLAVE_WEB_KICKSTART_DIR
	if [ ! -d "$MASTER_TM_MODULE_DIR/moosefs" ];then
	    mkdir -p "$MASTER_TM_MODULE_DIR/moosefs"
	    /bin/cp $MASTER_TM_MODULE_DIR/shared/*  $MASTER_TM_MODULE_DIR/moosefs/
        sed -i 's/cp -r/\/usr\/bin\/mfsmakesnapshot -o/g' "$MASTER_TM_MODULE_DIR/moosefs/clone"
        sed -i 's/cp -R/\/usr\/bin\/mfsmakesnapshot -o/g' "$MASTER_TM_MODULE_DIR/moosefs/context"
        sed -i 's/iscsi" ]/iscsi,moosefs" ]/g' "$MASTER_ONED_CONF" 
        echo "You Must Reboot oned process. To load Moose file system support "
	fi

	if [ ! -f /etc/mfs/mfsmaster.cfg ];then
    	/bin/cp /etc/mfs/mfsmaster.cfg.dist /etc/mfs/mfsmaster.cfg
		sed -i -e 's/# EXPORTS_FILENAME/  EXPORTS_FILENAME/g' -e  's/# DATA_PATH/  DATA_PATH/g' /etc/mfs/mfsmaster.cfg
	fi
	
	if [ ! -f /etc/mfs/mfsexports.cfg ];then
		/bin/cp /etc/mfs/mfsexports.cfg.dist /etc/mfs/mfsexports.cfg
		sed -i -e "2c10.0.0.0\/8 \t\t/ \t rw,alldirs,maproot=0" /etc/mfs/mfsexports.cfg
	fi

	if [ ! -f /var/mfs/metadata.mfs ];then
		/bin/cp /var/mfs/metadata.mfs.empty /var/mfs/metadata.mfs
	fi

	if [ ! -f /etc/mfs/mfschunkserver.cfg ];then
    	/bin/cp /etc/mfs/mfschunkserver.cfg.dist /etc/mfs/mfschunkserver.cfg
        sed -i -e 's/# MASTER_HOST = mfsmaster/  MASTER_HOST = ezilla_masterfs/g' -e 's/# MASTER_PORT/  MASTER_PORT/g' -e 's/# HDD_CONF_FILENAME/  HDD_CONF_FILENAME/g' /etc/mfs/mfschunkserver.cfg
	fi

	if [ ! -f /etc/mfs/mfshdd.cfg ];then
        /bin/cp /etc/mfs/mfshdd.cfg.dist /etc/mfs/mfshdd.cfg
		echo '/mnt/mfschunk1/' >> /etc/mfs/mfshdd.cfg
		mkdir -p /mnt/mfschunk1/
		chown -R daemon:daemon /mnt/mfschunk1	
	fi
			
	/etc/init.d/mfsmaster	restart
    /etc/init.d/mfsmetalogger stop
	/etc/init.d/mfschunkserver restart 
		
	/sbin/chkconfig mfsmaster on
	/sbin/chkconfig mfsmetalogger off
	/sbin/chkconfig mfschunkserver on
	sleep 10
    /usr/bin/mfsmount /mfs -H mfsmaster
	sleep 1
	rm -rf /var/lib/one/datastores
	mkdir -p /var/lib/one/datastores
	/usr/bin/mfsmount /var/lib/one/datastores -H mfsmaster
	sleep 1
    chown -R oneadmin:oneadmin /var/lib/one
	chmod 755 /var/lib/one/datastores
# modify on default datastore , using moosefs TM mad.
    if [ -e $MASTER_DATASTORE_CONFIG ];then
        sed -i -e 's/NAME =/NAME = moosefs/g' -e 's/TM_MAD =/TM_MAD = moosefs/g' $MASTER_DATASTORE_CONFIG  
    fi
    su oneadmin -s /bin/bash -c "/usr/bin/onedatastore update 1 /opt/ezilla/share/config/datastore.one"

    elif [ $FILESYSTEM == "nfs" ];then
        declare -i modify_line=$(cat -n /etc/exports | grep '###Export /var/lib/one/datastores' | awk 'NR==1 {print $1}')
        start_line=`expr ${modify_line} + 1`
        sed -i "${start_line}i \/var/lib/one/datastores    10.0.0.0/8(rw,no_root_squash)" /etc/exports
        service nfs restart
    fi


}
function SetupSlaveFileSystem(){
    if [  $FILESYSTEM == "moosefs" ];then

        declare -i modify_line=$(cat -n $SLAVE_KICKSTART | grep '### MooseFS' | awk 'NR==1 {print $1}')
        start_line=`expr ${modify_line} + 1`
        sed -i "${start_line}i mkdir -p /opt/ezilla/share/moosefs" $SLAVE_KICKSTART
		start_line=`expr ${start_line} + 1`
        sed -i "${start_line}i wget $SLAVE_MOOSEFS_RPM_WEB_LOCATION/mfs.rpm -O $SLAVE_MOOSEFS_RPM_FOLDER/mfs.rpm" $SLAVE_KICKSTART
        start_line=`expr ${start_line} + 1`
        sed -i "${start_line}i wget $SLAVE_MOOSEFS_RPM_WEB_LOCATION/mfs-client.rpm -O $SLAVE_MOOSEFS_RPM_FOLDER/mfs-client.rpm" $SLAVE_KICKSTART
        start_line=`expr ${start_line} + 1`
        sed -i "${start_line}i wget $SLAVE_MOOSEFS_RPM_WEB_LOCATION/mfs-cgi.rpm -O $SLAVE_MOOSEFS_RPM_FOLDER/mfs-cgi.rpm" $SLAVE_KICKSTART
		start_line=`expr ${start_line} + 1`
        sed -i "${start_line}i yum install -y $SLAVE_MOOSEFS_RPM_FOLDER/mfs*.rpm"  $SLAVE_KICKSTART
		start_line=`expr ${start_line} + 1`
		sed -i "${start_line}i /bin/cp /etc/mfs/mfschunkserver.cfg.dist /etc/mfs/mfschunkserver.cfg " $SLAVE_KICKSTART
        start_line=`expr ${start_line} + 1`
     	sed -i "${start_line}i /bin/cp /etc/mfs/mfshdd.cfg.dist /etc/mfs/mfshdd.cfg " $SLAVE_KICKSTART
        start_line=`expr ${start_line} + 1`
		sed -i "${start_line}i mkdir -p /mnt/mfschunk1/" $SLAVE_KICKSTART
        start_line=`expr ${start_line} + 1`
        sed -i "${start_line}i sed -i -e 's/# MASTER_HOST = mfsmaster/  MASTER_HOST = ezilla_masterfs/g' -e 's/# MASTER_PORT/  MASTER_PORT/g' -e 's/# HDD_CONF_FILENAME/  HDD_CONF_FILENAME/g' /etc/mfs/mfschunkserver.cfg " $SLAVE_KICKSTART
		start_line=`expr ${start_line} + 1`
		sed -i "${start_line}i echo '/mnt/mfschunk1/' >> /etc/mfs/mfshdd.cfg" $SLAVE_KICKSTART
        start_line=`expr ${start_line} + 1`
		sed -i "${start_line}i mkdir -p /mnt/mfschunk1" $SLAVE_KICKSTART
        start_line=`expr ${start_line} + 1`
		sed -i "${start_line}i chown daemon:daemon /mnt/mfschunk1" $SLAVE_KICKSTART
        start_line=`expr ${start_line} + 1`
		sed -i "${start_line}i /etc/init.d/mfschunkserver start" $SLAVE_KICKSTART
		start_line=`expr ${start_line} + 1`
		sed -i "${start_line}i chkconfig mfschunkserver on" $SLAVE_KICKSTART
		start_line=`expr ${start_line} + 1`
		sed -i "${start_line}i rm -rf /var/lib/one/datastores" $SLAVE_KICKSTART
		start_line=`expr ${start_line} + 1`
		sed -i "${start_line}i mkdir -p /var/lib/one/datastores" $SLAVE_KICKSTART              
		start_line=`expr ${start_line} + 1`                       
        sed -i "${start_line}i echo /usr/bin/mfsmount   /var/lib/one/datastores               fuse    mfsmaster=ezilla-masterfs,mfsport=9421,_netdev,nonempty,nosuid,nodev 0 0 >> /etc/fstab"  $SLAVE_KICKSTART
        start_line=`expr ${start_line} + 1`
		sed -i "${start_line}i chown oneadmin:oneadmin /var/lib/one/datastores" $SLAVE_KICKSTART
         
        
    elif [ $FILESYSTEM == "nfs" ];then

        declare -i modify_line=$(cat -n $SLAVE_KICKSTART | grep '###Script' | awk 'NR==1 {print $1}')
        start_line=`expr ${modify_line} + 3`
        sed -i "${start_line}i mkdir -p /var/lib/one/datastores" $SLAVE_KICKSTART
        start_line=`expr ${start_line} + 1`
        sed -i "${start_line}i chown oneadmin:oneadmin /var/lib/one/.*" $SLAVE_KICKSTART
        start_line=`expr ${start_line} + 1`
        sed -i "${start_line}i \echo \'mount -t nfs ezilla-masterfs:/var/lib/one/datastores /var/lib/one/datastores \' >> /etc/rc.local " $SLAVE_KICKSTART
 
    fi

}
function removeMasterFileSystem(){
    echo test
}

SetupMasterFileSystem
SetupSlaveFileSystem
