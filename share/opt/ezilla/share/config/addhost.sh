#!/bin/bash
ip=$1
declare -i hostexist=$(/usr/bin/onehost list | grep "$ip" | /usr/bin/wc -l )
#"$ip " , space after "$ip' '", because  need  full  comparison 
HID=$(/usr/bin/onehost list | grep "$ip " | awk 'NR==1 {print $1}')
if [ "$hostexist" != "0" ]; then
    exit 0
fi
/usr/bin/onehost create ${ip} -i im_kvm -v vmm_kvm -n dummy
