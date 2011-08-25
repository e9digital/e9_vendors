class E9Vendors::VendorsController < Admin::ResourceController
  include E9Vendors::Controller

  respond_to :html, :js
  
  carrierwave_column_methods :logo, :context => :admin

  add_resource_breadcrumbs

  def create;  create!  { collection_path } end
  def update;  update!  { collection_path } end
  def destroy; destroy! { collection_path } end

  protected

  ##
  # IR
  # 
  def collection
    @vendors ||= end_of_association_chain.order(:name).all
  end
end
