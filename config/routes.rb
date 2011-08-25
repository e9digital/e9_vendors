Rails.application.routes.draw do

  base_path = 'directory'
  admin_path= "admin/#{base_path}"

  scope :path => admin_path, :module => :e9_vendors do
    resource :settings, :only => [:show, :update], :as => :e9_vendors_settings

    resources :vendor_categories, :path => :categories do
      collection { post :update_order }
    end

    resources :vendors, :except => :show do
      member do
        post   :upload_logo
        delete :reset_logo
      end
    end

    resources :vendor_members, :path => :members, :except => :show do
      resources :vendor_proxies, :path => :vendors
      member do
        get    :widget_code
        post   :upload_logo
        delete :reset_logo
      end
    end

    %w(
      vendors 
      members
    ).each do |path|
      get "/#{path}/:id", :to => redirect("/#{admin_path}/#{path}/%{id}/edit"), :constraints => { :id => /\d+/ }
    end
  end

  get "/#{base_path}/members/:id", :as => :vendor_member, :to => 'e9_vendors/vendor_members#show'
end
