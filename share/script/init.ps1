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




$content = Get-Content -path d:\context.sh 
$context = @{}

# Read All Context Variables from context.sh
foreach ($line in $content)
{
    if ($line[0] -ne '#')
    {
        $var = $line.split('=')
        if ($var[1] -ne $null)
        {
            #remove the " " of variables
            $var[1] = $var[1] -replace '^"|"$',""
            $context.Set_Item($var[0], $var[1])
        }
    }
}

#Setup the IP, gateway, netmask, dns
if ($context.Get_Item("IP_PUBLIC") -ne $null)
{
    netsh interface ip set address "°Ï°ì³s½u" static $context.Get_Item("IP_PUBLIC") $context.Get_Item("NETMASK") $context.Get_Item("GATEWAY") 1
    netsh interface ip set dns "°Ï°ì³s½u" static 140.110.16.1
    netsh interface ip add dns "°Ï°ì³s½u" 168.95.192.1 2 
}

#Setup Administrator Password
if ($context.Get_Item("ROOT_PASSWD") -ne $null)
{
    $password = $context.Get_Item('ROOT_PASSWD')
    net user Administrator "`"$password`""
}

#New Account and Password
if ($context.Get_Item("USERNAME") -ne $null)
{
    $password = $context.Get_Item('USER_PASSWD')
    net user $context.Get_Item("USERNAME") "`"$password`"" /add
    net localgroup administrators $context.Get_Item("USERNAME") /add
}

#Change Computer Name
if ($context.Get_Item("HOSTNAME") -ne $null)
{
    $hostname = $context.Get_Item('HOSTNAME')
    (get-wmiobject -class win32_ComputerSystem).Rename("`"$hostname`"")
}

