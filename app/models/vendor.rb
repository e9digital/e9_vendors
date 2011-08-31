class Vendor < ActiveRecord::Base
  include E9Vendors::Model

  has_and_belongs_to_many :vendor_categories
  has_many :vendor_proxies, :dependent => :destroy
  has_many :vendor_members, :through => :vendor_proxies

  validates :name,                     :presence => true
  validates :logo,                     :presence => true
  validates :sales_email,              :presence => true, :email => { :allow_blank => true }
  validates :short_description,        :presence => true
  validates :long_description,         :presence => true
  validates :landing_page,             :presence => true
  validates :vendor_categories,        :presence => true

  mount_uploader :logo, LogoUploader

  def self.all_proxies
    all.map {|vendor| vendor.vendor_proxies.build }
  end
end
