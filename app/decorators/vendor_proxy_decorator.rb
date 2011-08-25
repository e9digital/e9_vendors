class VendorProxyDecorator < VendorsDecorator
  decorates :vendor

  def as_json(options={})
    {
      :id => self.id,
      :address_1 => vendor.address_1,
      :address_2 => vendor.address_2,
      :admin_notes => vendor.admin_notes,
      :city => vendor.city,
      :categories => VendorCategoryDecorator.decorate(vendor.vendor_categories),
      :contact_email => vendor.contact_email,
      :contact_full_name => vendor.contact_full_name,
      :contact_phone => vendor.contact_phone,
      :contact_title => vendor.contact_title,
      :country => vendor.country,
      :discount_code => self.discount_code,
      :discount_percentage => self.discount_percentage,
      :discount_percentage => vendor.discount_percentage,
      :display_on_widget => self.display_on_widget,
      :display_on_widget_contact_form => vendor.display_on_widget_contact_form,
      :landing_page => self.landing_page,
      :logo => vendor.logo_url,
      :long_description => liquid_render(vendor.long_description),
      :member_compensation => vendor.member_compensation,
      :name => vendor.name,
      :nickname => vendor.nickname,
      :sales_email => self.sales_email,
      :sales_email => vendor.sales_email,
      :sales_full_name => self.sales_full_name,
      :sales_phone => self.sales_phone,
      :sales_title => self.sales_title,
      :short_description => liquid_render(vendor.short_description),
      :state => vendor.state,
      :website => vendor.website,
      :zipcode => vendor.zipcode
    }
  end
  
  def sales_info_array
    [model.sales_full_name, model.sales_title, model.sales_phone, model.sales_email].reject(&:blank?)
  end

  def landing_page_url
    model.landing_page =~ /^https?:/ ? model.landing_page : "http://#{model.landing_page}"
  end

  def label_with_default(column)
    "#{model.class.human_attribute_name(column)}".tap do |retv|
      if (v = model.vendor.send(column)) && v.present?
        retv << ' '
        retv << h.e9_t(:vendor_default, :default_value => v)
      end
    end
  end

  protected

  def liquid_context
    super.merge({
      'vendor_discount_code'       => model.discount_code,
      'vendor_sales_full_name'     => model.sales_full_name,
      'vendor_sales_title'         => model.sales_title,
      'vendor_sales_phone'         => model.sales_phone,
      'vendor_sales_email'         => model.sales_email,
      'vendor_landing_page'        => model.landing_page,
      'vendor_discount_percentage' => model.discount_percentage,
      'vendor_name'                => vendor.name,
      'vendor_nickname'            => vendor.nickname,
      'member_name'                => vendor_member.name,
      'member_nickname'            => vendor_member.nickname
    })
  end
end
