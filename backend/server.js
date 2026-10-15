const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
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

app.post('/api/services', async (req, res) => {
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

app.put('/api/services/:id', async (req, res) => {
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

app.delete('/api/services/:id', async (req, res) => {
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

app.get('/api/categories', async (req, res) => {
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