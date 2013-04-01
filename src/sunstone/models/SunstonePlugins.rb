
#-------------------------------------------------------------------------------
## Copyright (C) 2013
##
## This file is part of ezilla.
##
## This program is free software: you can redistribute it and/or modify it
## under the terms of the GNU General Public License as published by
## the Free Software Foundation, either version 3 of the License, or
## (at your option) any later version.
##
## This program is distributed in the hope that it will be useful, but WITHOUT
## ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
## FOR A PARTICULAR PURPOSE. See the GNU General Public License
## for more details.
##
## You should have received a copy of the GNU General Public License along with
## this program. If not, see <http://www.gnu.org/licenses/>
##
## Author: Chang-Hsing Wu <hsing _at_ nchc narl org tw>
##         Serena Yi-Lun Pan <serenapan _at_ nchc narl org tw>
##         Hsi-En Yu <yun _at_  nchc narl org tw>
##         Hui-Shan Chen  <chwhs _at_ nchc narl org tw>
##         Kuo-Yang Cheng  <kycheng _at_ nchc narl org tw>
##         CHI-MING Chen <jonchen _at_ nchc narl org tw>
##-------------------------------------------------------------------------------

require 'yaml'
require 'json'

class SunstonePlugins
    USER_PLUGIN_POLICY = false # or true to enable them by default

    attr_reader :plugins_conf

    def initialize
        load_conf
        check_plugins
    end

    def load_conf
        @plugins_conf = YAML.load_file(PLUGIN_CONFIGURATION_FILE)
    end

    def check_plugins
        base_path = SUNSTONE_ROOT_DIR+'/public/js/'

        @installed_plugins = Array.new

        # read user plugins
        modified = false
        Dir[base_path+'user-plugins/*.js'].each do |p_path|
            m = p_path.match(/^#{base_path}(.*)$/)
            if m and plugin = m[1]
                @installed_plugins << plugin
                if !plugins.include? plugin
                    @plugins_conf << {plugin=>{:ALL     => USER_PLUGIN_POLICY,
                                               :user    => nil,
                                               :group   => nil}}
                    modified = true
                end
            end
        end
        write_conf if modified

        # read base plugins
        Dir[base_path+'plugins/*.js'].each do |p_path|
            m = p_path.match(/^#{base_path}(.*)$/)
            if m and plugin = m[1]
                @installed_plugins << plugin
            end
        end
    end

    def plugins
        @plugins_conf.collect{|p| p.keys[0]}
    end

    def installed?(plugin)
        @installed_plugins.include? plugin
    end

    def authorized_plugins(user, group)
        auth_plugins = {"user-plugins"=>Array.new, "plugins"=>Array.new}

        @plugins_conf.each do |plugin_conf|
            plugin = plugin_conf.keys.first
            perms  = plugin_conf[plugin]

            if installed?(plugin)
                p_path, p_name = plugin.split('/')

                if perms[:user] and perms[:user].has_key? user
                    if perms[:user][user]
                        auth_plugins[p_path] << p_name
                    else
                        next
                    end
                elsif perms[:group] and perms[:group].has_key? group
                    if perms[:group][group]
                        auth_plugins[p_path] << p_name
                    else
                        next
                    end
                elsif perms[:ALL]
                    auth_plugins[p_path] << p_name
                end
            end
        end
        auth_plugins
    end

    def write_conf
        File.open(PLUGIN_CONFIGURATION_FILE,'w') do |f|
            f.write(@plugins_conf.to_yaml)
        end
    end

    def to_json
        @plugins_conf.to_json
    end
end
