const abFeatures = {
	title: {
		a: 'Contact Us',
		b: 'Get in Touch'
	},
	buttonText: {
		a: 'Submit',
		b: 'Send Message'
	}
};

const placeholders = {
	a: {
		name: 'Enter your name',
		email: 'Enter your email',
		phone: 'Enter your phone number',
		project_type: 'Enter project type',
		project_description: 'Describe your project',
		budget_min: 'Minimum budget',
		budget_max: 'Maximum budget',
	},
	b: {
		name: 'Your full name',
		email: 'Your email address',
		phone: 'Your phone',
		project_type: 'Type of project',
		project_description: 'Project details',
		budget_min: 'Min budget',
		budget_max: 'Max budget',
	},
};

const messages = {
	a: {
		success: 'Form submitted successfully!',
		error: 'An error occurred. Please try again.',
	},
	b: {
		success: 'Thank you! Your message has been sent.',
		error: 'Oops! Something went wrong. Please try again.',
	},
};

const initABTest = () => {
	const AB_VARIANT = localStorage.getItem('ab_variant') || (Math.random() > 0.5 ? 'b' : 'a');
	document.body.classList.add(`variant-${AB_VARIANT}`);
	document.getElementById('form-container').classList.add(`variant-${AB_VARIANT}`);

	document.querySelector('h1').textContent = abFeatures.title[AB_VARIANT];
	document.querySelector('button').textContent = abFeatures.buttonText[AB_VARIANT];

	Object.entries(placeholders[AB_VARIANT]).forEach(([field, placeholder]) => {
		const input = document.getElementById(field);
		if (input) {
			input.placeholder = placeholder;
		}
	});

	if (AB_VARIANT === 'b') {
		const phoneGroup = document.querySelector('#phone').parentElement;
		const emailGroup = document.querySelector('#email').parentElement;
		document.getElementById('form').insertBefore(phoneGroup, emailGroup);
	}

	localStorage.setItem('ab_variant', AB_VARIANT);
};

export { initABTest, messages, abFeatures };