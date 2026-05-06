//handler for links in skills area
this.mySkillsLinksHalndler = () => {
	//get all links in divs with class=linksContainer
	$('.linksContainer > a').each(function (index, el) {
		//if data attribute isn't undefined then add onClick listener
		const dataLinkToEl = $(this).attr('data-linkToElement');
		if (typeof dataLinkToEl === 'string') {
			//get project preview div
			const $projectPreviewDiv = $('.' + dataLinkToEl);
			//calculate project preview offset
			const marginPercentFromTop = 5;
			const offsetFromTop = $projectPreviewDiv.offset().top;
			const newOffsetFromTop =
				offsetFromTop - (offsetFromTop * marginPercentFromTop) / 100;
			//console.log(newOffsetFromTop);
			//add listener to link by data attribute
			$(this).click(function (event) {
				event.preventDefault();
				//disable mouse event handler from skills divs
				$('.projectDiv').off(
					'mouseenter mouseleave vmouseover vmouseout focus'
				);
				//scroll to project preview
				$('html').animate(
					{
						scrollTop: newOffsetFromTop
					},
					{
						duration: 900,
						complete: function () {
							//enable mouse event handler from skills divs
							mySkillsAnimation();
							$projectPreviewDiv.mouseenter();
							if (!platformIsMobile) {
								$('.projectDiv').off(
									'mouseenter mouseleave vmouseover vmouseout focus'
								);
								$projectPreviewDiv
									.find('#rmb')
									.one(
										'webkitAnimationEnd oanimationend msAnimationEnd animationend',
										function (e) {
											// console.log('i animation end');
											$(this).trigger('click');
										}
									);
							}
						}
					}
				);
				//trigger click on #rmb button in project preview div
			});
		}
	});
	// console.log(
	// 	$('.linksContainer > ').attr('data-linktoelement')
	// );
};

this.hashNavigationHandler = () => {
	if (window.location.hash === '#projectList') {
		const $target = $('#projectList');

		if ($target.length) {
			setTimeout(function() {
				$('html, body').animate({
					scrollTop: $target.offset().top
				}, 900);
			}, 300);
		}
	}
};
