import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

function ServiceForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEdit = Boolean(id)

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        image: '',
        category_id: '',
    })

    const [categories, setCategories] = useState([])
    const [errors, setErrors] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(isEdit)

    useEffect(() => {
        fetch('http://localhost:3000/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        if (!isEdit) return

        fetch(`http://localhost:3000/api/services/${id}`)
            .then(res => {
                if (res.status === 404) {
                    setErrors(['Услуга не найдена'])
                    setLoading(false)
                    return null
                }
                return res.json()
            })
            .then(data => {
                if (data) {
                    setForm({
                        title: data.title || '',
                        description: data.description || '',
                        price: data.price != null ? String(data.price) : '',
                        image: data.image || '',
                        category_id: data.category_id != null ? String(data.category_id) : '',
                    })
                    setLoading(false)
                }
            })
            .catch(err => {
                console.error(err)
                setErrors(['Ошибка загрузки'])
                setLoading(false)
            })
    }, [id, isEdit])

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value })
        setErrors([])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        setErrors([])

        const url = isEdit
            ? `http://localhost:3000/api/services/${id}`
            : 'http://localhost:3000/api/services'

        const method = isEdit ? 'PUT' : 'POST'

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                price: Number(form.price),
                category_id: form.category_id ? Number(form.category_id) : null,
            }),
        })
            .then(async res => {
                const data = await res.json()
                if (!res.ok) {
                    if (data.errors) {
                        setErrors(data.errors)
                    } else {
                        setErrors([data.error || 'Ошибка сохранения'])
                    }
                    setSubmitting(false)
                    return null
                }
                return data
            })
            .then(data => {
                if (data) {
                    navigate(`/services/${data.id}`)
                }
            })
            .catch(err => {
                console.error(err)
                setErrors(['Ошибка соединения с сервером'])
                setSubmitting(false)
            })
    }

    if (loading) {
        return <main><p className="catalog-status">Загрузка...</p></main>
    }

    return (
        <main>
            <div className="form-page">
                <h1>{isEdit ? 'Редактировать услугу' : 'Добавить услугу'}</h1>

                {errors.length > 0 && (
                    <div className="form-errors">
                        {errors.map((err, i) => (
                            <p key={i}>{err}</p>
                        ))}
                    </div>
                )}

                <form className="service-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Название *</label>
                        <input id="title" type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Например, Замена масла" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Описание</label>
                        <textarea id="description" rows="4" value={form.description} onChange={(e) => handleChange('description', e.target.value)} 
                        placeholder="Что входит в услугу" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Цена (₽) *</label>
                        <input id="price" type="number" min="0" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="7300" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category_id">Категория</label>
                        <select id="category_id" value={form.category_id} onChange={(e) => handleChange('category_id', e.target.value)}>
                            <option value="">— Без категории —</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Картинка</label>
                        <input id="image" type="text" value={form.image} onChange={(e) => handleChange('image', e.target.value)} placeholder="catalog1.png" />
                        <small className="form-hint">
                            Имя файла из папки public (например, catalog1.png)
                        </small>
                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <Link to={isEdit ? `/services/${id}` : '/catalog'} className="back-link"> Отмена </Link>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default ServiceForm