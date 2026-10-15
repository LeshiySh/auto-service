import { Link } from 'react-router-dom'

function Card({ id, title, desc, price, image }) {
    return (
        <div className="card">
            <img src={`/${image}`} alt={title} />
            <h3>{title}</h3>
            <p className="card-desc">{desc}</p>
            <div className="card-bottom">
                <Link to={`/services/${id}`} className="card-button">Подробнее</Link>
                <span className="card-price">от {price} ₽</span>
            </div>
        </div>
    )
}

export default Card