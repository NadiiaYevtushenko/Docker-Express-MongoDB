# Проєкт Express.js: Статичні файли, Cookies та Аутентифікація через JWT

## 📌 Опис

Цей проєкт реалізує сервер на Node.js з використанням Express.js, що демонструє:

- Відображення статичних файлів (включно з favicon)
- Збереження налаштувань користувача за допомогою cookies (перемикач теми)
- Аутентифікацію користувача з використанням JWT, збережених у cookies з опцією `httpOnly`
- Серверний рендеринг за допомогою шаблонів PUG

---

## 🛠 Використані технології

- **Node.js** — середовище виконання
- **Express.js** — вебфреймворк
- **PUG** — шаблонізатор HTML на сервері
- **cookie-parser** — для обробки cookies
- **jsonwebtoken** — для створення та перевірки JWT
- **cors** — middleware для обробки CORS
- **JavaScript** — для клієнтської логіки перемикання теми
- **Статичні файли** — CSS, JS, favicon

---

## 📁 Структура проєкту

````
.
├── app.js                         # Основний сервер Express
├── package.json                   # Залежності та метаінформація
├── package-lock.json              # Фіксація версій пакетів
├── README.md                      # Інструкція до проєкту
├── public/                        # Статичні файли
│   ├── icons/
│   │   └── favicon.ico            # Favicon для сайту
│   ├── images/
│   │   └── picLogo.png            # Логотип або зображення
│   ├── scripts/
│   │   └── theme.js               # Логіка перемикача теми (fetch + cookie)
│   └── styles/
│       ├── style.css              # Основні стилі сайту
│       └── test-login.html        # Тестовий HTML для перевірки JWT-cookie
├── src/
│   └── layout.pug                 # PUG-шаблон сторінки (головна розмітка)

---

## 🚀 Встановлення та запуск

1. **Встановлення залежностей**

   ```bash
   npm install
````

2. **Запуск сервера**

   ```bash
   node app.js
   ```

3. **Відкрий у браузері**
   ```
   http://localhost:3000/
   ```

---

## ✅ Реалізація ТЗ та інструкція з перевірки

### 1. ✅ Статичні файли

- **Favicon**: розміщено в `public/icons/favicon.ico`
- **У шаблоні PUG**:
  ```pug
  link(rel="icon", href="/icons/favicon.ico", type="image/x-icon")
  ```
- **Інші файли**: стилі, скрипти, картинки — обслуговуються через `express.static('public')`

> 🔎 **Перевірка**:
>
> - DevTools → Network → файл `favicon.ico` має завантажуватись з 200 OK
> - Якщо файл уже кешований — буде 304 Not Modified
> - URL: `/icons/favicon.ico`

---

### 2. ✅ Cookies — перемикач теми

- Маршрут: `POST /set-theme`
- Зберігає значення `theme` (`light` або `dark`) у cookie
- Cookie налаштовано з:
  - `httpOnly: true`
  - `sameSite: 'Lax'`
  - `secure: false` (для локального запуску)

> 🔎 **Перевірка**:
>
> - Відкрий сторінку → натисни кнопку `Toggle Theme`
> - Відкрий DevTools → Application → Cookies
> - Переконайся, що cookie `theme` змінюється

---

### 3. ✅ Аутентифікація через JWT

- **Маршрути:**
  - `POST /register` — генерація токена
  - `POST /login` — генерація токена
- **JWT-токен:**

  - створюється за допомогою бібліотеки `jsonwebtoken`
  - зберігається як cookie `token` з параметрами:
    - `httpOnly: true` — недоступна з JavaScript
    - `sameSite: 'Lax'` — захист від CSRF
    - `secure: false` — дозволено для `http://localhost`

- **Middleware:** `authenticateToken` перевіряє наявність та дійсність токена з cookie
- **Захищений маршрут:** `GET /profile` повертає інформацію про користувача лише за наявності валідного токена

> 🔎 **Перевірка:**
>
> - Надішли `POST /login` або `POST /register` через Postman або браузер  
>   (наприклад: [http://localhost:3000/login](http://localhost:3000/login))
> - У відповіді буде заголовок `Set-Cookie: token=...`
> - Зроби `GET /profile` — має повернути JSON з користувачем, якщо токен валідний
>
> 🧪 Для зручності перевірки створено файл **`public/styles/test-login.html`**  
> Відкрий його через браузер:
> [http://localhost:3000/styles/test-login.html](http://localhost:3000/styles/test-login.html)  
> і натисни кнопку — буде виконано `fetch()` до `/login`, а токен збережеться в cookies.
>
> ✅ Після цього також можна перевірити доступність favicon як підтвердження роботи статичних файлів:
> [http://localhost:3000/icons/favicon.ico](http://localhost:3000/icons/favicon.ico)

---

## 🔒 Безпека

- Cookie з токеном має `httpOnly` і `sameSite` → захист від XSS та CSRF
- У продакшн середовищі встановити:
  ```js
  secure: true; // для HTTPS
  ```

---
