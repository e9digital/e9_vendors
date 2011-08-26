class VendorProxy < ActiveRecord::Base
  include E9Vendors::Model

  belongs_to :vendor, :touch => true
  belongs_to :vendor_member, :touch => true

  before_validation :populate_default_discount_code

  validates :sales_email,         :email => { :allow_blank => true }

  delegate :name, :to => :vendor, :prefix => true

  scope :widget_visible, lambda { where(:display_on_widget => true) }

  PROXIED_COLUMNS = %w(
    discount_percentage
    landing_page
    sales_full_name
    sales_title
    sales_phone
    sales_email
  )

  PROXIED_COLUMNS.each do |column|
    class_eval %Q[def #{column}; vendor_fallback(:#{column}) end]
  end

  protected

  def populate_default_discount_code
    self.discount_code = self.discount_code.presence || "V-#{self.vendor.id}-#{self.vendor_member.id}"
  end

  def vendor_fallback(column)
    read_attribute(column).presence || vendor.send(column)
  end
end
