'use strict';

// jQuery.event.special.renewPage = {
//   bindType: 'resize',
//   delegateType: 'resize'
// };

/*fadingOut loader screen*/
var loaderScreen = function () {
	$('.loader-gif').fadeOut('slow');
}


$('.smallCanvas').prepend('<div class="home_container"><a href="../index.html#projectList"><div class="go_home"></div></a></div>');

$(document).ready(function () {
	let $target = $('#projectList')

	if ($target.length) {

		setTimeout(function () {
			const offset = $target.offset().top + 300;
			console.log(offset);
			$('html, body').animate({
				scrollTop: offset
			}, 900);
		}, 100);
	}
});
// Add click handler
$('.go_home_link').click(function (e) {
	e.preventDefault();

	// Get the projectList section position and add 300px
	const $projectList = $('#projectList');
	if ($projectList.length) {
		const scrollToPosition = $projectList.offset().top + 300;

		$('html, body').animate({
			scrollTop: scrollToPosition
		}, 900);
	}
});
$('.home_container').css({
	'z-index': '3',
	position: 'absolute',
	top: '10px',
	right: '10px'
});
$('body').css('overflow-x', 'visible');

var windowSizeHandler = function () {
	var $wWidth = $(window).width();
	var $canvasHSWidth = $('#canvasHolderSmall').width();
	if ($wWidth >= $canvasHSWidth) {
		$('.smallCanvas').width($wWidth);
	} else {
		$('.smallCanvas').width($canvasHSWidth + 40);
	}

};

//resize handler
var resizeHandler = function () {
	$(window).resize(function () {
		$('.loader-gif').css('display', 'initial');
		var resizeTimer;
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function () {
			windowSizeHandler();
			loaderScreen();
		}, 250);
	});
}

/**************main block*******************/
$(window).on('load', function () {
	console.log('document loaded');
	loaderScreen();
	windowSizeHandler(); //resize main blocks according to window width
	resizeHandler();
});


