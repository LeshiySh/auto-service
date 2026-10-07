import { useState } from 'react'
import Card from '../components/Card'
import { services } from '../data/services'

function Catalog() {
    const [query, setQuery] = useState('')

    const filtered = services.filter(service =>
        service.title.toLowerCase().includes(query.toLowerCase().trim())
    )

    return (
        <main>
            <h1 className="catalog-title">Каталог услуг</h1>

            <input type="text" className="search-input" placeholder="Поиск услуги" value={query} onChange={(e) => setQuery(e.target.value)}/>

            <div className="catalog">
                {filtered.map(service => (
                    <Card
                        key={service.id}
                        title={service.title}
                        desc={service.desc}
                        price={service.price}
                        image={service.image}
                    />
                ))}
            </div>
        </main>
    )
}

export default Catalog