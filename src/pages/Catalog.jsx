import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'

function Catalog() {
    const [services, setServices] = useState([])
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('http://localhost:3000/api/services')
            .then(res => res.json())
            .then(data => {
                setServices(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setError('Не удалось загрузить услуги')
                setLoading(false)
            })
    }, [])

    const filtered = services.filter(service =>
        service.title.toLowerCase().includes(query.toLowerCase().trim())
    )

    return (
        <main>
            <div className="catalog-header">
                <h1 className="catalog-title">Каталог услуг</h1>
                <Link to="/services/new" className="add-button">Добавить услугу</Link>
            </div>

            <input type="text" className="search-input" placeholder="Поиск услуги" value={query} onChange={(e) => setQuery(e.target.value)}/>

            {loading && <p className="catalog-status">Загрузка...</p>}
            {error && <p className="catalog-status error">{error}</p>}

            {!loading && !error && (
                <div className="catalog">
                    {filtered.map(service => (
                        <Card
                            key={service.id}
                            id={service.id}
                            title={service.title}
                            desc={service.description}
                            price={service.price}
                            image={service.image}
                        />
                    ))}
                </div>
            )}
        </main>
    )
}

export default Catalog