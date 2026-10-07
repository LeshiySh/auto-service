import { useState } from 'react'
import { Link } from 'react-router-dom'

function AuthForm({ type }) {
    const isRegister = type === 'register'

    const [form, setForm] = useState({
        fio: '',
        login: '',
        email: '',
        password: '',
        confirm: '',
    })

    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value })
        setErrors({ ...errors, [field]: '' })
        setSuccess(false)
    }

    const validate = () => {
        const newErrors = {}

        if (isRegister && form.fio.trim() === '') {
            newErrors.fio = 'Введите ФИО'
        }

        if (form.login.trim() === '') {
            newErrors.login = 'Введите логин'
        }

        if (isRegister) {
            if (form.email.trim() === '') {
                newErrors.email = 'Введите email'
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                newErrors.email = 'Некорректный email'
            }

            if (form.password.length < 8) {
                newErrors.password = 'Пароль должен быть не менее 8 символов'
            }

            if (form.confirm !== form.password) {
                newErrors.confirm = 'Пароли не совпадают'
            }
        } else {
            if (form.password === '') {
                newErrors.password = 'Введите пароль'
            }
        }

        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = validate()

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})
        setSuccess(true)
        setForm({ fio: '', login: '', email: '', password: '', confirm: '' })
    }

    return (
        <div className="auth-container">
            <div className="auth">
                <h1>{isRegister ? 'Регистрация' : 'Авторизация'}</h1>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {isRegister && (
                        <div className="form-group">
                            <label htmlFor="fio">ФИО</label>
                            <input id="fio" type="text" placeholder="ФИО" value={form.fio} onChange={(e) => handleChange('fio', e.target.value)}
                                className={errors.fio ? 'invalid' : ''}
                            />
                            {errors.fio && <small className="field-error show">{errors.fio}</small>}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="login">Логин</label>
                        <input id="login" type="text" placeholder="Логин" value={form.login} onChange={(e) => handleChange('login', e.target.value)}
                            className={errors.login ? 'invalid' : ''}
                        />
                        {errors.login && <small className="field-error show">{errors.login}</small>}
                    </div>

                    {isRegister && (
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                                className={errors.email ? 'invalid' : ''}
                            />
                            {errors.email && <small className="field-error show">{errors.email}</small>}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input id="password" type="password" placeholder="Пароль" value={form.password} onChange={(e) => handleChange('password', e.target.value)}
                            className={errors.password ? 'invalid' : ''}
                        />
                        {errors.password && <small className="field-error show">{errors.password}</small>}
                    </div>

                    {isRegister && (
                        <div className="form-group">
                            <label htmlFor="confirm">Повторите пароль</label>
                            <input id="confirm" type="password" placeholder="Повторите пароль" value={form.confirm} onChange={(e) => handleChange('confirm', e.target.value)}
                                className={errors.confirm ? 'invalid' : ''}
                            />
                            {errors.confirm && <small className="field-error show">{errors.confirm}</small>}
                        </div>
                    )}

                    <button type="submit">
                        {isRegister ? 'Зарегистрироваться' : 'Войти'}
                    </button>

                    {success && (
                        <p className="form-success show">
                            {isRegister ? 'Успешная регистрация' : 'Успешный вход'}
                        </p>
                    )}

                    <Link to={isRegister ? '/login' : '/register'}>
                        {isRegister ? 'Уже зарегистрированы?' : 'Не зарегистрированы?'}
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default AuthForm