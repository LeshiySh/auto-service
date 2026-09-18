const form = document.getElementById('regForm');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    let ok = true;

    const fio = form.fio.value.trim();
    const login = form.login.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form.confirm.value;

    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('show'));
    form.querySelectorAll('input').forEach(el => el.classList.remove('invalid'));

    if (fio === '') {
        showError('fio', 'Введите ФИО');
        ok = false;
    }

    if (login === '') {
        showError('login', 'Введите логин');
        ok = false;
    }

    if (email === '') {
        showError('email', 'Введите email');
        ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'Некорректный email');
        ok = false;
    }

    if (password.length < 8) {
        showError('password', 'Пароль должен быть не менее 8 символов');
        ok = false;
    }

    if (confirm !== password) {
        showError('confirm', 'Пароли не совпадают');
        ok = false;
    }

    if (ok) {
        alert('Форма успешно отправлена!');
        form.reset();
    }
});

function showError(field, message) {
    form[field].classList.add('invalid');
    const err = document.getElementById('err-' + field);
    err.textContent = message;
    err.classList.add('show');
}

function clearError(field) {
    form[field].classList.remove('invalid');
    document.getElementById('err-' + field).classList.remove('show');
}