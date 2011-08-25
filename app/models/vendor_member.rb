class VendorMember < ActiveRecord::Base
  include E9Vendors::Model

  def self.add_vendor_proxy(proxy_association)
    all.each {|member| member.vendor_proxies << proxy_association.build }
  end

  has_many :vendor_proxies, :dependent => :destroy do
    def by_category
      includes(:vendor => :vendor_categories)
        .order('vendor_categories.position')
        .group_by {|vd| vd.vendor.vendor_category.name }
    end
  end
  has_many :vendors, :through => :vendor_proxies

  mount_uploader :logo, LogoUploader

  validates :name, :presence => true
  validates :logo, :presence => true
end
