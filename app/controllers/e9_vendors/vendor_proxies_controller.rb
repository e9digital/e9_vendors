class E9Vendors::VendorProxiesController < Admin::ResourceController
  include E9Vendors::Controller

  belongs_to :vendor_member
  defaults :instance_name => :vendor

  add_resource_breadcrumbs

  def update
    update! do |format|
      format.html { redirect_to collection_path }
      format.js
    end
  end

  protected

  def determine_layout
    request.xhr? ? false : super
  end

  def add_index_breadcrumb
    add_breadcrumb parent.class.model_name.human.pluralize, polymorphic_path(parent.class)
    add_breadcrumb (@index_title = e9_t(:index_title, :member => parent.name)), collection_path
  end

  def decorate(records)
    VendorProxyDecorator.decorate(records)
  end

  def collection
    get_collection_ivar || set_collection_ivar(decorate end_of_association_chain.joins(:vendor).order('vendors.name').all)
  end

  def resource
    get_resource_ivar || set_resource_ivar(decorate end_of_association_chain.find(params[:id]))
  end
end
