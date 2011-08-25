class VendorsDecorator < BaseDecorator
  allows :id, :role, :remove_logo!

  protected 

  class << self
    delegate :lookup_ancestors, :i18n_scope, :to => :model_class
  end

  # simply send it all over to the model
  def method_missing(*args)
    model.send(*args)
  end

  def liquid_render(template)
    Liquid::Template.parse(template || '').render(liquid_context)
  end

  def config_render(key)
    liquid_render(E9::Config[key])
  end

  def liquid_context
    # from base_controller
    h.liquid_env
  end
end
