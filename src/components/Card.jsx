function Card({ title, desc, price, image }) {
    return (
        <div className="card">
            <img src={`/${image}`} alt={title} />
            <h3>{title}</h3>
            <p className="card-desc">{desc}</p>
            <div className="card-bottom">
                <button>Подробнее</button>
                <span className="card-price">от {price} ₽</span>
            </div>
        </div>
    )
}

export default Card