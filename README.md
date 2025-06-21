# Express + MongoDB + Docker Compose

Практична робота: **Docker, Express та MongoDB**

---

## 🧩 Стек технологій

- Node.js (образ: `node:lts`)
- Express.js
- MongoDB (образ: `mongo`)
- Docker / Docker Compose
- Pug шаблони
- .env для конфігурації

---

## 📁 Структура проєкту

```
.
├── Dockerfile
├── docker-compose.yml
├── .env
├── app.js
├── package.json
├── src/             # Pug шаблони
├── public/          # Статичні файли (CSS, JS)
```

---

## ⚙️ Інструкція з запуску

### 1. Клонувати репозиторій

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Створити `.env`

```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/mydb
JWT_SECRET=supersecretkey123
```

### 3. Запустити Docker Compose

```bash
docker compose up --build
```

### 4. Відкрити браузер

```
http://localhost:3000
```

---

## 🔁 Автоматичне оновлення

Завдяки `volumes` у `docker-compose.yml` зміни в коді застосовуються автоматично.

- Можна змінювати Pug шаблони або JS-код
- Контейнер Express перезапускається завдяки `nodemon`

---

## 🧼 Зупинити та очистити

```bash
docker compose down --volumes
```

---