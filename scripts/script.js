const burger = document.querySelector('.burger');
const nav = document.querySelector('.header nav');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
});