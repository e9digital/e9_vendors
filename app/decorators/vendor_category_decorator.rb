class VendorCategoryDecorator < VendorsDecorator
  decorates :vendor_category

  def as_json(opts = {})
    {
      :id   => self.id,
      :name => self.name
    }
  end
end
