module E9Vendors::Model
  extend ActiveSupport::Concern

  def role
    'administrator'.role
  end

  module ClassMethods
    def touch_all
      update_all(:updated_at => DateTime.now)
    end
  end
end
