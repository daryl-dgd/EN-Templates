$(document).ready(function($) {

	console.log('global_js');

    //Add link to header logo
    var $headerLogo = $('.custom-header img.headerLogo').first();

    if ($headerLogo.length) {
        $headerLogo.wrapAll($('<a href="#" target="_blank" />'));
    }

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

    $('.footer-inner .footer-details').wrapAll('<div class="frow-container" />');
	
	if($('.page-1').length > 0){
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

        $('.other-amt-input').appendTo('.other-amt');
		
		//Add a minimum donation note
		$('<p style="font-size:12px;margin-bottom:0px;position:absolute;bottom:-15px;left:0;">Minimum donation of $5.00</p>').appendTo('.en__field__item.other-amt');

        $('input[name="transaction.recurrpay"]:checked').parent().addClass("active");
        
        //Add objects for $ amount and Monthly to the submit button
        $('.en__submit button').append(" <span class='totalAmount'></span><span class='monthlyToggle'> Monthly</span>");
	
        //Manage classes of inputs based on what is selected
        $('input[name="transaction.donationAmt"]:checked').parent().addClass("active");

        $('input[name="transaction.donationAmt"]').click(function() {
            $('input[name="transaction.donationAmt"]').parent().removeClass("active");
            $('input[name="transaction.donationAmt"]:checked').parent().addClass("active");
            
            console.log("clicked amount - " + $(this).val());

            if ($(this).val() == "Other") {
                $('.other-amt label').hide();

                setTimeout(function(){
                    $('.en__field__input--other').click();
                    $('.en__field__input--other').focus();
                },100);
            }
            else {
                $('.other-amt label').show();
                
                setTimeout(function(){
					var latestTotal = getTotalAmountText();
					console.log('latestTotal:', latestTotal);
					$('.totalAmount').text(latestTotal);
				}, 100);
            }
        });
        
        $('input[name="transaction.donationAmt"]:checked').click();

        if ($('input[name="transaction.recurrpay"]:checked').val() == "N") {
            $('.en__field--donationAmt').addClass("one-time-selected");
            $('.monthlyToggle').hide();
        }
        else {
            $('.en__field--donationAmt').addClass("monthly-selected");
            $('.monthlyToggle').show();
        }

        //Checking for One-Time or Monthly option and select first available donation amount unless Other is already selected
        $('input[name="transaction.recurrpay"]').click(function() {
            $('input[name="transaction.recurrpay"]').parent().removeClass("active");
            $('input[name="transaction.recurrpay"]:checked').parent().addClass("active");

            if ($(this).val() == "N") {
                if ($('.en__field--donationAmt').hasClass("monthly-selected")) {
                    if (!$('.other-amt').hasClass('active')) {
                        $('#en__field_transaction_donationAmt2').click();
                    }
                }

                $('.en__field--donationAmt').removeClass("monthly-selected");
                $('.en__field--donationAmt').addClass("one-time-selected");
                
                $('.monthlyToggle').hide();
            }
            else {
                if ($('.en__field--donationAmt').hasClass("one-time-selected")) {
                    if (!$('.other-amt').hasClass('active')) {
                        $('#en__field_transaction_donationAmt6').click();
                    }
                }

                $('.en__field--donationAmt').removeClass("one-time-selected");
                $('.en__field--donationAmt').addClass("monthly-selected");
                
                $('.monthlyToggle').show();
            }
        });

        //Update total amount when other is updated
        $(document).on('input keyup blur change', '.en__field__input--other', function () {
			// Increase the delay slightly to give EN time to calculate fees
			setTimeout(function () {
				var latestTotal = getTotalAmountText();
				console.log('Syncing Other Total:', latestTotal);
				$('.totalAmount').text(latestTotal);
			}, 200); // 200ms is usually the sweet spot for EN calculations
		});

        //Build array of donation levels and split them between One-Time and Monthly options
        $('.en__field--donationAmt label').each(function() {
            if ($(this).text().trim() === "Onetime") {
                $(this).text("$" + $(this).prev('.en__field__input').val());
                $(this).parent().addClass("don-level one-time");
            } else if ($(this).text().trim() === "Monthly") {
                $(this).text("$" + $(this).prev('.en__field__input').val());
                $(this).parent().addClass("don-level monthly");
            }
        });

        //Accessibility on giving levels - focus state
        $(".en__field--donationAmt input").on('focus', function(){
            $(this).parent().addClass('focus');
        });

        $(".en__field--donationAmt input").on('focusout', function(){
            $(this).parent().removeClass('focus');
        });

        $(".en__field--recurrpay input").on('focus', function(){
            $(this).parent().addClass('focus');
        });

        $(".en__field--recurrpay input").on('focusout', function(){
            $(this).parent().removeClass('focus');
        });
		
        //Wrap elements in donor-info div
        $('.en__field--title').wrap($('<div class="donor-info"/>'));
        $('.en__field--firstName, .en__field--lastName').wrapAll($('<div class="donor-info"/>'));
        $('.en__field--infname').wrapAll($('<div class="donor-info tribute-fields"/>'));
        $('.en__field--address1, .en__field--address2').wrapAll($('<div class="donor-info"/>'));
        $('.en__field--infadd1, .en__field--infadd2').wrapAll($('<div class="donor-info tribute-fields"/>'));
        $('.en__field--city, .en__field--region').wrapAll($('<div class="donor-info"/>'));
        $('.en__field--infcity, .en__field--infreg').wrapAll($('<div class="donor-info tribute-fields"/>'));
        $('.en__field--postcode, .en__field--country').wrapAll($('<div class="donor-info"/>'));
        $('.en__field--emailAddress, .en__field--phoneNumber').wrapAll($('<div class="donor-info"/>'));
        $('.en__field--ccexpire, .en__field--ccvv').wrapAll($('<div class="donor-info"/>'));

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
		
		$(document).on('change', '#en__field_transaction_feeCover', function () {
			syncTotalAmount(150);
		});
    
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
        var spinner = '<i class="fa-solid fa-spinner fa-spin-pulse"></i>';
       
        $('.en__submit button').text("Processing ");
        $('.en__submit button').append(spinner);
        $('.en__submit button').prop("disabled", true);
        resolve();
    });
}