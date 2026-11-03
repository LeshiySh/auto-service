import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    }

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
                    <Link to="/" onClick={() => setMenuOpen(false)}>Главная</Link>
                    <Link to="/catalog" onClick={() => setMenuOpen(false)}>Каталог</Link>
                    
                    {user ? (
                        <>
                            <Link to="/cabinet" onClick={() => setMenuOpen(false)}>
                                Кабинет
                            </Link>
                            <button className="nav-logout" onClick={handleLogout}>
                                Выйти
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)}>Войти</Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)}>Регистрация</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header