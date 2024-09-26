const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const { User } = require('./models');
const { Op } = require('sequelize');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();

app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'API documentation for managing users'
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const sequelize = new Sequelize('GsFmaHhX', 'bsXdAH', 'YXARlmwhPyqtRdVB', {
    host: '185.177.216.77',
    dialect: 'mysql'
});

// POST /create
/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               role:
 *                 type: string
 *               efficiency:
 *                 type: integer
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 */
app.post('/create', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json({ success: true, result: { id: user.id } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// GET /get
/**
 * @swagger
 * /get:
 *   get:
 *     summary: Get a list of users
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Role of the users to filter by
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           full_name:
 *                             type: string
 *                           role:
 *                             type: string
 *                           efficiency:
 *                             type: integer
 */
app.get('/get', async (req, res) => {
    try {
        const role = req.query.role;
        const whereClause = role ? { role } : {};
        const users = await User.findAll({ where: whereClause });
        const result = users.map(user => ({
            id: user.id,
            full_name: user.full_name,
            role: user.role,
            efficiency: user.efficiency
        }));
        res.json({ success: true, result: { users: result } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get users' });
    }
});

// GET /get/:user_id
/**
 * @swagger
 * /get/{user_id}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           full_name:
 *                             type: string
 *                           role:
 *                             type: string
 *                           efficiency:
 *                             type: integer
 */
app.get('/get/:user_id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            success: true,
            result: {
                users: [{
                    id: user.id,
                    full_name: user.full_name,
                    role: user.role,
                    efficiency: user.efficiency
                }]
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// PATCH /update/:user_id
/**
 * @swagger
 * /update/{user_id}:
 *   patch:
 *     summary: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               role:
 *                 type: string
 *               efficiency:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The updated user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     full_name:
 *                       type: string
 *                     role:
 *                       type: string
 *                     efficiency:
 *                       type: integer
 */
app.patch('/update/:user_id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update(req.body);
        res.json({
            success: true,
            result: {
                id: user.id,
                full_name: user.full_name,
                role: user.role,
                efficiency: user.efficiency
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE /delete/:user_id
/**
 * @swagger
 * /delete/{user_id}:
 *   delete:
 *     summary: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The deleted user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     full_name:
 *                       type: string
 *                     role:
 *                       type: string
 *                     efficiency:
 *                       type: integer
 */
app.delete('/delete/:user_id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();
        res.json({
            success: true,
            result: {
                id: user.id,
                full_name: user.full_name,
                role: user.role,
                efficiency: user.efficiency
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// DELETE /delete
/**
 * @swagger
 * /delete:
 *   delete:
 *     summary: Delete all users
 *     responses:
 *       200:
 *         description: All users have been deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 */
app.delete('/delete', async (req, res) => {
    try {
        await User.destroy({ where: {} });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete all users' });
    }
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
