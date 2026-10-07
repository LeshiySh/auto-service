function Home() {
    return (
        <main>
            <div className="poster">
                <div className="poster-images">
                    <img  src="/autoservice.png" alt=""/>
                </div>
                <div className="poster-content">
                    <h1>СТО в Ульяновске. <br/> Быстрый ремонт любой <br/> сложности </h1>
                    <p>Автосервис Sh·auto - это ремонт и обслуживание любых автомобилей без очереди</p>
                    <a href="/Catalog">
                        <button>Каталог услуг</button>
                    </a>
                </div>
            </div>
            <section className="stats">
                <div className="stats-container">
                    <div className="stat">
                        <p className="stat-number">10</p>
                        <p className="stat-label">лет на рынке</p>
                    </div>
                    <div className="stat">
                        <p className="stat-number">5000</p>
                        <p className="stat-label">клиентов</p>
                    </div>
                    <div className="stat">
                        <p className="stat-number">99%</p>
                        <p className="stat-label">довольны</p>
                    </div>
                    <div className="stat">
                        <p className="stat-number">24/7</p>
                        <p className="stat-label">поддержка</p>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Home