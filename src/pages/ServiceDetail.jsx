import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ApplicationModal from '../components/ApplicationModal'

function ServiceDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, token } = useAuth()
    const [service, setService] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showDelete, setShowDelete] = useState(false)
    const [showBook, setShowBook] = useState(false)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        fetch(`http://localhost:3000/api/services/${id}`)
            .then(res => {
                if (res.status === 404) {
                    setError('Услуга не найдена')
                    setLoading(false)
                    return null
                }
                return res.json()
            })
            .then(data => {
                if (data) {
                    setService(data)
                    setLoading(false)
                }
            })
            .catch(err => {
                console.error(err)
                setError('Ошибка загрузки')
                setLoading(false)
            })
    }, [id])

    const handleDelete = () => {
        setDeleting(true)
        fetch(`http://localhost:3000/api/services/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(async res => {
                if (!res.ok) {
                    const data = await res.json()
                    setError(data.error || 'Ошибка удаления')
                    setDeleting(false)
                    setShowDelete(false)
                    return null
                }
                return res.json()
            })
            .then(data => {
                if (data) navigate('/catalog')
            })
            .catch(err => {
                console.error(err)
                setError('Ошибка соединения')
                setDeleting(false)
                setShowDelete(false)
            })
    }

    if (loading) return <main><p className="catalog-status">Загрузка...</p></main>
    if (error) return (
        <main>
            <p className="catalog-status error">{error}</p>
            <div className="text-center mt-20">
                <Link to="/catalog" className="back-link">← Вернуться в каталог</Link>
            </div>
        </main>
    )
    const isAdmin = user && user.role === 'ADMIN'
    return (
        <main>
            <div className="service-detail-wrapper">
                <Link to="/catalog" className="back-arrow">←</Link>

                <div className="service-detail">
                    <img src={`/${service.image}`} alt={service.title} className="service-detail-image" />

                    <div className="service-detail-info">
                        <h1>{service.title}</h1>
                        <p className="service-detail-desc">{service.description}</p>
                        <p className="service-detail-price">от {service.price} ₽</p>

                        <div className="service-detail-actions">
                            {isAdmin && (
                                <>
                                    <Link to={`/services/${service.id}/edit`} className="edit-button">Редактировать</Link>
                                    <button className="delete-button" onClick={() => setShowDelete(true)}>Удалить</button>
                                </>
                            )}
                            {user && (
                                <button className="book-button" onClick={() => setShowBook(true)}>Записаться</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showDelete && (
                <div className="modal-overlay" onClick={() => !deleting && setShowDelete(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Удалить услугу?</h3>
                        <p>«{service.title}» будет удалена без возможности восстановления.</p>
                        <div className="modal-actions">
                            <button className="modal-cancel" onClick={() => setShowDelete(false)} disabled={deleting}> Отмена </button>
                            <button className="modal-confirm" onClick={handleDelete} disabled={deleting}>
                                {deleting ? 'Удаление...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showBook && (
                <ApplicationModal 
                    service={service} 
                    onClose={() => setShowBook(false)} 
                    onSuccess={() => {
                        setShowBook(false)
                        navigate('/cabinet')
                    }} 
                />
            )}
        </main>
    )
}

export default ServiceDetail