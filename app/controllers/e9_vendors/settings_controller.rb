class E9Vendors::SettingsController < Admin::SettingsController
  include E9Vendors::Controller

  defaults :instance_name => 'settings', :resource_class => Settings

  skip_before_filter :add_admin_settings_breadcrumb

  def add_index_breadcrumb
    add_breadcrumb! e9_t(:index_title)
  end
end
