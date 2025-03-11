const MIN_LENGTH = 3;

const validateField = (value, fieldName) => {
	const errors = [];
	if (!value || value.trim().length < MIN_LENGTH) {
		errors.push(`${fieldName} must be at least ${MIN_LENGTH} characters`);
	}
	return errors;
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const cleanPhoneNumber = (phone) => {
	return phone.replace(/[^\d+]/g, '');
};

const validatePhone = (phone) => {
	const cleanedPhone = cleanPhoneNumber(phone);
	return /^\+?\d+$/.test(cleanedPhone);
};

const validateBudget = (min, max) => {
	return Number(min) <= Number(max);
};

const validateNotZero = (max) => {
	return Number(max) !== 0;
}

export { validateField, validateEmail, validatePhone, validateBudget, validateNotZero };