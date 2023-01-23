$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

// Generate new unique ID
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

/* Grab referral code */
var queryString = window.location.search;
if (!window.location.search.includes('?') && window.location.hash.includes('?')) {
	queryString = '?' + window.location.hash.split('?')[1];
}
const urlParams = new URLSearchParams(queryString);
if (urlParams.has('utm_id')) {
	const utm_id = urlParams.get('utm_id');
  $('#Referred-From-ID').val(utm_id);
  console.log("Referred by ID " + utm_id);
}

var lastVPHeight = 0;
if ($(window).width() < 991.5) {
  const containier_scroll_class = '.everwork-site';
  
  const scroll_arr = ["0", "1", "2", "3", "4", "5"];
  const numAppSlides = 5;
  const numLaptopSlides = 6;
  const scrollBoxIDs = scroll_arr.map(i => "#scroll-box-" + i);
  const scrollBoxEls = scrollBoxIDs.map(id => document.querySelector(id));
  
  const top_page_el_id = '#everwork-site-logo';
  const disable_snap_el_id = '#after-scroll';
  const remove_waitlist_banner_id = "#everwork-footer";
  
  const top_page_el = document.querySelector(top_page_el_id);
  const disable_snap_el = document.querySelector(disable_snap_el_id);
  const remove_waitlist_banner_el = document.querySelector(remove_waitlist_banner_id);

  var onlyOneActiveScroll = function (activeIdx) {
    scroll_arr.forEach(idx => {
      $(".mobile-scroll-"+activeIdx).css("opacity", "1");
      if (idx != activeIdx) {
        $(".mobile-scroll-"+idx).css("opacity", "0");
      }
    });

    if ($(".for-workers").css("display") == "none") { // company mode
      var activeIdxInt = parseInt(activeIdx);
      const multiplierVW = 60;
      const startingMarginVW = 150;

      var newMarginVW = startingMarginVW - (multiplierVW*activeIdxInt);
      var newMarginVWStr = newMarginVW.toString() + "vw";
      $(".companies-app").animate({ 'marginLeft': newMarginVWStr, opacity: 1 }, 750)
    }
  }
  
  const observer = new window.IntersectionObserver(([entry]) => {
    if (entry.target.id == disable_snap_el_id.substring(1) && entry.isIntersecting) {
      console.log("Disable snap");
      $('#hack-animate-coming-soon').click();
      $('#hack-move-toggle-up').click();
      // $("#site-wrapper").css("scroll-snap-type", "y");
      $('#almost-live-container').show();
      return;
    } else if (entry.target.id == disable_snap_el_id.substring(1)) {
      $('#hack-move-toggle-down').click();
      //$('#toggle-site-panel').hide();
      /*
      var numSlides = $(".for-workers").css("display") == "none" ? numLaptopSlides : numAppSlides;
      onlyOneActiveScroll(scroll_arr[numSlides - 1]);
      */
      return;
    }
    if (entry.target.id == remove_waitlist_banner_id.substring(1) && entry.isIntersecting) {
      $('#almost-live-container').hide();
      return;
    } else if (entry.target.id == remove_waitlist_banner_id.substring(1)) {
      $('#almost-live-container').show();
      return;
    }
    if (entry.target.id == top_page_el_id.substring(1) && entry.isIntersecting) {
      $('#toggle-site-panel').show();
      $('#almost-live-container').hide();
      //onlyOneActiveScroll(scroll_arr[0]);
      return;
    }
    scrollBoxEls.forEach(el => {
      const el_idx = el.id.split('-').pop();
      if (numAppSlides <= parseInt(el_idx) && $(".for-companies").css("display") == "none") {
        return;
      }
      if (entry.target.id == el.id && entry.isIntersecting) {
        $('#toggle-site-panel').hide();
        $('#almost-live-container').hide();
        // $("#site-wrapper").css("scroll-snap-type", "y mandatory");
        if ($(".mobile-scroll-"+el_idx).css("opacity") != "1") {
          onlyOneActiveScroll(el_idx);
        }
        return;
      }
    });
    
  }, {
    root: null,
    threshold: 0.8, // 80% of viewport
  });

  observer.observe(top_page_el);
  observer.observe(disable_snap_el);
  observer.observe(remove_waitlist_banner_el);
  // Uncomment to enable scroll box snapping
  // scrollBoxEls.forEach(el => observer.observe(el));
}

$("#companies-laptop-v2").scroll(function() {
    $(".swipe-to-view-dashboard").fadeTo( 1000, 0 );
});

$('.everwork-site').scroll(function() {
    if ($('#better-work').isInViewport() || $('#paying-too-much').isInViewport()) {
        $('#toggle-site-panel').hide();
    } else if ($('#reappear-toggle').isInViewport() && $(window).width() > 991) {
        $('#toggle-site-panel').show();
    }
});

// Fix a bug with the scrolling of "how it works"
$("#how-it-works").click(function() {
    $('#site-wrapper').css('overflow','visible');
    $('html, body').animate({
        scrollTop: $("#mockup-section").offset().top
    }, 800, function() {
    	if ($(window).width() > 991) { // snap scroll fix
        document.getElementById('mockup-section').scrollIntoView(true);
        $('#site-wrapper').css('overflow-y','scroll');
        $('#site-wrapper').css('overflow-x','hidden');
      }
    });
});

// Transition to second step and
// propogate the email to the "more info" form
$('#email-company-form').submit(() => {
    $('#hack-company-email-success-trigger').click();
    const submittedEmail = $('#enter-work-email').val();
    $('#more-info-email').val(submittedEmail);
});

// Transition to third step
$('#more-info-form').submit(() => {
    if ($("#worker-toggle-btn").hasClass("toggle-active")) {
      $('#hack-more-info-success-trigger').click();
    }
});

$('#schedule-call').click(() => {
	  Calendly.initPopupWidget({url: 'https://calendly.com/filip-susic-everwork/30min?background_color=f8f5ec&text_color=2c3219&primary_color=5e7541'});
    return false;
});

var lastScrollPos = 0;
$( document ).ready(function() {
		// Populate new unique referral code
  	const newReferralID = uuidv4();
    $('#Refer-Others-With-ID').val(newReferralID);

    $(".for-companies").hide();
    $("#worker-toggle-btn").addClass("toggle-active");
    $("#company-toggle-btn").addClass("toggle-inactive");
    
    function isOnGreenBG () {
      panelBGColor = $("#toggle-site-panel").css("background-color");
      return panelBGColor == 'rgb(66, 73, 47)';
    }
    
    // Whenever company mode is toggled
    $("#company-toggle-btn").click(function() {
        $(".for-companies").show();
        $(".for-workers").hide();
        $("#worker-toggle-btn").removeClass("toggle-active").addClass("toggle-inactive");
        $("#company-toggle-btn").addClass("toggle-active").removeClass("toggle-inactive");;
        $("#company-name-field").show();
        $("#company-name-field").prop('required', true);
        $("#Is-Company").prop('checked', true);
        $("#Is-Employer").prop('checked', true);
        
        $(this).css("background-color", "#F2F2F2");
        $(this).css("color", "black");
        $("#worker-toggle-btn").css("background-color", "transparent");
        $("#enter-work-email").attr("placeholder", "Enter Work Email");
        
        if (isOnGreenBG()) {
          $("#worker-toggle-btn").css("color", "white");
        } else {
          $("#worker-toggle-btn").css("color", "black");
        }
    });
    
    // Whenever worker mode is toggled
    $("#worker-toggle-btn").click(function() {
        $(".for-workers").show();
        $(".for-companies").hide();
        $("#company-toggle-btn").removeClass("toggle-active").addClass("toggle-inactive");
        $("#worker-toggle-btn").addClass("toggle-active").removeClass("toggle-inactive");
        $("#company-name-field").hide();
        $("#company-name-field").prop('required', false);
        $("#Is-Company").prop('checked', false);
        $("#Is-Employer").prop('checked', false);
        
        $(this).css("background-color", "#F2F2F2");
        $(this).css("color", "black");
        $("#company-toggle-btn").css("background-color", "transparent");
        $("#enter-work-email").attr("placeholder", "Enter Email");
        
        if (isOnGreenBG()) {
          $("#company-toggle-btn").css("color", "white");
        } else {
          $("#company-toggle-btn").css("color", "black");
        }
    });
    
    if ($(window).width() < 992) {
    		
        function blurListener(event) {
        	window.scrollBy(0,100);
        }
        [].forEach.call(document.querySelectorAll('input'), function(el) {
          el.addEventListener('blur', blurListener, false);
        });
        
        // Whenever a modal is open
        $(".modal-btn").click(function() {
        	lastScrollPos = $(window).scrollTop();
          setTimeout(() => {
            $('body').css('overflow', 'hidden');
            $('#site-wrapper').css('overflow', 'hidden');
            window.scrollBy(0,100);
          }, 500);
        });

        // Whenever a modal is closed
        $(".div-block-49").click(function() {
          $('body').css('overflow', 'visible');
          $('#site-wrapper').css('overflow', 'visible');
          window.scrollBy(0, lastScrollPos);
        });
    		
        console.log("Mobile view..");
        $("#join-waitlist-company").val("Join");
    }
    
    if (window.location.hash.includes("join-waitlist")) {
        console.log("Waitlist hash");
        if ($(window).width() < 992) {
          $('body').css('overflow', 'hidden');
        	$('#site-wrapper').css('overflow', 'hidden');
        }
        $(".waitlist-modal").css("display", "flex");
        $(".waitlist-modal").css("opacity", "1");
    }
    
    if (window.location.hash.includes("company")) {
      $("#company-toggle-btn").click();
    }
});

function isCalendlyEvent(e) {
  return e.origin === "https://calendly.com" && e.data.event && e.data.event.indexOf("calendly.") === 0;
};
 
window.addEventListener("message", function(e) {
  if(isCalendlyEvent(e) && e.data.event == "calendly.event_scheduled") {
    $('#waitlist-modal-close').click();
  }
});