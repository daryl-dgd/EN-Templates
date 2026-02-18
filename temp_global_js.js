$(document).ready(function($) {
    //Add body classes
    if($('.en__Donation').length > 0){
        $('body').addClass("en__Donation");
    }
    if($('.en__OneColumn_Form').length > 0){
        $('body').addClass("en__OneColumn_Form");
		//Display background image
		var $banner = $('.bannerImgSrc img').first();

		if ($banner.length) {
			var src = $banner.attr('src');

			$('body').css({
				'background-image': 'url("' + src + '")',
			});

			$banner.remove();
		}
    }
    if($('.en__MultiStep_Form').length > 0){
        $('body').addClass("en__MultiStep_Form");
    }
    if($('.en__Campaign_Form').length > 0){
        $('body').addClass("en__Campaign_Form");
		// get hero banner img src
		let getHeroBannerSrc = $('.bannerImgSrc img').attr('src');

		// set background img
		$('.hero-banner').css({
			backgroundImage: `url(${getHeroBannerSrc})`
		});
    }
    if($('.en__Static').length > 0){
        $('body').addClass("en__Static");
    }

    /* Progress Tracker */
    var $trackerContainer = $('.progress-tracker-container');
    
    if ($trackerContainer.length > 0) {
        var $configElement = $('[class*="progress-step-"]').first();
        
        if ($configElement.length > 0) {
            var classList = $configElement.attr('class');
            var match = classList.match(/progress-step-(\d+)-(\d+)/);
            
            if (match) {
                var currentStep = parseInt(match[1], 10);
                var totalSteps = parseInt(match[2], 10);
                
                buildProgressTracker($trackerContainer, currentStep, totalSteps);
            }
        }
    }

    function buildProgressTracker($container, current, total) {
        var html = '';
        for (var i = 1; i <= total; i++) {
            var statusClass = (i < current) ? 'completed' : (i === current ? 'active' : 'pending');

            if (i === current) {
                $('body').addClass('page-' + i);
            }

            var stepContent = (statusClass === 'completed') 
                ? '<i class="fa-solid fa-check"></i>' 
                : '<span class="step-number">' + i + '</span>';

            html += '<div class="step ' + statusClass + '">' + stepContent + '</div>';
        }

        var trackerWrapper = '<div class="progress-tracker-ui">' + html + '</div>';
        $container.append(trackerWrapper);
        
        $('.progress-step-text, .progress-tracker-ui').wrapAll($('<div class="page-step-container"/>'));
    }

    var $secureBlock = $('.secure-donation');
    $secureBlock.each(function() {
        var $p = $(this).find('p');
        var $img = $p.find('img').detach();
        var text = $p.text().trim();
        
        var $newContainer = $('<div class="secure-container"></div>');
        $newContainer.append($img);
        $newContainer.append('<p class="secure-text">' + text + '</p>');
        
        $p.replaceWith($newContainer);
    });
	
	if($('.donate-page').length > 0){
        //Donation form page, run appropriate JS
    
		function getTotalAmountText() {
			return $('.donation-amount-fees span.total-donation span').text().trim();
		}
		function syncTotalAmount(delay) {
			setTimeout(function () {
				$('.totalAmount').text(getTotalAmountText());
			}, delay || 100);
		}
		
		$('input[value="Other"]').parent().addClass("other-amt");
        $('input[name="transaction.donationAmt.other"]').parent().addClass("other-amt-input");
		
		//Add a minimum donation note
		$('<p style="font-size: 12px; margin-bottom: 0px; position: absolute; bottom: -15px; left: 0;">Minimum donation of $5.00</p>').appendTo('.other-amt-input');

        $('input[name="transaction.recurrpay"]:checked').parent().addClass("active");

        // A master function to restore ALL visual states
        function restoreDonationState() {
            // 1. Restore Active Classes
            $('.en__field--donationAmt .en__field__item').removeClass('active');
            var $checkedInput = $('input[name="transaction.donationAmt"]:checked');
            if ($checkedInput.length > 0) {
                $checkedInput.closest('.en__field__item').addClass('active');
            }
        
            // 2. Restore "Other" Input State
            // If the "Other" radio is checked, ensure the text input is visible
            if ($checkedInput.val() === 'Other') {
                var $otherInput = $('input[name="transaction.donationAmt.other"]');
                $otherInput.closest('.en__field__item').addClass('active');
            }
            
            $('input[value="Other"]').parent().addClass("other-amt");
        }

        /* Donation levels */
        $(document).on('change', 'input[name="transaction.donationAmt"]', function() {
            restoreDonationState();
            
            console.log("clicked amount - " + $(this).val());
            
            if ($(this).val() === "Other") {
                var $otherInput = $('input[name="transaction.donationAmt.other"]');
                setTimeout(function() {
                    $otherInput.focus();
                }, 50);
            }
            else {
                setTimeout(function(){
					var latestTotal = getTotalAmountText();
					console.log('latestTotal:', latestTotal);
					$('.totalAmount').text(latestTotal);
				}, 100);
            }
        });

        /* Frequency Buttons */
        $(document).on('change', 'input[name="transaction.recurrpay"]', function() {
            $('input[name="transaction.recurrpay"]').parent().removeClass("active");
            $('input[name="transaction.recurrpay"]:checked').parent().addClass("active");
        });

        //Update total amount when other is updated
        $(document).on('input keyup blur change', '.en__field__input--other', function () {
			// Increase the delay slightly to give EN time to calculate fees
			setTimeout(function () {
				var latestTotal = getTotalAmountText();
				console.log('Syncing Other Total:', latestTotal);
				$('.totalAmount').text(latestTotal);
			}, 200);
		});

        // Accessibility on giving levels - focus state
        $(document).on('focusin', '.en__field--donationAmt input, .en__field--recurrpay input', function() {
            $(this).parent().addClass('focus');
        });

        $(document).on('focusout', '.en__field--donationAmt input, .en__field--recurrpay input', function() {
            $(this).parent().removeClass('focus');
        });

        $('input[name="transaction.donationAmt.other"]').on('keydown', function(e) {
            if (e.shiftKey && (e.keyCode === 9 || e.key === 'Tab')) {
                
                var $textWrapper = $(this).closest('.en__field__item');
        
                // 2. Look backwards for the first sibling that is NOT the "Other" radio wrapper
                // We use prevAll() to look at all previous siblings, filter out the "Other" radio wrapper,
                // and grab the first one we find (which will be the $50 level).
                var $targetWrapper = $textWrapper.prevAll('.en__field__item:not(.other-amt)').first();
                var $targetRadio = $targetWrapper.find('input[type="radio"]');
        
                if ($targetRadio.length > 0) {
                    e.preventDefault();
                    
                    $textWrapper.hide().removeClass('active');
                    $('.other-amt').show().removeClass('active');
                    $(this).val('');
        
                    // 4. Click the $50 radio and focus it
                    $targetRadio.prop('checked', true).trigger('change').focus();
                }
            }
        });

        //Monthly CTA
        $('.en__field--recurrpay .en__field__item').last().addClass("onetime");
        $('.en__field--recurrpay .en__field__item').last().addClass("monthly");
        var monthlyCTA = '<div class="monthly-cta-container">' +
                            '<img src="https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10080/monthly-cta-arrow.png?v=1771254205000" alt="" class="monthly-cta-img" width="59" height="73">' +
                            '<p class="monthly-cta-text">' +
                                'Give monthly to support the mission and make your impact go further.' +
                            '</p>' +
                        '</div>';

        $('.en__field--recurrpay .en__field__item').last().append(monthlyCTA);
		
        //Update Opt-in Question label
        var $optInContainer = $('.en__field--general-opt-in');
        if ($optInContainer.length > 0) {
            var $originalHeaderLabel = $optInContainer.find('> .en__field__label');
            var $checkboxLabel = $optInContainer.find('.en__field__item .en__field__label--item');
    
            var questionText = $originalHeaderLabel.text().trim();
    
            if (questionText) {
                $checkboxLabel.text(questionText);
            }
        }

        //Wrap Tribute fields (1)
        $('.en__field--infcountry, .en__field--infreg').wrapAll($('<div class="donor-info tribute-fields"/>'));
        $('.en__field--infcity, .en__field--infpostcd').wrapAll($('<div class="donor-info tribute-fields"/>'));

        //Wrap Details fields (2)
        $('.en__field--title, .en__field--firstName, .en__field--lastName').wrapAll($('<div class="donor-info"/>'));
        $('.en__field--emailAddress').wrap($('<div class="donor-info"/>'));
        $('.en__field--phoneNumber').wrap($('<div class="donor-info"/>'));

        //Wrap Payment fields (3)
        $('.en__field--paymenttype').wrap($('<div class="donor-info"/>'));
        $('.en__field--ccnumber').wrap($('<div class="donor-info"/>'));
        $('.en__field--ccexpire').wrap($('<div class="donor-info"/>'));
        $('.en__field--ccvv').wrap($('<div class="donor-info"/>'));

        //Wrap Address fields (4)
        $('.en__field--address1').wrap($('<div class="donor-info"/>'));
        $('.en__field--address2').wrap($('<div class="donor-info"/>'));
        $('.en__field--city, .en__field--region').wrapAll($('<div class="donor-info"/>'));
        $('.en__field--postcode, .en__field--country').wrapAll($('<div class="donor-info"/>'));


        //Add blank options to beginning of dropdowns
        var blankTitle = $('<option></option>').attr('value', '').text('');
        var blankHonorGift = $('<option></option>').attr('value', '').text('');
        var blankHonoree = $('<option></option>').attr('value', '').text('');
        var blankRegion = $('<option></option>').attr('value', '').text('');
        var blankCountry = $('<option></option>').attr('value', '').text('');
		
		//eCard customizations
		$('.eCard-message').parent().addClass('eCard-message-container');
		
		// eCard message toggle
		
		// This field ID needs to match the ID from the Account Data Structure field - You must add to the form and inspect the front-end element to find the ID.
		var $optIn = $('select#en__field_supporter_NOT_TAGGED_4');
		var $inMem = $('input#en__field_transaction_inmem');
		var $ecardMsg = $('.eCard-message');

		function toggleEcardMessage() {
			var optVal = $optIn.val();
			var inMemChecked = $inMem.is(':checked');

			// Show ONLY if "Yes, by email" AND inMem is checked
			$ecardMsg.toggleClass('en__hidden', !(optVal === 'Yes, by email' && inMemChecked));
		}

		// Watch both fields
		$optIn.on('change', toggleEcardMessage);
		$inMem.on('change', toggleEcardMessage);

		// Run on load (optional but recommended)
		toggleEcardMessage();
				
        // Append the new option to the select element
        $('#en__field_supporter_title').prepend(blankTitle);
        $('#en__field_supporter_title').val(1);

        $('#en__field_transaction_othamt1').prepend(blankHonorGift);
        $('#en__field_transaction_othamt1').val(1);

        $('#en__field_transaction_othamt2').prepend(blankHonoree);
        $('#en__field_transaction_othamt2').val(1);

        $('#en__field_supporter_region').prepend(blankRegion);
        $('#en__field_supporter_region').val(1);

        $('#en__field_supporter_country').prepend(blankCountry);
        $('#en__field_supporter_country').val(1);

        function customTotal() {
            if ($('.custom-total-display').length === 0) {

                var totalHtml = '<div class="custom-total-display hidden"><div class="totals-label"><p><span class="total-label">Total</span></p></div><div class="totals-output"><p><span class="totalAmount"></span><span class="monthly-toggle hidden">/Month</span><span> USD</span></p></div></div>';

                $('.en__submit__container').before(totalHtml);

                var latestTotal = getTotalAmountText();
                console.log('latestTotal:', latestTotal);
                $('.totalAmount').text(latestTotal);

                var getRecurring = sessionStorage.getItem('recurring_val');
                if (getRecurring == "Y") {
                    $('.monthly-toggle').removeClass("hidden");
                }

                $('.custom-total-display').removeClass("hidden");
            }
        }
		
		$(document).on('change', '#en__field_transaction_feeCover', function () {
			syncTotalAmount(150);
		});

        restoreDonationState();
		var targetNode = document.querySelector('.en__field--donationAmt');
		if (targetNode) {
            // 3. Create the Observer
            var observer = new MutationObserver(function(mutations) {
                // We only care if nodes were added/removed (ChildList)
                var shouldRestore = false;
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        shouldRestore = true;
                    }
                });
    
                if (shouldRestore) {
                    // Temporarily disconnect to avoid infinite loops if our 
                    // restore function modifies the DOM structure significantly
                    observer.disconnect();
                    
                    restoreDonationState();
                    
                    // Reconnect immediately
                    observer.observe(targetNode, config);
                }
            });
    
            // 4. Configuration: Watch for changes to direct children and subtree
            var config = { childList: true, subtree: true };
    
            // 5. Start Observing
            observer.observe(targetNode, config);
        }

        //Tribute Banner
        if ($('.tribute-info-container').length > 0) {
            var savedType = sessionStorage.getItem('tribute_type');
            var savedName = sessionStorage.getItem('tribute_name');

            if (savedType && savedName) {
                $('.tribute-reason').html(savedType);
                $('.tribute-name').html(savedName);

                $('.tribute-info-container').removeClass("en__hidden");
            }
        }

        //Digital Wallet Separator
        var $walletContainer = $('#en__digitalWallet');
        if ($walletContainer.length > 0 && $('.digital-wallet-divider').length === 0) {
            var dividerHtml = '<div class="digital-wallet-divider">' +
                                '<span>OR PAY BY</span>' +
                            '</div>';
            
            $walletContainer.before(dividerHtml);
        }

        //Multi-step Back button
        function addBackButton() {
            var $submitDiv = $('.en__submit');
        
            $submitDiv.wrap('<div class="en__submit__container"></div>');
    
            var $nextBtn = $submitDiv.find('button');
            var $backBtn = $nextBtn.clone();
    
            $backBtn.text('Back');
            $backBtn.attr('type', 'button');
    
            var $backDiv = $('<div class="en__back"></div>').append($backBtn);
            
            $('.en__submit__container').prepend($backDiv);

            // GENERATE THE BACK URL
            var currentUrl = window.location.href;
            var cleanUrl = currentUrl.split('?')[0]; 
            var parts = cleanUrl.split('/');
            var pageNumIndex = parts.length - 1;
            var currentPageNum = parseInt(parts[pageNumIndex]);

            if (!isNaN(currentPageNum) && currentPageNum > 1) {
                parts[pageNumIndex] = currentPageNum - 1;
                var prevUrl = parts.join('/') + '?chain';
            }

            if (window.location.href.indexOf('mode=DEMO') > -1) {
                prevUrl += '&mode=DEMO';
            }

            $backBtn.on('click', function(e) {
                e.preventDefault();
                window.location.href = prevUrl;
            });
        }

        function coverFeeTooltip() {
            var $feeLabel = $('.en__field__label').filter(function() {
                return $(this).text().indexOf('Cover transaction costs') > -1;
            });
        
            if ($feeLabel.length > 0 && $('.fee-info-icon').length === 0) {
                var tooltipHtml = '<span class="fee-info-icon"><i class="fa-regular fa-circle-question"></i></span>' +
                                '<div class="fee-info-tooltip" style="display: none;">' +
                                    'By covering the transaction costs, you ensure that 100% of your donation goes directly toward our mission.' +
                                '</div>';
        
                $feeLabel.append(tooltipHtml);
        
                $('.fee-info-icon').on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    $('.fee-info-tooltip').fadeToggle(200);
                });
                
                $('.fee-info-tooltip').on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
        
                $(document).on('click', function(e) {
                    if (!$(e.target).closest('.fee-info-icon, .fee-info-tooltip').length) {
                        $('.fee-info-tooltip').fadeOut(200);
                    }
                });
            }
        }

        if($('.en__MultiStep_Form').length > 0 && $('.en__back').length === 0) {
            addBackButton();
        }

        if ($('body.page-4').length > 0) {
            setTimeout(function(){
                customTotal();
                coverFeeTooltip();
            },200);
        }

        /* Confirmation Page (Redirect) */
        var $redirectFlag = $('#en-custom-redirect');

        if ($redirectFlag.length > 0) {
            $('.page-step-container').hide();

            var spinner = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
            $('.confirmation-spinner').append(spinner);

            var targetUrl = $redirectFlag.attr('data-url');
            
            setTimeout(function() {
                window.location.replace(targetUrl);
            }, 1500); 
        }
        /*else if ($('body.page-5').length > 0) {
            $('.page-step-container').hide();

            var spinner = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
            $('.confirmation-spinner').append(spinner);
        }*/
    
    } else if ($('.page-ty').length > 0){
        //Thank You Page
        
        var tdElement = $(".transaction-details .recurFreq").text().trim();

        if (tdElement === ""){
            $(".transaction-details .recurFreq").text("One-Time");
        }
        else {
            $(".transaction-details .recurFreq").text("Monthly");
        }
    }
});

(function() {
    function setCustomBackground() {
        const configEl = document.querySelector('.en-bg-config');
        
        if (!configEl) {
            return;
        }

        const body = document.body;
        const type = configEl.getAttribute('data-type');
        
        body.classList.add('custom-bg-active');

        if (type === 'solid') {
            const color = configEl.getAttribute('data-color');
            if (color) body.style.setProperty('--custom-bg-color', color);
        } 
        else if (type === 'gradient') {
            const start = configEl.getAttribute('data-start');
            const end = configEl.getAttribute('data-end');
            const direction = configEl.getAttribute('data-direction') || 'to bottom';
            
            if (start && end) {
                const gradientString = `linear-gradient(${direction}, ${start}, ${end})`;
                body.style.setProperty('--custom-bg-image', gradientString);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setCustomBackground);
    } else {
        setCustomBackground();
    }
})();

//Error Handling
window.enOnValidate = function(){
    if($('.other-amt').hasClass('active')){
        var inputValue = $('.en__field__input--other').val();
        var newValue = inputValue.replace('$', '');
        $('.en__field__input--other').val(newValue);
    }

    return true;
}

window.enOnSubmit = function() {
    return new Promise(function(resolve, reject) {
        if ($('body.page-1').length > 0) {
            var isRecurring = $('input[name="transaction.recurrpay"]:checked').val();
            var isTribute = $('#en__field_transaction_inmem:checked').val();
            var tributeType = $('#en__field_transaction_trbopts').val();
            var honoreeName = $('#en__field_transaction_honname').val();

            sessionStorage.setItem('recurring_val', isRecurring);

            if (isTribute) {
                sessionStorage.setItem('tribute_type', tributeType);
                sessionStorage.setItem('tribute_name', honoreeName);
            }
        }
        else if ($('body.page-4').length > 0) {
            var spinner = '<i class="fa-solid fa-spinner fa-spin-pulse"></i>';
       
            $('.en__submit button').text("Processing ");
            $('.en__submit button').append(spinner);
            $('.en__submit button').prop("disabled", true);
        }

        resolve();
    });
}