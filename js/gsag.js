(function($) {
  /* ----------------------------------------------------------------
    INIT
  ---------------------------------------------------------------- */
  $.fn.gsag = function(options) {
    var opts = $.extend({}, $.fn.gsag.defaults, options);
    
    /* ----------------------------------------------------------------
      SETUP
    ---------------------------------------------------------------- */
    CSSPlugin.defaultTransformPerspective = opts.TransformPerspective;
    TweenLite.defaultEase = eval(opts.Easing);
    
    $('[data-gsag]:not(body)').each(function() {
      /* ----------------------------------------------------------------
        INITIAL
      ---------------------------------------------------------------- */
       $.fn.gsag.tween($(this), 'gsagInitial', opts);
    });
    
    /* ----------------------------------------------------------------
      EVENT: ONSCREEN
    ---------------------------------------------------------------- */
    $('[data-gsag-trigger=onscreen]').onScreen({
       doIn: function() {
         $.fn.gsag.tween($(this), 'gsagFinal', opts);
       },
       doOut: function() {
         $.fn.gsag.tween($(this), 'gsagInitial', opts);
       }
    });
  
    /* ----------------------------------------------------------------
      EVENT: HOVER
    ---------------------------------------------------------------- */
    $('[data-gsag-trigger=hover]').on('mouseover', function() {
      $.fn.gsag.tween($(this), 'gsagFinal', opts);
    }).on('mouseout', function() {
      $.fn.gsag.tween($(this), 'gsagInitial', opts);
    });
    
    return this;
  };
  
  /* ----------------------------------------------------------------
    HELPER: PROCESS DATA ATTRIBUTES
  ---------------------------------------------------------------- */
  $.fn.gsag.process_data_attributes = function(el, expected_prefix) {
    var el_opts = { };
    $.each(el.data(), function(k, v) {
      if (k.indexOf(expected_prefix) > -1)
        el_opts[k.replace(expected_prefix, '')] = v;
    });
    return el_opts;
  }
  
  /* ----------------------------------------------------------------
    HELPER: TWEEN
  ---------------------------------------------------------------- */
  $.fn.gsag.tween = function(el, expected_prefix, defaults) {
    TweenLite.killTweensOf(el);
    var el_opts = $.fn.gsag.process_data_attributes(el, expected_prefix);
    // defaults
    var duration = el_opts.Duration || defaults.Duration;
    delete(el_opts.Duration);
    // syntax
    var options = { };
    $.each(el_opts, function(k, v) {
      options[k.charAt(0).toLowerCase() + k.slice(1)] = v;
    });
    TweenMax.to(el, duration, options);
  }
  
  /* ----------------------------------------------------------------
    DEFAULTS
  ---------------------------------------------------------------- */
  $.fn.gsag.defaults = $.fn.gsag.process_data_attributes($('body'), 'gsagDefault');

  /* ----------------------------------------------------------------
    ...
  ---------------------------------------------------------------- */
}(jQuery));