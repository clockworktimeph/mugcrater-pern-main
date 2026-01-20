<h1 align="center">PERN System</h1>

> A CRUD app created with PostgreSQL, Sequelize, Express, React and Node (PERN). Features: Login, Creates, Delete, Update and Get posts.

## Install
1. Clone this repository: `git clone https://github.com/alexander21r/pern-crud`
2. Install PostgreSQL and Node.js if you do not have it already
3. Start PostgreSQL and create a database
4. Add your database name, master username and password in the .env file in the server folder.
5. Go to server folder and type: `npm install`
6. Start backend by typing: `npm run dev`
7. Go to client folder and type: `npm install`
8. Start frontend by typing: `npm run start`

## Helmet (For managing scripts (and other head elements) declaratively, you can use react-helmet. It allows you to manage changes to the document head, like adding scripts or meta tags.)
1. npm install react-helmet (Folder: Client)

## Bootstrap
1. npm install bootstrap (Folder: Client)

## Login
1. Database Query Setup:
  - CREATE DATABASE users;
  - CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
  );
2. Backend Setup (Node.js with Express):
  - npm install express pg bcrypt body-parser cors

