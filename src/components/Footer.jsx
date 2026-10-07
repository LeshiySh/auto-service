import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer>
            <div className="footer-container">
                <div className="footer-info-brend">
                    <p>Sh·auto — Профессиональный ремонт любой сложности и круглосуточное обслуживание автомобилей</p>
                </div>

                <div className="footer-info">
                    <h3>Навигация</h3>
                    <Link to="/">Главная</Link>
                    <Link to="/catalog">Каталог</Link>
                    <Link to="/login">Авторизация</Link>
                    <Link to="/register">Регистрация</Link>
                </div>

                <div className="footer-info">
                    <h3>Контакты</h3>
                    <p>+7 (999) 777-69-67</p>
                    <p>shauto@mail.ru</p>
                    <p>Ульяновск, ул. Машинная, 73</p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 Sh·auto. Все права защищены.</p>
            </div>
        </footer>
    )
}

export default Footer