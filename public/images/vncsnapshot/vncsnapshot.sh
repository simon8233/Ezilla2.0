#!/bin/bash
#  #{host} #{vnc_port} #{id} #{vnc_pw}
## $1 host
## $2 vnc port
## $3 VM id
## $4 vnc's password
## jpg name
JPGTMPNAME=`echo "$ONE_LOCATION/lib/sunstone/public/images/$3-big.jpg"`
JPGNAME=`echo "$ONE_LOCATION/lib/sunstone/public/images/$3.jpg"`
if [ ! -f $JPGNAME ]; then
	cp $ONE_LOCATION/lib/sunstone/public/images/no_signal_m.jpg $JPGNAME
fi
$ONE_LOCATION/lib/sunstone/public/images/vncsnapshot/vncpwd.sh "$ONE_LOCATION/lib/sunstone/public/images/vncsnapshot"  $1 $2 $JPGTMPNAME "$4"
sleep 1
/usr/bin/convert $JPGTMPNAME -resize 160x120 $JPGNAME
rm -rf $JPGTMPNAME 
