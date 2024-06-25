(function () {

	let windowWidth = document.documentElement.clientWidth;

	const btnNext = document.querySelector('.btn-next-slide');
	const btnPrev = document.querySelector('.btn-prev-slide');

	const containerSlider = document.querySelector('.container-slider');
	const slider = document.querySelector('.slider');
	const sliderLength = document.querySelectorAll('.item').length;
	const imgSlider = document.querySelectorAll('.content-slide__back');

	const totalStep = document.querySelector('.total-steps');
	const stepSlide = document.querySelector('.step-slide');

	const currentPosition = {
		position: 0,
		getPosition() {
			return this.position;
		},
		setPosition(value) {
			this.position = value;
		},
		movePosition(value) {
			this.position += value;
		},
	};
	const mediaQueries = {
		1: window.matchMedia('(max-width: 500px)'),
		2: window.matchMedia('(max-width: 767px)'),
		3: window.matchMedia('(max-width: 1024px)'),
		4: window.matchMedia('(min-width: 1025px)')
	};
	const objSlider = {
		distance: updateWidthItem(),
		position: currentPosition,
		visibleSlides: getVisibleSlidesMediaQueries(mediaQueries),
		containerSlider: containerSlider,
		slider: slider,
		step: stepSlide,
		totalStep: totalStep,
		countStep: null,
		sliderLength: sliderLength,

		sliderEnd() {
			return -(this.sliderLength * this.distance - (this.visibleSlides * this.distance));
		},
		setCountTotalStep() {
			this.countStep = this.sliderLength - this.visibleSlides + 1;
		}

	}


	function getVisibleSlidesMediaQueries(media) {
		for (let key in media) {
			if (media[key].matches) {
				return parseInt(key);
			}
		}
	}

	document.addEventListener('DOMContentLoaded', () => {

		objSlider.setCountTotalStep();
		showTotalStep(objSlider);
	});
	window.addEventListener('resize', () => {
		let newWindowWidth = document.documentElement.clientWidth;
		if (newWindowWidth === windowWidth) return;
		resetSlider(objSlider);
		objSlider.distance = updateWidthItem();
		objSlider.visibleSlides = getVisibleSlidesMediaQueries(mediaQueries);
		objSlider.setCountTotalStep();
		showTotalStep(objSlider);
		windowWidth = newWindowWidth;
	});

	btnPrev.addEventListener('click', function () {
		movePrev(objSlider, animateSlider);
		showSlideStep(objSlider);
		slider.style.transition = 'transform .3s';
	});
	btnNext.addEventListener('click', function () {
		moveNext(objSlider, animateSlider);
		showSlideStep(objSlider);
		slider.style.transition = 'transform .3s';
	});




	function resetSlider(objSlider) {
		const { slider, position, step } = objSlider;
		step.textContent = 1;
		position.movePosition(-position.getPosition());
		animateSlider(slider, position.getPosition())
	}
	function moveNext(objSlider, animateCallback) {
		const { visibleSlides, position, slider, distance, sliderLength } = objSlider;
		const valueEnd = visibleSlides * distance - distance * sliderLength;
		if (position.getPosition() <= valueEnd) {
			return;
		}
		position.movePosition(-distance);
		animateCallback(slider, position.getPosition());
	}
	function movePrev(objSlider, animateCallback) {
		const { position, slider, distance } = objSlider;

		if (position.getPosition() === 0) {
			return;
		}
		position.movePosition(distance);
		animateCallback(slider, position.getPosition());
	}



	function showTotalStep(objSlider) {
		const { totalStep, countStep } = objSlider;
		totalStep.textContent = countStep;
	}
	function showSlideStep(objSlider) {
		const { position, step, totalStep, distance } = objSlider;

		if (position.getPosition() > 0) return;
		const data = Math.abs(position.getPosition() / distance) + 1;
		if (data >= totalStep.textContent) {
			step.textContent = totalStep.textContent;
			return;
		}
		step.textContent = data;
	}


	function animateSlider(elem, value) {
		requestAnimationFrame(() => {
			updateSliderPosition(elem, value);
		});
	}

	function updateSliderPosition(elem, value) {
		elem.style.transform = `translateX(${value}px)`;
	}


	function updateWidthItem() {
		let widthItem = document.querySelector('.item').offsetWidth;
		return widthItem;
	}



	let isDragging = false;
	let touchStart = 0;
	let touchEnd = 0;
	let touchMove = 0;


	slider.addEventListener('touchstart', (e) => {
		e.preventDefault();
		isDragging = true;
		touchStart = e.touches[0].clientX;

	}, { passive: false })

	slider.addEventListener('touchmove', (e) => {
		if (!isDragging) return;
		e.preventDefault();

		touchMove = e.touches[0].clientX - touchStart + objSlider.position.getPosition();
		slider.style.transition = 'transform .3s linear';
		animateSlider(slider, touchMove);

		touchEnd = e.touches[0].clientX;
	}, { passive: false })

	document.addEventListener('touchend', (e) => {
		if (!isDragging) return;

		e.preventDefault();
		isDragging = false;
		objSlider.position.setPosition(touchMove);

		setTimeout(() => {

			if (objSlider.position.getPosition() > 0) {

				animateSlider(slider, 0);
				objSlider.position.setPosition(0);
				showSlideStep(objSlider);

			} else if (objSlider.position.getPosition() < objSlider.sliderEnd()) {

				animateSlider(slider, objSlider.sliderEnd());
				objSlider.position.setPosition(objSlider.sliderEnd());
				showSlideStep(objSlider);

			} else if (touchEnd - touchStart < -20) {

				objSlider.position.setPosition(
					objSlider.distance * (Math.floor(objSlider.position.getPosition() / objSlider.distance))
				);
				showSlideStep(objSlider);
				animateSlider(slider, objSlider.position.getPosition());
				
			} else if (touchEnd - touchStart > 20) {
				objSlider.position.setPosition(
					objSlider.distance * (Math.ceil(objSlider.position.getPosition() / objSlider.distance))
				);
				showSlideStep(objSlider);
				animateSlider(slider, objSlider.position.getPosition());
			} else {
				objSlider.position.setPosition(
					objSlider.distance * (Math.round(objSlider.position.getPosition() / objSlider.distance))
				);
				animateSlider(slider, objSlider.position.getPosition());
			}
		}, 100);
	})

})();










(function () {
	const inputElement = document.querySelector('.form-search__input');
	inputElement.addEventListener('blur', function () {
		this.value = '';
	});

	const form = document.querySelector('.form-support');
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		validateForm(event);
	});

	function validateForm(event) {
		let submitError = null;
		if (!emailValidate(event, '.form-support__email', '.error-email', 'show-error')) {
			submitError = 'error';
		}
		if (!nameValidate(event, '.form-support__name', '.error-name', 'show-error')) {
			submitError = 'error';
		}
		return submitError ? console.log('error') : event.currentTarget.submit();
	}

	function emailValidate(event, classValue, errorClassValue, showErrorClassValue) {
		const error = document.querySelector(errorClassValue);
		const emailInput = event.currentTarget.querySelector(classValue);
		if (!emailInput.checkValidity() || emailInput.value.trim() === '') {
			error.classList.add(showErrorClassValue);
			return false;
		} else {
			error.classList.remove(showErrorClassValue);
			return true;
		}
	}

	function nameValidate(event, classValue, errorClassValue, showErrorClassValue) {
		const error = document.querySelector(errorClassValue);
		const nameInput = event.target.querySelector(classValue);
		if (nameInput.value.trim() === '' || nameInput.value.length < 4) {
			error.classList.add(showErrorClassValue);
			return false;
		} else {
			error.classList.remove(showErrorClassValue);
			return true;
		}
	}

})();

