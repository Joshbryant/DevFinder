/*
| +++++++++++++++++++++++++++++++++++++++++++++++
| TABLE OF CONTENT
| +++++++++++++++++++++++++++++++++++++++++++++++
|	1. Main menu & Mega menu
|	2. Responsive multi level menu
|	3. Initialize carousel
|	4. animate elements when they are in viewport
|	5. Range slider
|	6. beautiful animated filtering and sorting products
|	7. Product album functions - used in single product page
|	8. Pretty Checkboxs and Radio buttons
|	9. Contact us form validation and submit
*/

jQuery(function($) {
	
	
	/*
	| +++++++++++++++++++++++++++++++++++++++++++++++
	| Main menu & Mega menu
	| +++++++++++++++++++++++++++++++++++++++++++++++
	*/
	
	// add class submenu to submenu's that are not megamenu
	$('.main-menu ul').each(function() {
		if ( $(this).closest('.mega-menu').length == 0 )
		{
			$(this).addClass('sub-menu');
		}
	});
	// add class has-child to each menu item that has child
	$('.main-menu li').each(function() {
		if ( $(this).find('ul').length ) 
			$(this).addClass('has-child');
	});
	
	$('.main-menu li').hoverIntent({
		// on menu mouse hover function handler
		over: function() {
			var $this = $(this),
				$mm = $this.children('.mega-menu'),
				$parent = $this.closest('.inner');
			
			// we need to setup megamenu position and width
			$mm.css({ 
				'left': ($parent.offset().left - $this.offset().left - 1) + 'px', 
				'width': $parent.outerWidth() + 'px', 
				'visibility': 'visible'
			});
			
			// now we are good and we can show the megamenu
			$this.addClass('active').children('ul, .mega-menu').animate({ 'height': 'toggle' }, 300, function() { $(this).css('overflow', 'visible'); } );
		}, 
		// mouse out handler
		out: function() {
			$(this).removeClass('active').children('ul, .mega-menu').animate({ 'height': 'toggle' }, 10, function() { $(this).css('overflow', 'visible'); } );
		},
		// A simple delay, in milliseconds, before the "out" function is called
		timeout: 200
	});
	
	
	/*
	| +++++++++++++++++++++++++++++++++++++++++++++++
	| Responsive multi level menu
	| Credits goes to: https://github.com/codrops/ResponsiveMultiLevelMenu
	| Licensed under the MIT License
	| +++++++++++++++++++++++++++++++++++++++++++++++
	*/
	$( '#dl-menu' ).dlmenu({
		animationClasses : { classin : 'dl-animate-in-5', classout : 'dl-animate-out-5' }
	});
	$(window).on('resize', function() {
		fix_mobile_menu_width();
	});
	fix_mobile_menu_width();
	function fix_mobile_menu_width() {
		var menu_width = $('#menu-container .inner').width();
		$('.dl-menuwrapper .dl-menu, .dl-menuwrapper .dl-submenu').css( 'width', menu_width );
	}
	
	
	/*
	| +++++++++++++++++++++++++++++++++++++++++++++++
	| Initialize carousel
	| +++++++++++++++++++++++++++++++++++++++++++++++
	*/
	$('.carousel-wrapper').each(function() {
		var $this = $(this), new_max;
		var configs = new Array();
		configs['autoplay'] = $this.data('autoplay') == true;
		configs['loop'] = $this.data('loop') == true;
		configs['width'] = $this.data('width');
		configs['minItems'] = $this.data('minitems');
		configs['maxItems'] = $this.data('maxitems');
		configs['slideshowspeed'] = $this.data('slideshow-speed');
		configs['speed'] = $this.data('speed');
		
		new_max = configs['maxItems'];
		var sliderW = $this.width();
		if ( sliderW >= 980 )
		{
			if ( configs['maxItems'] > 4 ) new_max = 4;
		}
		else if ( sliderW < 980 && sliderW >= 768 )
		{
			if ( configs['maxItems'] > 3 ) new_max = 3;
		}
		else if ( sliderW < 768 && sliderW >= 640 )
		{
			if ( configs['maxItems'] > 2 ) new_max = 2;
		}
		else if ( sliderW < 640 && sliderW >= 480 )
		{
			if ( configs['maxItems'] > 2 ) new_max = 2;
		}
		else
		{
			new_max = 1;
		}
		
		configs['minWidth'] = ( isNaN(configs['width']) || configs['width'] == 'undefined' ) ? sliderW / new_max : configs['width'];

		$this.children('ul').carouFredSel({
			circular: false,
			infinite: false,
			responsive: true,
			width: '100%',
			height: 'auto',
			items: {
				visible: {
					min: configs['minItems'],
					max: configs['maxItems'],
				},
				width: configs['minWidth']
			},
			scroll: {
				easing: 'easeOutQuart'
			},
			auto: false,
			prev: {
				button: function() { return $this.closest('.carousel-iframe').find('.carousel-direction-arrows .crsl-prev'); },
				key: "left",
				duration: configs['speed']
			},
			next: {
				button: function() { return $this.closest('.carousel-iframe').find('.carousel-direction-arrows .crsl-next'); },
				key: "right",
				duration: configs['speed']
			},
			swipe: {
				onMouse: true,
				onTouch: true
			},
			onCreate: function () {
				carousel_height( $this );
				$(window).on('resize', function() {
					carousel_height( $this );
				});
			}
		});
			
	});
	
	function carousel_height( $this )
	{
		$this.imagesLoaded(function() {
			var max = 0;
			$this.find('li').each(function() {
				if ( $(this).outerHeight() > max )
				{
					max = $(this).outerHeight();
				}
			});
			$this.find('.carousel-list, .caroufredsel_wrapper').css( 'height', max + 'px' );
		});
	}
	
	
	
	/*
	| +++++++++++++++++++++++++++++++++++++++++++++++
	| animate elements when they are in viewport
	| +++++++++++++++++++++++++++++++++++++++++++++++
	*/
	$('.noIE .animated').waypoint(function() {
		var animation = $(this).data('animation');
		$(this).addClass('animation-done').addClass(animation);
	}, { 
		triggerOnce: true,
		offset: '60%' 
	});
	
	
	
	

	/*
	| +++++++++++++++++++++++++++++++++++++++++++++++
	| Range slider
	| +++++++++++++++++++++++++++++++++++++++++++++++
	*/
	$('.range-slider').each(function() {
		var $this = $(this),
			configs = new Array();
		
		configs['min'] = ( $this.data('min') === undefined ) ? 0 : $this.data('min');
		configs['max'] = ( $this.data('max') === undefined ) ? 100 : $this.data('max');
		configs['start'] = ( $this.data('start') === undefined ) ? [10, 90] : $this.data('start');
		configs['step'] = ( $this.data('step') === undefined ) ? 1 : $this.data('step');
		
		var percentage = {
			to : function (range, value) {
				value = range[0] < 0 ? value + Math.abs(range[0]) : value - range[0];
				return (value * 100) / this._length(range);
			},
			_length : function (range) {
				return (range[0] > range[1] ? range[0] - range[1] : range[1] - range[0]);
			}
		}
		
		$this.noUiSlider({
			range: [configs['min'], configs['max']],
			start: configs['start'],
			step: configs['step'],
			slide: function() {
				var values = $(this).val(),
					range = $this.data('setup').settings.range;
					
				$this.siblings('.range-slider-value').find('> .min').text( '$' + values[0] ).css({ 'left': percentage.to(range, values[0]) + '%', 'visibility': 'visible', 'margin-left': (-0.6) * $this.siblings('.range-slider-value').find('> .min').outerWidth() });
				$this.siblings('.range-slider-value').find('> .max').text( '$' + values[1] ).css({ 'left': percentage.to(range, values[1]) + '%', 'visibility': 'visible', 'margin-left': (-0.6) * $this.siblings('.range-slider-value').find('> .max').outerWidth() });
			}
		});
		
		var settings = $this.data('setup').settings;
		$this.siblings('.range-slider-value').find('> .min').text( '$' + settings.start[0] ).css({ 'left': percentage.to(settings.range, settings.start[0]) + '%', 'visibility': 'visible', 'margin-left': (-0.6) * $this.siblings('.range-slider-value').find('> .min').outerWidth() });
		$this.siblings('.range-slider-value').find('> .max').text( '$' + settings.start[1] ).css({ 'left': percentage.to(settings.range, settings.start[1]) + '%', 'visibility': 'visible', 'margin-left': (-0.6) * $this.siblings('.range-slider-value').find('> .max').outerWidth() });
	});
	

	/*
	| +++++++++++++++++++++++++++++++++++++++++++++++
	| beautiful animated filtering and sorting products
	| +++++++++++++++++++++++++++++++++++++++++++++++
	*/
	var $products = $('#product-list-container'),
		layout_mode = $products.data('layout');
	
	if ( typeof layout_mode == 'undefined' || typeof layout_mode === undefined )
	{
		layout_mode = 'grid';
	}
	
	$('.display-mode li > a').on('click', function(e) {
		if ( $('.noIE').length )
		{
			e.preventDefault();
		}
		var $this = $(this);
		
		$this.parent().siblings('.active').removeClass('active');
		$this.parent().addClass('active');
		
		if ( $this[0].id == 'list-mode' )
		{
			$products.mixitup('toList');
		}
		else
		{
			$products.mixitup('toGrid');
		}
		
	});
	
	if ( typeof $.fn.mixitup !== undefined && typeof $.fn.mixitup != 'undefined' )
	{
		$products.mixitup({
			targetSelector: '.mix',
			/*
			filterSelector: '.filter',
			sortSelector: '.sort',
			buttonEvent: 'click',
			*/
			effects: ['fade','scale'],
			listEffects: null,
			easing: 'easeOutElastic',
			layoutMode: layout_mode,
			targetDisplayGrid: 'inline-block',
			targetDisplayList: 'block',
			gridClass: 'product-grid',
			listClass: 'product-list',
			transitionSpeed: 500,
			showOnLoad: 'all',
			sortOnLoad: false,
			multiFilter: false,
			filterLogic: 'or',
			resizeContainer: true,
			minHeight: 0,
			failClass: 'fail',
			perspectiveDistance: '3000',
			perspectiveOrigin: '50% 50%',
			animateGridList: true,
			onmixLoad: null,
			onmixStart: null,
			onmixEnd: null
		});
	}


	/*
	| +++++++++++++++++++++++++++++++++++++++++++++++
	| Product album functions - used in single product page
	| +++++++++++++++++++++++++++++++++++++++++++++++
	*/
	if ( typeof $.fn.zoom !== undefined && typeof $.fn.zoom != 'undefined' )
	{
		$('.jq-zoom').zoom();
	}
	$('.product-single .product-album > ul > li > a').on('click', function() {
		var $this = $(this),
			$cur = $this.closest('.product-album').find('> a'),
			$to_move = $this.children();
			
		$to_move.hide();
		$cur.children(':not(.zoomImg)').hide().appendTo( $this );
		$cur.empty();
		$to_move.appendTo( $cur );
		$this.children().hide().show();
		$cur.children().fadeIn(300);
		$cur.zoom();
	});
	
	
	/*
	| +++++++++++++++++++++++++++++++++++++++++++++++
	| Pretty checkboxs and radio buttons
	| +++++++++++++++++++++++++++++++++++++++++++++++
	*/
	$('.checkable').prettyCheckable();
	
	
	/*
	| +++++++++++++++++++++++++++++++++++++++++++++++
	| Quantity increment/decrement button set
	| +++++++++++++++++++++++++++++++++++++++++++++++
	*/
	$('.qty-btngroup').each(function() {
		var $this = $(this),
			$input = $this.children('input[type="text"]'),
			val = $input.val();
		$this.children('.plus').on('click', function() {
			$input.val( ++val );
		});
		$this.children('.minus').on('click', function() {
			if ( val == 0 ) return;
			$input.val( --val );
		});
	});
	
	$('.my-cart .remove-item').on('click', function(e) {
		e.preventDefault();
		$(this).closest('tr').fadeOut(400, function() {
			$(this).remove();
		});
	});
	
	/*
	| +++++++++++++++++++++++++++++++++++++++++++++++
	| Contact us form validation
	| +++++++++++++++++++++++++++++++++++++++++++++++
	*/
	$('#contact-form').on('submit', function(e) {
		e.preventDefault();
		// we clear error messages
		$(this).find('.error').removeClass('error');
		$(this).find('.err_msg').fadeOut(200);
		
		// validate form
		var validation = validate_contact(e);
		
		for (var i = 0; i < validation.length; i++) 
		{
			$(validation[i]).addClass('error');
		}
		
		if ( validation.length ) 
		{
			$('body, html').animate( { 'scrollTop': $(validation[0]).offset().top - 100 }, 'easeInCube', function() {
				$(this).select();
			});
			return false;
		}
		else
		{
			submit_form(e);
			return true;
		}
	});
	
	function validate_contact(e) {
		var $form = $(e.target);
		var rule, val, bad_fields = new Array();
		$form.find('input, textarea').each(function() {
			rule = $(this).data('validate');
			if ( ! rule ) return;
			
			val = $(this).val();
			if ( ! val.match(rule) )
			{
				bad_fields.push(this);
			}
		});
		return bad_fields;
	}
	
	
	/*
	| +++++++++++++++++++++++++++++++++++++++++++++++
	| Contact us form submit
	| +++++++++++++++++++++++++++++++++++++++++++++++
	*/
	function submit_form(e) {
		var $form = $(e.target),
			$btn = $form.find('button'),
			btn_text = $btn.text();
		$.ajax({
			url: 'includes/phpmailer/contact.php',
			data: $form.serialize(),
			dataType: 'json',
			type: 'POST',
			beforeSend: function() {
				$('#contact_fail .alert-inner').empty();
				$('#contact_fail').hide();
				$btn.attr('disabled', 'disabled').addClass('btn-disabled').css('cursor', 'not-allowed').text('Sending...');
			},
			success: function(result) {
				if ( typeof result.success == 'undefined' )
				{
					// form is not valid, display errors
					for ( var x in result )
					{
						$('#contact_fail .alert-inner').append('<p>' + result[x] + '</p>');
					}
					$('#contact_fail').fadeIn();
				}
				else
				{
					// form sent successfully and without errors
					$('#contact_success').fadeIn(700, function() {
						var $this = $(this);
						setTimeout(function() {
							$this.fadeOut();
						}, 5000);
					});
				}
			},
			complete: function() {
				$btn.removeAttr('disabled', 'disabled').removeClass('btn-disabled').css('cursor', 'pointer').html(btn_text);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				switch (jqXHR.status)
				{
					case 404:
						alert("We're Sorry... The file you are looking for is not found :(");
						break;
					case 500,200:
						$('#contact_fail .alert-inner').append("<p>Oops, something went wrong and we couldn't send your message :(</p>");
						$('#contact_fail').fadeIn();
						break;
					default:
						console.log(jqXHR, textStatus, errorThrown);
				}
			}
		});
	}

});