class VendorMemberObserver < ActiveRecord::Observer
  observe :vendor_member

  #
  # Assign hash_id before save (for gets)
  #
  def before_save(record)
    record.md5_hash = Digest::MD5.hexdigest("#{record.name}/#{DateTime.now}") if record.md5_hash.blank?
  end

  #
  # build and assign a new set of vendor proxies after creation 
  #
  def after_create(record)
    record.vendor_proxies = Vendor.all_proxies
  end
end
