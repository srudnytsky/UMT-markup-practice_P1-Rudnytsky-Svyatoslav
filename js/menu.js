// script.js
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
const closeBtn = document.querySelector('.mobile-menu__close');

if (burger && mobileMenu && closeBtn) {
    burger.addEventListener('click', () => {
        mobileMenu.classList.add('is-open');
        burger.setAttribute('aria-expanded', 'true');
    });

    closeBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
    });
}