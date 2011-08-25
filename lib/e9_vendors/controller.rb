module E9Vendors::Controller
  extend ActiveSupport::Concern
  include E9Rails::Helpers::ResourceLinks

  included do
    defaults
  end

  module ClassMethods
    def defaults(hash = {})
      super(hash.reverse_merge(:route_prefix => nil))
    end
  end

  def add_index_breadcrumb
    add_breadcrumb! @index_title || e9_t(:index_title), collection_path
  end
end
