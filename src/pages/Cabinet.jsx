import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function Cabinet() {
    const { user, token, loading: authLoading } = useAuth()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editApp, setEditApp] = useState(null)
    const [editCar, setEditCar] = useState('')
    const [editComment, setEditComment] = useState('')

    useEffect(() => {
        if (!user) return;

        const isAdmin = user.role === 'ADMIN'
        const url = isAdmin 
            ? 'http://localhost:3000/api/admin/applications' 
            : 'http://localhost:3000/api/applications/my'

        fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setApplications(data)
                else setError('Ошибка загрузки')
                setLoading(false)
            })
            .catch(() => {
                setError('Ошибка соединения')
                setLoading(false)
            })
    }, [token, user])

    if (authLoading) {
        return <main><p className="catalog-status">Загрузка профиля...</p></main>
    }
    if (!user) {
        return <Navigate to="/login" replace />
    }

    const isAdmin = user.role === 'ADMIN'

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await fetch(`http://localhost:3000/api/admin/applications/${id}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                setApplications(applications.map(app => app.id === id ? { ...app, status: newStatus } : app))
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteApp = async (id) => {
        if (!window.confirm('Точно удалить заявку?')) return
        try {
            const res = await fetch(`http://localhost:3000/api/applications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                setApplications(applications.filter(app => app.id !== id))
            } else {
                const data = await res.json()
                alert(data.error)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const openEdit = (app) => {
        setEditApp(app)
        setEditCar(app.car_brand)
        setEditComment(app.comment || '')
    }

    const handleUpdateApp = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`http://localhost:3000/api/applications/${editApp.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ car_brand: editCar, comment: editComment })
            })
            const data = await res.json()
            if (res.ok) {
                setApplications(applications.map(app => 
                    app.id === editApp.id ? { ...app, car_brand: editCar, comment: editComment } : app
                ))
                setEditApp(null)
            } else {
                alert(data.error)
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <main><p className="catalog-status">Загрузка...</p></main>

    return (
        <main>
            <div className="cabinet-wrapper">
                <h1 className="catalog-title">Личный кабинет</h1>
                
                <div className="user-info">
                    <p><strong>ФИО:</strong> {user.fio}</p>
                    <p><strong>Логин:</strong> {user.login}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>

                <h2 className="cabinet-subtitle">
                    {isAdmin ? 'Все заявки клиентов' : 'Мои заявки'}
                </h2>

                {error && <p className="catalog-status error">{error}</p>}

                {applications.length === 0 ? (
                    <p className="catalog-status">Заявок пока нет</p>
                ) : isAdmin ? (
                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Клиент</th>
                                    <th>Услуга</th>
                                    <th>Авто</th>
                                    <th>Комментарий</th>
                                    <th>Статус</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map(app => (
                                    <tr key={app.id}>
                                        <td>{app.id}</td>
                                        <td>
                                            <strong>{app.user_fio}</strong><br/>
                                            <span className="table-muted">{app.user_email}</span>
                                        </td>
                                        <td>{app.service_title}</td>
                                        <td>{app.car_brand}</td>
                                        <td>{app.comment || '—'}</td>
                                        <td>
                                            <select 
                                                value={app.status} 
                                                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                className={`status-select status-${app.status}`}
                                            >
                                                <option value="NEW">Новая</option>
                                                <option value="CONFIRMED">Подтверждена</option>
                                                <option value="REJECTED">Отказана</option>
                                                <option value="DONE">Завершена</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="applications-list">
                        {applications.map(app => (
                            <div key={app.id} className="application-card">
                                <div className="app-header">
                                    <h3>{app.service_title}</h3>
                                    <span className={`app-status status-${app.status}`}>
                                        {app.status === 'NEW' && 'Новая'}
                                        {app.status === 'CONFIRMED' && 'Подтверждена'}
                                        {app.status === 'REJECTED' && 'Отказана'}
                                        {app.status === 'DONE' && 'Завершена'}
                                    </span>
                                </div>
                                <p><strong>Автомобиль:</strong> {app.car_brand}</p>
                                {app.comment && <p><strong>Комментарий:</strong> {app.comment}</p>}
                                <p className="app-date">Создана: {new Date(app.created_at).toLocaleString('ru-RU')}</p>
                                
                                {app.status === 'NEW' && (
                                    <div className="app-actions">
                                        <button className="btn-small btn-edit" onClick={() => openEdit(app)}>Редактировать</button>
                                        <button className="btn-small btn-delete" onClick={() => handleDeleteApp(app.id)}>Удалить</button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {editApp && (
                <div className="modal-overlay" onClick={() => setEditApp(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Редактировать заявку</h3>
                        <form onSubmit={handleUpdateApp} className="service-form">
                            <div className="form-group">
                                <label>Марка авто</label>
                                <input type="text" value={editCar} onChange={e => setEditCar(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Комментарий</label>
                                <textarea rows="3" value={editComment} onChange={e => setEditComment(e.target.value)} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="modal-cancel" onClick={() => setEditApp(null)}>Отмена</button>
                                <button type="submit" className="modal-confirm">Сохранить</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Cabinet