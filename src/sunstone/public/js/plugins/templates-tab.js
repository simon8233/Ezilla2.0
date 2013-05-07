/*-------------------------------------------------------------------------------*/
/* Copyright (C) 2013                                                            */
/*                                                                               */
/* This file is part of ezilla.                                                  */
/*                                                                               */
/* This program is free software: you can redistribute it and/or modify it       */
/* under the terms of the GNU General Public License as published by             */
/* the Free Software Foundation, either version 3 of the License, or             */
/* (at your option) any later version.                                           */
/*                                                                               */
/* This program is distributed in the hope that it will be useful, but WITHOUT   */
/* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS */
/* FOR A PARTICULAR PURPOSE. See the GNU General Public License                  */
/* for more details.                                                             */
/*                                                                               */
/* You should have received a copy of the GNU General Public License along with  */
/* this program. If not, see <http://www.gnu.org/licenses/>                      */
/*                                                                               */
/* Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>                          */
/*         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>                   */
/*         Hsi-En Yu <yun _at_  nchc narl org tw>                                */
/*         Hui-Shan Chen  <chwhs _at_ nchc narl org tw>                          */
/*         Kuo-Yang Cheng  <kycheng _at_ nchc narl org tw>                       */
/*         CHI-MING Chen <jonchen _at_ nchc narl org tw>                         */
/*-------------------------------------------------------------------------------*/

/*Templates tab plugin*/

var templates_tab_content = '\
<h2><i class="icon-file"></i> '+tr("Templates")+'</h2>\
<form id="template_form" action="" action="javascript:alert(\'js error!\');">\
  <div class="action_blocks">\
  </div>\
<table id="datatable_templates" class="display">\
  <thead>\
    <tr>\
      <th class="check"><input type="checkbox" class="check_all" value="">'+tr("All")+'</input></th>\
      <th>'+tr("ID")+'</th>\
      <th>'+tr("Owner")+'</th>\
      <th>'+tr("Group")+'</th>\
      <th>'+tr("Name")+'</th>\
      <th>'+tr("Registration time")+'</th>\
    </tr>\
  </thead>\
  <tbody id="tbodytemplates">\
  </tbody>\
</table>\
<div class="legend_div">\
  <span>?</span>\
  <p class="legend_p">\
'+tr("Clicking `instantiate` will instantly create new Virtual Machines from the selected templates and name one-id. If you want to assign a specific name to a new VM, or launch several instances at once, use Virtual Machines->New button.")+'\
  </p>\
  <p class="legend_p">\
'+tr("You can clone a template to obtain a copy from an existing template. This copy will be owned by you.")+'\
  </p>\
</div>\
</form>';

var create_template_tmpl = '<div id="template_create_tabs">\
        <ul>\
                <li><a href="#easy">'+tr("Wizard KVM")+'</a></li>\
 		<!--\
		<li><a href="#easy">'+tr("Wizard XEN")+'</a></li>\
                <li><a href="#easy">'+tr("Wizard VMware")+'</a></li>\
 		-->\
                <li><a href="#manual">'+tr("Advanced mode")+'</a></li>\
        </ul>\
        <div id="easy">\
                <form>\
                        <div id="template_type" style="margin-bottom:1em;">\
                                <!--\
                                <div class="clear"></div>\
                                <label for="template_type">Select VM type:</label>\
                                <input type="radio" id="kvm" name="template_type" value="kvm">KVM</input>\
                                <input type="radio" id="xen" name="template_type" value="xen">XEN</input>\
                                <div class="clear"></div>\
                                -->\
                                <p style="font-size:0.8em;text-align:right;"><i>'+
    tr("Fields marked with")+'<span style="display:inline-block;" class="ui-icon ui-icon-alert" />'+
    tr("are mandatory")+'</i><br />\
                                <a href="#" id="fold_unfold_vm_params"><u>'+tr("Fold / Unfold all sections")+'</u></a></p>\
                        </div>\
                          <!-- capacity section name, memory, cpu vcpu -->\
                          <div class="vm_section" id="capacity">\
                            <div class="show_hide" id="add_capacity_cb">\
                                  <h3>'+tr("Capacity options")+'</h3>\
                            </div>\
                          <fieldset><legend>'+tr("Capacity")+'</legend>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt">\
                            <label for="ostype">'+tr("OSType")+':</label>\
                            <select id="ostype" name="ostype">\
                                <option value="WINDOWS">'+tr("Windows")+'</option>\
                                <option value="CENTOS">'+tr("Linux Centos/Redhat")+'</option>\
                                <option value="UBUNTU">'+tr("Linux Ubuntu/Mint")+'</option>\
                                <option value="FEDORA">'+tr("Linux Fedora")+'</option>\
                                <option value="OPENSUSE">'+tr("Linux openSUSE")+'</option>\
                            </select>\
                            <div class="tip">'+tr("Select the OS Type for this image")+'</div>\
                            </div>\
                                <div class="vm_param kvm_opt xen_opt vmware_opt">\
                                  <label for="NAME">'+tr("Name")+':</label>\
                                  <input type="text" id="NAME" name="name"/>\
                                  <div class="tip">'+tr("Name that the VM will get for description purposes. If NAME is not supplied a name generated by one will be in the form of one-&lt;VID&gt;.")+'</div>\
                                </div>\
                            <div class="vm_param kvm xen vmware_opt">\
                                  <label for="MEMORY">'+tr("Memory")+':</label>\
				  <select id="MEMORY" name="memory">\
                                        <option value="1024">1G</option>\
                                        <option value="2048">2G</option>\
                                        <option value="4096">4G</option>\
                                        <option value="8192">8G</option>\
                                        <option value="16384">16G</option>\
                                        <option value="32768">32G</option>\
                                        <option value="49152">48G</option>\
                                        <option value="65536">64G</option>\
                                        <option value="131072">128G</option>\
                                  </select>\
                                  <div class="tip">'+tr("Amount of RAM required for the VM, in Megabytes.")+'</div>\
                            </div>\
                    <div class="vm_param kvm xen vmware">\
                                <label for="CPU">'+tr("CPU")+':</label>\
                                  <input type="text" id="CPU" name="cpu" value="1" size="2"/>\
                                  <div class="tip">'+tr("Percentage of CPU divided by 100 required for the Virtual Machine. Half a processor is written 0.5.")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt">\
                                  <label for="VCPU">'+tr("VCPU")+':</label>\
                                  <input type="text" id="VCPU" name="vcpu" value="1" size="3" />\
                                  <div class="tip">'+tr("Number of virtual cpus. This value is optional, the default hypervisor behavior is used, usually one virtual CPU.")+'</div>\
                            </div>\
                          </fieldset>\
                          </div>\
                          <!-- OS and Boot options\
                                arch, kernel, initrd, root, kernel_cmd, bootloader, boot\
                          -->\
                        <div class="vm_section" id="os_boot_opts">\
                            <div class="show_hide" id="add_os_boot_opts_cb">\
                            <h3>'+tr("Boot/OS options")+'<a id="add_os_boot_opts" class="icon_left" href="#"><span class="ui-icon ui-icon-plus" /></a></h3>\
                            </div>\
                          <fieldset><legend>'+tr("OS and Boot options")+'</legend>\
                                <div class="vm_param kvm vmware">\
                                  <label for="ARCH">'+tr("Architecture")+':</label>\
                                  <select id="ARCH" name="arch">\
                                        <option value="x86_64">x86_64</option>\
					<option value="i686">i686</option>\
                                  </select>\
                                  <div class="tip">'+tr("CPU architecture to virtualization")+'</div>\
                                </div>\
                                <!--xen necesita kernel o bootloader.\
                                Opciones de kernel son obligatorias si se activa kernel-->\
                                <div class="" id="kernel_bootloader">\
                                  <label>'+tr("Boot method")+':</label>\
                                  <select id="boot_method" name="boot_method">\
                                    <option id="no_boot" name="no_boot" value=""></option>\
                                    <option value="kernel">'+tr("Kernel")+'</option>\
                                    <option value="bootloader">'+tr("Bootloader")+'</option>\
                                  </select>\
                                  <div class="tip">'+tr("Select boot method")+'</div>\
                                </div>\
                            <div class="vm_param kvm_opt xen kernel">\
                                  <label for="KERNEL">'+tr("Kernel")+':</label>\
                                  <input type="text" id="KERNEL" name="kernel" />\
                                  <div class="tip">'+tr("Path to the OS kernel to boot the image")+'</div>\
                                </div>\
                            <div class="vm_param kvm xen kernel">\
                                  <label for="INITRD">'+tr("Initrd")+':</label>\
                                  <input type="text" id="INITRD" name="initrd"/>\
                                  <div class="tip">'+tr("Path to the initrd image")+'</div>\
                            </div>\
                            <div class="vm_param kvm xen kernel">\
                                  <label for="ROOT">'+tr("Root")+':</label>\
                                  <input type="text" id="ROOT" name="root"/>\
                                  <div class="tip">'+tr("Device to be mounted as root")+'</div>\
                            </div>\
                                <div class="vm_param kvm xen kernel">\
                                  <label for="KERNEL_CMD">'+tr("Kernel commands")+':</label>\
                                  <input type="text" id="KERNEL_CMD" name="kernel_cmd" />\
                                  <div class="tip">'+tr("Arguments for the booting kernel")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen bootloader">\
                                  <label for="BOOTLOADER">'+tr("Bootloader")+':</label>\
                                  <input type="text" id="BOOTLOADER" name="bootloader" />\
                                  <div class="tip">'+tr("Path to the bootloader executable")+'</div>\
                            </div>\
                            <div class="vm_param kvm">\
                                  <label for="BOOT">'+tr("Boot")+':</label>\
                                  <select id="BOOT" name="boot">\
                                  </select>\
                                  <div class="tip">'+tr("Boot device type")+'</div>\
                            </div>\
                            </fieldset>\
                          </div>\
\
\
            <!-- FEATURES SECTION pae,acpi-->\
              <div class="vm_section" id="features">\
                <div class="show_hide" id="add_features_cb">\
                    <h3>'+tr("Features")+'<a id="add_features" class="icon_left" href="#"><span class="ui-icon ui-icon-plus" /></a></h3>\
                </div>\
                <fieldset><legend>'+tr("Features")+'</legend>\
                <div class="vm_param kvm_opt xen_opt vmware_opt">\
                    <label for="PAE">'+tr("PAE")+':</label>\
                    <select id="PAE" name="PAE">\
                        <option value="">'+tr("Default")+'</option>\
                        <option value="yes">'+tr("Enable")+'</option>\
                        <option value="no">'+tr("Disable")+'</option>\
                    </select>\
                    <div class="tip">'+tr("Physical address extension mode allows 32-bit guests to address more than 4 GB of memory")+'</div>\
                </div>\
                <div class="vm_param kvm_opt xen_opt vmware_opt" style="display:none;">\
                    <label for="ACPI">'+tr("ACPI")+':</label>\
                    <select id="ACPI" name="ACPI">\
                        <option value="">'+tr("Default")+'</option>\
                        <option value="yes" selected >'+tr("Enable")+'</option>\
                        <option value="no">'+tr("Disable")+'</option>\
                    </select>\
                    <div class="tip">'+tr("Useful for power management, for example, normally required for graceful shutdown to work")+'</div>\
                </div>\
                </fieldset>\
              </div>\
\
\
                          <!--disks section using image or declaring\
                          image, image ID, target, driver\
                          type, source, size, format, clone, save,\
                          readonly  SEVERAL DISKS-->\
                          <div class="vm_section" id="disks">\
                                  <div class="show_hide" id="add_disks_cb">\
<h3>'+tr("Add disks/images")+' <a id="add_disks" class="icon_left" href="#"><span class="ui-icon ui-icon-plus" /></a></h3>\
                          </div>\
                          <fieldset><legend>'+tr("Disks")+'</legend>\
                             <div class="" id="image_vs_disk" style="display:none;">\
                                  <label>'+tr("Add disk/image")+'</label>\
                                  <input type="radio" id="add_disk" name="image_vs_disk" value="disk">'+tr("Disk")+'</input>\
                                  <!--<label for="add_disk">Add a disk</label>-->\
                                  <input type="radio" id="add_image" name="image_vs_disk" value="image">'+tr("Image")+'</input>\
                                  <!--<label for="add_image">Add an image</label>-->\
                             </div>\
                            <div class="clear"></div>\
                            <div class="vm_param kvm xen vmware add_image">\
                                  <label for="IMAGE">'+tr("Image")+':</label>\
                                  <select type="text" id="IMAGE" name="image">\
                                  </select>\
                                  <div class="tip">'+tr("Name of the image to use")+'</div>\
                                  <input type="hidden" id="IMAGE_UNAME" name="image_uname" value=""/>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt">\
                                  <label for="TARGET">'+tr("Target")+':</label>\
                                  <input type="text" id="TARGET" name="target"/>\
                                  <div class="tip">'+tr("Device to map image disk. If set, it will overwrite the default device mapping")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt">\
                                  <label for="DRIVER">'+tr("Driver")+':</label>\
                                  <input type="text" id="DRIVER" name="driver"/>\
                                  <div class="tip">'+tr("Specific image mapping driver. KVM: raw, qcow2. Xen:tap:aio:, file:. VMware unsupported")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt add_disk">\
                                  <label for="TYPE">'+tr("Type")+':</label>\
                                  <select id="TYPE" name="type">\
                                  </select>\
                                  <div class="tip">'+tr("Disk type")+'</div>\
                            </div>\
                            <div class="vm_param kvm xen vmware add_disk">\
                                  <label for="SOURCE">'+tr("Source")+':</label>\
                                  <input type="text" id="SOURCE" name="source" />\
                                  <div class="tip">'+tr("Disk file location path or URL")+'</div>\
                            </div>\
                            <div class="vm_param kvm xen vmware add_disk">\
                                  <label for="TM_MAD">'+tr("Transfer Manager")+':</label>\
                                  <input type="text" id="TM_MAD" name="tm_mad" />\
                                  <div class="tip">'+tr("shared,ssh,iscsi,dummy")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt add_disk ">\
                            <!--Mandatory for swap, fs and block images-->\
                                  <label for="SIZE">'+tr("Size")+':</label>\
                                  <input type="text" id="SIZE" name="size" />\
                                  <div class="tip">'+tr("Size in MB")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt add_disk ">\
                            <!--mandatory for fs images-->\
                                  <label for="FORMAT">'+tr("Format")+':</label>\
                                  <input type="text" id="FORMAT" name="format" />\
                                  <div class="tip">'+tr("Filesystem type for the fs images")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt add_disk">\
                                  <label for="CLONE">'+tr("Clone")+':</label>\
                                  <select id="CLONE" name="clone">\
                                        <option value="yes">'+tr("Yes")+'</option>\
                                        <option value="no">'+tr("No")+'</option>\
                                  </select>\
                                  <div class="tip">'+tr("Clone this image")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt add_disk">\
                                  <label for="SAVE">'+tr("Save")+':</label>\
                                   <select id="SAVE" name="save">\
                                        <option value="no">'+tr("No")+'</option>\
                                        <option value="yes">'+tr("Yes")+'</option>\
                                  </select>\
                                  <div class="tip">'+tr("Save this image after shutting down the VM")+'</div>\
                            </div>\
                                <div class="vm_param kvm_opt xen_opt vmware_opt add_disk">\
                                  <label for="READONLY">'+tr("Read only")+':</label>\
                                  <select id="READONLY" name="readonly">\
                                    <option value="no">'+tr("No")+'</option>\
                                    <option value="yes">'+tr("Yes")+'</option>\
                                  </select>\
                                  <div class="tip">'+tr("Mount image as read-only")+'</div>\
                            </div>\
                            <div class="">\
                                        <button class="add_remove_button add_button" id="add_disk_button" value="add_disk">'+tr("Add")+'</button>\
                                        <button class="add_remove_button" id="remove_disk_button" value="remove_disk">'+tr("Remove selected")+'</button>\
                                        <div class="clear"></div>\
                                        <label style="" for="disks_box">'+tr("Current disks")+':</label>\
                                        <select id="disks_box" name="disks_box" style="height:100px;width:350px" multiple>\
                                        </select>\
                                        <div class="clear"></div>\
                                        </div>\
                          </fieldset>\
                          </div>\
\
                          <!-- network section  network, network id,, ip, mac,\
                          bridge, target,  script, model -->\
                          <div class="vm_section" id="networks">\
                            <div class="show_hide" id="add_networks_cb">\
                              <h3>'+tr("Setup Networks")+' <a id="add_networks" class="icon_left" href="#"><span class="ui-icon ui-icon-plus" /></a></h3>\
                            </div>\
                          <fieldset><legend>'+tr("Network")+'</legend>\
                            <div class="" id="network_vs_niccfg" style="display:none;">\
                                  <label>'+tr("Add network")+'</label>\
                                  <input type="radio" id="add_network" name="network_vs_niccfg" value="network">'+tr("Predefined")+'</input>\
                                  <!--<label style="width:200px;" for="add_network">Pre-defined network</label>-->\
                                  <input type="radio" id="add_niccfg" name="network_vs_niccfg" value="niccfg">'+tr("Manual")+'</input>\
                                  <!--<label for="add_niccfg">Manual network</label>-->\
                                  <!--<div class="tip"></div>-->\
                            </div>\
                            <div class="clear"></div>\
                            <div class="vm_param kvm xen vmware network">\
                                  <label for="NETWORK">'+tr("Network")+':</label>\
                                  <select type="text" id="NETWORK" name="network">\
                                  </select>\
                                  <div class="tip">'+tr("Name of the network to attach this device")+'</div>\
                                  <input type="hidden" id="NETWORK_UNAME" name="network_uname" value=""/>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt niccfg network">\
                                  <label for="IP">'+tr("IP")+':</label>\
                                  <input type="text" id="IP" name="ip" />\
                                  <div class="tip">'+tr("Request an specific IP from the Network")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt niccfg">\
                                  <label for="MAC">'+tr("MAC")+':</label>\
                                  <input type="text" id="MAC" name="mac" />\
                                  <div class="tip">'+tr("HW address associated with the network interface")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt niccfg">\
                                  <label for="BRIDGE">'+tr("Bridge")+'</label>\
                                  <input type="text" id="BRIDGE" name="bridge" />\
                                  <div class="tip">'+tr("Name of the bridge the network device is going to be attached to")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt vmware_opt niccfg">\
                                  <label for="TARGET">'+tr("Target")+':</label>\
                                  <input type="text" id="TARGET" name="nic_target" />\
                                  <div class="tip">'+tr("Name for the tun device created for the VM")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt vmware_opt niccfg">\
                                  <label for="SCRIPT">'+tr("Script")+':</label>\
                                  <input type="text" id="SCRIPT" name="script" />\
                                  <div class="tip">'+tr("Name of a shell script to be executed after creating the tun device for the VM")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt niccfg network">\
                                  <!----<label for="MODEL">'+tr("Model")+':</label>----->\
                                  <input type="text" id="MODEL" name="model" value="virtio" style="display:none;"/>\
                                  <!----<div class="tip">'+tr("Hardware that will emulate this network interface. With Xen this is the type attribute of the vif.")+'</div>---->\
                            </div>\
                            <div class="firewall_select">\
                                  <label for="black_white_tcp">'+tr("TCP firewall mode")+':</label>\
                                  <select name="black_white_tcp" id="black_white_tcp">\
                                       <option value="">'+tr("Optional, please select")+'</option>\
                                       <option value="whitelist">'+tr("Port whitelist")+'</option>\
                                       <option value="blacklist">'+tr("Port blacklist")+'</option>\
                                  </select>\
                            </div>\
                            <div class="clear"></div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt firewall">\
                                  <label for="white_ports_tcp">'+tr("TCP white ports")+':</label>\
                                  <input type="text" id="WHITE_PORTS_TCP" name="white_ports_tcp" />\
                                  <div class="tip">'+tr("Permits access to the VM only through the specified ports in the TCP protocol")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt firewall">\
                                  <label for="black_ports_tcp">'+tr("TCP black ports")+'</label>\
                                  <input type="text" id="BLACK_PORTS_TCP" name="black_ports_tcp" />\
                                  <div class="tip">'+tr("Disallow access to the VM through the specified ports in the TCP protocol")+'</div>\
                            </div>\
                            <div class="firewall_select">\
                                  <label for="black_white_udp">'+tr("UDP firewall mode")+':</label>\
                                  <select name="black_white_udp" id="black_white_udp">\
                                       <option value="">'+tr("Optional, please select")+'</option>\
                                       <option value="whitelist">'+tr("Port whitelist")+'</option>\
                                       <option value="blacklist">'+tr("Port blacklist")+'</option>\
                                  </select>\
                            </div>\
                            <div class="clear"></div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt firewall">\
                                  <label for="white_ports_udp">'+tr("UDP white ports")+':</label>\
                                  <input type="text" id="WHITE_PORTS_UDP" name="white_ports_udp" />\
                                  <div class="tip">'+tr("Permits access to the VM only through the specified ports in the UDP protocol")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt firewall">\
                                  <label for="black_ports_udp">'+tr("UDP black ports")+':</label>\
                                  <input type="text" id="BLACK_PORTS_UDP" name="black_ports_udp" />\
                                  <div class="tip">'+tr("Disallow access to the VM through the specified ports in the UDP protocol")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt niccfg network">\
                                  <label for="icmp">'+tr("ICMP")+':</label>\
                                  <select name="icmp" id="ICMP">\
                                      <option value="" selected="selected">'+tr("Accept (default)")+'</option>\
                                      <option value="drop">'+tr("Drop")+'</option>\
                                  </select>\
                                  <div class="tip">'+tr("ICMP policy")+'</div>\
                            </div>\
                            <div class="clear"></div>\
                            <div class="">\
                                <button class="add_remove_button add_button" id="add_nic_button" value="add_nic">'+tr("Add")+'</button>\
                                <button class="add_remove_button" id="remove_nic_button" value="remove_nic">'+tr("Remove selected")+'</button>\
                                <div class="clear"></div>\
                                <label for="nics_box">'+tr("Current NICs")+':</label>\
                                <select id="nics_box" name="nics_box" style="height:100px;width:350px" multiple>\
                                </select>\
                            </div>\
                          </fieldset>\
                          </div>\
\
\
                          <!--Input several type, bus-->\
                          <div class="vm_section" id="inputs">\
                                <div class="show_hide" id="add_inputs_cb">\
                                  <h3>'+tr("Add inputs")+' <a id="add_inputs" class="icon_left" href="#"><span class="ui-icon ui-icon-plus" /></a></h3>\
                            </div>\
                          <fieldset><legend>'+tr("Inputs")+'</legend>\
                                <div class="vm_param kvm_opt">\
                                  <label for="TYPE">'+tr("Type")+':</label>\
                                  <select id="TYPE" name="input_type">\
                                        <option value="tablet">'+tr("Tablet")+'</option>\
					 <option value="mouse">'+tr("Mouse")+'</option>\
                                  </select>\
                                  <div class="tip"></div>\
                            </div>\
                            <div class="vm_param kvm_opt">\
                                   <label for="BUS">'+tr("Bus")+':</label>\
                                  <select id="BUS" name="input_bus">\
                                        <option value="usb">'+tr("USB")+'</option>\
                                        <option value="ps2">'+tr("PS2")+'</option>\
                                        <option value="xen">'+tr("XEN")+'</option>\
                                  </select>\
                                  <div class="tip"></div>\
                            </div>\
                            <div class="">\
                                        <button class="add_remove_button add_button" id="add_input_button" value="add_input" class="kvm_opt">'+tr("Add")+'</button>\
                                        <button class="add_remove_button" id="remove_input_button" value="remove_input" class="kvm_opt">'+tr("Remove selected")+'</button>\
                                        <div class="clear"></div>\
                                        <label for="inputs_box">'+tr("Current inputs")+':</label>\
                                        <select id="inputs_box" name="inputs_box" style="height:100px;" multiple>\
                                        </select>\
                                        </div>\
                          </fieldset>\
                          </div>\
\
\
                          <!--graphics type, listen, port, passwd, keymap -->\
                          <div class="vm_section" id="graphics">\
                                <div class="show_hide" id="add_graphics_cb">\
                                  <h3>'+tr("Add Graphics")+' <a id="add_graphics" class="icon_left" href="#"><span class="ui-icon ui-icon-plus" /></a></h3>\
                            </div>\
                          <fieldset><legend>'+tr("Graphics")+'</legend>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt">\
                                  <label for="TYPE">'+tr("Graphics type")+':</label>\
                                  <select id="TYPE" name="">\
                    <option value="">'+tr("Please select")+'</option>\
                                        <option id="vnc" value="vnc">'+tr("VNC")+'</option>\
                                    <!-- <option value="sdl">'+tr("SDL")+'</option> -->\
 					<option id="spice" value="spice">'+tr("SPICE")+'</option>\
                                  </select>\
                                  <div class="tip">'+tr("VMware supports VNC only")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt">\
                                  <label for="LISTEN">'+tr("Listen IP")+':</label>\
                                  <input type="text" id="LISTEN" name="graphics_ip"/>\
                                  <div class="tip">'+tr("IP to listen on")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt">\
                                  <label for="PORT">'+tr("Port")+':</label>\
                                  <input type="text" id="PORT" name="port" />\
                                  <div class="tip">'+tr("Port for the VNC server")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt">\
                                  <label for="PASSWD">'+tr("Password")+':</label>\
                                  <input type="text" id="PASSWD" name="graphics_pw" value="12333678"/>\
                                  <div class="tip">'+tr("Password for the VNC server")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt">\
                                  <label for="KEYMAP">'+tr("Keymap")+'</label>\
                                  <input type="text" id="KEYMAP" name="keymap" />\
                                  <div class="tip">'+tr("Keyboard configuration locale to use in the VNC display")+'</div>\
                            </div>\
                          </fieldset>\
                          </div>\
\
\
                          <!--context textarea? -->\
                          <div class="vm_section" id="context">\
                                <div class="show_hide" id="add_context_cb">\
                                  <h3>'+tr("Add context variables")+' <a id="add_context" class="icon_left" href="#"><span class="ui-icon ui-icon-plus" /></a></h3>\
                            </div>\
                          <fieldset><legend>'+tr("Context")+'</legend>\
              <div class="vm_param kvm_opt xen_opt vmware_opt">\
                    <label for="var_name">'+tr("Name")+':</label>\
                    <input type="text" id="var_name" name="var_name" />\
                    <div class="tip">'+tr("Name for the context variable")+'</div>\
              </div>\
              <div class="vm_param kvm_opt xen_opt">\
                    <label for="var_value">'+tr("Value")+':</label>\
                    <input type="text" id="var_value" name="var_value" />\
                    <div class="tip">'+tr("Value of the context variable")+'</div>\
              </div>\
              <div class="">\
                    <button class="add_remove_button add_button" id="add_context_button" value="add_context">'+tr("Add")+'</button>\
                    <button class="add_remove_button" id="remove_context_button" value="remove_input">'+tr("Remove selected")+'</button>\
                    <div class="clear"></div>\
                    <label for="context_box">'+tr("Current variables")+':</label>\
                    <select id="context_box" name="context_box" style="height:100px;" multiple>\
                    </select>\
              </div>\
              </fieldset>\
              </div>\
\
\
                          <!--placement requirements rank -->\
                          <div class="vm_section" id="placement" style="display:none;">\
                           <div class="show_hide" id="add_placement_cb">\
                              <h3>'+tr("Add placement options")+' <a id="add_placement" class="icon_left" href="#"><span class="ui-icon ui-icon-plus" /></a></h3>\
                           </div>\
                          <fieldset><legend>'+tr("Placement")+'</legend>\
                    <div class="vm_param kvm_opt xen_opt vmware_opt">\
                                  <label for="REQUIREMENTS">'+tr("Requirements")+':</label>\
                                  <input type="text" id="REQUIREMENTS" name="requirements" />\
                                  <div class="tip">'+tr("Boolean expression that rules out provisioning hosts from list of machines suitable to run this VM")+'</div>\
                            </div>\
                            <div class="vm_param kvm_opt xen_opt vmware_opt">\
                                  <label for="RANK">'+tr("Rank")+':</label>\
                                  <input type="text" id="RANK" name="rank" />\
                                  <div class="tip">'+tr("This field sets which attribute will be used to sort the suitable hosts for this VM. Basically, it defines which hosts are more suitable than others")+'</div>\
                            </div>\
                          </fieldset>\
                          </div>\
\
\
                          <!--raw type=> set to current, data -->\
                          <div class="vm_section" id="raw" style="display:none;">\
                                <div class="show_hide" id="add_raw_cb">\
                                <h3>'+tr("Add Hypervisor raw options")+' <a id="add_raw" class="icon_left" href="#"><span class="ui-icon ui-icon-plus" /></a></h3>\
                            </div>\
                          <fieldset><legend>'+tr("Raw")+'</legend>\
                          <!--set TYPE to current xen/kvm -->\
                                <div class="vm_param kvm_opt xen_opt vmware_opt">\
                                  <label for="DATA">'+tr("Data")+':</label>\
                                  <input type="hidden" id="TYPE" name="type" />\
                                  <input type="text" id="DATA" name="data" />\
                                  <div class="tip">'+tr("Raw data to be passed directly to the hypervisor")+'</div>\
                            </div>\
                          </fieldset>\
                          </div>\
\
\
              <!--custom variables -->\
                          <div class="vm_section" id="custom_var" style="display:none;">\
                                <div class="show_hide" id="add_context_cb">\
                                  <h3>'+tr("Add custom variables")+' <a id="add_custom_var" class="icon_left" href="#"><span class="ui-icon ui-icon-plus" /></a></h3>\
                            </div>\
                          <fieldset><legend>'+tr("Custom variables")+'</legend>\
              <div class="vm_param kvm_opt xen_opt vmware_opt">\
                    <label for="custom_var_name">'+tr("Name")+':</label>\
                    <input type="text" id="custom_var_name" name="custom_var_name" />\
                    <div class="tip">'+tr("Name for the custom variable")+'</div>\
              </div>\
              <div class="vm_param kvm_opt xen_opt vmware_opt">\
                    <label for="custom_var_value">'+tr("Value")+':</label>\
                    <input type="text" id="custom_var_value" name="custom_var_value" />\
                    <div class="tip">'+tr("Value of the custom variable")+'</div>\
              </div>\
              <div class="">\
                    <button class="add_remove_button add_button" id="add_custom_var_button" value="add_custom_var">'+tr("Add")+'</button>\
                    <button class="add_remove_button" id="remove_custom_var_button" value="remove_custom_var">'+tr("Remove selected")+'</button>\
                    <div class="clear"></div>\
                    <label for="custom_var_box">'+tr("Current variables")+':</label>\
                    <select id="custom_var_box" name="custom_var_box" style="height:100px;" multiple>\
                    </select>\
              </div>\
              </fieldset>\
              </div>\
              <!-- submit -->\
           <fieldset>\
             <div class="form_buttons">\
               <button class="button" id="create_template_form_easy" value="OpenNebula.Template.create">\
                  '+tr("Create")+'\
               </button>\
               <button class="button" id="reset_template_form" type="reset" value="reset">'+tr("Reset")+'</button>\
             </div>\
           </fieldset>\
        </form>\
        </div><!--easy mode -->\
        <div id="manual">\
                <form>\
                <h3 style="margin-bottom:10px;">'+tr("Write the Virtual Machine template here")+'</h3>\
                  <fieldset style="border-top:none;">\
                        <textarea id="textarea_vm_template" style="width:100%; height:15em;"></textarea>\
                        <div class="clear"></div>\
                  </fieldset>\
                  <fieldset>\
                        <div class="form_buttons">\
                          <button class="button" id="create_template_form_manual" value="OpenNebula.Template.create">\
                          '+tr("Create")+'\
                          </button>\
                        <button class="button" type="reset" value="reset">'+tr("Reset")+'</button>\
                        </div>\
                  </fieldset>\
                </form>\
        </div>\
</div>';

var update_template_tmpl =
   '<form action="javascript:alert(\'js error!\');">\
         <h3 style="margin-bottom:10px;">'+tr("Please, choose and modify the template you want to update")+':</h3>\
            <fieldset style="border-top:none;">\
                 <label for="template_template_update_select">'+tr("Select a template")+':</label>\
                 <select id="template_template_update_select" name="template_template_update_select"></select>\
                 <div class="clear"></div>\
                 <div>\
                   <table class="permissions_table" style="padding:0 10px;">\
                     <thead><tr>\
                         <td style="width:130px">'+tr("Permissions")+':</td>\
                         <td style="width:40px;text-align:center;">'+tr("Use")+'</td>\
                         <td style="width:40px;text-align:center;">'+tr("Manage")+'</td>\
                         <td style="width:40px;text-align:center;">'+tr("Admin")+'</td></tr></thead>\
                     <tr>\
                         <td>'+tr("Owner")+'</td>\
                         <td style="text-align:center"><input type="checkbox" name="template_owner_u" class="owner_u" /></td>\
                         <td style="text-align:center"><input type="checkbox" name="template_owner_m" class="owner_m" /></td>\
                         <td style="text-align:center"><input type="checkbox" name="template_owner_a" class="owner_a" /></td>\
                     </tr>\
                     <tr>\
                         <td>'+tr("Group")+'</td>\
                         <td style="text-align:center"><input type="checkbox" name="template_group_u" class="group_u" /></td>\
                         <td style="text-align:center"><input type="checkbox" name="template_group_m" class="group_m" /></td>\
                         <td style="text-align:center"><input type="checkbox" name="template_group_a" class="group_a" /></td>\
                     </tr>\
                     <tr>\
                         <td>'+tr("Other")+'</td>\
                         <td style="text-align:center"><input type="checkbox" name="template_other_u" class="other_u" /></td>\
                         <td style="text-align:center"><input type="checkbox" name="template_other_m" class="other_m" /></td>\
                         <td style="text-align:center"><input type="checkbox" name="template_other_a" class="other_a" /></td>\
                     </tr>\
                   </table>\
                 </div>\
                 <label for="template_template_update_textarea">'+tr("Template")+':</label>\
                 <div class="clear"></div>\
                 <textarea id="template_template_update_textarea" style="width:100%; height:14em;"></textarea>\
            </fieldset>\
            <fieldset>\
                 <div class="form_buttons">\
                    <button class="button" id="template_template_update_button" value="Template.update_template">\
                       '+tr("Update")+'\
                    </button>\
                 </div>\
            </fieldset>\
</form>';

var dataTable_templates;
var $create_template_dialog;

var template_actions = {

    "Template.create" : {
        type: "create",
        call: OpenNebula.Template.create,
        callback: addTemplateElement,
        error: onError,
        notify:true
    },

    "Template.create_dialog" : {
        type: "custom",
        call: popUpCreateTemplateDialog
    },

    "Template.list" : {
        type: "list",
        call: OpenNebula.Template.list,
        callback: updateTemplatesView,
        error: onError
    },

    "Template.show" : {
        type : "single",
        call: OpenNebula.Template.show,
        callback: updateTemplateElement,
        error: onError
    },

    "Template.showinfo" : {
        type: "single",
        call: OpenNebula.Template.show,
        callback: updateTemplateInfo,
        error: onError
    },

    "Template.refresh" : {
        type: "custom",
        call: function () {
            waitingNodes(dataTable_templates);
            Sunstone.runAction("Template.list");
        }
    },

    "Template.autorefresh" : {
        type: "custom",
        call: function() {
            OpenNebula.Template.list({timeout: true, success: updateTemplatesView, error: onError});
        }
    },

    "Template.update_dialog" : {
        type: "custom",
        call: popUpTemplateTemplateUpdateDialog
    },

    "Template.update" : {
        type: "single",
        call: OpenNebula.Template.update,
        callback: function() {
            notifyMessage(tr("Template updated correctly"));
        },
        error: onError
    },

    "Template.fetch_template" : {
        type: "single",
        call: OpenNebula.Template.fetch_template,
        callback: function (request,response) {
            $('#template_template_update_dialog #template_template_update_textarea').val(response.template);
        },
        error: onError
    },

    "Template.fetch_permissions" : {
        type: "single",
        call: OpenNebula.Template.show,
        callback: function(request,template_json){
            var dialog = $('#template_template_update_dialog form');
            var template = template_json.VMTEMPLATE;
            setPermissionsTable(template,dialog);
        },
        error: onError
    },

    "Template.delete" : {
        type: "multiple",
        call: OpenNebula.Template.del,
        callback: deleteTemplateElement,
        elements: templateElements,
        error: onError,
        notify: true
    },

    "Template.instantiate" : {
        type: "single",
        call: OpenNebula.Template.instantiate,
        error: onError,
        notify: true
    },

     "Template.instantiate_vms" : {
         type: "custom",
         call: function(){
             nodes = getSelectedNodes(dataTable_templates);
             $.each(nodes,function(){
                 Sunstone.runAction("Template.instantiate",this,"");
             });
             Sunstone.runAction("VM.refresh");
         }
     },
    "Template.chown" : {
        type: "multiple",
        call: OpenNebula.Template.chown,
        callback: templateShow,
        elements: templateElements,
        error:onError,
        notify: true
    },
    "Template.chgrp" : {
        type: "multiple",
        call: OpenNebula.Template.chgrp,
        callback:  templateShow,
        elements: templateElements,
        error:onError,
        notify: true
    },
    "Template.chmod" : {
        type: "single",
        call: OpenNebula.Template.chmod,
        error: onError,
        notify: true
    },
    "Template.clone_dialog" : {
        type: "custom",
        call: popUpTemplateCloneDialog
    },
    "Template.clone" : {
        type: "single",
        call: OpenNebula.Template.clone,
        error: onError,
        notify: true
    },
    "Template.help" : {
        type: "custom",
        call: function() {
            hideDialog();
            $('div#templates_tab div.legend_div').slideToggle();
        }
    }
}

var template_buttons = {
    "Template.refresh" : {
        type: "action",
        text: '<i class="icon-refresh icon-large"></i> <br/> <span class="top-button-font">' +tr("Refresh")+'</span>',
        alwaysActive: true
    },
    "Template.create_dialog" : {
        type: "create_dialog",
        text: '<i class="icon-plus icon-large"></i> <br/> <span class="top-button-font">' +tr("New")+'</span>'
    },
    "Template.update_dialog" : {
        type: "action",
        text: '<i class="icon-edit icon-large"></i> <br/> <span class="top-button-font">' +tr("Update properties")+'</span>',
    },
/*    "Template.instantiate_vms" : {
        type: "action",
        text: '<i class="icon-cloud icon-large"></i> <br/> <span class="top-button-font">' +tr("Instantiate")+'</span>',
    },*/

    "action_list" : {
        type: "select",
        actions: {

    "Template.chown" : {
        type: "confirm_with_select",
        text: tr("Change owner"),
        select: users_sel,
        tip: tr("Select the new owner")+":",
        condition: mustBeAdmin
    },
    "Template.chgrp" : {
        type: "confirm_with_select",
        text: tr("Change group"),
        select: groups_sel,
        tip: tr("Select the new group")+":",
        condition: mustBeAdmin
    },
    "Template.clone_dialog" : {
        type: "action",
        text: tr("Clone")
    },
}
},

    "Template.delete" : {
        type: "confirm",
        text: '<i class="icon-trash icon-large"></i> <br/> <span class="top-button-font">' +tr("Delete")+'</span>',
    },

    "Template.help" : {
        type: "action",
        text: '<i class="icon-question-sign icon-large"></i> <br/> <span class="top-button-font">'+tr("Help")+'</span>',
        alwaysActive: true
    }
}

var template_info_panel = {
    "template_info_tab" : {
        title: tr("Template information"),
        content: ""
    }
}

var templates_tab = {
    title: tr("Templates"),
    content: templates_tab_content,
    buttons: template_buttons,
    tabClass: 'subTab'
//    parentTab: 'vres_tab'
}

Sunstone.addActions(template_actions);
Sunstone.addMainTab('templates_tab',templates_tab);
Sunstone.addInfoPanel('template_info_panel',template_info_panel);

//Returns selected elements in the template table
function templateElements(){
    return getSelectedNodes(dataTable_templates);
}

//Runs a show action on the template with from a prev request
function templateShow(req){
    Sunstone.runAction("Template.show",req.request.data[0][0]);
}

// Returns an array containing the values of the template_json and ready
// to be inserted in the dataTable
function templateElementArray(template_json){
    var template = template_json.VMTEMPLATE;
    return [
        '<input class="check_item" type="checkbox" id="template_'+template.ID+'" name="selected_items" value="'+template.ID+'"/>',
        template.ID,
        template.UNAME,
        template.GNAME,
        template.NAME,
        pretty_time(template.REGTIME)
    ];
}

//Updates the select input field with an option for each template
function updateTemplateSelect(){
    var templates_select =
        makeSelectOptions(dataTable_templates,
                          1,//id_col
                          4,//name_col
                          [],//status_cols
                          []//bad status values
                         );

    //update static selectors:
    $('#template_id', $create_vm_dialog).html(templates_select);
}

// Callback to update an element in the dataTable
function updateTemplateElement(request, template_json){
    var id = template_json.VMTEMPLATE.ID;
    var element = templateElementArray(template_json);
    updateSingleElement(element,dataTable_templates,'#template_'+id);
    updateTemplateSelect();
}

// Callback to remove an element from the dataTable
function deleteTemplateElement(req){
    deleteElement(dataTable_templates,'#template_'+req.request.data);
    updateTemplateSelect();
}

// Callback to add a template element
function addTemplateElement(request, template_json){
    var element = templateElementArray(template_json);
    addElement(element,dataTable_templates);
    updateTemplateSelect();
}

// Callback to refresh the list of templates
function updateTemplatesView(request, templates_list){
    var template_list_array = [];

    $.each(templates_list,function(){
       template_list_array.push(templateElementArray(this));
    });

    updateView(template_list_array,dataTable_templates);
    updateTemplateSelect();
    updateVResDashboard("templates",templates_list);
}

// Callback to update the information panel tabs and pop it up
function updateTemplateInfo(request,template){
    var template_info = template.VMTEMPLATE;
    var info_tab = {
        title: tr("Information"),
        content:
        '<table id="info_template_table" class="info_table" style="width:80%">\
           <thead>\
             <tr><th colspan="2">'+tr("Template")+' \"'+template_info.NAME+'\" '+
            tr("information")+'</th></tr>\
           </thead>\
           <tr>\
             <td class="key_td">'+tr("ID")+'</td>\
             <td class="value_td">'+template_info.ID+'</td>\
           </tr>\
           <tr>\
             <td class="key_td">'+tr("Name")+'</td>\
             <td class="value_td">'+template_info.NAME+'</td>\
           </tr>\
           <tr>\
             <td class="key_td">'+tr("Owner")+'</td>\
             <td class="value_td">'+template_info.UNAME+'</td>\
           </tr>\
           <tr>\
             <td class="key_td">'+tr("Group")+'</td>\
             <td class="value_td">'+template_info.GNAME+'</td>\
           </tr>\
           <tr>\
             <td class="key_td">'+tr("Register time")+'</td>\
             <td class="value_td">'+pretty_time(template_info.REGTIME)+'</td>\
           </tr>\
           <tr><td class="key_td">'+tr("Permissions")+'</td><td></td></tr>\
           <tr>\
             <td class="key_td">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+tr("Owner")+'</td>\
             <td class="value_td" style="font-family:monospace;">'+ownerPermStr(template_info)+'</td>\
           </tr>\
           <tr>\
             <td class="key_td">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+tr("Group")+'</td>\
             <td class="value_td" style="font-family:monospace;">'+groupPermStr(template_info)+'</td>\
           </tr>\
           <tr>\
             <td class="key_td"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+tr("Other")+'</td>\
             <td class="value_td" style="font-family:monospace;">'+otherPermStr(template_info)+'</td>\
           </tr>\
         </table>'
    };
    var template_tab = {
        title: tr("Template"),
        content: '<table id="template_template_table" class="info_table" style="width:80%">\
        <thead><tr><th colspan="2">'+tr("Template")+'</th></tr></thead>'+
        prettyPrintJSON(template_info.TEMPLATE)+
        '</table>'
    };


    Sunstone.updateInfoPanelTab("template_info_panel","template_info_tab",info_tab);
    Sunstone.updateInfoPanelTab("template_info_panel","template_template_tab",template_tab);

    Sunstone.popUpInfoPanel("template_info_panel");
}

// Prepare the template creation dialog
function setupCreateTemplateDialog(){
 //Helper functions for the dialog operations

    // Called when changing tabs. Since we use the same form for both
    // KVM, XEN and others we need to do some operation to update it
    var vmTabChange = function(event,ui){
        // ui.tab     // anchor element of the selected (clicked) tab
        // ui.panel   // element, that contains the selected/clicked tab contents
        // ui.index   // zero-based index of the selected (clicked) tab

        //disable all items
        $(items,dialog).attr('disabled','disabled');
        //hide all mandatory icons
        $('.vm_param .man_icon',dialog).css("display","none");

        //empty selects
        $('select#BOOT',section_os_boot).empty();
        $('select#TYPE',section_disks).empty();

        //hide options about boot method
        $('div#kernel_bootloader',section_os_boot).show();
        $('.kernel, .bootloader', section_os_boot).hide();
        $('select#BOOT',section_os_boot).parent().hide();
        //unselect boot method
        $('select#boot_method option',section_os_boot).removeAttr('selected');

        //hide non common sections
        $(section_inputs).hide();
        $(section_features).hide();
        switch(ui.index){
        case 0:
            enable_kvm();
            break;
        case 1:
            enable_xen();
            break;
        case 2:
            enable_vmware();
        case 3:
            break;
        }
        //hide_disabled();
        //show_enabled();
    }

    //~ var hide_disabled = function(context) {
        //~ var $disabled;
        //~ if (!context) {
            //~ $disabled = $('.vm_param input:disabled,.vm_param select:disabled');
        //~ } else {
            //~ $disabled = $('.vm_param input:disabled,.vm_param select:disabled',context);
        //~ }
        //~
        //~ $disabled.each(function(){
            //~ $(this).parent('.vm_param').hide();
        //~ });
    //~ }
    //~
    //~ var show_enabled = function(context){
        //~ var $enabled;
        //~ if (!context) {
            //~ $enabled = $('.vm_param input:enabled,.vm_param select:enabled');
        //~ } else {
            //~ $enabled = $('.vm_param input:enabled,.vm_param select:enabled',context);
        //~ }
        //~
        //~ $enabled.parent('.vm_param').show();
    //~ }

    //Using kvm wizard.
    var enable_kvm = function(){
        man_class="kvm";
        opt_class="kvm_opt";
        $(kvm_items,dialog).removeAttr('disabled');
        $('.kvm .man_icon',dialog).css("display","inline-block");

        //KVM particularities:
        // * Add custom disk types
        // * Add custom boot options
        // * Show boot options
        // * Set the raw type to kvm
        // * Show the inputs and graphics section

        var type_opts =
            '<option id="no_type" value="" selected="selected">'+tr("None")+'</option>\
             <option value="disk">'+tr("Disk")+'</option>\
             <option value="floppy">'+tr("Floppy")+'</option>\
             <option value="cdrom">'+tr("CD-ROM")+'</option>\
             <option value="swap">'+tr("Swap")+'</option>\
             <option value="fs">'+tr("FS")+'</option>\
             <option value="block">'+tr("Block")+'</option>';

        $('select#TYPE',section_disks).html(type_opts);

        var boot_opts =
            '<option value="hd">'+tr("hd")+'</option>\
            <option value="fd">'+tr("fd")+'</option>\
            <option value="cdrom">'+tr("cdrom")+'</option>\
            <option value="network">'+tr("network")+'</option>';

        $('select#BOOT',section_os_boot).html(boot_opts);
        $('select#BOOT',section_os_boot).parent().show();
        $('select#boot_method option#no_boot',section_os_boot).html(tr("Driver default"));

        $('input#TYPE', section_raw).val("kvm");

//        $(section_inputs).show();
    };

    // Using XEN wizard.
    var enable_xen = function(){
        man_class="xen";
        opt_class="xen_opt";
        $(xen_items,dialog).removeAttr('disabled');
        $('.xen .man_icon',dialog).css("display","inline-block");

        // XEN particularities:
        // * Add custom disk types
        // * Remove driver default boot method
        // * Set the raw section to XEN
        // * Show the graphics section

        var type_opts =
            '<option value="disk">'+tr("Disk")+'</option>\
             <option value="floppy">'+tr("Floppy")+'</option>\
             <option value="cdrom">'+tr("CD-ROM")+'</option>\
             <option value="swap">'+tr("Swap")+'</option>\
             <option value="fs">'+tr("FS")+'</option>\
             <option value="block">'+tr("Block")+'</option>';

        $('select#TYPE',section_disks).html(type_opts);

        $('select#boot_method option#no_boot',section_os_boot).html(tr("Please choose"));

        $('input#TYPE', section_raw).val("xen");
    };

    //VMWare wizard
    var enable_vmware = function() {
        man_class="vmware";
        opt_class="vmware_opt";
        $(vmware_items,dialog).removeAttr('disabled');
        $('.vmware .man_icon',dialog).css("display","inline-block");

        //VMWARE particularities
        // * Add custom disk types
        // * Hide boot method field
        // * Set the raw type to vmware

        var type_opts =
            '<option value="file" selected="selected">'+tr("File")+'</option>\
             <option value="cdrom">'+tr("CD-ROM")+'</option>\
             <option value="block">'+tr("Block")+'</option>';

        $('select#TYPE',section_disks).html(type_opts);

        $('div#kernel_bootloader',section_os_boot).hide();

        $('input#TYPE', section_raw).val("vmware");
    };

    //This function checks that all mandatory items within a section
    //have some value. Returns true if so, false if not.
    var mandatory_filter = function(context){
        var man_items = "."+man_class;

        //find enabled mandatory items in this context
        man_items = $(man_items+' input:visible, '+man_items+' select:visible',context);
        var r = true;

        //we fail it the item is enabled and has no value
        $.each(man_items,function(){
            var item = $(this);
            if (item.parents(".vm_param").attr('disabled') ||
                !(item.val().length)) {
                r = false;
                return false;
            };
        });
        return r;
    };

    //Adds an option element to a multiple select box. Before doing so,
    //it checks that the desired filter is passed
    var box_add_element = function(context,box_tag,filter){
        var value="";
        var params= $('.vm_param',context);
        var inputs= $('input:enabled',params);
        var selects = $('select:enabled',params);
        var fields = $.merge(inputs,selects);

        //are fields passing the filter?
        var result = filter();
        if (!result) {
            notifyError(tr("There are mandatory parameters missing in this section"));
            return false;
        }

        value={};

        //With each enabled field we form a JSON object
        var id = null;
        $.each(fields,function(){
            var field = $(this);
            if (!(field.parents(".vm_param").attr('disabled')) &&
                field.val().length){
                //Pick up parents ID if we do not have one
                id = field.attr('id').length ? field.attr('id') : field.parent().attr('id');
                value[id] = field.val();
            };
        });
        var value_string = JSON.stringify(value);
        var option=
            '<option value=\''+value_string+'\'>'+
            stringJSON(value)+
            '</option>';
        $('select'+box_tag,context).append(option);
        return false;
    };

    //Removes selected elements from a multiple select box
    var box_remove_element = function(section_tag,box_tag){
        var context = $(section_tag,dialog);
        $('select'+box_tag+' :selected',context).remove();
        return false;
    };

    //Given the JSON of a VM template (or of a section of it), it crawls
    //the fields of certain section (context) and add their name and
    //values to the template JSON.
    var addSectionJSON = function(template_json,context){
        var params= $('.vm_param',context);
        var inputs= $('input:enabled',params);
        var selects = $('select:enabled',params);
        var fields = $.merge(inputs,selects);

        fields.each(function(){
            var field=$(this);
            if (!(field.parents(".vm_param").attr('disabled'))){ //if ! disabled
                if (field.val().length){ //if has a length
                    template_json[field.attr('id')]=field.val();
                };
            };
        });
    };

    // Given a section (context) and a tag for
    // a multiple select in that section, it adds the
    // JSON values to an array parsed as objects.
    // Returns the array
    var addBoxJSON = function(context,box_tag){
        var array = [];
        $('select'+box_tag+' option',context).each(function(){
            array.push( JSON.parse($(this).val()) );
        });
        return array;
    }

    //Given an object, removes those elements which are empty
    //Used to clean up a template JSON before submitting
    //it to opennebula.js
    var removeEmptyObjects = function(obj){
        for (elem in obj){
            var remove = false;
            var value = obj[elem];
            if (value instanceof Array)
            {
                if (value.length == 0)
                    remove = true;
            }
            else if (value instanceof Object)
            {
                var obj_length = 0;
                for (e in value)
                    obj_length += 1;
                if (obj_length == 0)
                    remove = true;
            }
            else
            {
                value = String(value);
                if (value.length == 0)
                    remove = true;
            }
            if (remove)
                delete obj[elem];
        }
        return obj;
    }

    //Toggles the icon when a section is folded/unfolded
    var iconToggle = function(){
        $('.icon_left',$create_template_dialog).click(function(e){
            if ($('span',e.currentTarget).hasClass("ui-icon-plus")){
                $('span',e.currentTarget).removeClass("ui-icon-plus");
                $('span',e.currentTarget).addClass("ui-icon-minus");
            } else {
                $('span',e.currentTarget).removeClass("ui-icon-minus");
                $('span',e.currentTarget).addClass("ui-icon-plus");
            };
        });
    };

    //Fold/unfold all sections button
    var foldUnfoldToggle = function() {
        $('#fold_unfold_vm_params',$create_template_dialog).toggle(
            function(){
                $('.vm_section fieldset',$create_template_dialog).show();
                $('.icon_left span',$create_template_dialog).removeClass("ui-icon-plus");
                $('.icon_left span',$create_template_dialog).addClass("ui-icon-minus");
                return false;
            },
            function(){
                $('.vm_section fieldset',$create_template_dialog).hide();
                //Show capacity opts
                $('.vm_section fieldset',$create_template_dialog).first().show();
                $('.icon_left span',$create_template_dialog).removeClass("ui-icon-minus");
                $('.icon_left span',$create_template_dialog).addClass("ui-icon-plus");
                return false;
            });
    };

    // Set ups the capacity section
    var capacity_setup = function(){
        //Actually there is nothing to set up, but it used to be
        //possible to hide it like others
        /*
          $('fieldset',section_capacity).hide();
          $('#add_capacity',section_capacity).click(function(){
          $('fieldset',section_capacity).toggle();
          return false;
          });
        */

    }

    //Sets up the OS_BOOT section
    var os_boot_setup = function(){
        $('fieldset',section_os_boot).hide();
        $('.bootloader, .kernel',section_os_boot).hide();

        $('#add_os_boot_opts',section_os_boot).click(function(){
            $('fieldset',section_os_boot).toggle();
            return false;
        });

        //Depending on the boot method we enable/disable some options
        $('#boot_method',section_os_boot).change(function(){
            select = $(this).val();
            switch (select)
            {
            case "kernel":
                $('.bootloader',section_os_boot).hide();
                $('.bootloader',section_os_boot).attr('disabled','disabled');
                $('.kernel',section_os_boot).show();
                $('.kernel',section_os_boot).removeAttr('disabled');
                break;
            case "bootloader":
                $('.kernel',section_os_boot).hide();
                $('.kernel',section_os_boot).attr('disabled','disabled');
                $('.bootloader',section_os_boot).show();
                $('.bootloader',section_os_boot).removeAttr('disabled');
                break;
            default:
                $('.kernel, .bootloader',section_os_boot).hide();
                $('.kernel, .bootloader',section_os_boot).attr('disabled','disabled');
                $('.kernel input, .bootloader input',section_os_boot).val("");
            };
        });
    };

    // Sets up the features section
    var features_setup = function(){
        $('fieldset',section_features).hide();

        $('#add_features',section_features).click(function(){
            $('fieldset',section_features).toggle();
            return false;
        });
    };

    // Sets up the disk section
    var disks_setup = function(){

        $('fieldset',section_disks).hide();
        $('.vm_param', section_disks).hide();
        //$('#image_vs_disk',section_disks).show();

        $('#add_disks', section_disks).click(function(){
            $('fieldset',section_disks).toggle();
            return false;
        });

        //Auto-set IMAGE_UNAME hidden field value
        $('#IMAGE', section_disks).change(function(){
            var option = $('option:selected',this);
            var uname = getValue(option.attr('elem_id'),1,2,dataTable_images);
            $('input#IMAGE_UNAME',section_disks).val(uname);
            var target = getValue(option.attr('elem_id'),1,12,dataTable_images);
            if (target && target != "--")
                $('input#TARGET',section_disks).val(target);
            else
                $('input#TARGET',section_disks).val('');
            var driver = getValue(option.attr('elem_id'),1,13,dataTable_images);
            if (driver && driver != "--")
                $('input#DRIVER',section_disks).val(driver);
            else             
                $('input#DRIVER',section_disks).val('');
        });

        //Depending on adding a disk or a image we need to show/hide
        //different options and make then mandatory or not
        $('#image_vs_disk input',section_disks).click(function(){
            //$('fieldset',section_disks).show();
            $('.vm_param', section_disks).show();
            var select = $(this).val();
            switch (select)
            {
            case "disk":
                $('.add_image',section_disks).hide();
                $('.add_image',section_disks).attr('disabled','disabled');
                $('.add_disk',section_disks).show();
                $('.add_disk',section_disks).removeAttr('disabled');
                break;
            case "image":
                $('.add_disk',section_disks).hide();
                $('.add_disk',section_disks).attr('disabled','disabled');
                $('.add_image',section_disks).show();
                $('.add_image',section_disks).removeAttr('disabled');
                break;
            }
            $('#SIZE',section_disks).parent().hide();
            $('#SIZE',section_disks).parent().attr('disabled','disabled');
            $('#FORMAT',section_disks).parent().hide();
            $('#SIZE',section_disks).parent().attr('disabled','disabled');
            $('#TYPE :selected',section_disks).removeAttr('selected');
            //hide_disabled(section_disks);
        });

        //Depending on the type of disk we need to show/hide
        //different options and make then mandatory or not
        $('select#TYPE',section_disks).change(function(){
            var select = $(this).val();
            switch (select) {
                //size,format,target
            case "swap":
                //size mandatory
                $('#SIZE',section_disks).parent().show();
                $('#SIZE',section_disks).parent().removeAttr('disabled');
                $('#SIZE',section_disks).parent().removeClass(opt_class);
                $('#SIZE',section_disks).parent().addClass(man_class);

                //target optional
                $('#TARGET',section_disks).parent().removeClass(man_class);
                $('#TARGET',section_disks).parent().addClass(opt_class);

                //format hidden
                $('#FORMAT',section_disks).parent().hide();
                $('#FORMAT',section_disks).parent().attr('disabled','disabled');

                //source hidden
                $('#SOURCE',section_disks).parent().hide();
                $('#SOURCE',section_disks).parent().
                    attr('disabled','disabled');
                break;
            case "fs":
                //size mandatory
                $('#SIZE',section_disks).parent().show();
                $('#SIZE',section_disks).parent().removeAttr('disabled');
                $('#SIZE',section_disks).parent().removeClass(opt_class);
                $('#SIZE',section_disks).parent().addClass(man_class);

                //target mandatory
                $('#TARGET',section_disks).parent().removeClass(opt_class);
                $('#TARGET',section_disks).parent().addClass(man_class);

                //format mandatory
                $('#FORMAT',section_disks).parent().show();
                $('#FORMAT',section_disks).parent().removeAttr('disabled');
                $('#FORMAT',section_disks).parent().removeClass(opt_class);
                $('#FORMAT',section_disks).parent().addClass(man_class);

                //source hidden
                $('#SOURCE',section_disks).parent().hide();
                $('#SOURCE',section_disks).parent().
                    attr('disabled','disabled');
                break;
            case "block":
                //size shown and optional
                $('#SIZE',section_disks).parent().show();
                $('#SIZE',section_disks).parent().removeAttr('disabled');
                $('#SIZE',section_disks).parent().removeClass(man_class);
                $('#SIZE',section_disks).parent().addClass(opt_class);

                //target mandatory
                $('#TARGET',section_disks).parent().removeClass(opt_class);
                $('#TARGET',section_disks).parent().addClass(man_class);

                //format hidden
                $('#FORMAT',section_disks).parent().hide();
                $('#FORMAT',section_disks).parent().attr('disabled','disabled');

                //source hidden
                $('#SOURCE',section_disks).parent().hide();
                $('#SOURCE',section_disks).parent().
                    attr('disabled','disabled');
                break;
            case "floppy":
            case "disk":
            case "cdrom":
            default:
                //size hidden
                $('#SIZE',section_disks).parent().hide();
                $('#SIZE',section_disks).parent().attr('disabled','disabled');

                //target mandatory
                $('#TARGET',section_disks).parent().removeClass(opt_class);
                $('#TARGET',section_disks).parent().addClass(man_class);

                //format optional
                $('#FORMAT',section_disks).parent().hide();
                $('#FORMAT',section_disks).parent().attr('disabled','disabled');

                //source shown
                $('#SOURCE',section_disks).parent().show();
                $('#SOURCE',section_disks).parent().
                    removeAttr('disabled');
            }
            //hide_disabled(section_disks);
        });

        //Our filter for the disks section fields is the standard
        //mandatory filter applied for this section
        var diskFilter = function(){
            return mandatory_filter(section_disks);
        };

        $('#add_disk_button',section_disks).click(function(){
            box_add_element(section_disks,'#disks_box',diskFilter);
            return false;
        });
        $('#remove_disk_button',section_disks).click(function(){
            box_remove_element(section_disks,'#disks_box');
            return false;
        });

        //preselect now hidden option
        $('#image_vs_disk input#add_image',section_disks).trigger('click');

    };

    // Sets up the network section
    var networks_setup = function(){

        $('.vm_param',section_networks).hide();
        $('.firewall_select',section_networks).hide();
        $('fieldset',section_networks).hide();

        $('#add_networks',section_networks).click(function(){
            $('fieldset',section_networks).toggle();
            return false;
        });

        //Auto-set IMAGE_UNAME hidden field value
        $('#NETWORK', section_networks).change(function(){
            var option = $('option:selected',this);
            var uname = getValue(option.attr('elem_id'),1,2,dataTable_vNetworks);
            $('input#NETWORK_UNAME',section_networks).val(uname);
        });

        //Depending on adding predefined network or not we show/hide
        //some fields
        $('#network_vs_niccfg input',section_networks).click(function(){

            //firewall
            $('.firewall',section_networks).hide();
            $('.firewall',section_networks).attr('disabled','disabled');
/*
 *     ezilla 2.0 release  ,disable firewall function. waiting for next release.  will be opening.
*/
//            $('.firewall_select',section_networks).show();
            $('.firewall_select select option',section_networks).removeAttr('selected');

            select = $(this).val();
            switch (select) {
            case "network":
                $('.niccfg',section_networks).hide();
                $('.niccfg',section_networks).attr('disabled','disabled');
                $('.network',section_networks).show();
                $('.network',section_networks).removeAttr('disabled');
                break;
            case "niccfg":
                $('.network',section_networks).hide();
                $('.network',section_networks).attr('disabled','disabled');
                $('.niccfg',section_networks).show();
                $('.niccfg',section_networks).removeAttr('disabled');
                break;
            }
            //hide_disabled(section_networks);
        });

        $('#black_white_tcp',section_networks).change(function(){
            switch ($(this).val()) {
            case "whitelist":
                $('#BLACK_PORTS_TCP',section_networks).parent().attr('disabled','disabled');
                $('#BLACK_PORTS_TCP',section_networks).parent().hide();
                $('#WHITE_PORTS_TCP',section_networks).parent().removeAttr('disabled');
                $('#WHITE_PORTS_TCP',section_networks).parent().show();
                break;
            case "blacklist":
                $('#WHITE_PORTS_TCP',section_networks).parent().attr('disabled','disabled');
                $('#WHITE_PORTS_TCP',section_networks).parent().hide();
                $('#BLACK_PORTS_TCP',section_networks).parent().removeAttr('disabled');
                $('#BLACK_PORTS_TCP',section_networks).parent().show();
                break;
            default:
                $('#WHITE_PORTS_TCP',section_networks).parent().attr('disabled','disabled');
                $('#WHITE_PORTS_TCP',section_networks).parent().hide();
                $('#BLACK_PORTS_TCP',section_networks).parent().attr('disabled','disabled');
                $('#BLACK_PORTS_TCP',section_networks).parent().hide();
            };
        });

        $('#black_white_udp',section_networks).change(function(){
            switch ($(this).val()) {
            case "whitelist":
                $('#BLACK_PORTS_UDP',section_networks).parent().attr('disabled','disabled');
                $('#BLACK_PORTS_UDP',section_networks).parent().hide();
                $('#WHITE_PORTS_UDP',section_networks).parent().removeAttr('disabled');
                $('#WHITE_PORTS_UDP',section_networks).parent().show();
                break;
            case "blacklist":
                $('#WHITE_PORTS_UDP',section_networks).parent().attr('disabled','disabled');
                $('#WHITE_PORTS_UDP',section_networks).parent().hide();
                $('#BLACK_PORTS_UDP',section_networks).parent().removeAttr('disabled');
                $('#BLACK_PORTS_UDP',section_networks).parent().show();
                break;
            default:
                $('#WHITE_PORTS_UDP',section_networks).parent().attr('disabled','disabled');
                $('#WHITE_PORTS_UDP',section_networks).parent().hide();
                $('#BLACK_PORTS_UDP',section_networks).parent().attr('disabled','disabled');
                $('#BLACK_PORTS_UDP',section_networks).parent().hide();
            };
        });

        //The filter to add a new network checks that we have selected a
        //network, or that the ip or mac are set
        //TODO: Improve this check
        var nicFilter = function(){
            return mandatory_filter(section_networks);
        };

        $('#add_nic_button',section_networks).click(function(){
            box_add_element(section_networks,'#nics_box',nicFilter);
            return false;
        });
        $('#remove_nic_button',section_networks).click(function(){
            box_remove_element(section_networks,'#nics_box');
            return false;
        });

        //preselect now hidden option
        $('#network_vs_niccfg input#add_network',section_networks).trigger('click');
    };

    //Sets up the input section - basicly enabling adding and removing from box
    var inputs_setup = function() {
        
        $('fieldset',section_inputs).hide();

        $('#add_inputs',section_inputs).click(function(){
            $('fieldset',section_inputs).toggle();
            return false;
        });

        $('#add_input_button',section_inputs).click(function(){
            //no filter
            box_add_element(section_inputs,'#inputs_box',function(){return true});
            return false;
        });
        $('#remove_input_button',section_inputs).click(function(){
            box_remove_element(section_inputs,'#inputs_box');
            return false;
        });
    };

    //Set up the graphics section
    var graphics_setup = function(){
        $('fieldset',section_graphics).hide();
        $('.vm_param',section_graphics).hide();
        $('select#TYPE',section_graphics).parent().show();

        $('#add_graphics',section_graphics).click(function(){
            $('fieldset',section_graphics).toggle();
            return false;
        });

        $('select#TYPE',section_graphics).change(function(){
            g_type = $(this).val();
            switch (g_type) {
            case "vnc":
                $('#LISTEN',section_graphics).parent().hide();
                $('#LISTEN',section_graphics).val('0.0.0.0');
                $('#PORT',section_graphics).parent().hide();
                //$('#PASSWD',section_graphics).parent().show();
                $('#KEYMAP',section_graphics).parent().hide();
                $('#PORT',section_graphics).parent().removeAttr('disabled');
                $('#PASSWD',section_graphics).parent().removeAttr('disabled');
                $('#KEYMAP',section_graphics).parent().removeAttr('disabled');
                break;
            case "sdl":
                $('#LISTEN',section_graphics).parent().hide();
                $('#LISTEN',section_graphics).val('0.0.0.0');
                $('#PORT',section_graphics).parent().hide();
                $('#PASSWD',section_graphics).parent().hide();
                $('#KEYMAP',section_graphics).parent().hide();
                $('#PORT',section_graphics).parent().attr('disabled','disabled');
                $('#PASSWD',section_graphics).parent().attr('disabled','disabled');
                $('#KEYMAP',section_graphics).parent().attr('disabled','disabled');
                break;
 	    case "spice":
                $('#LISTEN',section_graphics).parent().hide();
                $('#LISTEN',section_graphics).val('0.0.0.0');
                $('#PORT',section_graphics).parent().hide();
                //$('#PASSWD',section_graphics).parent().show();
                $('#KEYMAP',section_graphics).parent().hide();
                $('#PORT',section_graphics).parent().removeAttr('disabled');
                $('#PASSWD',section_graphics).parent().removeAttr('disabled');
                $('#KEYMAP',section_graphics).parent().removeAttr('disabled');
                break;
            default:
                $('#LISTEN',section_graphics).parent().hide();
                $('#PORT',section_graphics).parent().hide();
                $('#PASSWD',section_graphics).parent().hide();
                $('#KEYMAP',section_graphics).parent().hide();
            }
        });

    };

    //Set up the context section - TODO: Apply improvements here...
    var context_setup = function(){
        $('fieldset',section_context).hide();

        $('#add_context',section_context).click(function(){
            $('fieldset',section_context).toggle();
            return false;
        });

        $('#add_context_button', section_context).click(function(){
            var name = $('#var_name',section_context).val();
            var value = $('#var_value',section_context).val();
            if (!name.length || !value.length) {
                notifyError(tr("Context variable name and value must be filled in"));
                return false;
            }
            option= '<option value=\''+value+'\' name=\''+name+'\'>'+
                name+'='+value+
                '</option>';
            $('select#context_box',section_context).append(option);
            return false;
        });

        $('#remove_context_button', section_context).click(function(){
            box_remove_element(section_context,'#context_box');
            return false;
        });
    };

    // Set up the placement section
    var placement_setup = function(){
        $('fieldset',section_placement).hide();

        $('#add_placement',section_placement).click(function(){
            $('fieldset',section_placement).toggle();
            return false;
        });

    };

    // Set up the raw section
    var raw_setup = function(){
        $('fieldset',section_raw).hide();

        $('#add_raw',section_raw).click(function(){
            $('fieldset',section_raw).toggle();
            return false;
        });
    };

    //set up the custom variables section
    var custom_variables_setup = function(){
        $('fieldset',section_custom_var).hide();

        $('#add_custom_var',section_custom_var).click(function(){
            $('fieldset',section_custom_var).toggle();
            return false;
        });

        $('#add_custom_var_button', section_custom_var).click(
            function(){
                var name = $('#custom_var_name',section_custom_var).val();
                var value = $('#custom_var_value',section_custom_var).val();
                if (!name.length || !value.length) {
                    notifyError(tr("Custom variable name and value must be filled in"));
                    return false;
                }
                option= '<option value=\''+value+'\' name=\''+name+'\'>'+
                    name+'='+value+
                    '</option>';
                $('select#custom_var_box',section_custom_var).append(option);
                return false;
            });

        $('#remove_custom_var_button', section_custom_var).click(
            function(){
                box_remove_element(section_custom_var,'#custom_var_box');
                return false;
            });
    }

    //***CREATE VM DIALOG MAIN BODY***

    dialogs_context.append('<div title="'+tr("Create VM Template")+'" id="create_template_dialog"></div>');
    $create_template_dialog = $('#create_template_dialog',dialogs_context)
    var dialog = $create_template_dialog;

    //Insert HTML in place
    dialog.html(create_template_tmpl);

    //Enable tabs
    $('#template_create_tabs',dialog).tabs({
        select:vmTabChange
    });

    //Prepare jquery dialog
    var height = Math.floor($(window).height()*0.8); //set height to a percentage of the window
    dialog.dialog({
        autoOpen: false,
        modal: true,
        width: 600,
        height: height
    });

    // Enhace buttons
    $('button',dialog).button();

    // Re-Setup tips
    setupTips(dialog);

    //Enable different icon for folded/unfolded categories
    iconToggle(); //toogle +/- buttons

    //Sections, used to stay within their scope
    var section_capacity = $('div#capacity',dialog);
    var section_os_boot = $('div#os_boot_opts',dialog);
    var section_features = $('div#features',dialog);
    var section_disks = $('div#disks',dialog);
    var section_networks = $('div#networks',dialog);
    var section_inputs = $('div#inputs',dialog);
    var section_graphics = $('div#graphics',dialog);
    var section_context = $('div#context',dialog);
    var section_placement = $('div#placement',dialog);
    var section_raw = $('div#raw',dialog);
    var section_custom_var = $('div#custom_var',dialog);

    //Different selector for items of kvm and xen (mandatory and optional)
    var items = '.vm_param input,.vm_param select';
    var kvm_man_items = '.kvm input,.kvm select';
    var kvm_opt_items = '.kvm_opt input, .kvm_opt select';
    var kvm_items = kvm_man_items +','+kvm_opt_items;
    var xen_man_items = '.xen input,.xen select';
    var xen_opt_items = '.xen_opt input, .xen_opt select';
    var xen_items = xen_man_items +','+ xen_opt_items;
    var vmware_man_items = '.vmware input,.vmware select';
    var vmware_opt_items = '.vmware_opt input, .vmware_opt select';
    var vmware_items = vmware_man_items +','+ vmware_opt_items;

    //Starting template type, optional items class and mandatory items class
    var templ_type = "kvm";
    var opt_class=".kvm_opt";
    var man_class=".kvm";
    //Template RAW sections
    var template_raw="";
    var template_cpuraw="";

    vmTabChange(0,{index : 0}); //enable kvm

    foldUnfoldToggle();

    //initialise all sections
    capacity_setup();
    os_boot_setup();
    features_setup();
    disks_setup();
    networks_setup();
    inputs_setup();
    graphics_setup();
    context_setup();
    placement_setup();
    raw_setup();
    custom_variables_setup();

    //Process form
    $('button#create_template_form_easy',dialog).click(function(){
        //validate form

        var vm_json = {};
        var name,value,boot_method;

        //process capacity options
        var scope = section_capacity;

        if (!mandatory_filter(scope)){
            notifyError(tr("There are mandatory fields missing in the capacity section"));
            return false;
        };
        addSectionJSON(vm_json,scope);

        //process os_boot_opts
        scope= section_os_boot;
        switch (templ_type){
        case "xen":
            boot_method = $('#boot_method option:selected',scope).val();
            if (!boot_method.length){
                notifyError(tr("Xen templates must specify a boot method"));
                return false;}
        };

        if (!mandatory_filter(scope)){
            notifyError(tr("There are mandatory fields missing in the OS Boot options section"));
            return false;
        };
        vm_json["OS"] = {};
        addSectionJSON(vm_json["OS"],scope);

        //Fetch pae and acpi options
        scope = section_features;
        vm_json["FEATURES"] = {};
        addSectionJSON(vm_json["FEATURES"],scope);

        //process disks -> fetch from box
        scope = section_disks;
        vm_json["DISK"] = addBoxJSON(scope,'#disks_box');

        //process nics -> fetch from box
        scope = section_networks;
        vm_json["NIC"] = addBoxJSON(scope,'#nics_box');

        //process inputs -> fetch from box
        scope = section_inputs;
        vm_json["INPUT"] = [{"BUS":"usb", "TYPE":"tablet"}];
        //addBoxJSON(scope,'#inputs_box');

        //process graphics -> fetch fields with value
        scope = section_graphics;
        	vm_json["GRAPHICS"] = {};
        	addSectionJSON(vm_json["GRAPHICS"],scope);
        //context
        //
        

        scope = section_context;
        vm_json["CONTEXT"] = {};
        $('#context_box option',scope).each(function(){
            name = $(this).attr('name');
            value = $(this).val();
            vm_json["CONTEXT"][name]=value;
        });
        var nic_id = 0;
        $.each(vm_json["NIC"],function(){
        var vnet_id = this["NETWORK"]
        var eth_str = "ETH"+nic_id+"_"
        var net_str = 'NETWORK=\\"'+ vnet_id +'\\"'

        vm_json["CONTEXT"][eth_str+"IP"] = "$NIC[IP,"+ net_str +"]";
        vm_json["CONTEXT"][eth_str+"NETOWRK"] = "$NETWORK[NETWORK_ADDRESS,"+ net_str +"]";
        vm_json["CONTEXT"][eth_str+"MASK"] = "$NETWORK[NETWORK_MASK,"+ net_str +"]";
        vm_json["CONTEXT"][eth_str+"GATEWAY"] = "$NETWORK[GATEWAY,"+ net_str +"]";
        vm_json["CONTEXT"][eth_str+"DNS"] = "$NETWORK[DNS,"+ net_str +"]";
        nic_id++;
       });        


        scope = section_capacity;
        vm_json["CONTEXT"]["OSTYPE"]=$('#ostype option:selected',scope).val();
        var vcpu_num=$('input#VCPU',scope).val();

        //placement -> fetch with value, escape double quotes
        scope = section_placement;
        var requirements = $('input#REQUIREMENTS',scope).val();
        requirements = escapeDoubleQuotes(requirements);
        $('input#REQUIREMENTS',scope).val(requirements);
        var rank = $('input#RANK',scope).val();
        rank = escapeDoubleQuotes(rank);
        $('input#RANK',scope).val(rank);
        addSectionJSON(vm_json,scope);

        //for windows 7 vcpu cores
        template_cpuraw += "     <cpu>\n";
        template_cpuraw += "     	<topology sockets='1' cores='" + vcpu_num + "' threads='1'/>\n";
        template_cpuraw += "     </cpu>\n";
        //raw -> if value set type to driver and fetch

        template_raw += "     <devices>\n";
        template_raw += "            <controller type=\'usb\' index=\'0\' model=\'ich9-ehci1\'>\n";
        template_raw += "              <address type=\'pci\' domain=\'0x0000\' bus=\'0x00\' slot=\'0x08\' function=\'0x7\'/>\n";
        template_raw += "            </controller>\n";
        template_raw += "            <controller type=\'usb\' index=\'0\' model=\'ich9-uhci1\'>\n";
        template_raw += "              <master startport=\'0\'/>\n";
        template_raw += "              <address type=\'pci\' domain=\'0x0000\' bus=\'0x00\' slot=\'0x08\' function=\'0x0\' multifunction=\'on\'/>\n";
        template_raw += "            </controller>\n";
        template_raw += "            <controller type=\'usb\' index=\'0\' model=\'ich9-uhci2\'>\n";
        template_raw += "              <master startport=\'2\'/>\n";
        template_raw += "              <address type=\'pci\' domain=\'0x0000\' bus=\'0x00\' slot=\'0x08\' function=\'0x1\'/>\n";
        template_raw += "            </controller>\n";
        template_raw += "            <controller type=\'usb\' index=\'0\' model=\'ich9-uhci3\'>\n";
        template_raw += "              <master startport=\'4\'/>\n";
        template_raw += "              <address type=\'pci\' domain=\'0x0000\' bus=\'0x00\' slot=\'0x08\' function=\'0x2\'/>\n";
        template_raw += "            </controller>\n";
        template_raw += "            <redirdev bus=\'usb\' type=\'spicevmc\'>\n";
        template_raw += "              <address type=\'usb\' bus=\'0\' port=\'3\'/>\n";
        template_raw += "            </redirdev>\n";
        template_raw += "            <redirdev bus=\'usb\' type=\'spicevmc\'>\n";
        template_raw += "              <address type=\'usb\' bus=\'0\' port=\'4\'/>\n";
        template_raw += "            </redirdev>\n";
        template_raw += "            <redirdev bus=\'usb\' type=\'spicevmc\'>\n";
        template_raw += "              <address type=\'usb\' bus=\'0\' port=\'5\'/>\n";
        template_raw += "            </redirdev>\n";
        template_raw += "            <redirdev bus=\'usb\' type=\'spicevmc\'>\n";
        template_raw += "              <address type=\'usb\' bus=\'0\' port=\'6\'/>\n";
        template_raw += "            </redirdev>\n";
        template_raw += "        </devices>\n";
	
	scope = section_raw;
	vm_json["RAW"] = {};
        
	//SPICE for usb redirction
	if ($('select#TYPE',section_graphics).val() == "spice"){
       		addSectionJSON(vm_json["RAW"],scope);
		vm_json["RAW"]["TYPE"]="KVM";
		vm_json["RAW"]["DATA"]=template_cpuraw+template_raw;
	}else{
        //raw -> if value set type to driver and fetch
       		addSectionJSON(vm_json["RAW"],scope);
		vm_json["RAW"]["TYPE"]="KVM";
                vm_json["RAW"]["DATA"]=template_cpuraw;
	}

        //custom vars
        scope = section_custom_var;
        $('#custom_var_box option',scope).each(function(){
            name = $(this).attr('name');
            value = $(this).val();
            vm_json[name]=value;
        });

        // remove empty elements
        vm_json = removeEmptyObjects(vm_json);

        //wrap it in the "vmtemplate" object
        vm_json = {vmtemplate: vm_json};


        Sunstone.runAction("Template.create",vm_json);

        $create_template_dialog.dialog('close');
        return false;
    });

    //Handle manual forms
    $('button#create_template_form_manual',$create_template_dialog).click(function(){
        var template = $('textarea#textarea_vm_template',$create_template_dialog).val();

        //wrap it in the "vm" object
        template = {"vmtemplate": {"template_raw": template}};

        Sunstone.runAction("Template.create",template);
        $create_template_dialog.dialog('close');
        return false;
    });

    //Reset form - empty boxes
    $('button#reset_vm_form',dialog).click(function(){
        $('select#disks_box option',section_disks).remove();
        $('select#nics_box option',section_networks).remove();
//        $('select#inputs_box option',section_inputs).remove();
        $('select#custom_var_box option',section_custom_var).remove();
        return true;
    });
}

function popUpCreateTemplateDialog(){
    //Repopulate images select
    var im_sel = makeSelectOptions(dataTable_images,
                                   4, //id col - trick -> reference by name!
                                   4, //name col
                                   [10,10,10],
                                   [tr("DISABLED"),tr("LOCKED"),tr("ERROR")]
                                  );
    $('div#disks select#IMAGE',$create_template_dialog).html(im_sel);
    //Repopulate network select
    var vn_sel = makeSelectOptions(dataTable_vNetworks,
                                   4, //id col - trick -> reference by name!
                                   4,
                                   [],
                                   []
                                  );
    $('div#networks select#NETWORK',$create_template_dialog).html(vn_sel);

    $create_template_dialog.dialog('open');
};

function setupTemplateTemplateUpdateDialog(){
    //Append to DOM
    dialogs_context.append('<div id="template_template_update_dialog" title="'+tr("Update template properties")+'"></div>');
    var dialog = $('#template_template_update_dialog',dialogs_context);

    //Put HTML in place
    dialog.html(update_template_tmpl);

    var height = Math.floor($(window).height()*0.8); //set height to a percentage of the window

    //Convert into jQuery
    dialog.dialog({
        autoOpen:false,
        width:700,
        modal:true,
        height:height,
        resizable:false
    });

    $('button',dialog).button();

    $('#template_template_update_select',dialog).change(function(){
        var id = $(this).val();
        $('.permissions_table input',dialog).removeAttr('checked')
        $('.permissions_table',dialog).removeAttr('update');
        if (id && id.length){
            var dialog = $('#template_template_update_dialog');
            $('#template_template_update_textarea',dialog).val(tr("Loading")+"...");

            Sunstone.runAction("Template.fetch_permissions",id);
            Sunstone.runAction("Template.fetch_template",id);
        } else {
            $('#template_template_update_textarea',dialog).val("");
        };
    });

    $('.permissions_table input',dialog).change(function(){
        $(this).parents('table').attr('update','update');
    });

    $('form',dialog).submit(function(){
        var dialog = $(this);
        var new_template = $('#template_template_update_textarea',dialog).val();
        var id = $('#template_template_update_select',dialog).val();
        if (!id || !id.length) {
            $(this).parents('#template_template_update_dialog').dialog('close');
            return false;
        };

        var permissions = $('.permissions_table',dialog);
        if (permissions.attr('update')){
            var perms = {
                octet : buildOctet(permissions)
            };
            Sunstone.runAction("Template.chmod",id,perms);
        };

        Sunstone.runAction("Template.update",id,new_template);
        $(this).parents('#template_template_update_dialog').dialog('close');
        return false;
    });
};

function popUpTemplateTemplateUpdateDialog(){
    var select = makeSelectOptions(dataTable_templates,
                                   1,//id_col
                                   4,//name_col
                                   [],
                                   []
                                  );
    var sel_elems = getSelectedNodes(dataTable_templates);


    var dialog =  $('#template_template_update_dialog');
    $('#template_template_update_select',dialog).html(select);
    $('#template_template_update_textarea',dialog).val("");
    $('.permissions_table input',dialog).removeAttr('checked');
    $('.permissions_table',dialog).removeAttr('update');

    if (sel_elems.length >= 1){ //several items in the list are selected
        //grep them
        var new_select= sel_elems.length > 1? '<option value="">Please select</option>' : "";
        $('option','<select>'+select+'</select>').each(function(){
            var val = $(this).val();
            if ($.inArray(val,sel_elems) >= 0){
                new_select+='<option value="'+val+'">'+$(this).text()+'</option>';
            };
        });
        $('#template_template_update_select',dialog).html(new_select);
        if (sel_elems.length == 1) {
            $('#template_template_update_select option',dialog).attr('selected','selected');
            $('#template_template_update_select',dialog).trigger("change");
        };
    };

    dialog.dialog('open');
    return false;

};


// Template clone dialog
function setupTemplateCloneDialog(){
    //Append to DOM
    dialogs_context.append('<div id="template_clone_dialog" title="'+tr("Clone a template")+'"></div>');
    var dialog = $('#template_clone_dialog',dialogs_context);

    //Put HTML in place

    var html = '<form><fieldset>\
<div class="clone_one">'+tr("Choose a new name for the template")+':</div>\
<div class="clone_several">'+tr("Several templates are selected, please choose prefix to name the new copies")+':</div>\
<br />\
<label class="clone_one">'+tr("Name")+':</label>\
<label class="clone_several">'+tr("Prefix")+':</label>\
<input type="text" name="name"></input>\
<div class="form_buttons">\
  <button class="button" id="template_clone_button" value="Template.clone">\
'+tr("Clone")+'\
  </button>\
</div></fieldset></form>\
';

    dialog.html(html);

    //Convert into jQuery
    dialog.dialog({
        autoOpen:false,
        width:375,
        modal:true,
        resizable:false
    });

    $('button',dialog).button();

    $('form',dialog).submit(function(){
        var name = $('input', this).val();
        var sel_elems = templateElements();
        if (!name || !sel_elems.length)
            notifyError('A name or prefix is needed!');
        if (sel_elems.length > 1){
            for (var i=0; i< sel_elems.length; i++)
                //use name as prefix if several items selected
                Sunstone.runAction('Template.clone',
                                   sel_elems[i],
                                   name+getTemplateName(sel_elems[i]));
        } else {
            Sunstone.runAction('Template.clone',sel_elems[0],name)
        };
        $(this).parents('#template_clone_dialog').dialog('close');
        setTimeout(function(){
            Sunstone.runAction('Template.refresh');
        }, 1500);
        return false;
    });
}

function popUpTemplateCloneDialog(){
    var dialog = $('#template_clone_dialog');
    var sel_elems = templateElements();
    //show different text depending on how many elements are selected
    if (sel_elems.length > 1){
        $('.clone_one',dialog).hide();
        $('.clone_several',dialog).show();
        $('input',dialog).val('Copy of ');
    }
    else {
        $('.clone_one',dialog).show();
        $('.clone_several',dialog).hide();
        $('input',dialog).val('Copy of '+getTemplateName(sel_elems[0]));
    };

    $(dialog).dialog('open');
}

// Set the autorefresh interval for the datatable
function setTemplateAutorefresh() {
    setInterval(function(){
        var checked = $('input.check_item:checked',dataTable_templates);
        var filter = $("#datatable_templates_filter input",
                       dataTable_templates.parents('#datatable_templates_wrapper')).attr('value');
        if (!checked.length && !filter.length){
            Sunstone.runAction("Template.autorefresh");
        }
    },INTERVAL+someTime());
};

//The DOM is ready at this point
$(document).ready(function(){

    dataTable_templates = $("#datatable_templates",main_tabs_context).dataTable({
        "bJQueryUI": true,
        "bSortClasses": false,
        "bAutoWidth":false,
        "sDom" : '<"H"lfrC>t<"F"ip>',
        "oColVis": {
            "aiExclude": [ 0 ]
        },
        "sPaginationType": "full_numbers",
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": ["check"] },
            { "sWidth": "80px", "aTargets": [0] },
            { "sWidth": "35px", "aTargets": [1] },
            { "sWidth": "150px", "aTargets": [5] },
            { "sWidth": "100px", "aTargets": [2,3] }
        ],
        "oLanguage": (datatable_lang != "") ?
            {
                sUrl: "locale/"+lang+"/"+datatable_lang
            } : ""
    });

    dataTable_templates.fnClearTable();
    addElement([
        spinner,
        '','','','',''],dataTable_templates);
    Sunstone.runAction("Template.list");

    setupCreateTemplateDialog();
    setupTemplateTemplateUpdateDialog();
    setupTemplateCloneDialog();
    setTemplateAutorefresh();

    initCheckAllBoxes(dataTable_templates);
    tableCheckboxesListener(dataTable_templates);
    infoListener(dataTable_templates,'Template.showinfo');

    $('div#templates_tab div.legend_div').hide();
});
