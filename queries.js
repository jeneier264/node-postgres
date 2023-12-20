import pkg from 'pg';
import * as dotenv from 'dotenv'

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});


export const getUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).json(result.rows);
    });
};



export const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM users WHERE id = $1', [id], 
    (error, result) => {
        if (error) {
            throw error;
        } else if (!result.rows.length) res.status(200).json("User does not exist!");
        else res.status(200).json(result.rows);
    })
};

export const createUser = (req, res) => {
    const {name, email} = req.body;

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    [name, email], (error, result) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`User added with ID: ${result.rows[0].id}`);
    })
};

export const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const {name, email} = req.body;

    pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id], 
    (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`User modified with ID : ${id}`);
    })
};

export const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM users WHERE id = $1', [id], 
    (error, result) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Users deleted with ID: ${id}`);
    })
};