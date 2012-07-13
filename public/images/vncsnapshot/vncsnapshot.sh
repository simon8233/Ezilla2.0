#!/bin/bash
#  #{host} #{vnc_port} #{id} #{vnc_pw}
## $1 host
## $2 vnc port
## $3 VM id
## $4 vnc's password
## jpg name
CURRENT_PATH=`pwd`
if [ ! -f $CURRENT_PATH/vncpwd.sh ]; then
      CURRENT_PATH=`echo "$CURRENT_PATH/pubilc/images/vncsnapshot"`
fi
JPGTMPNAME=`echo "$CURRENT_PATH/$3-big.jpg"`
JPGNAME=`echo "$CURRENT_PATH/$3.jpg"`
if [ ! -f $JPGNAME ]; then
	cp $CURRENT_PATH/no_signal_m.jpg $JPGNAME
fi
$CURRENT_PATH/vncpwd.sh "$CURRENT_PATH"  $1 $2 $JPGTMPNAME "$4"
sleep 1
if [ -f $JPGTMPNAME ]; then
	/usr/bin/convert $JPGTMPNAME -resize 160x120 $JPGNAME
	rm -rf $JPGTMPNAME 
fi
