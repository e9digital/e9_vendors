module E9Vendors
  autoload :VERSION,    'e9_vendors/version'
  autoload :Model,      'e9_vendors/model'
  autoload :Controller, 'e9_vendors/controller'

  def E9Vendors.configure
    yield self
  end

  def E9Vendors.init!
  end

  class Engine < ::Rails::Engine
    config.e9_vendors = E9Vendors

    config.active_record.observers ||= []
    config.active_record.observers |= [
      :vendor_member_observer,
      :vendor_observer
    ]

    config.to_prepare { E9Vendors.init! }
  end
end
