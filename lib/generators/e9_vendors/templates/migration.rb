class CreateE9Vendors < ActiveRecord::Migration
  def self.up
    create_table :vendor_members, :force => true do |t|
      t.string   "name"
      t.string   "nickname"
      t.string   "address_1"
      t.string   "address_2"
      t.string   "city"
      t.string   "zipcode"
      t.string   "country"
      t.string   "contact_email"
      t.string   "contact_full_name"
      t.string   "contact_title"
      t.string   "contact_phone"
      t.string   "state"
      t.text     "website"
      t.text     "admin_notes"
      t.string   "logo"
      t.string   "md5_hash"
      t.timestamps
    end

    create_table :vendor_categories, :force => true do |t|
      t.string   "name"
      t.integer  "position"
      t.timestamps
    end

    create_table :vendor_categories_vendors, :force => true, :id => false do |t|
      t.references :vendor_category, :vendor
    end 

    create_table :vendor_proxies, :force => true do |t|
      t.references :vendor, :vendor_member
      t.boolean  "display_on_widget",                                  :default => true
      t.string   "discount_code"
      t.string   "sales_full_name"
      t.string   "sales_title"
      t.string   "sales_phone"
      t.string   "sales_email"
      t.decimal  "discount_percentage", :precision => 10, :scale => 2
      t.text     "landing_page"
      t.timestamps
    end

    create_table :vendors, :force => true do |t|
      t.references :vendor_category
      t.integer  "position"
      t.string   "name"
      t.string   "nickname"
      t.string   "address_1"
      t.string   "address_2"
      t.string   "city"
      t.string   "zipcode"
      t.string   "country"
      t.string   "contact_email"
      t.string   "contact_full_name"
      t.string   "contact_title"
      t.string   "contact_phone"
      t.string   "state"
      t.text     "website"
      t.text     "admin_notes"
      t.boolean  "display_on_widget_contact_form",                                :default => true
      t.string   "sales_email"
      t.string   "sales_full_name"
      t.string   "sales_title"
      t.string   "sales_phone"
      t.text     "short_description"
      t.text     "long_description"
      t.text     "default_landing_page"
      t.decimal  "discount_percentage",     :precision => 10, :scale => 2
      t.decimal  "member_compensation", :precision => 10, :scale => 2
      t.string   "logo"
      t.timestamps
    end

    add_column :settings, :e9_vendors_widget_title,      :string
    add_column :settings, :e9_vendors_widget_form_title, :string
    add_column :settings, :e9_vendors_widget_form_text,  :text
  end

  def self.down
  end
end
