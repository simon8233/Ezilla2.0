# -------------------------------------------------------------------------- #
# Copyright 2002-2012, OpenNebula Project Leads (OpenNebula.org)             #
#                                                                            #
# Licensed under the Apache License, Version 2.0 (the "License"); you may    #
# not use this file except in compliance with the License. You may obtain    #
# a copy of the License at                                                   #
#                                                                            #
# http://www.apache.org/licenses/LICENSE-2.0                                 #
#                                                                            #
# Unless required by applicable law or agreed to in writing, software        #
# distributed under the License is distributed on an "AS IS" BASIS,          #
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   #
# See the License for the specific language governing permissions and        #
# limitations under the License.                                             #
#--------------------------------------------------------------------------- #

require 'CloudServer'

require 'OpenNebulaJSON'
include OpenNebulaJSON

require 'OpenNebulaVNC'
require 'OpenNebulaJSON/JSONUtils'
include JSONUtils

require 'SunstoneMarketplace'

class SunstoneServer < CloudServer
    # FLAG that will filter the elements retrieved from the Pools
    POOL_FILTER = Pool::INFO_ALL

    # Secs to sleep between checks to see if image upload to repo is finished
    IMAGE_POLL_SLEEP_TIME = 5

    include SunstoneMarketplace

    def initialize(client, config, logger)
        super(config, logger)
        @client = client
    end

    ############################################################################
    #
    ############################################################################
    def get_pool(kind,gid)
        if gid == "0"
            user_flag = Pool::INFO_ALL
        else
            user_flag = POOL_FILTER
        end

        pool = case kind
            when "group"      then GroupPoolJSON.new(@client)
            when "cluster"    then ClusterPoolJSON.new(@client)
            when "host"       then HostPoolJSON.new(@client)
            when "image"      then ImagePoolJSON.new(@client, user_flag)
            when "vmtemplate" then TemplatePoolJSON.new(@client, user_flag)
            when "vm"         then VirtualMachinePoolJSON.new(@client, user_flag)
            when "vnet"       then VirtualNetworkPoolJSON.new(@client, user_flag)
            when "user"       then UserPoolJSON.new(@client)
            when "acl"        then AclPoolJSON.new(@client)
            when "datastore"  then DatastorePoolJSON.new(@client)
            else
                error = Error.new("Error: #{kind} resource not supported")
                return [404, error.to_json]
        end

        rc = pool.info

        if OpenNebula.is_error?(rc)
            return [500, rc.to_json]
        else
            return [200, pool.to_json]
        end
    end

    ############################################################################
    #
    ############################################################################
    def get_resource(kind, id)
        resource = retrieve_resource(kind, id)
        if OpenNebula.is_error?(resource)
            return [404, resource.to_json]
        else
            return [200, resource.to_json]
        end
    end

    ############################################################################
    #
    ############################################################################
    def get_template(kind,id)
        resource = retrieve_resource(kind,id)
        if OpenNebula.is_error?(resource)
            return [404, resource.to_json]
        else
            template_str = resource.template_str(true)
            return [200, {:template => template_str}.to_json]
        end
    end

    ############################################################################
    #
    ############################################################################
    def create_resource(kind, template)
        resource = case kind
            when "group"      then GroupJSON.new(Group.build_xml, @client)
            when "cluster"    then ClusterJSON.new(Group.build_xml, @client)
            when "host"       then HostJSON.new(Host.build_xml, @client)
            when "image"      then ImageJSON.new(Image.build_xml, @client)
            when "vmtemplate" then TemplateJSON.new(Template.build_xml, @client)
            when "vm"         then VirtualMachineJSON.new(VirtualMachine.build_xml,@client)
            when "vnet"       then VirtualNetworkJSON.new(VirtualNetwork.build_xml, @client)
            when "user"       then UserJSON.new(User.build_xml, @client)
            when "acl"        then AclJSON.new(Acl.build_xml, @client)
            when "datastore"  then DatastoreJSON.new(Acl.build_xml, @client)
            else
                error = Error.new("Error: #{kind} resource not supported")
                return [404, error.to_json]
        end

        rc = resource.create(template)
        if OpenNebula.is_error?(rc)
            return [500, rc.to_json]
        else
            resource.info
            return [201, resource.to_json]
        end
    end

    ############################################################################
    #
    ############################################################################
    def upload(template, file_path)
        image_hash = parse_json(template, 'image')
        if OpenNebula.is_error?(image_hash)
            return [500, image_hash.to_json]
        end

        image_hash['PATH'] = file_path

        ds_id = parse_json(template, 'ds_id')
        if OpenNebula.is_error?(ds_id)
            return [500, ds_id.to_json]
        end

        new_template = {
            :image => image_hash,
            :ds_id => ds_id,
        }.to_json

        image = ImageJSON.new(Image.build_xml, @client)

        rc = image.create(new_template)

        if OpenNebula.is_error?(rc)
            return [500, rc.to_json]
        end

        image.info
        #wait until image is ready to return
        while (image.state_str == 'LOCKED') && (image['RUNNING_VMS'] == '0') do
            sleep IMAGE_POLL_SLEEP_TIME
            image.info
        end
        return [201, image.to_json]
    end

    ############################################################################
    #
    ############################################################################
    def delete_resource(kind, id)
        resource = retrieve_resource(kind, id)
        if OpenNebula.is_error?(resource)
            return [404, resource.to_json]
        end
        if resource.is_a?(VirtualMachineJSON)
            ip=resource["TEMPLATE/NIC/IP"] if !resource["TEMPLATE/NIC/IP"].nil?
            ostype=resource["TEMPLATE/CONTEXT/OSTYPE"] if  !resource["TEMPLATE/CONTEXT/OSTYPE"].nil?
            if !ostype.nil?  &&  !ip.nil?
                if ostype.eql?("WINDOWS")
                    cport=3389
                else
                    cport=22
                end
                    File.delete("/tmp/redir/#{ip}:#{cport}") if File.exist?("/tmp/redir/#{ip}:#{cport}")
                     
                    redir_pid = %x{ps -ef | grep "caddr=#{ip} --cport=#{cport}" |grep -v grep | awk '{print $2}'}
                    redir_pid =  redir_pid.split("\n")

                    if redir_pid.length > 1
                        %x{kill -9 `ps -ef | grep "caddr=#{ip} --cport=#{cport}" |grep -v grep | awk '{print $2}'`}
                    else
                        %x{kill -9 #{redir_pid[0]}}if !redir_pid[0].nil?
                    end
            end
        end
        rc = resource.delete
        if OpenNebula.is_error?(rc)
            return [500, rc.to_json]
        else
            return [204, resource.to_json]
        end
    end

    ############################################################################
    #
    ############################################################################
    def perform_action(kind, id, action_json)
        resource = retrieve_resource(kind, id)
        if OpenNebula.is_error?(resource)
            return [404, resource.to_json]
        end

        rc = resource.perform_action(action_json)
        if OpenNebula.is_error?(rc)
            return [500, rc.to_json]
        else
            return [204, resource.to_json]
        end
    end

    ############################################################################
    # Unused
    ############################################################################
    def get_vm_log(id)
        resource = retrieve_resource("vm", id)
        if OpenNebula.is_error?(resource)
            return [404, nil]
        else
            if !ONE_LOCATION
                vm_log_file = LOG_LOCATION + "/#{id}.log"
            else
                vm_log_file = LOG_LOCATION + "/#{id}/vm.log"
            end

            begin
                log = File.read(vm_log_file)
            rescue Exception => e
                msg = "Log for VM #{id} not available"
                return [200, {:vm_log => msg}.to_json]
            end

            return [200, {:vm_log => log}.to_json]
        end
    end
    ########################################################################
    # VNC
    ########################################################################
    def startvnc(id, config)
        resource = retrieve_resource("vm", id)
        if OpenNebula.is_error?(resource)
            return [404, resource.to_json]
        end

        vnc_proxy = OpenNebulaVNC.new(config, logger)
        return vnc_proxy.start(resource)
    end

    ############################################################################
    #
    ############################################################################
    def stopvnc(pipe,port)
        begin
            OpenNebulaVNC.stop(pipe,port)
        rescue Exception => e
            logger.error {e.message}
            error = Error.new("Error stopping VNC. Please check server logs.")
            return [500, error.to_json]
        end

        return [200, nil]
    end
    ############################################################################
    # Redirect Port 
    ############################################################################
    def redirect(id,cport,loc)

        resource = retrieve_resource("vm", id)
        if OpenNebula.is_error?(resource)
                return [404,nil]
        end
    	if loc == "spice"
		ip = resource['/VM/HISTORY_RECORDS/HISTORY[last()]/HOSTNAME']
	    else
	        ip = resource['TEMPLATE/NIC/IP']
    	end

        redir_pid = %x{ps -ef | grep "caddr=#{ip} --cport=#{cport}" |grep -v grep | awk '{print $2}'} 
        if redir_pid.empty? ## "redirect ip proc" is not exist
            File.delete("/tmp/redir/#{ip}:#{cport}") if File.exist?("/tmp/redir/#{ip}:#{cport}")
        end
        
        file_redir_info = nil

		if !File.directory?("/tmp/redir")
			Dir.mkdir("/tmp/redir")
        end
        if !File.exist?("/tmp/redir/#{ip}:#{cport}") ##
            file_redir_info = File.open("/tmp/redir/#{ip}:#{cport}",'w+')        
    	    if ONE_LOCATION.nil?
    	        redir = "/usr/share/one/redir/redir"
		    else
                redir = ONE_LOCATION + "/share/redir/redir"
            end
            pipe = open("|#{redir}  --lport=0 --caddr=#{ip} --cport=#{cport} &")
            redir_port = pipe.readline
            pipe.close
            file_redir_info.write(redir_port)
            file_redir_info.close
        end        
        redir_port = File.new("/tmp/redir/#{ip}:#{cport}").read
        info = {:info=>redir_port,:loc=>loc,:id=>id,:cport=>cport}
        return [200,info]
    end
         
    ############################################################################
    # Snapshot
    ############################################################################
    def snapshot(id)
        resource = retrieve_resource("vm", id)
        if OpenNebula.is_error?(resource)
            return [404, nil]
        else
            host     = resource['/VM/HISTORY_RECORDS/HISTORY[last()]/HOSTNAME']
            vnc_port = resource['TEMPLATE/GRAPHICS/PORT']
            vnc_pw = resource['TEMPLATE/GRAPHICS/PASSWD']

	    if ONE_LOCATION.nil?
	       sh_path = "/usr/lib/one/sunstone/public/images/vncsnapshot/"
               cmd = "/usr/lib/one/sunstone/public/images/vncsnapshot/vncsnapshot.sh #{sh_path} #{host} #{vnc_port} #{id} #{vnc_pw}"
	    else
	       sh_path =  ONE_LOCATION + "/lib/sunstone/public/images/vncsnapshot/"
               cmd = ONE_LOCATION + "/lib/sunstone/public/images/vncsnapshot/vncsnapshot.sh #{sh_path} #{host} #{vnc_port} #{id} #{vnc_pw}"
            end
	    
            begin
                pipe = IO.popen(cmd)
		pipe.close
                return [200, "images/#{id}.jpg".to_json]
            rescue Exception => e
                return [500, OpenNebula::Error.new(e.message).to_json]
            end
        end
    end
    ############################################################################
    #    Ezilla Auto-Installation Service for Slave Node
    #############################################################################
    def startInstallServ()
        
        if ONE_LOCATION.nil?
            cmd = "sudo /usr/share/one/auto-installation/ezilla-autoinstall-server restart"
        else
            cmd = "sudo " +ONE_LOCATION + "/share/auto-installation/ezilla-autoinstall-server restart"
        end
        begin
            %x{#{cmd}}
            return [ 200 , "Everything will be ok!!!" ]
        rescue Exception => e
            return [ 500 , OpenNebula::Error.new(e.message).to_json ]
        end
    end
    def stopInstallServ()
        if ONE_LOCATION.nil?
            cmd = "sudo /usr/share/one/auto-installation/ezilla-autoinstall-server stop"
        else
            cmd = "sudo " +ONE_LOCATION + "/share/auto-installation/ezilla-autoinstall-server stop"
        end
        begin
            %x{#{cmd}}
            return [ 200 , "Everything will be ok!!!" ]
        rescue Exception => e
            return [ 500 , OpenNebula::Error.new(e.message).to_json ]
        end
    end
    def statusInstallServ()
        if ONE_LOCATION.nil?
            cmd = "sudo /usr/share/one/auto-installation/ezilla-autoinstall-server status"
        else
            cmd = "sudo " +ONE_LOCATION + "/share/auto-installation/ezilla-autoinstall-server status"
        end
        begin
            status = %x{#{cmd}}
            puts status
            info = {:status=>status}
            return [ 200 , info ]
        rescue Exception => e
            return [ 500 , OpenNebula::Error.new(e.message).to_json ]
        end

    end

    #############################################################################
    #     Setup Slave node environment 
    #############################################################################   
    def setup_slave_environment(diskver)
        if ONE_LOCATION.nil?
           diskver_config_file = "/usr/share/one/auto-installation/ezilla-slave-config"
           cmd = "sudo /usr/share/one/auto-installation/ezilla-slave-init.sh"
        else
           diskver_config_file =  ONE_LOCATION + "/share/auto-installation/ezilla-slave-config"
           cmd = "sudo " +ONE_LOCATION + "/share/auto-installation/ezilla-slave-init.sh"
        end

        File.open(diskver_config_file,"w+")  do |f|
            f.write("INSTALL_MODE=#{diskver["install_mode"]}\n")
            f.write("DISK_NUM=#{diskver["disk"].size}\n")
            f.write("DISK=#{diskver["disk"].join(",")}\n")
            f.write("FILESYSTEM=#{diskver["filesystem"]}\n")
            f.write("NETWORK=#{diskver["net_card"]}\n")
        end


        begin
            %x{#{cmd}}
            return [ 200 , "Everything will be ok!!!" ]
        rescue Exception => e
            return [ 500 , OpenNebula::Error.new(e.message).to_json ]
        end
    end    
    #############################################################################
    #
    ############################################################################
    def get_pool_monitoring(resource, meters)
        #pool_element
        pool = case resource
            when "vm", "VM"
                VirtualMachinePool.new(@client)
            when "host", "HOST"
                HostPool.new(@client)
            else
                error = Error.new("Monitoring not supported for #{resource}")
                return [200, error.to_json]
            end

        meters_a = meters.split(',')

        rc = pool.monitoring(meters_a)

        if OpenNebula.is_error?(rc)
            error = Error.new(rc.message)
            return [500, error.to_json]
        end

        rc[:resource] = resource

        return [200, rc.to_json]
    end

    def get_resource_monitoring(id, resource, meters)
        pool_element = case resource
            when "vm", "VM"
                VirtualMachine.new_with_id(id, @client)
            when "host", "HOST"
                Host.new_with_id(id, @client)
            else
                error = Error.new("Monitoring not supported for #{resource}")
                return [200, error.to_json]
            end

        meters_a = meters.split(',')

        rc = pool_element.monitoring(meters_a)

        if OpenNebula.is_error?(rc)
            error = Error.new(rc.message)
            return [500, error.to_json]
        end

        meters_h = Hash.new
        meters_h[:resource]   = resource
        meters_h[:id]         = id
        meters_h[:monitoring] = rc

        return [200, meters_h.to_json]
    end

    private

    ############################################################################
    #
    ############################################################################
    def retrieve_resource(kind, id)
        resource = case kind
            when "group"      then GroupJSON.new_with_id(id, @client)
            when "cluster"    then ClusterJSON.new_with_id(id, @client)
            when "host"       then HostJSON.new_with_id(id, @client)
            when "image"      then ImageJSON.new_with_id(id, @client)
            when "vmtemplate" then TemplateJSON.new_with_id(id, @client)
            when "vm"         then VirtualMachineJSON.new_with_id(id, @client)
            when "vnet"       then VirtualNetworkJSON.new_with_id(id, @client)
            when "user"       then UserJSON.new_with_id(id, @client)
            when "acl"        then AclJSON.new_with_id(id, @client)
            when "datastore"  then DatastoreJSON.new_with_id(id, @client)
            else
                error = Error.new("Error: #{kind} resource not supported")
                return error
        end

        rc = resource.info
        if OpenNebula.is_error?(rc)
            return rc
        else
            return resource
        end
    end
end