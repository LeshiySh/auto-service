DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS categories;

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