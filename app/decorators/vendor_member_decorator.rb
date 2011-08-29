class VendorMemberDecorator < VendorsDecorator
  decorates :vendor_member

  def as_json(options = {})
    {
      :name => model.name,
      :address_1 => model.address_1,
      :address_2 => model.address_2,
      :admin_notes => model.admin_notes,
      :categories => VendorCategoryDecorator.decorate(VendorCategory.widget_visible.ordered),
      :city => model.city,
      :contact_email => model.contact_email,
      :contact_full_name => model.contact_full_name,
      :contact_phone => model.contact_phone,
      :contact_title => model.contact_title,
      :country => model.country,
      :nickname => model.nickname,
      :state => model.state,
      :vendors => VendorProxyDecorator.decorate(model.vendor_proxies.widget_visible),
      :website => model.website,
      :widget_form_text => h.kramdown(config_render(:e9_vendors_widget_form_text)),
      :widget_form_title => h.kramdown(config_render(:e9_vendors_widget_form_title)),
      :widget_title => h.kramdown(config_render(:e9_vendors_widget_title)),
      :zipcode => model.zipcode
    }
  end

  def widget_code
    <<-CODE
<script type="text/javascript" src="#{script_url}"></script>
<script type="text/javascript">
  try {
    new E9.VendorWidget({
      code: "#{model.md5_hash}",
       url: "#{base_url}"
    }).render();
  } catch (e) {}
</script>
    CODE
  end
  
  protected

  def script_url
    dir = Rails.env.development? && 'javascripts' || 'assets'
    "#{base_url}/#{dir}/vendor-widget.js"
  end

  def base_url
    h.request.protocol + h.request.host_with_port
  end

  def liquid_context
    super.merge({
      'member_name'     => self.name,
      'member_nickname' => self.nickname
    })
  end
end
