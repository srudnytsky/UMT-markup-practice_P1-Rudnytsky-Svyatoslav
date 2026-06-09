document.addEventListener('DOMContentLoaded', function () {
    new Swiper('.top-selling__slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 25,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            }
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    new Swiper('.testimonials__slider', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 20,
        
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        breakpoints: {
            768: {
                slidesPerView: 2,      // 2 відгуки на планшеті
                spaceBetween: 25,
            },
            1024: {
                slidesPerView: 3,      // 3 відгуки на десктопі
                spaceBetween: 30,
                navigation: false      // вимикаємо стрілки на великих екранах
            }
        }
    });
});