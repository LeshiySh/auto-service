import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Login from './pages/Login'
import Register from './pages/Register'
import ServiceDetail from './pages/ServiceDetail'
import ServiceForm from './pages/ServiceForm'

function App() {
    const location = useLocation()
    const hideFooter = location.pathname === '/login' || location.pathname === '/register'

    return (
        <div className="container">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/services/new" element={<ServiceForm />} />
                <Route path="/services/:id/edit" element={<ServiceForm />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            {!hideFooter && <Footer />}
        </div>
    )
}

export default App