# Avirup Mondal's Blog Platform

A full-stack blog platform built from scratch using Node.js, Express.js, MongoDB, EJS, and JWT Authentication. 

## 🚀 Features
- **User Authentication:** Secure signup and login using JSON Web Tokens (JWT) and bcrypt password hashing.
- **CRUD Operations:** Authenticated users can create, read, and delete their own blog posts.
- **SEO-Friendly:** Posts automatically generate SEO-friendly slugs for URLs (e.g., `/posts/my-first-post`).
- **Responsive UI:** A premium, dark-themed user interface built with Bootstrap 5.

---

## 💻 How to Run Locally

### Prerequisites
1. **Node.js**: Make sure Node.js is installed on your computer.
2. **MongoDB**: You need a MongoDB Atlas Cloud database or a local MongoDB installation.

### Step-by-step Setup
1. **Open your terminal** and navigate to this folder:
   ```bash
   cd "C:\Users\risin\OneDrive\Desktop\Blog Site"
   ```

2. **Install the dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a file named `.env` in the root folder (if it doesn't exist already) and add the following:
   ```env
   PORT=3001
   MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0...
   JWT_SECRET=supersecretkey_avirup_blog_2026
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```

5. **View the Site**:
   Open your browser and navigate to: **http://localhost:3001**

---

## 🌐 How to Upload to GitHub

1. Download and install **Git** from [gitforwindows.org](https://gitforwindows.org/).
2. Create an empty repository on GitHub.
3. Open your terminal in this project folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YourUsername/your-repo-name.git
   git push -u origin main
   ```

---

## ☁️ How to Deploy (Make it live on the internet!)

The easiest way to host this project for free is using **Render**:
1. Go to [Render.com](https://render.com/) and sign in with your GitHub account.
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository.
4. Set the Build Command to `npm install`.
5. Set the Start Command to `npm start`.
6. Scroll down to **Environment Variables** and add your `MONGO_URI` and `JWT_SECRET`.
7. Click **Create Web Service** and wait a few minutes for your live URL!

---

### Important Notes
- **Admin Account:** There is no default admin account. You just need to sign up for an account on the live site, and you can use that to create posts.
- **Security:** NEVER upload your `.env` file to GitHub. The `.gitignore` file is already set up to prevent this.
