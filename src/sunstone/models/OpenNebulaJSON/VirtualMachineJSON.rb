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
#         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
#         Hsi-En Yu <yun _at_  nchc narl org tw>
#         Hui-Shan Chen  <chwhs _at_ nchc narl org tw>
#         Kuo-Yang Cheng  <kycheng _at_ nchc narl org tw>
#         CHI-MING Chen <jonchen _at_ nchc narl org tw>
#-------------------------------------------------------------------------------

require 'OpenNebulaJSON/JSONUtils'

module OpenNebulaJSON

    class VirtualMachineJSON < OpenNebula::VirtualMachine
        include JSONUtils

        def create(template_json)
            vm_hash = parse_json(template_json, 'vm')
            if OpenNebula.is_error?(vm_hash)
                return vm_hash
            end

            if vm_hash['vm_raw']
                template = vm_hash['vm_raw']
            elsif vm_hash['template_id']
                template_id = vm_hash['template_id']

                template = "TEMPLATE_ID = #{template_id}"
                template << "\nNAME = #{vm_hash['vm_name']}" if vm_hash['vm_name']

            else
                template = template_to_str(vm_hash)
            end

            self.allocate(template)
       end

        def perform_action(template_json)
            action_hash = parse_json(template_json,'action')
            if OpenNebula.is_error?(action_hash)
                return action_hash
            end

            rc = case action_hash['perform']
                 when "cancel"       then self.cancel
                 when "deploy"       then self.deploy(action_hash['params'])
                 when "finalize"     then self.finalize
                 when "hold"         then self.hold
                 when "livemigrate"  then self.live_migrate(action_hash['params'])
                 when "migrate"      then self.migrate(action_hash['params'])
                 when "resume"       then self.resume
                 when "release"      then self.release
                 when "stop"         then self.stop
                 when "suspend"      then self.suspend
                 when "restart"      then self.restart
                 when "reset"        then self.reset
                 when "saveas"       then self.save_as(action_hash['params'])
                 when "shutdown"     then self.shutdown
                 when "reboot"       then self.reboot
                 when "resubmit"     then self.resubmit
                 when "chown"        then self.chown(action_hash['params'])
                 when "chmod"        then self.chmod_octet(action_hash['params'])
                 when "attachdisk"   then self.attachdisk(action_hash['params'])
                 when "detachdisk"   then self.detachdisk(action_hash['params'])
                 else
                     error_msg = "#{action_hash['perform']} action not " <<
                         " available for this resource"
                     OpenNebula::Error.new(error_msg)
                 end
        end

        def delete
            self.finalize
        end

        def deploy(params=Hash.new)
            super(params['host_id'])
        end

        def live_migrate(params=Hash.new)
            super(params['host_id'])
        end

        def migrate(params=Hash.new)
            super(params['host_id'])
        end

        def save_as(params=Hash.new)
            super(params['disk_id'].to_i, params['image_name'], params['type'])
        end

        def chown(params=Hash.new)
            super(params['owner_id'].to_i,params['group_id'].to_i)
        end

        def chmod_octet(params=Hash.new)
            super(params['octet'])
        end

        def attachdisk(params=Hash.new)
            template_json = params['disk_template']
            template = template_to_str(template_json)
            super(template)
        end

        def detachdisk(params=Hash.new)
            super(params['disk_id'].to_i)
        end
    end
end
