const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

function validateService(body) {
    const errors = [];

    if (!body.title || body.title.trim() === '') {
        errors.push('Название услуги обязательно');
    }

    if (!body.price && body.price !== 0) {
        errors.push('Цена обязательна');
    } else if (isNaN(body.price) || Number(body.price) < 0) {
        errors.push('Цена должна быть неотрицательным числом');
    }

    if (body.category_id && isNaN(body.category_id)) {
        errors.push('category_id должен быть числом');
    }

    return errors;
}

// GET запрос к таблице услуг - список всех услуг

app.get('/api/services', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// GET запрос к таблице услуг - поиск услуги по id

app.get('/api/services/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'id должен быть числом' });
    }

    try {
        const result = await pool.query('SELECT * FROM services WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Услуга не найдена' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// POST запрос к таблице услуг - добавление услуги

app.post('/api/services', adminMiddleware, async (req, res) => {
    const errors = validateService(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const { title, description, price, image, category_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO services (title, description, price, image, category_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [title, description || null, price, image || null, category_id || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// PUT - редактирование кслуги

app.put('/api/services/:id', adminMiddleware, async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'id должен быть числом' });
    }

    const errors = validateService(req.body);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const { title, description, price, image, category_id } = req.body;

    try {
        const result = await pool.query(
            `UPDATE services
             SET title = $1, description = $2, price = $3, image = $4, category_id = $5
             WHERE id = $6
             RETURNING *`,
            [title, description || null, price, image || null, category_id || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Услуга не найдена' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// DELETE - удаление услуги

app.delete('/api/services/:id', adminMiddleware, async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'id должен быть числом' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM services WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Услуга не найдена' });
        }

        res.json({ message: 'Услуга удалена', deleted: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// GET запрос к таблице категорий - список всех категорий

app.get('/api/categories', adminMiddleware, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});

// Проверка авторизации

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Нет доступа. Требуется авторизация' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Неверный или истекший токен' });
    }
}

// Проверка роли Администратора

function adminMiddleware(req, res, next) {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Доступ запрещен.' });
    }
    next();
}

// РЕГИСТРАЦИЯ

app.post('/api/register', async (req, res) => {
    const { fio, login, email, password } = req.body;

    if (!fio || !login || !email || !password) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Пароль должен быть не менее 8 символов' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Некорректный формат email' });
    }
    try {
        const checkUser = await pool.query(
            'SELECT * FROM users WHERE login = $1 OR email = $2', 
            [login, email]
        );
        if (checkUser.rows.length > 0) {
            return res.status(400).json({ error: 'Пользователь с таким логином или email уже существует' });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const result = await pool.query(
            'INSERT INTO users (fio, login, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, fio, login, email, role',
            [fio, login, email, passwordHash, 'USER']
        );

        res.status(201).json({ message: 'Регистрация успешна', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера при регистрации' });
    }
});

// ВХОД

app.post('/api/login', async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ error: 'Введите логин и пароль' });
    }
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE login = $1 OR email = $1', 
            [login]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }
        const token = jwt.sign(
            { id: user.id, role: user.role, fio: user.fio }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        res.json({
            message: 'Вход выполнен',
            token,
            user: { id: user.id, fio: user.fio, login: user.login, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера при входе' });
    }
});