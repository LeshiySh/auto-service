DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fio VARCHAR(255) NOT NULL,
    login VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price INTEGER,
    image VARCHAR(255),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE NOT NULL,
    car_brand VARCHAR(100) NOT NULL,
    comment TEXT,
    status VARCHAR(20) DEFAULT 'NEW' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name) VALUES
    ('Техническое обслуживание'),
    ('Двигатель'),
    ('Трансмиссия'),
    ('Подвеска'),
    ('Шины и диски'),
    ('Кузов');

INSERT INTO services (title, description, price, image, category_id) VALUES
    (
        'Техническое обслуживание',
        'Плановое ТО: замена масла и фильтров, проверка тормозной системы, диагностика двигателя и подвески.',
        3500,
        'catalog1.png',
        1
    ),
    (
        'Ремонт двигателя',
        'Полная диагностика, капитальный ремонт, замена ремня ГРМ, прокладок и навесного оборудования.',
        12000,
        'catalog2.png',
        2
    ),
    (
        'Ремонт трансмиссии',
        'Ремонт МКПП и АКПП, замена сцепления, масел, сальников и приводов. Диагностика на стенде.',
        15000,
        'catalog3.png',
        3
    ),
    (
        'Ремонт подвески',
        'Замена амортизаторов, рычагов, шаровых опор, сайлентблоков. Развал-схождение в подарок.',
        6000,
        'catalog4.png',
        4
    ),
    (
        'Шиномонтаж',
        'Сезонная смена шин, балансировка колёс, правка стальных и литых дисков, ремонт проколов.',
        1800,
        'catalog5.png',
        5
    ),
    (
        'Кузовной ремонт',
        'Удаление вмятин без покраски, рихтовка, покраска в камере, полировка и антикоррозийная обработка.',
        8000,
        'catalog6.png',
        6
    );