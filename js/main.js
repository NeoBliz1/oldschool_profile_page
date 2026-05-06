/* eslint-disable no-undef, @typescript-eslint/no-unused-vars, no-unused-vars */
//import functions from modules.js
const skillsLinksHandler = this.mySkillsLinksHalndler;

//srt named event for refresh parallax imgs
jQuery.event.special.renewPage = {
	bindType: 'resize',
	delegateType: 'resize'
};

//checking browser and platform
const platformIsMobile = (function (a) {
	return (
		/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
			a
		) ||
		/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
			a.substr(0, 4)
		)
	);
})(navigator.userAgent || navigator.vendor || window.opera);
let orientationIsChange = false;
if (platformIsMobile) {
	$(window).on('orientationchange', function (event) {
		$('.loader-gif').css('display', 'initial');
		orientationIsChange = true;
		// console.log(orientationIsChange);
	});
}

const zoomInHeader = function () {
	//zoom in main header
	$('.headerContent').addClass('zoomIn animated');
	//hide are elements which will be animated
	$('.scrollAnimate').addClass('hidden');
};

/*use waypoint JQuery plugin for tracking scroll elements*/
let controller = [];
let scenesArr = [];
let upButtonController = {};
let upButtonScene = {};
const iScrollArr = [];
const scrollAnimate = function (viewportHeight, refreshOffset) {
	// console.log(viewportHeight*0.48*(-1))
	const scrollEventOffset = viewportHeight * 0.48 * -1;
	if (!refreshOffset) {
		// console.log('magick scroll initialize');
		$('.scrollAnimate, .progressbar__svg-circle')
			.addClass('animated')
			.each(function (index, el) {
				const stickyId = 'myStickyEl' + index;
				// scenesArr.push('scene'+index);
				const $this = $(this);
				$this.attr('id', stickyId);

				controller[index] = new ScrollMagic.Controller();
				// create a scene
				scenesArr[index] = new ScrollMagic.Scene().addTo(controller[index]);

				scenesArr[index]
					.triggerElement('#' + stickyId)
					.offset(scrollEventOffset)
					.duration(100)
					.on('start', function (event) {
						if ($this.hasClass('hidden')) {
							$('#' + stickyId)
								.removeClass('hidden fadeOutDown')
								.addClass('fadeInUp slow');
						}
					});
			});

		// init controller
		upButtonController = new ScrollMagic.Controller();
		// create a scene
		upButtonScene = new ScrollMagic.Scene().addTo(upButtonController);

		const $upButton = $('.upButton');
		upButtonScene
			.triggerElement(window)
			.offset($(window).height() + $upButton.height())
			.duration(100)
			.on('start', function (event) {
				if (event.scrollDirection === 'FORWARD') {
					// console.log(event.scrollDirection);
					$upButton.removeClass('hidden fadeOutDown').addClass('fadeInUp slow');
				} else {
					// console.log(event.scrollDirection);
					$upButton.removeClass('fadeInUp slow').addClass('fadeOutDown');
				}
			});
	} else if (refreshOffset) {
		for (let i = 0, length1 = scenesArr.length; i < length1; i++) {
			scenesArr[i].offset(scrollEventOffset);
		}
		upButtonScene.offset(scrollEventOffset);
		// console.log('offset is update');
	}
};

/*fadingOut loader screen*/
const loaderScreen = function () {
	$('.loader-gif').css('display', 'initial').fadeOut('slow');
};

//set parallax img attributes
const setParallaxImage = function (wSW, wDPR) {
	let pathToParllaxImg = '../img/cover_bg_3.png';
	let pathToThmbImg = '../img/ava.png';
	const setImgPassway = function () {
		$('.blizThumbnail').css('background-image', 'url(' + pathToThmbImg + ')');
		$('.slider1, .slider2').attr('src', pathToParllaxImg);
	};
	if (wSW >= 2400) {
		const cover_bgUrl =
			'https://res.cloudinary.com/deah4rwon/image/upload/v1607826257/imgs/responsive_Img/cover_bg_3-4k_oji9x8.png';
		$.ajax({
			url: cover_bgUrl,
			type: 'HEAD',
			error: function () {
				pathToParllaxImg = '../img/cover_bg_3.png';
				setImgPassway();
				console.log('img is not available');
			},
			success: function () {
				pathToParllaxImg = cover_bgUrl;
				setImgPassway();
				console.log(' img available');
			}
		});
		pathToThmbImg = '../img/ava.png';
		console.log(pathToParllaxImg);
	} else if (wSW >= 1800 && wDPR >= 0.25 && wDPR < 3) {
		pathToParllaxImg = '../img/cover_bg_3.png';
		pathToThmbImg = '../img/ava.png';
		setImgPassway();
	} else if (wSW < 1800 && wSW >= 640 && wDPR >= 3) {
		pathToParllaxImg = '../img/responsive_Img/cover_bg_3.png';
		pathToThmbImg = '../img/ava.png';
		setImgPassway();
	} else {
		pathToParllaxImg = '../img/cover_bg_3.png';
		pathToThmbImg = '../img/responsive_Img/tiny_ava.png';
		setImgPassway();
	}
};

const $projectDiv = $('.projectDiv');

let durationTime = 500;
let viewportWidth,
	viewportHeight,
	projectDivZoomInCoeff,
	projectDivWidth,
	projectDivHeight;
let projectDivFullSizeState = false;

/*functions which handling MySkills areas divs
and applying zommIn animation on it*/
const DSdurationTime = 500; //div skill full size animation duration time

//add read more button to project divs
const addReadMoreBtnsToPrjDivs = () => {
	$projectDiv.addClass('scrollAnimate hidden');
	$projectDiv.prepend(
		'<button class="readMoreBtn hidden" id="rmb" type="button">read more</button>'
	);
};

//handler for all div thumbnails
const mySkillsAnimation = function () {
	const zoomInAnimation = function (thisIs) {
		durationTime = 500;
		const viewportWidth = $(window).width();

		$(thisIs)
			.removeClass('fadeInUp')
			// .filter(':not(:animated)')
			.css({
				'z-index': 8,
				'text-indent': '1px'
			})
			//using step function for animate skill boxes
			.animate(
				{
					textIndent: viewportWidth * projectDivZoomInCoeff
				},
				{
					step: function (now, fx) {
						let $zoomInIcon = $(thisIs).find('i');
						$zoomInIcon.fadeOutAnimation();
						//animate zomm in skill box
						$(thisIs).css(
							'-webkit-transform',
							'scale3d(' + now + ', ' + now + ', ' + now + ')'
						);
						$(thisIs).css(
							'transform',
							'scale3d(' + now + ', ' + now + ', ' + now + ')'
						);
					},
					duration: durationTime,
					complete: function () {
						let $btns;
						if (platformIsMobile && viewportWidth < 1000) {
							$btns = $(thisIs).find('a');
						} else {
							$btns = $(thisIs).find('button, a');
						}
						$btns
							.rollInBtnAnimation()
							.mousedown(function (event) {
								//animate press button, I use this method because animate.css is a conflict with translateY
								const speed = 50;
								const currentBottomProp = parseFloat($(this).css('bottom'));
								$(this).animate(
									{
										bottom: currentBottomProp - 3 + 'px'
									},
									speed,
									function () {
										$(this).animate(
											{bottom: currentBottomProp + 'px'},
											speed
										);
									}
								);
							})
							.click(function (event) {
								if (event.currentTarget.id === 'rmb') {
									/*alert('Your clicked button 'Read more'');*/
									projectDivFullSizeState = true;
									projectDivFullSize(thisIs);
								}
								// if (event.currentTarget.id === 'vpb') {
								// 	$('.hovered').trigger('mouseleave').removeClass('hovered');
								// }
							});
					}
				},
				'linear'
			);
	};
	const zoomOutAnimation = function (thisIs) {
		durationTime = 500;
		$(thisIs).animate(
			{
				textIndent: 1.0
			},
			{
				step: function (now, fx) {
					$(thisIs).css(
						'-webkit-transform',
						'scale3d(' + now + ', ' + now + ', ' + now + ')'
					);
					$(thisIs).css(
						'transform',
						'scale3d(' + now + ', ' + now + ', ' + now + ')'
					);

					let $zoomInIcon = $(thisIs).find('i');
					$zoomInIcon.fadeInAnimation();
					let $btns;
					if (platformIsMobile && viewportWidth < 1000) {
						$btns = $(thisIs).find('a');
					} else {
						$btns = $(thisIs).find('button, a');
					}
					$btns.rollOutBtnAnimation().off('click');
				},
				duration: durationTime,
				complete: function () {
					$(thisIs).css('z-index', '7');
				}
			},
			'linear'
		);
	};
	jQuery.fn.fadeInAnimation = function () {
		//button animated In
		this.removeClass('fadeOut animated faster').addClass(
			'fadeIn animated faster'
		);
		return this;
	};
	jQuery.fn.fadeOutAnimation = function () {
		//button animated In
		this.removeClass('fadeIn animated faster').addClass(
			'fadeOut animated faster'
		);
		return this;
	};
	jQuery.fn.rollInBtnAnimation = function () {
		//button animated In
		this.removeClass('hidden rollOut animated faster')
			.addClass('rollIn animated faster')
			.attr('tabindex', '0');
		return this;
	};
	jQuery.fn.rollOutBtnAnimation = function () {
		//button animated Out
		this.removeClass('rollIn animated faster')
			.addClass('rollOut animated faster')
			.attr('tabindex', '-1');
		return this;
	};
	//jQuery function for centering div
	jQuery.fn.center = function (
		viewportHeight,
		viewportWidth,
		divCurrentHeight,
		divCurrentWidth
	) {
		const $windowScrollTo = $(window).scrollTop();
		//scrolling to current position after hiding scroll bar
		$(window).on('scroll.fixedCurrentView', function () {
			$(window).scrollTop($windowScrollTo);
		});
		// console.log($windowScrollTo)
		const targetTopOffset = Math.max(
			0,
			(viewportHeight - divCurrentHeight) / 2 + $windowScrollTo
		); //defining the target position from the div top to the viewport
		// console.log('targetTopOffset - '+targetTopOffset)
		const targetLeftOffset = Math.max(
			0,
			(viewportWidth - divCurrentWidth) / 2 + $(window).scrollLeft()
		); //defining the target position from the div left to the viewport
		// console.log(viewportHeight, viewportWidth, divCurrentHeight, divCurrentWidth, $(window).scrollTop());
		this.animate(
			{
				top: targetTopOffset,
				left: targetLeftOffset
			},
			{
				duration: DSdurationTime,
				queue: false,
				complete: function () {
				}
			}
		);
		// console.log('center finished')
		return this;
	};
	//jQuery function for scaling div
	jQuery.fn.scaleDivMax = function (
		viewportHeight,
		viewportWidth,
		divCurrentHeight,
		divCurrentWidth
	) {
		const divTargetWidthCoeff = (viewportWidth * 0.9) / divCurrentWidth;
		const divTargetHeightCoeff = (viewportHeight * 0.9) / divCurrentHeight;
		let divTargetCoeff;
		if (
			viewportWidth > viewportHeight &&
			viewportWidth - viewportHeight > 200
		) {
			divTargetCoeff = divTargetHeightCoeff;
		} else {
			ivTargetCoeff = divTargetWidthCoeff;
		}
		// console.log(viewportWidth);
		// console.log(viewportHeight);
		this.animate(
			{
				textIndent: divTargetCoeff
			},
			{
				step: function (now, fx) {
					$(this).css(
						'-webkit-transform',
						'scale3d(' + now + ', ' + now + ', ' + now + ')'
					);
					$(this).css(
						'transform',
						'scale3d(' + now + ', ' + now + ', ' + now + ')'
					);
				},
				duration: DSdurationTime,
				queue: false,
				complete: function () {
				}
			},
			'linear'
		);
		return this;
	};
	jQuery.fn.backToStartPosition = function (currentDivOffset) {
		this.animate(
			{
				top: currentDivOffset.top,
				left: currentDivOffset.left
			},
			{
				duration: DSdurationTime,
				queue: false
			}
		);
		return this;
	};
	//jQuery function for scaling div
	jQuery.fn.scaleDivMin = function () {
		this.animate(
			{
				textIndent: 1
			},
			{
				step: function (now, fx) {
					$(this).css(
						'-webkit-transform',
						'scale3d(' + now + ', ' + now + ', ' + now + ')'
					);
					$(this).css(
						'transform',
						'scale3d(' + now + ', ' + now + ', ' + now + ')'
					);
				},
				duration: DSdurationTime,
				queue: false,
				complete: function () {
				}
			},
			'linear'
		);
		return this;
	};
	jQuery.fn.scaleCloseButton = function (divCurrentHeight, divCurrentWidth) {
		this.css({
			'font-size': divCurrentWidth * 0.03,
			bottom: divCurrentHeight * 1.02,
			left: divCurrentWidth * 0.99,
			'text-indent': 0
		});
		// console.log(this.css('font-size'))
		return this;
	};

	//scaling project div for more description, sensitive to resize event
	const projectDivFullSize = function (thisIs) {
		const currentDivOffset = $(thisIs).offset();
		const viewportHeight = $(window).height();
		const viewportWidth = $(window).width();
		const divCurrentHeight = $(thisIs).outerHeight();
		const divCurrentWidth = $(thisIs).outerWidth();
		const vpbMarginValue = projectDivWidth * 0.03;
		const vpbFontSize = projectDivWidth * 0.04;

		//cloning current div for saving current structure flex table
		const $cloneDiv = $(thisIs).clone();

		//remove "read more" button
		$cloneDiv.removeClass('projectDiv scrollAnimate').find('#rmb, i').remove();

		//roll in "view project" button
		$cloneDiv
			.find('#vpb')
			.css({
				'font-size': vpbFontSize
			})
			.rollInBtnAnimation();

		$cloneDiv.find('.project_1 > .bottomPart, #vpb').css({
			margin: vpbMarginValue
		});

		//add overlay div
		$('body').append('<div id="fullSizeSkillBoxOverlay"></div>'); //adding overlay div to the end main div
		$cloneDiv
			.attr('id', 'cloneDiv')
			.appendTo('body') //adding clone div to the end main div
			.append(
				'<a class="closeButton" type="button" tabindex="0"><i class="far fa-times-circle"></i></a>'
			)
			.css({
				position: 'absolute',
				top: currentDivOffset.top,
				left: currentDivOffset.left,
				'z-index': 10,
				margin: 0,
				'border-style': 'double',
				'border-color': 'white'
			})
			.center(viewportHeight, viewportWidth, divCurrentHeight, divCurrentWidth)
			.scaleDivMax(
				viewportHeight,
				viewportWidth,
				divCurrentHeight,
				divCurrentWidth
			)
			.focus()
			.find('button, a')
			.mousedown(function (event) {
				//animate press button, I use this method because animate.css is a conflict with translateY
				const speed = 50;
				const currentBottomProp = parseFloat($(this).css('bottom'));
				$(this).animate(
					{
						bottom: currentBottomProp - 3 + 'px'
					},
					speed,
					function () {
						$(this).animate({bottom: currentBottomProp + 'px'}, speed);
					}
				);
			});

		//show description
		$cloneDiv
			.find('.paragraphMSD')
			.removeClass('hidden')
			.hide()
			.fadeIn(DSdurationTime);

		//set close button font-size
		$('.closeButton').scaleCloseButton(divCurrentHeight, divCurrentWidth);

		//show close button
		// $('.closeButton')
		// 	.removeClass('hidden')
		// 	.hide()
		// 	.fadeIn(DSdurationTime)
		// 	.hover(
		// 		function () {
		// 			$(this)
		// 				.find('.fa-times-circle')
		// 				.removeClass('far')
		// 				.addClass('fas')
		// 				.fadeIn(DSdurationTime);
		// 		},
		// 		function () {
		// 			$(this)
		// 				.find('.fa-times-circle')
		// 				.removeClass('fas')
		// 				.addClass('far')
		// 				.fadeIn(DSdurationTime);
		// 		}
		// 	);

		//overlay click handler
		const $closeButton = $('#fullSizeSkillBoxOverlay, .closeButton');
		$closeButton.click(function (event) {
			console.log('click');
			event.preventDefault();
			/* Act on the event */
			projectDivFullSizeState = false;
			projectDivMinimize(this, currentDivOffset);
		});
		//add esc key listner for close enhanced div
		$(document).keyup(function (e) {
			// console.log('keyUp');
			if (e.key === 'Escape') {
				// escape key maps to keycode `27`
				projectDivFullSizeState = false;
				projectDivMinimize($closeButton, currentDivOffset);
				$('.hovered').find('#rmb').focus();
			} else if (e.key === 'Enter') {
				// console.log('enter tapped');
				if ($('.closeButton').hasClass('closeBtnFocused')) {
					// console.log('cose button focused');
					projectDivFullSizeState = false;
					projectDivMinimize($closeButton, currentDivOffset);
					$('.hovered').find('#rmb').focus();
				}
			}
		});
		$('.closeButton').focus(function () {
			// console.log('close button focused');
			$(this).addClass('closeBtnFocused');
		});
		//disable mouse event handler from skills divs
		$projectDiv.off('mouseenter mouseleave vmouseover vmouseout focus');
	};
	//minimize fullSize div $(this).trigger('mouseleave');
	const projectDivMinimize = function (thisIs, currentDivOffset) {
		$(thisIs).off('click, focus');
		$(document).off('keyup');
		$('#fullSizeSkillBoxOverlay').fadeOut(DSdurationTime, function () {
			$(this).remove();
		});
		$('#cloneDiv')
			.scaleDivMin()
			.backToStartPosition(currentDivOffset)
			.fadeOut(DSdurationTime, function () {
				$(this).remove();
			});
		$('body').css('overflow', 'visible');
		$(window).off('scroll.fixedCurrentView');
		//add hover listner
		divHoverHandler();
		const $divFocused = $('.focused');
		//if divs with class focused is exist
		// console.log($divMaximazed[0] === undefined);
		if ($divFocused[0] !== undefined) {
			$divFocused.find('#rmb').focus();
		}
	};
	const divHoverHandler = function () {
		//mouse in and out handler
		$projectDiv
			.hover(
				function () {
					const thisIs = this;
					/* Stuff to do when the mouse enters the element */
					// console.log('mouseenter fired');
					const $divHovered = $('.hovered').not(thisIs);
					//if divs with class focused is exist
					// console.log($divMaximazed[0] === undefined);
					if ($divHovered[0] !== undefined) {
						//minimize div and remove classes
						zoomOutAnimation($divHovered);
						$divHovered.removeClass('hovered');
						// console.log('hovered remove in hover event');
					}
					const $divFocused = $('.focused').not(thisIs);
					//if divs with class focused is exist
					// console.log($divMaximazed[0] === undefined);
					if ($divFocused[0] !== undefined) {
						//minimize div and remove classes
						$divHovered.removeClass('focused');
						// console.log('hovered remove in hover event');
					}
					// console.log($(thisIs));
					if (!$(thisIs).hasClass('hovered')) {
						// console.log('has class hovered');
						$(thisIs).addClass('hovered');
						zoomInAnimation(thisIs);
					}
					if (platformIsMobile) {
						const divCurrentHeight = $(thisIs).outerHeight();
						const viewportHeight = $(window).height();
						const currentDivOffset = $(thisIs).offset();
						const windowScrollTo = currentDivOffset.top;
						const targetTopOffset = Math.max(
							0,
							windowScrollTo - (viewportHeight - divCurrentHeight) / 2
						); //defining the target position from the div top to the viewport
						$('html, body').animate(
							{
								scrollTop: targetTopOffset
							},
							DSdurationTime
						);
						//show description
						if ($(window).width() < 1000) {
							$(thisIs)
								.find('.paragraphMSD')
								.removeClass('hidden')
								.fadeInAnimation();
						}
					}
				},
				function () {
					console.log('mouseleave fired');
					/* Stuff to do when the mouse leaves the element */
					const thisIs = this;
					$(thisIs).removeClass('hovered');
					zoomOutAnimation(thisIs);
					if (platformIsMobile) {
						$(thisIs).find('.paragraphMSD').fadeOutAnimation();
					}
				}
			)
			//add focus listner for tab navigation
			.focus(function () {
				// console.log('div focused');
				const $divFocused = $('.focused');
				//if divs with class focused is exist
				// console.log($divMaximazed[0] === undefined);
				if ($divFocused[0] !== undefined) {
					//minimize div and remove classes
					zoomOutAnimation($divFocused);
					$divFocused.removeClass('focused');
				}
				$(this).mouseenter().addClass('focused');
			});
		if (platformIsMobile) {
			// console.log('swipe1');
			$('.examplesContainer').on('scrollstart', function (event) {
				// console.log('swipe');
				$('.hovered').trigger('mouseleave').removeClass('hovered');
			});
		}
	};

	divHoverHandler();
};

const resizeHandler = function () {
	//resize handler
	//const resizeTimer;
	let browserInitialWidth = window.outerWidth;
	let windowOuterHeight = window.outerHeight;
	$(window).on('renewPage', function (event) {
		if (!platformIsMobile) {
			$('.loader-gif').css('display', 'initial');
		}
		//main resize part
		const viewportWidth = $(window).width();
		const viewportHeight = $(window).height();
		const wSW = window.screen.width;
		const wDPR = window.devicePixelRatio;
		// console.log(wDPR);
		// console.log(viewportHeight);
		const currBrowserWidth = window.outerWidth;
		const currBrowserHeight = window.outerHeight;
		const bWratio = browserInitialWidth / currBrowserWidth;
		let bHratio;
		if (platformIsMobile) {
			bHratio = 1;
		} else {
			bHratio = windowOuterHeight / currBrowserHeight;
		}
		// console.log('viewportHeight' + viewportHeight);
		// console.log('windowOuterHeight'+windowOuterHeight, 'currBrowserHeight'+currBrowserHeight);
		// console.log(bWratio, bHratio);
		windowSizeHandler(viewportWidth, viewportHeight);
		scrollAnimate(viewportHeight, true);
		if (
			(platformIsMobile && orientationIsChange) ||
			bWratio !== 1 ||
			bHratio !== 1
		) {
			browserInitialWidth = currBrowserWidth;
			windowOuterHeight = currBrowserHeight;
			$('#tMessageDialog').dialog('close'); //close current message dialog
			projectDivSizeHandler(
				viewportWidth,
				viewportHeight,
				wDPR,
				windowOuterHeight,
				browserInitialWidth
			);
			cloneDivSizeHandler(viewportHeight, viewportWidth);
			tMessageDialogBox(viewportWidth, viewportHeight);
			// console.log('font and divs resize is happend');
		}
		setParallaxImage(wSW, wDPR);
		$('.slider1').one('load', function (event) {
			if (!platformIsMobile || orientationIsChange) {
				loaderScreen();
				orientationIsChange = false;
			}
			// console.log('windowSizeHandler finished');
			$(window).off('renewPage').trigger('resize');
			resizeHandler();
			// console.log('renewPage is finished');
		});
	});
};
//this function is sensitive to resize event
const windowSizeHandler = function (viewportWidth, viewportHeight) {
	//set main elements width and height
	$('body, .headerContent, .main').width(viewportWidth);

	//set my skills area height
	const FMheight = $('.skillsProgressContainer').height();
	$('.mySkills').height(FMheight * 1.04);

	// console.log();
	const mySkillsDivHeight = $('.mySkills').height();
	const mySkillsDivWidth = $('.mySkills').width();

	//add parallax element
	//initialize parallax script
	const $sldr1 = $('.slider1');
	const $sldr2 = $('.slider2');
	//initial parameters for sliders img
	let sldr1NW, sldr1NH, headerOverlayWidth;
	let headerOverlayHeight, mySkillsOverlayWidth, mySkillsOverlayHeight;

	sldr1NW = $sldr1.get(0).naturalWidth;
	sldr1NH = $sldr1.get(0).naturalHeight;

	if (sldr1NH / (sldr1NW / viewportWidth) < viewportHeight) {
		headerOverlayWidth = 'auto';
		headerOverlayHeight = '100vh';
	} else {
		headerOverlayWidth = '100vw';
		headerOverlayHeight = 'auto';
	}

	if (sldr1NH / (sldr1NW / mySkillsDivWidth) < mySkillsDivHeight) {
		mySkillsOverlayWidth = 'auto';
		mySkillsOverlayHeight = mySkillsDivHeight;
	} else {
		mySkillsOverlayWidth = '100vw';
		mySkillsOverlayHeight = 'auto';
	}
	// initialize parallax
	$sldr1.css({
		width: headerOverlayWidth,
		height: headerOverlayHeight,
		'will-change': 'auto'
	});
	$sldr2.css({
		width: mySkillsOverlayWidth,
		height: mySkillsOverlayHeight
	});

	const parallaxScaleCoeff = 2; //parallax image coeff which enhances parallax effect
	const image1 = document.getElementsByClassName('slider1');
	new simpleParallax(image1, {
		scale: parallaxScaleCoeff,
		delay: 0.6,
		transition: 'cubic-bezier(0,0,0,1)',
		overflow: false
	});
	const image2 = document.getElementsByClassName('slider2');
	new simpleParallax(image2, {
		scale: parallaxScaleCoeff,
		delay: 0.6,
		transition: 'cubic-bezier(0,0,0,1)',
		overflow: false
	});

	//coeefficient for zooming project divs
	if (viewportWidth >= 980) {
		projectDivZoomInCoeff = 1.3 / viewportWidth;
	} else if (viewportWidth >= 350) {
		projectDivZoomInCoeff = 1.4 / viewportWidth;
	} else {
		projectDivZoomInCoeff = 1.2 / viewportWidth;
	}
};
//this function is sensitive to resize event
const projectDivSizeHandler = function (
	viewportWidth,
	viewportHeight,
	wDPR,
	windowOuterHeight,
	windowOuterWidth
) {
	//function handle which window is on resize
	let fontScaleCoeff, blizThumbnailScaleCoeff;
	if (platformIsMobile) {
		if (viewportWidth > viewportHeight) {
			fontScaleCoeff = viewportWidth * 1.2;
			blizThumbnailScaleCoeff = viewportWidth * 0.7;
		} else {
			fontScaleCoeff = viewportHeight * 1.2;
			blizThumbnailScaleCoeff = viewportHeight;
		}
	} else {
		if (viewportWidth > viewportHeight) {
			// console.log(viewportWidth);
			if (viewportWidth < 1000) {
				fontScaleCoeff = viewportWidth;
				blizThumbnailScaleCoeff = viewportWidth;
			} else {
				fontScaleCoeff = 1000;
				blizThumbnailScaleCoeff = 1000;
			}
		} else {
			fontScaleCoeff = viewportHeight;
			blizThumbnailScaleCoeff = viewportHeight;
		}
	}

	//set thumbnail size in px;
	$('.blizThumbnail')
		.width(blizThumbnailScaleCoeff * 0.3)
		.height(blizThumbnailScaleCoeff * 0.3);
	//set responsive size for social networks logos
	$('.logo_prop')
		.width(blizThumbnailScaleCoeff * 0.08)
		.height(blizThumbnailScaleCoeff * 0.08);
	//set responsive font-size
	$('h1')
		.each(function (index) {
			const elFontSize = fontScaleCoeff * 0.025;
			$(this).css('font-size', elFontSize); //set font size in pixels
		})
		.filter('.mainHeader')
		.css('font-size', fontScaleCoeff * 0.04);

	$('h2').each(function (index) {
		const elFontSize = fontScaleCoeff * 0.02;
		$(this).css('font-size', elFontSize); //set font size in pixels
	});

	$('p, a, ul').each(function (index) {
		const elFontSize = fontScaleCoeff * 0.018;
		$(this).css('font-size', elFontSize); //set font size in pixels
	});
	//upButton size handler
	const upButtonFontSize = fontScaleCoeff * 0.045;
	$('.upButton').css({
		'font-size': upButtonFontSize,
		height: 'auto',
		width: '-moz-min-content',
		padding: fontScaleCoeff * 0.005,
		'padding-bottom': 'initial',
		// bottom:  fontScaleCoeff*0.04,
		right: fontScaleCoeff * 0.04
	});
	//messageButton size handler
	const messageButtonFontSize = fontScaleCoeff * 0.04;
	$('.messageButton').css({
		'font-size': messageButtonFontSize,
		width: messageButtonFontSize * 1.5,
		height: messageButtonFontSize * 1.5,
		'padding-top': fontScaleCoeff * 0.005,
		'padding-bottom': 'initial',
		// bottom:  fontScaleCoeff*0.04,
		left: fontScaleCoeff * 0.04
	});

	//set project div size
	projectDivWidth = Math.pow(viewportWidth * 30000, 1 / 3);
	projectDivHeight = projectDivWidth * 0.8;
	$projectDiv.css({
		'min-width': projectDivWidth,
		'min-height': projectDivHeight,
		width: projectDivWidth,
		height: projectDivHeight,
		'margin-left': 0.05 * projectDivWidth,
		'margin-right': 0.05 * projectDivWidth
	});
	//set buttons font-size
	$('#rmb, #vpb').css('font-size', projectDivWidth * 0.06);
	//set button vpb position parameters, except project_1 and 2 divs
	$projectDiv
		.not('.project_1, .projectWithDescription')
		.find('#vpb')
		.css({
			left: projectDivWidth * 0.55,
			bottom: 0,
			'margin-bottom': projectDivWidth * 0.02
		});

	//set paragraph size in project divs
	if (platformIsMobile) {
		$('.paragraphMSD').css({
			'text-indent': projectDivWidth * 0.02,
			'font-size': projectDivWidth * 0.05
		});
	} else {
		$('.paragraphMSD').css({
			'text-indent': projectDivWidth * 0.02,
			'font-size': projectDivWidth * 0.025
		});
	}
};
//this function is sensitive to resize event
const cloneDivSizeHandler = function (viewportHeight, viewportWidth) {
	//handle clone div if it exist
	const $cloneDiv = $('#cloneDiv');
	if ($cloneDiv.length) {
		const divCurrentHeight = $cloneDiv.outerHeight();
		const divCurrentWidth = $cloneDiv.outerWidth();
		const vpbFontSize = divCurrentWidth * 0.04;
		const vpbMarginValue = divCurrentWidth * 0.03;
		// console.log(viewportWidth);
		// console.log(divCurrentWidth);
		// console.log(divCurrentHeight);
		$cloneDiv
			.center(viewportHeight, viewportWidth, divCurrentHeight, divCurrentWidth)
			.scaleDivMax(
				viewportHeight,
				viewportWidth,
				divCurrentHeight,
				divCurrentWidth
			)
			.find('#vpb')
			.css({
				'font-size': vpbFontSize
			});
		//set close button font-size
		$('.closeButton').scaleCloseButton(divCurrentHeight, divCurrentWidth);
		// console.log('rescaling is happened')
		$cloneDiv.find('.paragraphMSD').css({
			'text-indent': divCurrentWidth * 0.02,
			'font-size': divCurrentWidth * 0.025
		});
	}
};
//handler for tMessage box
//this function is sensitive to resize event
const tMessageDialogBox = function (viewportWidth, viewportHeight) {
	//dialog init variables
	let titleFontSize,
		messagesFontSize,
		robotFontsize,
		userIconSize,
		targetWidth,
		targetHeight,
		thHeight;

	jQuery.fn.scrollToLastMsg = function () {
		const $this = $(this);
		$this.scrollTop($this[0].scrollHeight);
		return this;
	};
	jQuery.fn.fixUserIconSize = function () {
		const $this = $(this);
		$this.css({
			width: userIconSize,
			height: userIconSize,
			'min-height': userIconSize
		});
		return this;
	};
	let pOf, pAt, pMy;
	if (platformIsMobile) {
		targetWidth = viewportWidth * 0.8;
		targetHeight = viewportHeight * 0.7;
		// console.log(targetWidth)
		if (viewportWidth > viewportHeight) {
			titleFontSize = targetHeight / 18;
			messagesFontSize = titleFontSize / 1.5;
			robotFontsize = targetHeight / 15;
			userIconSize = targetHeight / 10;
		} else {
			titleFontSize = targetHeight / 25;
			messagesFontSize = titleFontSize / 1.5;
			robotFontsize = targetHeight / 20;
			userIconSize = targetHeight / 10;
		}
		thHeight = '65%';
		pMy = 'center';
		pAt = 'center';
		pOf = window;
	} else {
		targetWidth = viewportWidth * 0.3;
		targetHeight = viewportHeight * 0.76;
		titleFontSize = targetHeight * 0.039;
		messagesFontSize = titleFontSize * 0.7;
		robotFontsize = targetHeight * 0.07;
		userIconSize = targetHeight * 0.1;
		thHeight = '60%'; //height of thought area
		pMy = 'left bottom';
		pAt = 'left bottom-60';
		pOf = '.messageButton';
	}

	//initizlize dialog widget
	const $tMessageDialog = $('#tMessageDialog');
	const $tCont = $('.thoughtContainer');
	// console.log($tMessageDialog.dialog('instance'));
	if ($tMessageDialog.dialog('instance') === undefined) {
		// console.log('t box initialized');
		$tMessageDialog.dialog({
			position: {my: pMy, at: pAt, of: pOf},
			width: targetWidth,
			height: targetHeight,
			resizable: true,
			autoOpen: false,
			show: {
				effect: 'blind',
				direction: 'down',
				duration: DSdurationTime
			},
			hide: {
				effect: 'blind',
				direction: 'down',
				duration: DSdurationTime
			}
		});
		let chatUpdateTimer;
		const updateChat = function () {
			$.ajax({
				type: 'GET',
				url: 'https://t-msg-bot.space/get_msg',
				crossDomain: true,
				success: function (data) {
					console.log(data);
					if (!jQuery.isEmptyObject(data)) {
						// console.log(Object.values(data));
						const textMsg = Object.values(data)[0];
						$tCont
							.append('<p class="thought robotThought">' + textMsg + '</p>')
							.append('<i class="userIcon"></i>');
						$('.userIcon').fixUserIconSize();
						$tCont.scrollToLastMsg();
					}
				}
			});
		};
		$('.ui-dialog')
			.on('dialogclose', function (event, ui) {
				clearInterval(chatUpdateTimer); //stop update chat when the dialog is closed
				console.log('clearInterval');
			})
			.on('dialogopen', function (event, ui) {
				chatUpdateTimer = setInterval(function () {
					updateChat();
					// console.log('startInterval');
				}, 5000);
			})
			.on('resize', function (e) {
				// console.log('stop prop');
				$('#tMessageDialog').css('width', $(this).width());
				e.stopPropagation(); // prevents triggering to resize the entire page
			});
		//toggle message box view
		$('.messageButton').click(function (event) {
			const isOpen = $tMessageDialog.dialog('isOpen');
			if (isOpen) {
				$tMessageDialog.dialog('close');
			} else {
				$tMessageDialog.dialog('open');
			}
		});
		//send message
		let execOnce = false;
		const rcHlC = $('#recaptchaCheck'); //recaptcha highlighter container
		$('.sendBtn').click(function (event) {
			const nnV = $('#nickName').val();
			const tMV = $('#tMessageArea').val();
			const gCR = $('#g-recaptcha-response');
			if (nnV === null || nnV === '') {
				console.log("Nick name can't be empty");
			} else if (tMV === null || tMV === '') {
				console.log("Message field can't be empty");
			} else if (gCR.val() === null || gCR.val() === '') {
				console.log('gCR is empty');
				rcHlC.val('');
			} else {
				event.preventDefault();
				rcHlC.val('1');
				const formDateArr = $('form').serializeArray();
				const formDate = JSON.stringify(formDateArr);
				// console.log(formDate);
				const curThoughtFontSize = $('.thought').css('font-size');
				const curRobotFontSize = $('.fa-robot').css('font-size');
				$tCont.append(
					'<p class="thought userThought">' + formDateArr[1].value + '</p>'
				);

				if (!execOnce) {
					$tCont
						.append(
							"<p class='thought robotThought'>I forwarded your messge. If you don't have time, just give me the contact information, master contact with you later.</p>"
						)
						.append('<i class="fas fa-robot"></i>');
					execOnce = true;
				}

				$('.thought').css('font-size', curThoughtFontSize);
				$('.fa-robot').css('font-size', curRobotFontSize);
				// $tCont.scrollTop($('.thoughtContainer')[0].scrollHeight); //scroll to the last text msg
				$tCont.scrollToLastMsg();
				$.ajax({
					type: 'POST',
					url: 'https://t-msg-bot.space/post_msg',
					data: formDate,
					crossDomain: true,
					success: function (data) {
						console.log(data);
						$('#tMessageArea').val('');
					}
				});
			}
		});
		$('#tMessageArea').keypress(function (event) {
			const key = event.keyCode;
			if (key === 13) {
				$('.sendBtn').click();
			}
		});
	}

	//update size of dialog box
	$tMessageDialog
		.dialog('option', 'height', targetHeight)
		.dialog('option', 'width', targetWidth);
	//update size thought area
	$tCont.height(thHeight);
	//refresh fornt sizes of dialog content
	$('.sendBtn').css('font-size', titleFontSize);

	$('.ui-dialog')
		.css({
			position: 'fixed',
			'min-width': '350px'
		})
		.find('.ui-dialog-titlebar')
		.css({
			'font-size': titleFontSize,
			'margin-top': '-20px',
			'margin-left': '10px',
			'margin-right': '10px'
		});

	$('.ui-dialog')
		.find('.thought, label, input, textarea')
		.css('font-size', messagesFontSize);

	$('.fa-robot').css({
		'font-size': robotFontsize
	});

	$('.userIcon').fixUserIconSize();
};

//handler for scroll top button

const scrollTop = function () {
	if (platformIsMobile) {
		$('.upButton')
			.mousedown(function (event) {
				//animate press button, I use this method because animate.css is a conflict with translateY
				const $this = $(this);
				const speed = 50;
				const currentBottomProp = parseFloat($(this).css('bottom'));

				$this.animate(
					{
						bottom: currentBottomProp - 3 + 'px'
					},
					speed,
					function () {
						$this.animate({bottom: currentBottomProp + 'px'}, speed);
					}
				);
			})
			.click(function (event) {
				event.preventDefault();
				$('html, body').animate(
					{
						scrollTop: $('.header').offset().top
					},
					900
				);
			});
	} else {
		$('.upButton')
			.hover(
				function () {
					$(this)
						.addClass('upButton-hover')
						.find('.fa-arrow-alt-circle-up')
						.removeClass('far')
						.addClass('fas');
				},
				function () {
					$(this)
						.removeClass('upButton-hover')
						.find('.fa-arrow-alt-circle-up')
						.removeClass('fas')
						.addClass('far');
				}
			)
			.click(function (event) {
				event.preventDefault();
				$('html, body').animate(
					{
						scrollTop: $('.header').offset().top
					},
					900
				);
			});
	}
};

/**************main block*******************/
$(window).on('load', function () {
	const viewportWidth = $(window).width();
	const viewportHeight = $(window).height();
	const wSW = window.screen.width;
	const wDPR = window.devicePixelRatio;
	const windowOuterWidth = window.outerWidth;
	const windowOuterHeight = window.outerHeight;
	scrollTop(); //handler for up button
	addReadMoreBtnsToPrjDivs();
	mySkillsAnimation();
	projectDivSizeHandler(
		viewportWidth,
		viewportHeight,
		wDPR,
		windowOuterHeight,
		windowOuterWidth
	); //resize MySkills divs from window size
	setParallaxImage(wSW, wDPR);
	$('.slider1').one('load', function (event) {
		windowSizeHandler(viewportWidth, viewportHeight); //resize main blocks according to window width
		resizeHandler();
		scrollAnimate(viewportHeight, false); //scroll handler for divs
		loaderScreen();
		zoomInHeader();
		//handler for tMessage box
		tMessageDialogBox(viewportWidth, viewportHeight);
		console.log('document loaded');
		skillsLinksHandler();
		hashNavigationHandler();
	});
});
