/*
A simple jQuery function that can add listeners on attribute change.
http://meetselva.github.io/attrchange/

About License:
Copyright (C) 2013 Selvakumar Arumugam
You may use attrchange plugin under the terms of the MIT Licese.
https://github.com/meetselva/attrchange/blob/master/MIT-License.txt
*/
(function(e){function t(){var e=document.createElement("p");var t=false;if(e.addEventListener)e.addEventListener("DOMAttrModified",function(){t=true},false);else if(e.attachEvent)e.attachEvent("onDOMAttrModified",function(){t=true});else return false;e.setAttribute("id","target");return t}function n(t,n){if(t){var r=this.data("attr-old-value");if(n.attributeName.indexOf("style")>=0){if(!r["style"])r["style"]={};var i=n.attributeName.split(".");n.attributeName=i[0];n.oldValue=r["style"][i[1]];n.newValue=i[1]+":"+this.prop("style")[e.camelCase(i[1])];r["style"][i[1]]=n.newValue}else{n.oldValue=r[n.attributeName];n.newValue=this.attr(n.attributeName);r[n.attributeName]=n.newValue}this.data("attr-old-value",r)}}var r=window.MutationObserver||window.WebKitMutationObserver;e.fn.attrchange=function(e,t){if(typeof e=="object"){return i._core.call(this,e)}else if(typeof e=="string"){return i._ext.call(this,e,t)}};var i={_core:function(i){var s={trackValues:false,callback:e.noop};if(typeof i==="function"){s.callback=i}else{e.extend(s,i)}if(s.trackValues){this.each(function(t,n){var r={};for(var i,t=0,s=n.attributes,o=s.length;t<o;t++){i=s.item(t);r[i.nodeName]=i.value}e(this).data("attr-old-value",r)})}if(r){var o={subtree:false,attributes:true,attributeOldValue:s.trackValues};var u=new r(function(t){t.forEach(function(t){var n=t.target;if(s.trackValues){t.newValue=e(n).attr(t.attributeName)}s.callback.call(n,t)})});return this.data("attrchange-method","Mutation Observer").data("attrchange-obs",u).each(function(){u.observe(this,o)})}else if(t()){return this.data("attrchange-method","DOMAttrModified").on("DOMAttrModified",function(e){if(e.originalEvent)e=e.originalEvent;e.attributeName=e.attrName;e.oldValue=e.prevValue;s.callback.call(this,e)})}else if("onpropertychange"in document.body){return this.data("attrchange-method","propertychange").on("propertychange",function(t){t.attributeName=window.event.propertyName;n.call(e(this),s.trackValues,t);s.callback.call(this,t)})}return this},_ext:function(t,n){switch(t){case"disconnect":return this.each(function(){var t=e(this).data("attrchange-method");if(t=="propertychange"||t=="DOMAttrModified"){e(this).off(t)}else if(t=="Mutation Observer"){e(this).data("attrchange-obs").disconnect()}}).removeData("attrchange-method")}}}})(jQuery);



















/*
  v0.0.2 (2014-05-22 17:04:51 +1000)
    - defaults
    - triggers: onScreen, hover
  v0.0.3 (2014-05-22 17:05:48 +1000)
    - dependency checks: TweenMax, $.fn.onScreen
    - triggers: click, class
    - foreign triggers: click
    - functionality: final/intial durations, final/initial delay, nesting
*/


(function($) {
  /* ----------------------------------------------------------------
    INIT
  ---------------------------------------------------------------- */
  $.fn.gsag = function(options) {
    if (typeof(TweenMax) === 'undefined') {
      alert('ERROR: TweenMax (GSAP) missing');
      return;
    }
    if (typeof($.fn.onScreen) === 'undefined') {
      console.log('WARNING: onScreen plugin missing');
    }
    
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
    if (typeof($.fn.onScreen) != 'undefined') {
      $('[data-gsag-trigger=onscreen]').onScreen({
         doIn: function() {
           $.fn.gsag.tween($(this), 'gsagFinal', opts);
         },
         doOut: function() {
           $.fn.gsag.tween($(this), 'gsagInitial', opts);
         }
      });
    }
  
    /* ----------------------------------------------------------------
      EVENT: HOVER
    ---------------------------------------------------------------- */
    $('[data-gsag-trigger=hover]').on('mouseover', function(e) {
      e.preventDefault();
      $.fn.gsag.tween($(this), 'gsagFinal', opts);
    }).on('mouseout', function(e) {
      e.preventDefault();
      $.fn.gsag.tween($(this), 'gsagInitial', opts);
    });
  
    /* ----------------------------------------------------------------
      EVENT: CLICK
    ---------------------------------------------------------------- */
    $('[data-gsag-trigger=click]').on('click', function(e) {
      e.preventDefault();
      $.fn.gsag.tween($(this), 'gsagFinal', opts);
    });
  
    /* ----------------------------------------------------------------
      EVENT: CLASS
    ---------------------------------------------------------------- */
    $('[data-gsag-trigger=class]').attrchange({
    	trackValues: true, 
    	callback: function(e) { 
  	    // e    	          - event object
  	    // e.attributeName - Name of the attribute modified
  	    // e.oldValue      - Previous value of the modified attribute
  	    // e.newValue      - New value of the modified attribute
  	    // Triggered when the selected elements attribute is added/updated/removed
        if (e.attributeName == 'class') {
          var monitored_class = $(this).data('gsag-trigger-classname');
          if ($(this).hasClass(monitored_class)) {
            $.fn.gsag.tween($(this), 'gsagFinal', opts);
          } else {
            $.fn.gsag.tween($(this), 'gsagInitial', opts);
          }
        }
    	}        
    });
    
    
    
  
    /* ----------------------------------------------------------------
      FOREIGN EVENT: CLICK
    ---------------------------------------------------------------- */
    $('[data-gsag-foreign-trigger=click]').on('click', function(e) {
      e.preventDefault();
      var selector = $(this).data('gsag-foreign-selector');
      var method = $(this).data('gsag-foreign-method');
      var argument = $(this).data('gsag-foreign-argument');
      var cmd = "$('" + selector + "')." + method + "('" + argument + "');";
      eval(cmd);
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
    var delay = el_opts.Delay || defaults.Delay;
    if (!el_opts.Duration && expected_prefix == 'gsagInitial')
      delay = 0;
    delete(el_opts.Duration);
    delete(el_opts.Delay);
    // syntax
    var options = { };
    $.each(el_opts, function(k, v) {
      options[k.charAt(0).toLowerCase() + k.slice(1)] = v;
    });
    setTimeout(function() {
      TweenMax.to(el, duration, options);
    }, delay);
    
    // children
    el.find('[data-gsag]:not([data-gsag-trigger])').each(function() {
      var el = $(this);
      TweenLite.killTweensOf(el);
      var el_opts = $.fn.gsag.process_data_attributes(el, expected_prefix);
      // defaults
      var duration = el_opts.Duration || defaults.Duration;
      var delay = el_opts.Delay || defaults.Delay;
      if (!el_opts.Duration && expected_prefix == 'gsagInitial')
        delay = 0;
      delete(el_opts.Duration);
      delete(el_opts.Delay);
      // syntax
      var options = { };
      $.each(el_opts, function(k, v) {
        options[k.charAt(0).toLowerCase() + k.slice(1)] = v;
      });
      setTimeout(function() {
        TweenMax.to(el, duration, options);
      }, delay);
    });
  }
  
  /* ----------------------------------------------------------------
    DEFAULTS
  ---------------------------------------------------------------- */
  $.fn.gsag.defaults = $.fn.gsag.process_data_attributes($('body'), 'gsagDefault');

  /* ----------------------------------------------------------------
    ...
  ---------------------------------------------------------------- */
}(jQuery));