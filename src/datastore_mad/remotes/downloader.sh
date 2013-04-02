#!/bin/bash
#-------------------------------------------------------------------------------#
# Copyright (C) 2013                                                            #
#                                                                               #
# This file is part of ezilla.                                                  #
#                                                                               #
# This program is free software: you can redistribute it and/or modify it       #
# under the terms of the GNU General Public License as published by             #
# the Free Software Foundation, either version 3 of the License, or             #
# (at your option) any later version.                                           #
#                                                                               #
# This program is distributed in the hope that it will be useful, but WITHOUT   #
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS #
# FOR A PARTICULAR PURPOSE. See the GNU General Public License                  #
# for more details.                                                             #
#                                                                               #
# You should have received a copy of the GNU General Public License along with  #
# this program. If not, see <http://www.gnu.org/licenses/>                      #
#                                                                               #
# Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>                          #
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>                   #
#         Hsi-En Yu <yun _at_  nchc narl org tw>                                #
#         Hui-Shan Chen  <chwhs _at_ nchc narl org tw>                          #
#         Kuo-Yang Cheng  <kycheng _at_ nchc narl org tw>                       #
#         CHI-MING Chen <jonchen _at_ nchc narl org tw>                         #
#-------------------------------------------------------------------------------#

function get_type
{
    if [ "$NO_DECOMPRESS" = "yes" ]; then
        echo "application/octet-stream"
    else
        command=$1

        ( $command | head -n 1024 | file -b --mime-type - ) 2>/dev/null
    fi
}

# Gets the command needed to decompress an stream.
function get_decompressor
{
    type=$1

    case "$type" in
    "application/x-gzip")
        echo "gunzip -c -"
        ;;
    "application/x-bzip2")
        echo "bunzip2 -c -"
        ;;
    *)
        echo "cat"
        ;;
    esac
}

# Function called to decompress a stream. The first parameter is the command
# used to decompress the stream. Second parameter is the output file or
# - for stdout.
function decompress
{
    command="$1"
    to="$2"

    if [ "$to" = "-" ]; then
        $command
    else
        $command > "$to"
    fi
}

# Function called to hash a stream. First parameter is the algorithm name.
function hasher
{
    if [ -n "$1" ]; then
        openssl dgst -$1 | awk '{print $NF}' > $HASH_FILE
    else
        # Needs something consuming stdin or the pipe will break
        cat >/dev/null
    fi
}

# Unarchives a tar or a zip a file to a directpry with the same name.
function unarchive
{
    TO="$1"

    file_type=$(get_type "cat $TO")

    tmp="$TO"

    # Add full path if it is relative
    if [ ${tmp:0:1} != "/" ]; then
        tmp="$PWD/$tmp"
    fi

    IN="$tmp.tmp"
    OUT="$tmp"

    case "$file_type" in
    "application/x-tar")
        command="tar -xf $IN -C $OUT"
        ;;
    "application/zip")
        command="unzip -d $OUT $IN"
        ;;
    *)
        command=""
        ;;
    esac

    if [ -n "$command" ]; then
        mv "$OUT" "$IN"
        mkdir "$OUT"

        $command

        if [ "$?" != "0" ]; then
            echo "Error uncompressing archive" >&2
            exit -1
        fi
	FileNUM=`ls -1 $OUT | wc -l`
	FileNAME=""
	echo "$FileNUM" > /tmp/cmd.log
	if [ $FileNUM == "1" ]; then
		FileNAME=`ls -1 $OUT`
		mv "$OUT" "$OUT-tmp"
		mv "$OUT-tmp/$FileNAME" "$OUT"
        	rm "$IN"
		rm -rf "$OUT-tmp"
	else
		echo "Error uncompressing archive" >&2
        	rm "$IN"
        	rm -rf "$OUT"
            	exit -1
	fi
    fi
}

TEMP=`getopt -o m:s:l:n -l md5:,sha1:,limit:,nodecomp -- "$@"`

if [ $? != 0 ] ; then
    echo "Arguments error"
    exit -1
fi

eval set -- "$TEMP"

while true; do
    case "$1" in
        -m|--md5)
            HASH_TYPE=md5
            HASH=$2
            shift 2
            ;;
        -s|--sha1)
            HASH_TYPE=sha1
            HASH=$2
            shift 2
            ;;
        -n|--nodecomp)
            export NO_DECOMPRESS="yes"
            shift
            ;;
        -l|--limit)
            export LIMIT_RATE="$2"
            shift 2
            ;;
        --)
            shift
            break
            ;;
        *)
            shift
            ;;
    esac
done

FROM="$1"
TO="$2"

# File used by the hasher function to store the resulting hash
export HASH_FILE="/tmp/downloader.hash.$$"

case "$FROM" in
http://*|https://*)
    # -k  so it does not check the certificate
    # -L  to follow redirects
    # -sS to hide output except on failure
    # --limit_rate to limit the bw
    curl_args="-sS -k -L $FROM"

    if [ -n "$LIMIT_RATE" ]; then
        curl_args="--limit-rate $LIMIT_RATE $curl_args"
    fi

    command="curl $curl_args"
    ;;
*)
    command="cat $FROM"
    ;;
esac

file_type=$(get_type "$command")
decompressor=$(get_decompressor "$file_type")

$command | tee >( decompress "$decompressor" "$TO" ) \
    >( hasher $HASH_TYPE ) >/dev/null

if [ "$?" != "0" ]; then
    echo "Error copying" >&2
    exit -1
fi

if [ -n "$HASH_TYPE" ]; then
    HASH_RESULT=$( cat $HASH_FILE)
    rm $HASH_FILE
    if [ "$HASH_RESULT" != "$HASH" ]; then
        echo "Hash does not match" >&2
        exit -1
    fi
fi

# Unarchive only if the destination is filesystem
if [ "$TO" != "-" ]; then
    unarchive "$TO"
fi

