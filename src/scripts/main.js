import { validateField, validateEmail, validatePhone, validateBudget, validateNotZero } from './form-validation.js';
import { initABTest, messages, abFeatures } from './ab-test.js';

const API_URL = process.env.API_URL;
const form = document.querySelector('#form');
const formContainer = document.querySelector('#form-container');

const trackEvent = (eventName, eventCategory = 'Form', eventLabel = '') => {
	if (window.gtag) {
		gtag('event', eventName, {
			event_category: eventCategory,
			event_label: eventLabel,
		});
	}
	console.log(`Event tracked: ${eventName}`);
};

const showError = (input, message) => {
	const errorElement = input.nextElementSibling;
	if (errorElement && errorElement.classList.contains('error-message')) {
		errorElement.textContent = message;
		errorElement.style.display = 'block';
		input.classList.add('invalid');
	} else {
		console.error('Error element not found for input:', input);
	}
};

const clearErrors = () => {
	document.querySelectorAll('.error-message').forEach(el => {
		el.style.display = 'none';
	});
	document.querySelectorAll('.invalid').forEach(el => {
		el.classList.remove('invalid');
	});
};

const showFormMessage = (type, message) => {
	const messageElement = document.createElement('div');
	messageElement.className = `form-message ${type}`;
	messageElement.textContent = message;

	const submitButton = form.querySelector('button');
	submitButton.insertAdjacentElement('afterend', messageElement);

	setTimeout(() => {
		if (messageElement.parentNode) {
			messageElement.parentNode.removeChild(messageElement);
		}
	}, 5000);
};

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	clearErrors();

	const formData = new FormData(form);
	const data = Object.fromEntries(formData.entries());
	const errors = {};

	const fieldsToValidate = {
		name: 'Name',
		email: 'Email',
		project_type: 'Project Type',
	};

	Object.entries(fieldsToValidate).forEach(([field, name]) => {
		const fieldErrors = validateField(data[field], name);
		if (fieldErrors.length > 0) {
			errors[field] = fieldErrors.join(', ');
		}
	});

	if (!validateEmail(data.email)) {
		errors.email = 'Please enter a valid email address.';
	}

	if (data.phone && !validatePhone(data.phone)) {
		errors.phone = 'Please enter a valid phone number.';
	}

	if (!validateBudget(data.budget_min, data.budget_max)) {
		errors.budget_max = 'Minimum budget cannot be greater than maximum budget.';
	}

	if (!validateNotZero(data.budget_max)) {
		errors.budget_max = 'Maximum budget cannot be zero';
	}

	if (Object.keys(errors).length > 0) {
		Object.entries(errors).forEach(([field, message]) => {
			const inputElement = document.getElementById(field);
			if (inputElement) {
				showError(inputElement, message);
			} else {
				console.error(`Element id: "${field}" not found`);
			}
		});
		return;
	}

	try {
		formContainer.classList.add('form-disabled');
		const submitButton = form.querySelector('button');
		submitButton.disabled = true;
		submitButton.textContent = 'Sending...';

		const response = await fetch(API_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			let errorMessage = 'Server error';
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorMessage;
			} catch (jsonError) {
				console.error('Failed to parse error response:', jsonError);
			}
			throw new Error(errorMessage);
		}

		showFormMessage('success', messages[localStorage.getItem('ab_variant') || 'a'].success);
		trackEvent('form_submit_success');
	} catch (error) {
		showFormMessage('error', messages[localStorage.getItem('ab_variant') || 'a'].error);
		trackEvent('form_submit_error', 'Form', error.message);
	} finally {
		formContainer.classList.remove('form-disabled');
		const submitButton = form.querySelector('button');
		submitButton.disabled = false;
		submitButton.textContent = abFeatures.buttonText[localStorage.getItem('ab_variant') || 'a'];
	}
});

initABTest();