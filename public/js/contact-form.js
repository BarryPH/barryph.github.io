const footerLoadingOverlay = document.getElementsByClassName('js-overlay-loading')[0];
const contactForm = document.getElementsByClassName('js-contact-form')[0];
const contactFormMessage = document.getElementsByClassName('js-contact-form-message')[0];

function formToJSON (formElem) {
  const formData = new FormData(formElem);
  const keys = Array.from(formData.keys());

  return keys.reduce((object, key) => {
    return Object.assign(object, { [key]: formData.get(key) });
  }, {})
}

async function handleFormSubmit (event) {
  event.preventDefault();

  const formData = formToJSON(event.target);
	const formUrl = 'http://104.236.132.84:4000/contact';

  footerLoadingOverlay.classList.add('visible');

  const response = await fetch(formUrl, {
    method: 'POST',
		mode: 'no-cors',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  }).catch(() => null);

  footerLoadingOverlay.classList.remove('visible');

  const messagePosTop = contactFormMessage.getBoundingClientRect().top;
  window.scrollBy({
    top: messagePosTop - 50,
    behavior: 'smooth',
  });

  const success = response && response.status.toString().startsWith('20');
  const message = success
    ? 'Thank you for your message! I will get back to you soon.'
    : 'Uh oh, something went wrong. Please try again.';

  contactFormMessage.classList.add('hidden');

  setTimeout(() => {
    contactFormMessage.textContent = message;
    contactFormMessage.classList.remove('hidden');
  }, 200);

  if (success) {
    contactForm.reset();
  }
}

contactForm.addEventListener('submit', handleFormSubmit);
