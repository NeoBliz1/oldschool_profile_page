// Configuration constants
const SESSION_TIME_TO_LIVE = 7 * 24 * 60 * 60 * 1000; // 7 days
const MIN_POLL_INTERVAL = 40000;  // 40 seconds starting point
const MAX_POLL_INTERVAL = 120000; // 2 minutes maximum
const IDLE_BACKOFF_MULTIPLIER = 2; // Double interval when idle
// const API_BASE_URL = 'http://localhost:8080';
const API_BASE_URL = 'https://profile-chat-service.vercel.app';

// LocalStorage Keys
const LOCKOUT_EXPIRY = 'chat_lockout_expiry';
const CHAT_NICKNAME = 'chat_nickname';
const UUID_KEY = 'uuid';
const LAST_SENDER_KEY = 'last_sender';

// State tracking variables
let currentVisibleMessageCount = 0;
let pollingTimeoutID = null;
let currentPollInterval = MIN_POLL_INTERVAL;
let idlePollCount = 0;
let blinkingInterval = null;
let originalTitle = document.title;

// Custom jQuery extensions
jQuery.fn.scrollToLastMsg = function () {
	const $this = $(this);
	if ($this.length && $this[0].scrollHeight) {
		$this.scrollTop($this[0].scrollHeight);
	}
	return this;
};

jQuery.fn.fixUserIconSize = function (userIconSize) {
	return this.css({
		width: userIconSize,
		height: userIconSize,
		'min-height': userIconSize
	});
};

// Notification functions
const startBlinking = function () {
	if (blinkingInterval) return;

	$('.messageButton').addClass('blinking');
	let isTitleToggled = false;
	blinkingInterval = setInterval(function () {
		document.title = isTitleToggled ? originalTitle : 'New message...';
		isTitleToggled = !isTitleToggled;
	}, 1000);
};

const stopBlinking = function () {
	if (!blinkingInterval) return;

	$('.messageButton').removeClass('blinking');
	clearInterval(blinkingInterval);
	blinkingInterval = null;
	document.title = originalTitle;
};

const validateInput = function(text) {
    const pattern = /^[a-zA-Z0-9а-яА-ЯёЁ!?*()_., -]*$/;
    return pattern.test(text);
};

// Global control utilities
const stopPolling = function () {
	if (pollingTimeoutID) {
		clearTimeout(pollingTimeoutID);
		pollingTimeoutID = null;
		console.log('Polling stopped');
	}
};

const unlockNicknameField = function () {
	console.log("Unlocking nickname field and clearing session data.");
	$('#nickName').prop('disabled', false).val('');
	localStorage.removeItem(CHAT_NICKNAME);
	localStorage.removeItem(UUID_KEY);
	localStorage.removeItem(LOCKOUT_EXPIRY);
	localStorage.removeItem(LAST_SENDER_KEY);
	currentVisibleMessageCount = 0;
	stopPolling();
};

const checkAndApplyUserSessionLock = function () {
	const savedName = localStorage.getItem(CHAT_NICKNAME);
	const uuid = localStorage.getItem(UUID_KEY);
	const expiryTime = localStorage.getItem(LOCKOUT_EXPIRY);
	const $nameInput = $('#nickName');

	if (savedName && expiryTime && uuid) {
		const parsedExpiry = parseInt(expiryTime, 10);

		if (Date.now() < parsedExpiry) {
			$nameInput.val(savedName).prop('disabled', true);
			return true;
		} else {
			console.log("Session expired. Cleaning up.");
			unlockNicknameField();
			return false;
		}
	}
	return false;
};

// Adaptive synchronization routine
const synchronizeChatThreadHistory = function (uuid) {
	stopPolling();

	currentPollInterval = MIN_POLL_INTERVAL;
	idlePollCount = 0;

	const poll = function () {
		// 1. Session expiration check
		const expiryTime = localStorage.getItem(LOCKOUT_EXPIRY);
		if (!expiryTime || Date.now() > parseInt(expiryTime, 10)) {
			console.log("Session expired. Stopping polling.");
			unlockNicknameField();
			return;
		}

		// 3. Clean environment URL string without any index tracking parameters
		const apiUrl = `${API_BASE_URL}/api/check?uuid=${encodeURIComponent(uuid)}`;

		$.ajax({
			type: 'GET',
			url: apiUrl,
			dataType: 'json',
			timeout: 8000,
			success: function (response) {
				// If the mailbox contains any history records, render them
				if (response && response.history && response.history.length > 0) {
					idlePollCount = 0;
					currentPollInterval = MIN_POLL_INTERVAL;

					const fragment = document.createDocumentFragment();
					let lastSender = null;

					response.history.forEach(function (msg) {
						if (!msg.content || msg.content.includes("Identifier Name:")) return;
						const styleClass = (msg.sender === "outerUser") ? "userThought" : "robotThought";
						const p = document.createElement('p');
						p.className = 'thought ' + styleClass;
						p.textContent = msg.content;
						p.style.fontSize = $('.thought').css('font-size');
						fragment.appendChild(p);
						const msgIcon = document.createElement('i');
						if(msg.sender === "outerUser") {
							msgIcon.className = 'fas fa-user-secret'
						} else {
							msgIcon.className = 'user-icon'
						}
						msgIcon.style.fontSize = $('.fa-robot').css('font-size');
						fragment.appendChild(msgIcon);
						lastSender = msg.sender;
					});
					localStorage.setItem(LAST_SENDER_KEY, lastSender);

					// 2. Dialog open visibility verification
					if (!$('#tMessageDialog').dialog('isOpen')) {
						console.log("Dialog closed. Pausing polling loop.");
						stopPolling();
						return;
					}

					// Clear the old elements completely and attach the fresh, complete chain
					const $chatStream = $('.chatStream');
					$chatStream.empty().append(fragment);

					$('.thoughtContainer').scrollToLastMsg();
				} else {
					// Gradual idle backup interval expansion if no messages are found
					idlePollCount++;
					if (idlePollCount > 5) {
						currentPollInterval = Math.min(
							currentPollInterval * IDLE_BACKOFF_MULTIPLIER,
							MAX_POLL_INTERVAL
						);
					}
				}

				console.log(`Next poll in ${currentPollInterval / 1000}s (idle count: ${idlePollCount})`);
				pollingTimeoutID = setTimeout(poll, currentPollInterval);
			},
			error: function (xhr, status) {
				alert("History data synchronization failed:" + xhr.responseText + ", with status: " + status + ".");
				// Aggressive network error backoff (Max 5 minutes)
				currentPollInterval = Math.min(currentPollInterval * 3, 300000);
				pollingTimeoutID = setTimeout(poll, currentPollInterval);
			}
		});
	};

	// Fast initial check invocation
	pollingTimeoutID = setTimeout(poll, 1000);
};

// Dialogue widget configuration engine
const tMessageDialogBox = function (viewportWidth, viewportHeight) {
	let titleFontSize, messagesFontSize, robotFontsize, userIconSize, targetWidth, targetHeight, thHeight;
	let pOf, pAt, pMy;

	if (platformIsMobile) {
		targetWidth = viewportWidth * 0.8;
		targetHeight = viewportHeight * 0.7;
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
		titleFontSize = targetHeight * 0.03;
		messagesFontSize = titleFontSize * 0.7;
		robotFontsize = targetHeight * 0.04;
		userIconSize = targetHeight * 0.1;
		thHeight = '75%';
		pMy = 'left bottom';
		pAt = 'left bottom-70';
		pOf = '.messageButton';
	}

	const $tMessageDialog = $('#tMessageDialog');
	const $tCont = $('.thoughtContainer');

	// FORCE DESTROY EXISTING DIALOG AND REMOVE ALL LISTENERS
	if ($tMessageDialog.dialog('instance') !== undefined) {
		// Remove all custom event listeners from ui-dialog elements
		$('.ui-dialog').off('dialogopen');
		$('.ui-dialog').off('dialogclose');
		$('.ui-dialog').off('resize');
		$('.messageButton').off('click');
		$('.sendBtn').off('click');

		// Destroy the dialog instance completely
		$tMessageDialog.dialog('destroy');

		// Remove any leftover ui-dialog wrapper elements from DOM
		$('.ui-dialog').remove();

		// Reset any stored dialog data
		$tMessageDialog.removeData();
	}

	$tMessageDialog.dialog({
		position: {my: pMy, at: pAt, of: pOf},
		width: targetWidth,
		height: targetHeight,
		resizable: true,
		autoOpen: false,
		show: {effect: 'blind', direction: 'down', duration: DSdurationTime},
		hide: {effect: 'blind', direction: 'down', duration: DSdurationTime}
	});

	$('.ui-dialog').on('dialogopen', function (event, ui) {
		stopBlinking();
		if (checkAndApplyUserSessionLock()) {
			const uuid = localStorage.getItem(UUID_KEY);
			if (uuid) synchronizeChatThreadHistory(uuid);
		}
	});

	$('.ui-dialog').on('dialogclose', function (event, ui) {
		const localUuid = localStorage.getItem(UUID_KEY);
		if (localUuid && localUuid !== '' && localStorage.getItem(LAST_SENDER_KEY) !== 'outerUser') {
			startBlinking();
		}
		stopPolling();
	});

	$('.ui-dialog').on('resize', function (e) {
		$('#tMessageDialog').css('width', $(this).width());
		e.stopPropagation();
	});

	$('.messageButton').off('click').click(function (event) {
		if ($tMessageDialog.dialog('isOpen')) {
			$tMessageDialog.dialog('close');
		} else {
			$tMessageDialog.dialog('open');
		}
	});

	const rcHlC = $('#recaptchaCheck');

	$('.sendBtn').off('click').click(function (event) {
		event.preventDefault();
		const nnV = $('#nickName').val();
		const tMV = $('#tMessageArea').val();

		const nickNameInput = $('#nickName')[0];
		const validationErrMsg = translations[currentLang].validationErrMsg;
		const nickNameValidationErr = translations[currentLang].nickNameValidationErr;
		const msgBodyValidationErr = translations[currentLang].msgBodyValidationErr;

		if (!nnV) {
			nickNameInput.setCustomValidity(nickNameValidationErr);
			nickNameInput.reportValidity();
			return;
		} else if (!validateInput(nnV)) {
			nickNameInput.setCustomValidity(validationErrMsg);
			nickNameInput.reportValidity();
			return;
		} else {
			nickNameInput.setCustomValidity('');
		}

		const messageAreaInput = $('#tMessageArea')[0];
		if (!tMV) {
			messageAreaInput.setCustomValidity(msgBodyValidationErr);
			messageAreaInput.reportValidity();
			return;
		} else if (!validateInput(tMV)) {
			messageAreaInput.setCustomValidity(validationErrMsg);
			messageAreaInput.reportValidity();
			return;
		} else {
			messageAreaInput.setCustomValidity('');
		}

		let googleCaptchaValue = '';
		const localUuid = localStorage.getItem(UUID_KEY);
		let ajaxUuid = localUuid && localUuid !== '' ? localUuid : '';
		if (!localUuid) {
			ajaxUuid = crypto.randomUUID();
			googleCaptchaValue = (typeof grecaptcha !== 'undefined' && grecaptcha.enterprise)
				? grecaptcha.enterprise.getResponse()
				: '';
		}

		if ((localUuid && localUuid !== '')
			|| (googleCaptchaValue && googleCaptchaValue !== '')) {
			rcHlC.val('1');
			const displayMsg = (typeof formDateArr !== 'undefined' && formDateArr) ? formDateArr.value : tMV;
			$tCont.scrollToLastMsg();

			const payloadData = {
				name: nnV,
				uuid: ajaxUuid,
				message: tMV,
				"g-recaptcha-response": googleCaptchaValue
			};

			$.ajax({
				type: 'POST',
				url: `${API_BASE_URL}/api/send`,
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify(payloadData),
				success: function (data) {
					// console.log("Success response from server:", data);
					$('#tMessageArea').val('');

					const sevenDaysExpiry = Date.now() + SESSION_TIME_TO_LIVE;
					if (localStorage.getItem(CHAT_NICKNAME) !== nnV) {
						localStorage.setItem(CHAT_NICKNAME, nnV);
					}
					if (!localUuid) {
						localStorage.setItem(UUID_KEY, ajaxUuid);
						document.querySelector('.g-recaptcha').innerHTML = '';
					}
					localStorage.setItem(LOCKOUT_EXPIRY, sevenDaysExpiry.toString());

					const $userMsg = $('<p class="thought userThought"></p>').text(displayMsg);
					$('.chatStream').append($userMsg);

					$('#nickName').prop('disabled', true);
					synchronizeChatThreadHistory(ajaxUuid);
				},
				error: function (xhr, status, error) {
					alert("Transmission rejected:" + xhr.responseText + ", with status: " + status + ".");
				}
			});
		} else {
			const recaptchaCheckbox = document.getElementById('recaptchaCheck');
			if (recaptchaCheckbox) {
				recaptchaCheckbox.setCustomValidity("Please complete the reCAPTCHA verification.");
				recaptchaCheckbox.reportValidity();
			}
		}
	});

	$('#tMessageArea').keypress(function (event) {
		const key = event.keyCode;
		if (key === 13) {
			event.preventDefault();
			$('.sendBtn').click();
		}
	});

	// Process geometry calculations
	$tMessageDialog.dialog('option', 'height', targetHeight).dialog('option', 'width', targetWidth);
	$tCont.height(thHeight);
	$('.sendBtn').css('font-size', titleFontSize);
	$('.ui-dialog').css({
		position: 'fixed',
		'min-width': '350px'
	}).find('.ui-dialog-titlebar').css({
		'font-size': titleFontSize,
		'margin-top': '-20px',
		'margin-left': '10px',
		'margin-right': '10px'
	});
	$('.ui-dialog').find('.thought, label, input, textarea').css('font-size', messagesFontSize);
	$('.fa-robot').css({'font-size': robotFontsize});
	$('.user-icon').fixUserIconSize(userIconSize);
}

// Input event mutation hooks
$('#nickName, #tMessageArea').on('input', function() {
    const inputElement = $(this)[0];
    if (validateInput($(this).val())) {
        inputElement.setCustomValidity("");
    }
});

$('#nickName').on('change blur', function () {
	const enteredName = $(this).val();
	if (enteredName && !$(this).prop('disabled')) {
		currentVisibleMessageCount = 0;
		$('.chatStream').empty();
		const uuid = localStorage.getItem(UUID_KEY);
		if (uuid) {
			synchronizeChatThreadHistory(uuid);
		}
	}
})

const renderMyRecaptcha = function (lang) {
	let recaptchaWidgetId = null;
	if (!localStorage.getItem(UUID_KEY) && window.grecaptcha && window.grecaptcha.enterprise) {
		window.grecaptcha.enterprise.ready(() => {
			const recaptchaContainer = document.querySelector('.g-recaptcha');
			if (!recaptchaContainer) return;

			if (recaptchaWidgetId !== null) {
				try {
					window.grecaptcha.enterprise.reset(recaptchaWidgetId);
				} catch (e) {
					console.log("Reset skipped:", e);
				}
			}

			recaptchaContainer.innerHTML = '';

			const freshTarget = document.createElement('div');
			recaptchaContainer.appendChild(freshTarget);

			recaptchaWidgetId = window.grecaptcha.enterprise.render(freshTarget, {
				'sitekey': '6Lc83gotAAAAAFtrV49_fGgIXORq9viNgws9o5FY',
				'hl': lang
			});
		});
	}
}
