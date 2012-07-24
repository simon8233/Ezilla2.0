#!/bin/bash
# #{sh_path} #{host} #{vnc_port} #{id} #{vnc_pw}
## $1 sh_path
## $2 host
## $3 vnc port
## $4 VM id
## $5 vnc's password
## jpg name
CURRENT_PATH=$1
JPGTMPNAME=`echo "$CURRENT_PATH/$4-big.jpg"`
JPGNAME=`echo "$CURRENT_PATH/$4.jpg"`
if [ ! -f $JPGNAME ]; then
	cp $CURRENT_PATH/no_signal_m.jpg $JPGNAME
fi
$CURRENT_PATH/vncpwd.sh "$CURRENT_PATH"  $2 $3 $JPGTMPNAME "$5"
sleep 1
if [ -f $JPGTMPNAME ]; then
	/usr/bin/convert $JPGTMPNAME -resize 160x120 $JPGNAME
	rm -rf $JPGTMPNAME 
fi
exit
