// modal.js
// Handles two modals:
//  1) Product modal — opens when any bouquet card is clicked, shows details.
//  2) Order modal — opens from the product modal's "Buy now" button
//     (or directly from the "Order a Bouquet" button in Contacts).

document.addEventListener('DOMContentLoaded', () => {
  function openBackdrop(backdrop) {
    backdrop.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeBackdrop(backdrop) {
    backdrop.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  // ==================== PRODUCT MODAL ====================
  const productBackdrop = document.querySelector('#product-modal-backdrop');
  const productClose = document.querySelector('#product-modal-close');
  const productImage = document.querySelector('#product-modal-image');
  const productTitle = document.querySelector('#product-modal-title');
  const productPrice = document.querySelector('#product-modal-price');
  const productDesc = document.querySelector('#product-modal-desc');
  const productBuyBtn = document.querySelector('#product-modal-buy');
  const productQty = document.querySelector('#product-modal-qty');

  function openProductModal(product) {
    productImage.src = product.image;
    productImage.alt = product.title;
    productTitle.textContent = product.title;
    productPrice.textContent = `$${product.price}`;
    productDesc.textContent = product.desc;
    if (productQty) productQty.value = 1;
    openBackdrop(productBackdrop);
  }

  function closeProductModal() {
    closeBackdrop(productBackdrop);
  }

  if (productClose) productClose.addEventListener('click', closeProductModal);

  if (productBackdrop) {
    productBackdrop.addEventListener('click', (event) => {
      if (event.target === productBackdrop) closeProductModal();
    });
  }

  // Any element carrying [data-bouquet-card] (static top-sellers or
  // dynamically rendered bouquet cards) opens the product modal.
  document.addEventListener('click', (event) => {
    const card = event.target.closest('[data-bouquet-card]');
    if (!card) return;

    openProductModal({
      title: card.dataset.title,
      price: card.dataset.price,
      desc: card.dataset.desc,
      image: card.dataset.image,
    });
  });

  // Keyboard support: Enter/Space on a focused card also opens the modal
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('[data-bouquet-card]');
    if (!card) return;
    event.preventDefault();
    openProductModal({
      title: card.dataset.title,
      price: card.dataset.price,
      desc: card.dataset.desc,
      image: card.dataset.image,
    });
  });

  // ==================== ORDER MODAL ====================
  const orderBackdrop = document.querySelector('#order-modal-backdrop');
  const orderClose = document.querySelector('#order-modal-close');
  const orderForm = document.querySelector('#order-form');
  const orderMsg = document.querySelector('#order-form-msg');
  const openOrderDirectBtn = document.querySelector('#open-order-modal');

  function openOrderModal() {
    openBackdrop(orderBackdrop);
    const firstField = orderBackdrop.querySelector('input, textarea');
    if (firstField) firstField.focus();
  }

  function closeOrderModal() {
    closeBackdrop(orderBackdrop);
  }

  if (orderClose) orderClose.addEventListener('click', closeOrderModal);

  if (orderBackdrop) {
    orderBackdrop.addEventListener('click', (event) => {
      if (event.target === orderBackdrop) closeOrderModal();
    });
  }

  // "Order a Bouquet" button in the Contacts section opens the order form directly
  if (openOrderDirectBtn) {
    openOrderDirectBtn.addEventListener('click', openOrderModal);
  }

  // "Buy now" inside the product modal: close product modal, open order modal
  if (productBuyBtn) {
    productBuyBtn.addEventListener('click', () => {
      closeProductModal();
      openOrderModal();
    });
  }

  // Close whichever modal is currently open on Escape
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (orderBackdrop.classList.contains('is-open')) closeOrderModal();
    if (productBackdrop.classList.contains('is-open')) closeProductModal();
  });

  // ==================== ORDER FORM SUBMIT ====================
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
      orderMsg.textContent = 'Thanks! Your order has been sent — we will contact you shortly.';
      orderMsg.className = 'modal__form-msg is-success';
      orderMsg.hidden = false;

      orderForm.reset();
      setTimeout(() => {
        closeOrderModal();
        orderMsg.hidden = true;
      }, 1800);
    });
  }
});