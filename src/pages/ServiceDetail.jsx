import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

function ServiceDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [service, setService] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [showConfirm, setShowConfirm] = useState(false)
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
        })
            .then(async res => {
                if (!res.ok) {
                    const data = await res.json()
                    setError(data.error || 'Ошибка удаления')
                    setDeleting(false)
                    setShowConfirm(false)
                    return null
                }
                return res.json()
            })
            .then(data => {
                if (data) {
                    navigate('/catalog')
                }
            })
            .catch(err => {
                console.error(err)
                setError('Ошибка соединения')
                setDeleting(false)
                setShowConfirm(false)
            })
    }

     if (loading) return <main><p className="catalog-status">Загрузка...</p></main>
    if (error) return (
        <main>
            <p className="catalog-status error">{error}</p>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/catalog" className="back-link">← Вернуться в каталог</Link>
            </div>
        </main>
    )

    return (
        <main>
            <div className="service-detail-wrapper">
                <Link to="/catalog" className="back-arrow" aria-label="Вернуться в каталог"> ← </Link>

                <div className="service-detail">
                    <img src={`/${service.image}`} alt={service.title} className="service-detail-image" />

                    <div className="service-detail-info">
                        <h1>{service.title}</h1>
                        <p className="service-detail-desc">{service.description}</p>
                        <p className="service-detail-price">от {service.price} ₽</p>

                        <div className="service-detail-actions">
                            <Link to={`/services/${service.id}/edit`} className="edit-button"> Редактировать </Link>
                            <button className="delete-button" onClick={() => setShowConfirm(true)}> Удалить </button>
                        </div>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <div className="modal-overlay" onClick={() => !deleting && setShowConfirm(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Удалить услугу?</h3>
                        <p>«{service.title}» будет удалена без возможности восстановления.</p>

                        <div className="modal-actions">
                            <button className="modal-cancel" onClick={() => setShowConfirm(false)} disabled={deleting}> Отмена </button>
                            <button className="modal-confirm" onClick={handleDelete} disabled={deleting}>
                                {deleting ? 'Удаление...' : 'Удалить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default ServiceDetail