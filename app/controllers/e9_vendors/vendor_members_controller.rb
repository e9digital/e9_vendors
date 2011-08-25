class E9Vendors::VendorMembersController < Admin::ResourceController
  include E9Vendors::Controller

  respond_to :json, :only => :show
  respond_to :html, :js, :except => :show

  carrierwave_column_methods :logo, :context => :admin

  skip_before_filter :authenticate_user!, :filter_access_filter, :only => :show

  add_resource_breadcrumbs
  before_filter :add_widget_code_breadcrumb, :only => :widget_code

  def show
    show! do |format|
      format.html { render_404 }
      format.json { render :json => { :type => 'member', :resource => resource }, :callback => params[:jsonp] }
    end
  end

  def create
    create! { collection_path }
  end

  def update
    update! do |success, failure| 
      success.html { redirect_to collection_path }
      failure.html { render :edit }
    end
  end

  def destroy
    destroy! do |format|
      format.html { redirect_to collection_path }
      format.js
    end
  end

  protected

  def resource
    get_resource_ivar || set_resource_ivar(decorate end_of_association_chain.send(resource_lookup, params[:id]))
  end

  def resource_lookup
    params[:action] == 'show' ? :find_by_md5_hash! : :find
  end

  def collection
    get_collection_ivar || set_collection_ivar(decorate end_of_association_chain.order(:name))
  end

  def decorate(records)
    VendorMemberDecorator.decorate(records)
  end

  def add_widget_code_breadcrumb
    add_breadcrumb! e9_t(:widget_code_title)
  end

  def determine_layout
    request.xhr? ? false : super
  end
end
