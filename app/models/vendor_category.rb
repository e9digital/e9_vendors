class VendorCategory < ActiveRecord::Base
  include E9Vendors::Model

  has_and_belongs_to_many :vendors

  validates :name, :presence => true

  scope :widget_visible, lambda {
    joins(:vendors => :vendor_proxies).group('vendor_categories.id') & VendorProxy.widget_visible
  }

  scope :ordered, lambda { order(:position) }

  # On updates, all members are touched, ensuring that widget JSON requests 
  # for the associations are pulling the most recent information
  after_save :on => :update do
    VendorMember.touch_all
  end
end
