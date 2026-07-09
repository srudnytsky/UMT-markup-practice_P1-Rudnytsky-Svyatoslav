// modal.js
// Handles the order modal (open/close/backdrop/esc) and both forms
// (footer subscribe form + modal order form).

document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.querySelector('#order-modal-backdrop');
  const openBtn = document.querySelector('#open-order-modal');
  const closeBtn = document.querySelector('#order-modal-close');

  const openModal = () => {
    backdrop.classList.add('is-open');
    document.body.classList.add('no-scroll');
    const firstField = backdrop.querySelector('input, textarea');
    if (firstField) firstField.focus();
  };

  const closeModal = () => {
    backdrop.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  };

  if (openBtn && backdrop) {
    openBtn.addEventListener('click', openModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on backdrop click (but not when clicking inside the modal itself)
  if (backdrop) {
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) closeModal();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && backdrop.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Allow other scripts (e.g. bouquets.js "Order" buttons on cards) to open the modal
  window.openOrderModal = openModal;

  // ==================== ORDER FORM ====================
  const orderForm = document.querySelector('#order-form');
  const orderMsg = document.querySelector('#order-form-msg');

  if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const agree = orderForm.querySelector('#order-agree');
      if (!agree.checked) {
        orderMsg.textContent = 'Please agree to the license agreement to continue.';
        orderMsg.className = 'modal__form-msg is-error';
        orderMsg.hidden = false;
        return;
      }

      // No real backend yet — simulate a successful submission.
      orderMsg.textContent = 'Thanks! Your request has been sent — we will contact you shortly.';
      orderMsg.className = 'modal__form-msg is-success';
      orderMsg.hidden = false;

      orderForm.reset();
      setTimeout(() => {
        closeModal();
        orderMsg.hidden = true;
      }, 1800);
    });
  }

  // ==================== SUBSCRIBE FORM ====================
  const subscribeForm = document.querySelector('#subscribe-form');
  const subscribeMsg = document.querySelector('#subscribe-msg');

  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const emailField = subscribeForm.querySelector('#subscribe-email');
      const email = emailField.value.trim();
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!isValidEmail) {
        subscribeMsg.textContent = 'Please enter a valid email address.';
        subscribeMsg.className = 'footer__subscribe-msg is-error';
        subscribeMsg.hidden = false;
        return;
      }

      subscribeMsg.textContent = 'You are subscribed! Watch your inbox for fresh offers.';
      subscribeMsg.className = 'footer__subscribe-msg is-success';
      subscribeMsg.hidden = false;
      subscribeForm.reset();
    });
  }
});