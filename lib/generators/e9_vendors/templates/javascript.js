;jQuery(function($) {
  $("body.controller-admin-vendor-details .links a[href$=/edit]").live('click', function(e) {
    e.preventDefault();
    $.fn.colorbox({ href: $(this).attr('href') });
  });

  // NOTE this uses livequery
  $("body.controller-admin-vendor-details form.edit_vendor_detail input[type=checkbox]").livequery('change', function(e) {
    $(this).closest('form').callRemote();
  });

  $("body.controller-admin-associations .links a[href$=/widget_code]").live('click', function(e) {
    e.preventDefault();
    $.fn.colorbox({ transition:'none', html:"<h1>Widget Code</h1>" + $(this).next('.tooltip').html() });
  });
});
