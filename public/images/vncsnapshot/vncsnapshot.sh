#!/bin/bash
#  #{host} #{vnc_port} #{id} #{vnc_pw}
## $1 host
## $2 vnc port
## $3 VM id
## $4 vnc's password
## jpg name
URRENT_PATH=`pwd`
JPGTMPNAME=`echo "$URRENT_PATH/$3-big.jpg"`
JPGNAME=`echo "$URRENT_PATH/$3.jpg"`
if [ ! -f $JPGNAME ]; then
	cp $URRENT_PATH/no_signal_m.jpg $JPGNAME
fi
$URRENT_PATH/vncpwd.sh "$URRENT_PATH"  $1 $2 $JPGTMPNAME "$4"
sleep 1
if [ -f $JPGTMPNAME ]; then
	/usr/bin/convert $JPGTMPNAME -resize 160x120 $JPGNAME
	rm -rf $JPGTMPNAME 
fi
