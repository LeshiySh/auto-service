import { useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header>
            <div className="header">
                <div>
                    <Link to="/">Sh·auto</Link>
                </div>

                <button className={`burger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Меню">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={menuOpen ? 'open' : ''}>
                    <Link to="/" > Главная </Link>
                    <Link to="/catalog" > Каталог </Link>
                    <Link to="/login" > Войти </Link>
                    <Link to="/register" > Регистрация </Link>
                </nav>
            </div>
        </header>
    )
}

export default Header