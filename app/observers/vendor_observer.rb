class VendorObserver < ActiveRecord::Observer
  observe :vendor

  #
  # On create, new VendorDetail joins are created for each existing member
  #
  def after_create(record)
    VendorMember.add_vendor_proxy(record.vendor_proxies)
  end

  #
  # On updates, all members are touched, ensuring that widget JSON requests 
  # for the members are pulling the most recent information
  #
  def after_update(record)
    VendorMember.touch_all
  end
end
