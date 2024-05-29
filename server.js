const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware для парсинга JSON тела запросов
app.use(bodyParser.json());

// Функция для чтения данных из файла
const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading users file:', err);
        return [];
    }
};

// Функция для записи данных в файл
const writeUsersToFile = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error('Error writing users file:', err);
    }
};

// Получение всех пользователей
app.get('/users', (req, res) => {
    const users = readUsersFromFile();
    res.json(users);
});

// Получение пользователя по id
app.get('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Создание нового пользователя
app.post('/users', (req, res) => {
    const users = readUsersFromFile();
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    writeUsersToFile(users);
    res.status(201).json(newUser);
});

// Обновление пользователя по id
app.put('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex !== -1) {
        users[userIndex] = { id: parseInt(req.params.id), ...req.body };
        writeUsersToFile(users);
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Удаление пользователя по id
app.delete('/users/:id', (req, res) => {
    const users = readUsersFromFile();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        writeUsersToFile(users);
        res.json(deletedUser);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
