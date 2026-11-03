import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function ApplicationModal({ service, onClose, onSuccess }) {
    const { token } = useAuth()
    const [carBrand, setCarBrand] = useState('')
    const [comment, setComment] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!carBrand.trim()) {
            return setError('Введите марку автомобиля')
        }

        setSubmitting(true)
        setError('')

        try {
            const res = await fetch('http://localhost:3000/api/applications', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    service_id: service.id,
                    car_brand: carBrand,
                    comment: comment
                })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Ошибка при создании заявки')
                setSubmitting(false)
                return
            }

            onSuccess()
        } catch (err) {
            setError('Ошибка соединения с сервером')
            setSubmitting(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={() => !submitting && onClose()}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Запись на услугу</h3>
                <p className="modal-service-title">{service.title}</p>
                <p className="modal-service-price">Стоимость: от {service.price} ₽</p>

                {error && <div className="form-errors"><p>{error}</p></div>}

                <form onSubmit={handleSubmit} className="service-form">
                    <div className="form-group">
                        <label>Марка и модель авто</label>
                        <input  type="text" value={carBrand}  onChange={(e) => setCarBrand(e.target.value)} placeholder="Например, Lada Vesta"/>
                    </div>
                    <div className="form-group">
                        <label>Комментарий</label>
                        <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Опишите проблему"/>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="modal-cancel" onClick={onClose} disabled={submitting}> Отмена </button>
                        <button type="submit" className="modal-confirm" disabled={submitting}>
                            {submitting ? 'Отправка...' : 'Записаться'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ApplicationModal