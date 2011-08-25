class LogoUploader < BaseUploader
  self.specified_dimensions = proc { Array.new(2, E9::Config[:e9_vendors_logo_size]) }

  process :convert        => :png
  process :resize_to_fill => specified_dimensions if specified_dimensions?

  def filename
    "#{model.class.to_s.underscore}_logo.png" if present?
  end

  def default_url
    File.join(host, DEFAULTS_BASE_PATH, "upload_image_thumb.png")
  end
end
