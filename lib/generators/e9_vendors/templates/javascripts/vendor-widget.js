/*!
 * e9Digital Vendor Widget - http://www.e9digital.com
 * Copyright (C) 2011 e9Digital
 * Author: Travis Cox
 *
 * For the documented source see http://www.e9digital.com/javascripts/vendor-widget.js
 *
 * Basic Usage:
   <script type="text/javascript" src="http://%{Your Host}/assets/vendor-widget.js"></script>
   <script type="text/javascript">
     new E9.VendorWidget({
       code: "your provided widget code",
       url: "%{Your Host}"
     }).render();
   </script>
 *
 * In addition to "code" several other options are available, including callbacks
 * which provide access to the Widget and its generated HTML, these documentation
 * for these options can be found at the above url.
 */

/**
  * @namespace E9 VendorWidget public namespace
  */
E9 = window.E9 || {};

(function() {
  if (E9 && E9.VendorWidget) return;

  /**
   * @constructor
   * @param {Object} opts the configuration options for the page
   */
  E9.VendorWidget = function(opts) {
    this.init(opts);
  }

  E9.VendorWidget.jsonP = function(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    var head = document.getElementsByTagName('head')[0];
    head.insertBefore(script, head.firstChild);

    callback(script);
    return script;
  }

  var

  /*
    Developed by Robert Nyman, http://www.robertnyman.com
    Code/licensing: http://code.google.com/p/getelementsbyclassname/
  */	
  getElementsByClassName = function (className, tag, elm){
    if (document.getElementsByClassName) {
      getElementsByClassName = function (className, tag, elm) {
        elm = elm || document;
        var elements = elm.getElementsByClassName(className),
            nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
            returnElements = [],
            current;
        for(var i=0, il=elements.length; i<il; i+=1){
          current = elements[i];
          if(!nodeName || nodeName.test(current.nodeName)) {
            returnElements.push(current);
          }
        }
        return returnElements;
      };
    }
    else if (document.evaluate) {
      getElementsByClassName = function (className, tag, elm) {
        tag = tag || "*";
        elm = elm || document;
        var classes = className.split(" "),
            classesToCheck = "",
            xhtmlNamespace = "http://www.w3.org/1999/xhtml",
            namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
            returnElements = [],
            elements,
            node;
        for(var j=0, jl=classes.length; j<jl; j+=1){
          classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
        }
        try	{
          elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
        }
        catch (e) {
          elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
        }
        while ((node = elements.iterateNext())) {
          returnElements.push(node);
        }
        return returnElements;
      };
    }
    else {
      getElementsByClassName = function (className, tag, elm) {
        tag = tag || "*";
        elm = elm || document;
        var classes = className.split(" "),
            classesToCheck = [],
            elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
            current,
            returnElements = [],
            match;
        for(var k=0, kl=classes.length; k<kl; k+=1){
          classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
        }
        for(var l=0, ll=elements.length; l<ll; l+=1){
          current = elements[l];
          match = false;
          for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
            match = classesToCheck[m].test(current.className);
            if (!match) {
              break;
            }
          }
          if (match) {
            returnElements.push(current);
          }
        }
        return returnElements;
      };
    }
    return getElementsByClassName(className, tag, elm);
  },

  // basic implementation to get the y position
  // of an element (the page attempts to scroll to it after form completion)
  getYPos = function(el) {
    var pos = 0;
    try {
      if (el.offsetParent) {
        do {
          pos += el.offsetTop;
        } while (el = el.offsetParent);
      }
    } catch (e) {
    } finally {
      return pos;
    }
  },

  /*
   * helper function to check if an object is "empty"
   */
  isEmpty = function(obj) {
    for(var i in obj) { if (obj.hasOwnProperty(i)){return false;}}
    return true;
  },

  /*
   * helper function to check for IE
   */
  browser = function() {
    var rv = 999, 
        ua = navigator.userAgent,
        re = new RegExp("MSIE ([0-9]+[\.0-9]{0,})");

    if (re.exec(ua) != null) rv = parseFloat( RegExp.$1 );

    return { version: rv };
  },
  
  isFirebug = function() { 
    var retv = false;
    try {
      retv = window.hasOwnProperty('console');
    } catch(e) {
    } finally {
      return retv;
    }
  },

  head = function() {
    return document.getElementsByTagName("head")[0];
  },

  addHeadElement = function(el) {
    head().appendChild(el);
  },

  removeHeadElement = function(el) {
    head().removeChild(el);
  },

  /* 
   * helper function to create element tags.
   * attrs accepts a hash of attributes or a string id 
   *
   * writes a singleton tag unless content is passed.
   * to force a closing tag with no content, pass an empty string.
   */
  tag = function(element, attrs, content) {
    if (!attrs) attrs = {};

    var html = '<' + element;
    if (typeof attrs == 'string') {
      html += ' id="' + attrs + '"';
    } else {
      for (var attr in attrs) {
        html += ' '+attr+'="'+attrs[attr]+'"';
      }
    }

    if (typeof content == 'string') {
      html += '>'+content+'</' + element + '>';
    } else {
      html += '/>';
    }

    return html;
  },

  /* 
   * helper function to create divs, simple interface to #tag
   */
  div = function(attrs, content) {
    return tag('div', attrs, content);
  },

  boolCheckbox = function(default_value, attrs, label) {
    attrs['type'] = 'checkbox';
    attrs['checked'] = 'checked';
    attrs['value'] = '0';
    attrs['style'] = 'display:none;visibility:hidden';

    var retv = tag('input', attrs);

    if (!default_value) delete attrs['checked'];
    delete attrs['style'];
    attrs['value'] = '1';

    retv += tag('input', attrs);

    if (label) retv += tag('label', {'class':'e9-label'}, label);

    return retv;
  },

  timestamp = function() {
    return new Date().getTime();
  },

  wait = function(options) {
    options.success = options.success || function() {};
    options.until = options.until || function() { return false; };
    options.error = options.error || function() {};
    options.timeout = options.timeout || 5000;
    options.interval = options.interval || 2;

    var start = timestamp(), elapsed, now;

    window.setTimeout(function() {
      now = timestamp();
      elapsed = now - start;

      if (options.until(elapsed)) {
        options.success();
        return false;
      }
      
      if (now >= start + options.timeout) {
        options.error();
        return false;
      }

      window.setTimeout(arguments.callee, options.interval);
    }, options.interval)
  },

  resetForm = function() {
    var form   = document.getElementById('e9-form'),
        inputs = form.getElementsByTagName('input');

    for (var i=0;i<inputs.length;i++) {
      if(inputs[i].type == 'text') { inputs[i].value = ''; }
    }
  }
 
  E9.VendorWidget.COUNT = 0;
  E9.VendorWidget.ERROR_MESSAGE = '\
    <h3 id="e9-timeout-message">Error loading content.</h3>\
    <p>The vendor list is down for scheduled maintenance.  Please check back soon.</p>';

  E9.VendorWidget.prototype = function () {
    var 
      
    // recaptcha key is unchangeable client side as it corresponds to 
    // the private key held on the server
    recaptchaPublicKey = "6LfGdMASAAAAAHfYpORJWsFUtqJGM7WhxMElUMlo",

    defaults = {
        /**
         * The element ID of the div where the widget should be written.
         *
         * The init process first looks for an existing element by this ID.
         * If found it will use it as the base HTML element where the widget is
         * written.  If not found, it will create it in place wherever 
         * E9.VendorWidget#render is called, with the ID defined here.
         *
         * This means there are two ways to call VendorWidget#render:
         *
         * A. Inline:
         * <div id="foo">
         *   <script type="text/javascript">
         *     new E9.VendorWidget({
         *       code: 'yourcode'
         *     }).render();
         *   </script>
         * </div>
         *
         * B. Deferred:
         * <div id="foo"></div>
         * ...
         * <script type="text/javascript">
         *   new E9.VendorWidget({
         *     code: 'yourcode',
         *     elementId: 'foo'
         *   }).render();
         * </script>
         *
         * In case A, the widget will be written in place where it is called.
         * In case B, the widget will be written inside the div "foo" that 
         * already exists.  In this way you could defer the loading til the end 
         * of the page, or in, for example, the jQuery.ready handler;
         *
         * Note that in case B, if elementId is passed but does not exist, 
         * the widget will still write itself in place, but inside an element 
         * with the ID passed.
         */
        elementId: 'e9-widget-container',

        /**
         * By default the widget prepends a stylesheet link to <head> which 
         * contains widget specific styles (plus an additional IE stylesheet if
         * an IE browser is detected).
         *
         * Passing this as false prevents the style load from happening.
         */
        styles: true,

        /**
         * A callback which occurs at the end of the init process, before render.
         * At this point the widget is fully configured, but waiting on initial
         * response from the server before rendering HTML.
         *
         * To manipulate HTML you should not use this, but onRender
         *
         * @param {Function} widget The E9.VendorWidget instance being created
         */
        onInit: function(widget) {},

        /**
         * A callback which occurs after the HTML has been rendered, immediately
         * before it is made visible.  At this point you have access to all the 
         * HTML generated by the widget, referenced by the widget property 'element'.
         *
         * @param {Function} widget the E9.VendorWidget instance being created
         */
        onRender: function(widget) {},

        /**
         * Callback that occurs on timeout error.  You may override this if, e.g.
         * you wanted to change the error message or HTML.
         */
        onError: function(widget) {},

        /**
         * the timeout to wait for a response from the server before displaying
         * an error.
         */
        timeout: 10000,

        /**
         * the timeout to wait for a response from the google recaptcha server before displaying
         * an error.
         */
        recaptcha_timeout: 10000,

        /**
         * The html tag used for widget headings.  The class of these elements
         * is 'e9-heading', regardless of the tag.
         */
        headingTag: 'h2',

        /**
         * The html tag used for widget subheadings.  The class of these elements
         * is 'e9-subheading', regardless of the tag.
         */
        subheadingTag: 'h3',

        /**
         * The text of the "Show Description" links which show or hide the long
         * description for each vendor.
         */
        showDescText: 'View More Info',

        /**
         * The recaptcha theme used.
         *
         * Accepted options: red, white, blackglass, clean
         *
         * For details, see: 
         * http://code.google.com/apis/recaptcha/docs/customization.html
         * 
         */
        recaptchaTheme: 'white'
    };

    return {
      init: function(opts) {
        var that = this, html;

        opts = opts || {};

        this.url = opts.url || '';

        // if url is protocol relative, prepend protocol
        if (/^\/\//.test(this.url)) {
          this.url = location.protocol + this.url;
        
        // else if we're https, ensure the url is
        } else if (location.protocol.match(/^https/)) {
          this.url = this.url.replace(/^http:/, 'https:');
        }

        // cut trailing / from url if present
        if (/\/$/.test(this.url)) this.url = this.url.substr(0, this.url.length - 1);

        // defines a callback in case of more than one widget on a page (unlikely)... 
        this.callback = 'cb' + ++E9.VendorWidget.COUNT;

        // and defines a global callback on E9.VendorWidget for jsonp
        E9.VendorWidget[this.callback] = function(response) {
          clearTimeout(that.jsonRequestTimer);
          that.renderHtmlFromResponse(response);
          that.removeScriptElement();
        }

        // code must be passed
        if (!opts.url) {
          html = tag('h3', {'class':'e9-error'}, 'E9.VendorWidget requires a script url');
        } else if (!opts.code) {
          html = tag('h3', {'class':'e9-error'}, 'E9.VendorWidget requires that you pass a code identifying yourself as a member');
        } else {
          html = tag('h3', {'class':'e9-loading'}, 'Loading...');
          this.scriptUrl = this.url + '/directory/members/' + opts.code + '.json?jsonp=E9.VendorWidget.' + this.callback;
          this.formUrl = this.url + '/contact_requests.json';
        }

        /* form is currently off */
        this.showForm = false;

        this.recaptchaPublicKey = recaptchaPublicKey;
        this.recaptchaTheme     = opts.recaptchaTheme || defaults.recaptchaTheme;
        this.recaptcha_timeout  = opts.recaptcha_timeout || defaults.recaptcha_timeout;

        this.styles        = opts.hasOwnProperty('styles') ? opts.styles : true 
        this.timeout       = opts.timeout       || defaults.timeout;
        this.elementId     = opts.elementId     || defaults.elementId;
        this.onRender      = opts.onRender      || defaults.onRender;
        this.onInit        = opts.onInit        || defaults.onInit;
        this.timeout       = opts.timeout       || defaults.timeout;
        this.headingTag    = opts.headingTag    || defaults.headingTag;
        this.subheadingTag = opts.subheadingTag || defaults.subheadingTag;
        this.showDescText  = opts.showDescText  || defaults.showDescText;

        this.element = document.getElementById(this.elementId);
        if (!this.element) {
          document.write(div(this.elementId, ''));
          this.element = document.getElementById(this.elementId);
        }
        if (opts.width) this.element.style.width = opts.width;
        if (opts.height) this.element.style.height = opts.height;
        this.element.innerHTML = html;

        this.onInit(this);
      },

      removeScriptElement: function() {
        removeHeadElement(this.scriptElement);
      },

      addReCAPTCHAScript: function() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        // NOTE protocol relative recaptcha url
        script.src = "//www.google.com/recaptcha/api/js/recaptcha_ajax.js";

        var head = document.getElementsByTagName('head')[0];
        head.insertBefore(script, head.firstChild);
      },

      displayReCAPTCHA: function() {
        Recaptcha.create(this.recaptchaPublicKey, "e9-recaptcha", {
          theme: this.recaptchaTheme,
          callback: function() {}
        });
      },

      addStylesheets: function() {
        var link = document.createElement("link");
        link.href = this.url + "/stylesheets/e9-widget.css";
        link.rel = "stylesheet";
        link.type = "text/css";
        addHeadElement(link);

        if (browser().version < 8) {
          link = document.createElement("link");
          link.href = this.url + "/stylesheets/e9-widget-ie.css";
          link.rel = "stylesheet";
          link.type = "text/css";
          addHeadElement(link);
        }
      },

      setTimeout: function(e) {
        var that = this;
        this.jsonRequestTimer = window.setTimeout(function() {
          that.element.innerHTML = E9.VendorWidget.ERROR_MESSAGE;
        }, this.timeout);
      },

      getFieldElements: function() {
        var elements = new Array();
        try {
          elements.push(document.getElementById('e9-form-name'));
          elements.push(document.getElementById('e9-form-phone'));
          elements.push(document.getElementById('e9-form-email'));
        } catch(e) {
        } finally {
          return elements;
        }
      },

      getShowLinks: function() {
        var showlinks = new Array();
        try {
          var links = document.getElementById('e9-vendor-list').getElementsByTagName('a');
          for(var i=0;i<links.length;i++) {
            if(links[i].name == 'e9-ldl') { showlinks.push(links[i]); }
          }
        } catch (e) {
        } finally {
          return showlinks;
        }
      },

      renderHtmlFromResponse: function(response) {
        if (isFirebug()) console.dir(response);

        if (response && typeof response === 'object' && response.type == 'contact-request' || response.type == 'member') {
          var that = this, html = '';

          if (response.type == 'contact-request') {
            // reload the captcha no matter what, it's not good for a 2nd pass.
            Recaptcha.reload();
            
            // re-enable the submit button if it was disabled on press
            var submit = document.getElementById('e9-form-submit');
            if (submit) { submit.removeAttribute('disabled'); }

            var m = document.getElementById('e9-feedback');

            if (isEmpty(response.errors)) {
              m.className = 'e9-feedback e9-feedback-success';
              resetForm();

              html = 'Your request has been submitted.';
            } else {
              var field;
              m.className = 'e9-feedback e9-feedback-error';
              for (var e in response.errors) {
                if (field = document.getElementById('e9-form-' + e)) {
                  field.className = 'e9-field e9-field-error';
                }
                html += div({'class':'e9-feedback-error-field'}, response.errors[e])
              }
            }

            m.innerHTML = html;
            m.style.display = 'block';

            window.scrollTo(0, getYPos(m));
          } else {
            response = response.resource;

            // TODO these html buffer variables are a bit chaotic...
            var vc, vendor, contentHtml = '', formHtml = '', formHtmlInner, fHtml, cHtml, vHtml, vHtmlInner;

            var vendorlist = '', optionList = '';

            optionList += tag('option', {'value': 0}, 'All');
            response.categories.forEach(function(c) {
              optionList += tag('option', {'value': c.id }, c.name);
            });

            contentHtml += tag(that.subheadingTag, {'id':'e9-contact-form-heading','class':'e9-subheading'}, response.widget_form_title);
            contentHtml += tag('select', {'id':'e9-category-select'}, optionList);
            contentHtml += div({'class':'e9-text'}, response.widget_form_text);

            response.vendors.forEach(function(vendor) {
              vHtml = '';
              formHtmlInner = '';

              // next if vendor is not present or it shouldn't display
              if (!vendor || !vendor.display_on_widget) return;

              vHtmlInner = '';

              // logo
              if (vendor.logo) {
                vHtmlInner += div({'class':'e9-vendor-logo'}, tag('img', {'src':vendor.logo}));
              }

              var cbHtml = '', vendorClass = 'e9-vendor';

              // title
              cbHtml += div({'class':'e9-vendor-name'}, vendor.name);

              // short desc & link
              cbHtml += div({'class':'e9-vendor-short-description'}, 
                vendor.short_description + ' ' +
                tag('a', {'data-id':vendor.id, 'class':'e9-show-desc-link', 'name':'e9-ldl', href:'javascript:;'}, that.showDescText)
              );

              // long desc
              cbHtml += div({'style':'display:none', 'class':'e9-vendor-long-description', 'id':'e9-ld'+vendor.id}, vendor.long_description);
              
              vHtmlInner += div({'class':'e9-vendor-content'}, cbHtml);

              vendor.categories.forEach(function(cat) {
                vendorClass += ' e9-c' + cat.id;
              });

              // wrap it up
              vendorlist += div({'class': vendorClass}, vHtmlInner);

              // continue if there is no contact form, or vendor shouldn't display on it
              if (!that.showForm || !vendor.display_on_widget_contact_form) return;

              // otherwise add them
              formHtmlInner += div({'class':'e9-field'}, 
                tag('input', {
                    'name':'contact_request[vendor_detail_ids][]',
                    'type':'checkbox',
                    'value':vendor.id,
                    'checked':'checked'
                }) + 
                tag('label', {'class':'e9-label'}, vendor.name)
              );

              if (formHtmlInner.length) {
                fHtml = div({'class':'e9-vendor-category-name'}, vc),
                fHtml += div({'class':'e9-vendors'}, formHtmlInner);
                formHtml += div({'class':'e9-vendor-category'}, fHtml);
              }
            });

            contentHtml += div({'id':'e9-vendor-list'}, vendorlist);

            if (that.showForm) {
              // if vendors were added to formHtml, wrap them in fieldset
              if (formHtml.length) {
                formHtml = 
                  tag('fieldset', {'class':'e9-fieldset e9-checkbox'}, 
                    tag('legend', 'e9-fieldset-legend', 'Vendors') +
                    formHtml
                  )
                ;
              }

              formHtml += div({'class':'e9-field', 'id':'e9-form-name'}, 
                tag('label', {'class':'e9-label e9-req'}, 'Full Name *') +
                tag('input', { 'name':'contact_request[name]', 'type':'text' })
              );

              formHtml += div({'class':'e9-field', 'id':'e9-form-email'}, 
                tag('label', {'class':'e9-label e9-req'}, 'Contact Email *') +
                tag('input', { 'name':'contact_request[email]', 'type':'text' })
              );

              formHtml += div({'class':'e9-field', 'id':'e9-form-phone'}, 
                tag('label', {'class':'e9-label'}, 'Contact Phone') +
                tag('input', { 'name':'contact_request[phone]', 'type':'text' })
              );

              formHtml += div("e9-recaptcha", '');
              
              formHtml += div({'class':'e9-actions'},
                tag('input', { 
                  'id':'e9-form-submit',
                  'name':'e9-form-submit', 
                  'type':'submit',
                  'value':'Submit'
                })
              );

              contentHtml += div({'id':'e9-form'}, formHtml);
              contentHtml += div({'id':'e9-feedback', 'class':'e9-feedback', 'style':'display:none'}, '');
            }

            html += tag(that.headingTag, {'id':'e9-heading','class':'e9-heading'}, response.widget_title);
            html += div('e9-content', contentHtml);

            // hide the element so it can be manipulated by onRender
            this.element.style.display = 'none';

            this.element.innerHTML = div('e9-widget', html);

            var select  = document.getElementById('e9-category-select'),
                     el = this.element,
                vendors = document.getElementsByClassName('e9-vendor', 'div', el);

            function toggleViz(v, els) {
              for (i in els) {
                if (els.hasOwnProperty(i)) els[i].style.display = v ? 'block' : 'none';
              }
            }

            select.onchange = function() {
              if (this.value == '0') {
                toggleViz(true, vendors);
              } else {
                toggleViz(false, vendors);
                toggleViz(true, getElementsByClassName('e9-c'+this.value, 'div', el));
              }
            }

            var showlink, showlinks = this.getShowLinks();
            for (var i=0;i<showlinks.length;i++) {
              showlink = showlinks[i];

              showlink['element'] = document.getElementById('e9-ld' + showlink.attributes['data-id'].value);

              showlink.onclick = function() {
                this.element.style.display = this.element.style.display == 'none' ? 'block' : 'none';
              }

              showlink.onmouseover = function() { 
                window.status = 'Toggle full description'; 
                return true; 
              }
            }

            if (this.showForm) {
              var form   = document.getElementById('e9-form'),
                  submit = document.getElementById('e9-form-submit');

              submit.onclick = function(e) {
                this.setAttribute("disabled", "disabled");
   
                var fields = that.getFieldElements();
                for(var i=0;i<fields.length;i++) {
                  fields[i].className = 'e9-field';
                }

                var inputs = form.getElementsByTagName('input');

                var formData = '', formLen  = inputs.length;
                for(var i=0;i<formLen;i++) {
                  if(!inputs[i].name) continue;
                  if(inputs[i].type == 'submit') continue;
                  if(inputs[i].type != 'checkbox' || inputs[i].checked) {
                    formData += inputs[i].name + '=' + encodeURIComponent(inputs[i].value) 
                  }
                  formData += '&';
                }

                formData += 'jsonp=E9.VendorWidget.' + that.callback;

                that.setTimeout();
                E9.VendorWidget.jsonP(that.formUrl + '?' + formData, function(el) {
                  that.scriptElement = el;
                });

                return false;
              }

              this.displayReCAPTCHA();
            }

            this.onRender(this);
            this.element.style.display = 'block';
          }
        } else {
          this.element.style.display = 'none';
          this.element.innerHTML = E9.VendorWidget.ERROR_MESSAGE;
          this.onError(this);
          this.element.style.display = 'block';
        }
      },

      /**
      * @access public
      * @return {Object} self
      */
      render: function() {
        that = this;

        if (this.styles) {
          this.addStylesheets();
        }

        if (this.scriptUrl) {
          function loadJSON() {
            that.setTimeout();
            E9.VendorWidget.jsonP(that.scriptUrl, function(el) { that.scriptElement = el; });
          }

          if (this.showForm) {
            this.addReCAPTCHAScript();
            wait({
              timeout : that.recaptcha_timeout,
              until   : function(elapsed) { return typeof Recaptcha !== 'undefined'; },
              error   : function() { that.element.innerHTML = E9.VendorWidget.ERROR_MESSAGE; },
              success : loadJSON
            });
          } else {
            loadJSON();
          }
        }
        return this;
      }
    };
  }();
})();
