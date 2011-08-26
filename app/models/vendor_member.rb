class VendorMember < ActiveRecord::Base
  include E9Vendors::Model

  has_many :vendor_proxies, :dependent => :destroy
  has_many :vendors, :through => :vendor_proxies

  validates :name, :presence => true

  def self.add_vendor_proxy(proxy_association)
    all.each {|member| member.vendor_proxies << proxy_association.build }
  end
end
