require 'rails/generators'
require 'rails/generators/migration'

module E9Vendors
  module Generators
    class InstallGenerator < Rails::Generators::Base
      include Rails::Generators::Migration

      def self.source_root
        File.join(File.dirname(__FILE__), 'templates')
      end
       
      def self.next_migration_number(dirname) #:nodoc:
        if ActiveRecord::Base.timestamped_migrations
          Time.now.utc.strftime("%Y%m%d%H%M%S")
        else
          "%.3d" % (current_migration_number(dirname) + 1)
        end
      end

      def create_migration
        migration_template 'migration.rb', 'db/migrate/create_e9_vendors.rb'
      end

      def copy_files
        directory 'javascripts',      'app/javascripts'
        directory 'stylesheets',      'app/stylesheets'
      end
    end
  end
end
