class Vendor < ActiveRecord::Base
  include E9Vendors::Model

  has_and_belongs_to_many :vendor_categories
  has_many :vendor_proxies, :dependent => :destroy
  has_many :vendor_members, :through => :vendor_proxies

  validates :name,                     :presence => true
  validates :logo,                     :presence => true
  validates :contact_email,            :presence => true, :email => { :allow_blank => true }
  validates :sales_email,              :presence => true, :email => { :allow_blank => true }
  validates :short_description,        :presence => true
  validates :long_description,         :presence => true
  validates :discount_percentage,          :presence => true, :numericality => { :allow_blank => true, :greater_than_or_equal_to => 0, :less_than => 100 }
  validates :member_compensation,      :presence => true, :numericality => { :allow_blank => true, :greater_than_or_equal_to => 0, :less_than => 100 }
  validates :landing_page,             :presence => true

  mount_uploader :logo, LogoUploader

  def self.all_proxies
    all.map {|vendor| vendor.vendor_proxies.build }
  end
end
