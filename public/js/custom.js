var Custom = (function() {
	function defer(method) {
	    if (window.jQuery) {
	    	// Service Worker seems to want to try and call jQuery before this script is ready
	    	// https://stackoverflow.com/questions/7486309/how-to-make-script-execution-wait-until-jquery-is-loaded
	        method();
	    } else {
	        setTimeout(function() { defer(method()) }, 50);
	    }
	}

	defer(function(){

		function activateCharacter(self){

			// Add class of 'selected' to the clicked character box. This is used for transitioning between characters while the modal box is open
			self.addClass('selected');

			//$charModal.find('.backButton').addClass('active');
			$('body').addClass('no-scroll character-active');

			// Grab the data-index attr added by Knockout for each box. This is used to link the box to the JSON data that's generated in the modal
			var $index = self.closest('.character-box.selected').data('index');

			// Firstly, generate a request for the JSON file
			jQuery.getJSON('./api/data.json', function(data){

				console.log('success');

				// Begin the mapping
				var name = data[$index].name;
				var urlName = data[$index].url;
				var bgColour = data[$index].bgColour;
				var weight = data[$index].weight;
				var minPercent = parseInt(data[$index].minPercent);
				var maxPercent = parseInt(data[$index].maxPercent);
				var fallspeed = data[$index].fallspeed;
				var gravity = data[$index].gravity;
				var airdodgeStart = data[$index].airdodgeStart;
				var airdodgeEnd = data[$index].airdodgeEnd;
				var textContrast = data[$index].textContrast;

				var airdodge = airdodgeStart + ' - ' + airdodgeEnd;
				var percRange = (maxPercent - minPercent) + 1;

				// Character Modal initialisers
				var $charModal = $('#characterModal');
				// Need to strip all classes from 'characterImageContainer' to remove the applied character class
				// https://stackoverflow.com/questions/5363289/remove-all-classes-except-one
				$charModal.find('.characterImageContainer').attr('class', 'characterImageContainer').addClass(urlName).css('backgroundColor', bgColour);
				$charModal.addClass('active animate');
				if(textContrast){
					$charModal.addClass(textContrast);
				}

				$('.modalUnderlay').css('backgroundColor', bgColour);

				$charModal.find('.grid-percRange .minPerc').text(minPercent);
				$charModal.find('.grid-percRange .maxPerc').text(maxPercent);
				$charModal.find('span[data-ref="name"]').text(name);

				// Generating the difficulty text via the global function in characters.js
				var difficultyAmount = computeDifficulty(minPercent, maxPercent);
				$charModal.find('.grid-difficulty').html('<span class="' + difficultyAmount + '">' + difficultyAmount + ' - ' + percRange + '%</span>');
				$charModal.find('.characterName').text(name);

				var $charOverviewItem = $charModal.find('.characterOverview');
				$charOverviewItem.find('li[data-ref="weight"]').html('Weight' + '<span class="value">' + weight + '</span>');
				$charOverviewItem.find('li[data-ref="fallspeed"]').html('Gravity' + '<span class="value">' + fallspeed + '</span>');
				$charOverviewItem.find('li[data-ref="airdodge"]').html('Airdodge' + '<span class="value">' + airdodge + '</span>');
				$charOverviewItem.find('li[data-ref="gravity"]').html('Gravity' + '<span class="value">' + gravity + '</span>');

				// Map those mf-ing values
				var $fd = $charModal.find('.stage-fd');
				$fd.find('span[data-ref="minPerc"]').text(minPercent).attr('data-defaultmin', minPercent);
				$fd.find('span[data-ref="maxPerc"]').text(maxPercent).attr('data-defaultmax', maxPercent);

				var $bf = $charModal.find('.stage-bf');
				$bf.find('span[data-ref="bfNormalMin"]').text(minPercent+7).attr('data-defaultmin', minPercent);
				$bf.find('span[data-ref="bfNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
				$bf.find('span[data-ref="bfLowPlatMin"]').text(minPercent-7).attr('data-defaultmin', minPercent-7);
				$bf.find('span[data-ref="bfLowPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
				$bf.find('span[data-ref="bfTopPlatMin"]').text(minPercent-20).attr('data-defaultmin', minPercent-20);
				$bf.find('span[data-ref="bfTopPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

				var $dl = $charModal.find('.stage-dl');
				$dl.find('span[data-ref="dlNormalMin"]').text(minPercent).attr('data-defaultmin', minPercent);
				$dl.find('span[data-ref="dlNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
				$dl.find('span[data-ref="dlLowPlatMin"]').text(minPercent-15).attr('data-defaultmin', minPercent-15);
				$dl.find('span[data-ref="dlLowPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
				$dl.find('span[data-ref="dlTopPlatMin"]').text(minPercent-26).attr('data-defaultmin', minPercent-26);
				$dl.find('span[data-ref="dlTopPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

				var $sv = $charModal.find('.stage-sv');
				$sv.find('span[data-ref="svNormalMin"]').text(minPercent+1).attr('data-defaultmin', minPercent+1);
				$sv.find('span[data-ref="svNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
				$sv.find('span[data-ref="svPlatMin"]').text(minPercent-14).attr('data-defaultmin', minPercent-14);
				$sv.find('span[data-ref="svPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

				var $tc = $charModal.find('.stage-tc');
				$tc.find('span[data-ref="tcNormalMin"]').text(minPercent-4).attr('data-defaultmin', minPercent-4);
				$tc.find('span[data-ref="tcNormalMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
				$tc.find('span[data-ref="tcLowPlatMin"]').text(minPercent-20).attr('data-defaultmin', minPercent-20);
				$tc.find('span[data-ref="tcLowPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
				$tc.find('span[data-ref="tcSidePlatMin"]').text(minPercent-25).attr('data-defaultmin', minPercent-25);
				$tc.find('span[data-ref="tcSidePlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);
				$tc.find('span[data-ref="tcTopPlatMin"]').text(minPercent-41).attr('data-defaultmin', minPercent-41);
				$tc.find('span[data-ref="tcTopPlatMax"]').text(maxPercent).attr('data-defaultmax', maxPercent);

				// Now to render % differences... Better to take care of them all in one loop
				// I want to see if rage button is not at default first though, two avoid double-handling the percent range calculations
				if($charModal.find('.btn[data-rage="0"]').hasClass('active')){
					//console.log('default rage');
					$charModal.find('.percRange-cell').each(function(){
						var $this = $(this);
						var $target = $this.find('.percRange');
						var $minPercent = $this.prev().prev().find('.minPerc').text();
						var $maxPercent = $this.prev().find('.maxPerc').text();
						$target.text($maxPercent - $minPercent + 1);
					});

					// Thingy doesn't animate is rage is at 0 and transitioning
					/*$minPerc
						.prop('number', $minPerc.text())
						.animateNumber({ number : adjustedMinPercent }, 200);
					$maxPerc
						.prop('number', $maxPerc.text())
						.animateNumber({ number : adjustedMaxPercent }, 200);
					$percRange
						.prop('number', $percRange.text())
						.animateNumber({ number : percRange }, 200);*/


				} else {
					//console.log('NOT default rage');
					// Set max/min percentage differences for each stage section
					rageAdjustment($charModal.find('.rageBtn.active'));
				}


				// RAGE MODIFIER STICKY
				var $charContainer = $('#characterModal .characterContainer');
				function fixedRagebar(self){
					var windowTop = self.scrollTop();
					
		            containerWidth = $charContainer.innerWidth();
		            marginOffset = $charContainer.css('margin-top');
		            if(120 < windowTop){
		                $('#characterModal .sticky').addClass('stuck');
		                $('.stuck').css({ top: marginOffset, width: containerWidth });

					} else {
						$('.stuck').css({ top: 0, width: '100%' }); // restore the original top value of the sticky element
						$('.sticky').removeClass('stuck');
					}
				}
				fixedRagebar($charContainer);

				// Limiting min execution interval on scroll to help prevent scroll jank
				// http://joji.me/en-us/blog/how-to-develop-high-performance-onscroll-event
				var scroll = function(){
					fixedRagebar($charContainer);
				}
				var raf = window.requestAnimationFrame ||
				    window.webkitRequestAnimationFrame ||
				    window.mozRequestAnimationFrame ||
				    window.msRequestAnimationFrame ||
				    window.oRequestAnimationFrame;
				var $window = $charContainer;
				var lastScrollTop = $window.scrollTop();

				if (raf) {
		    		loop();
				}
				function loop() {
				    var scrollTop = $window.scrollTop();
				    if (lastScrollTop === scrollTop) {
				        raf(loop);
				        return;
				    } else {
				        lastScrollTop = scrollTop;
				        // fire scroll function if scrolls vertically
				        scroll();
				        raf(loop);
				    }
				}

				// Need to resize based on window.innerHeight due to mobile address bar sizings.
				// https://developers.google.com/web/updates/2016/12/url-bar-resizing
				$(window).resize(function(e){
					fixedRagebar($charContainer);
				})



			})
			.fail(function(){
				console.log('error retrieving data');
			});


			/*if((self).find('.characterImageContainer').hasClass('text-dark')){
				$('body').addClass('text-dark');
			} else {
				$('body').removeClass('text-dark');
			}*/
			
		}

		function deactivateCharacter(){
			var $body = $('body');
			$body.removeClass('no-scroll');
			// determine if body has clas 'character-active', to see if we're deactivating a character or a menu page
			if($body.hasClass('character-active')){
				var $charModal = $('#characterModal');
				$charModal.removeClass();
				$charModal.find('.rageModifier').removeClass('stuck');
				$charModal.find('.characterBorder').css('height', 'auto');
				$('#character-list li.selected').removeClass('selected');
				$body.removeClass('character-active');
				$('.modalUnderlay').css('backgroundColor', 'transparent');
			} else {
				$('.menu-page > div').hide();
			}
			
			// Page does not force reload if '#' is in the URL
			// https://stackoverflow.com/questions/2405117/difference-between-window-location-href-window-location-href-and-window-location
			/*var baseUrl = window.location.protocol + "//" + window.location.host + '/#/';
			console.log(baseUrl);
			window.location.replace(baseUrl);*/
			// This seems to cause problems with the PWA side of things, and forces some kind of reload anyway.
		};
		function transitionCharacter(){
			var $charModal = $('#characterModal');
			$charModal.attr('class', 'active');
			$('#character-list li.selected').removeClass('selected');
			// In order to reset the animation of image between characters with the new single modal setup, it needs to be REMOVED ENTIRELY. Guh!
			// https://css-tricks.com/restart-css-animation/
			var el = $charModal.find('.characterImage'), newone = el.clone(true);
			el.before(newone);
			$('.' + el.attr('class') + ':last').remove();
			//$('#characterModal').find('.characterImage').css('left', '50');
		}
		

		function rageAdjustment(self){
			var rageAmount = self.attr("data-rage");
			
			self.siblings('.rageBtn').removeClass('active');
			self.addClass('active');
			var rageAdjMin = "";
			var rageAdjMax = "";

			// According to the data, characters with ... dunno, I got nothing
			// There seems to be no distinct pattern of how rage causes the min and max% windows to decay
			// Earlier, a rough spreadsheet was put together to try and measure the variance of decay between characters --> https://docs.google.com/spreadsheets/d/10YmEZihWk6oPPXnynnfIpyEApfl0ANPRlCq4WnHv3Ls/edit#gid=0
			// The stuff in red measures accumulated decay. Doesn't seem to be a pattern, so an average value is taken

			// Calculate amount to adjust min-percent based on rage
			if(rageAmount == "50"){rageAdjMin = -2; rageAdjMax = -5 }
			if(rageAmount == "60"){rageAdjMin = -5; rageAdjMax = -9 }
			if(rageAmount == "80"){rageAdjMin = -9; rageAdjMax = -16 }
			if(rageAmount == "100"){rageAdjMin = -12; rageAdjMax = -22 }
			if(rageAmount == "125"){rageAdjMin = -14; rageAdjMax = -27 }
			if(rageAmount == "150"){rageAdjMin = -18; rageAdjMax = -33 }

			$('#characterModal .stagePercents').each(function(){
				var $this = $(this);

				var $minPerc = $this.find('.minPerc');
				var $maxPerc = $this.find('.maxPerc');
				var $percRange = $this.find('.percRange');
				var defaultMinPercent = $minPerc.attr('data-defaultmin');
				var defaultMaxPercent = $maxPerc.attr('data-defaultmax');

				var adjustedMinPercent = parseInt(defaultMinPercent) + rageAdjMin;
				var adjustedMaxPercent = parseInt(defaultMaxPercent) + rageAdjMax;

				// Some min %'s go below zero at max rage (wtf). Need to round to 0
				// Adjusting min percent last in case it goes below zero and fucks the percRange var
				adjustedMinPercent = Math.max(0, adjustedMinPercent);
				var percRange = (adjustedMaxPercent - adjustedMinPercent) + 1;

				if(adjustedMaxPercent < adjustedMinPercent ){

					// On some stages, DingDong is impossible to kill with on some characters (like Satan on Battlefield)
					// Will need to render 'N/A' in those cases
					console.log('dingdong is impossible!');
					$minPerc.text('N/A').addClass('nosymbol');
					$maxPerc.text('N/A').addClass('nosymbol');
					$percRange.text('-').addClass('nosymbol');
				} else {
					$minPerc.removeClass('nosymbol');
					$maxPerc.removeClass('nosymbol');
					$percRange.removeClass('nosymbol');

					$minPerc
						.prop('number', $minPerc.text())
						.animateNumber({ number : adjustedMinPercent }, 200);
					$maxPerc
						.prop('number', $maxPerc.text())
						.animateNumber({ number : adjustedMaxPercent }, 200);
					$percRange
						.prop('number', $percRange.text())
						.animateNumber({ number : percRange }, 200);

				}

				//$minPerc.text(adjustedMinPercent);

				// Hmm, if min percent goes below zero, this will affect the max percent range, right???? NO, IT PROBABLY SHOULDN'T (I think...)

			});

		};

		function activateMenuBox(target){
			// check to see if a character is currently active
			if($('body').hasClass('active-character')){
				deactivateCharacter();	
			}
			$('body').addClass('no-scroll').removeClass('text-dark');
			$('.characterUnderlay').css('backgroundColor', 'rgb(136,136,136)');
			$('.characterBackButton').addClass('active');
			$('#' + target).show();
		}

		function transitionRageForward($activeRageButton){
			if(!$activeRageButton.is(':last-child')){
				rageAdjustment($activeRageButton.next());
			} else {
				rageAdjustment($activeRageButton.siblings('.rageBtn:first-child'));
			}
		}
		function transitionRageBackward($activeRageButton){
			if(!$activeRageButton.is(':first-child')){
				rageAdjustment($activeRageButton.prev());
			} else {
				rageAdjustment($activeRageButton.siblings('.rageBtn:last-child'));
			}
		}
		function transitionCharacterForward($activeContainer){
			//var $activateContainer = $('#character-list .character-box.active');
			//deactivateCharacter();
			transitionCharacter();
			if(!$activeContainer.is(':last-child')){
				activateCharacter($activeContainer.next());
			} else {
				// Loop back to first character if press right key on last character
				activateCharacter($activeContainer.siblings('.character-box:first-child'));
			}	
		}
		function transitionCharacterBackward($activeContainer){
			//deactivateCharacter();
			transitionCharacter();
			if(!$activeContainer.is(':first-child')){
				activateCharacter($($activeContainer.prev()));
			} else {
				// Loop forward to last character if press left key on first character
				activateCharacter($activeContainer.siblings('.character-box:last-child'));
			}
		}





		// Character key events

		// Include handlers for if SHIFT is held for rage button shifting
		var shiftKey = 16; // SHIFT
		var isShiftActive = false;
		var keyleft = 37;
		var keyright = 39;
		var key1 = 49;
		var key2 = 50;
		var key3 = 51;
		var key4 = 52;
		var key5 = 53;
		var key6 = 54;
		var key7 = 55;


		$(document).keyup(function(e){

			if(e.which == shiftKey) isShiftActive = false;

		}).keydown(function(e){
			e = e || window.event;

			// Need modal to close on ESC
			// https://stackoverflow.com/questions/3369593/how-to-detect-escape-key-press-with-javascript-or-jquery
			var isEscape = false;
			if ("key" in e){
				isEscape = (e.key == "Escape" || e.key == "Esc");
			} else {
				isEscape = (e.keyCode == 27);
			}
			if (isEscape){
				// if character is active, deactivate it
				if($('body').hasClass('no-scroll')){
					deactivateCharacter();
				} else {
					// else toggle the sidemenu instead
					$('body').toggleClass('toggle-sidedrawer');
				}
				
			}
			if(e.which == shiftKey) isShiftActive = true;

			// Need to check if character is currently active.
			if($('#characterModal.active').length){
				var $this = $(this);
				//console.log('modal is active!');
				// Need to check if SHIFT is held.
				if(isShiftActive){
					if(e.which == keyright){
						//console.log('shift held and right');
						transitionRageForward($this.find('.rageBtn.active'));
					}
					if(e.which == keyleft){
						//console.log('shift held and left');
						transitionRageBackward($this.find('.rageBtn.active'));
					}

				} else {
					if(e.which == keyright){transitionCharacterForward($('.character-box.selected'))};
					if(e.which == keyleft){transitionCharacterBackward($('.character-box.selected'))};

					if(e.which == key1){rageAdjustment($this.find('.rageBtn:nth-child(1)'))};
					if(e.which == key2){rageAdjustment($this.find('.rageBtn:nth-child(2)'))};
					if(e.which == key3){rageAdjustment($this.find('.rageBtn:nth-child(3)'))};
					if(e.which == key4){rageAdjustment($this.find('.rageBtn:nth-child(4)'))};
					if(e.which == key5){rageAdjustment($this.find('.rageBtn:nth-child(5)'))};
					if(e.which == key6){rageAdjustment($this.find('.rageBtn:nth-child(6)'))};
					if(e.which == key7){rageAdjustment($this.find('.rageBtn:nth-child(7)'))};
				}
			}

		});

		$('.filter-toggle').click(function(){
			var $this = $(this);
			$this.toggleClass('active');
			$this.next('.btn-group.mobile').toggleClass('active');
			$('#main').toggleClass('filtersActive');

			// If on mobile and at top of screen, the filter row covers the content! Not good.
			// This detects if the user is partly down the page, and if not will offset the grid by the height of header + height of filter row

			if($('#main').hasClass('filtersActive')){
				// First check to see if the filters are active. If they aren't, then proceed
				var scrollTop = $(window).scrollTop();
				var headerHeight = $('header').height() + $('.btn-group.mobile.active').innerHeight();
				if(scrollTop < 140){
					$('#main').css('margin-top', headerHeight);
				} else {
					$('#main').css('margin-top', '');
				}
				// If they aren't active and the button is clicked, remove the jQuery offset if present
			} else {
				$('#main').css('margin-top', '');
			}
		});

		$('.sidedrawer-toggle, #sidedrawer-overlay').click(function(){
			$('body').toggleClass('toggle-sidedrawer');
		});

		// Using traditional 'click()' bindings will not work on dynamically generated character boxes!
		// https://stackoverflow.com/questions/6658752/click-event-doesnt-work-on-dynamically-generated-elements
		$('#main').on('click', '#character-list .character-box', function(){
			activateCharacter($(this));
		})
		$('#characterModal').on('click', '.rageBtn', function(){
			rageAdjustment($(this));
		});


		/* --- */


		$('#icon-next').click(function(){
			transitionCharacterForward($('.character-box.selected'));
		});
		$('#icon-prev').click(function(){
			transitionCharacterBackward($('.character-box.selected'));
		});
		$('.backButton').click(function(){
			deactivateCharacter();
		});

		$('#about').click(function(){
			activateMenuBox('page-about');
		})
		$('#credits').click(function(){
			activateMenuBox('page-credits');
		})

		$('#filter-dropdown-btn').click(function(){
			$this = $(this);
			$this.toggleClass('active');
			$this.closest('.btn-group').toggleClass('open');
		});
		$('.add-info-grid').click(function(){
			$('.add-info-grid').toggleClass('checked');
			$('body').toggleClass('show-extra-info');
		})

	});
});