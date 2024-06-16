# Common Library Management System

## Overview

Common Library Management System is a backend application designed to manage library operations efficiently. It provides both a RESTful API and GraphQL API for users to interact with the system, handling tasks such as user management, book management, borrowing, and reporting.

## Features

- User Management: Registration, authentication, authorization with JWT.
- Book Management: CRUD operations for books, including pagination and filtering.
- Borrowing System: Borrow, return, and view borrow history for users.
- Reports and Aggregations: Generate reports like most borrowed books and active users.

## Tech Stack

- Node.js: JavaScript runtime environment.
- Express: Web framework for Node.js to handle HTTP requests.
- MongoDB: NoSQL database for data storage.
- GraphQL: Query language for APIs providing a flexible data interaction.
- Apollo Server: GraphQL server implementation.
- bcryptjs: Library for secure password hashing.
- jsonwebtoken: Library for JWT generation and authentication.

## Setup

1. Clone the repository


2. Install dependencies:
        npm i

3. Set up environment variables:
    cp .env.example .env
    
Create a .env file in the root directory and add:


Replace `your_secret_key` with a secure string for JWT token generation.

4. Start the servers: npm run dev


- Express server will run on http://localhost:4000.
- Apollo Server will run on http://localhost:4000/graphql.

## API Documentation

### RESTful API Endpoints

- User Management
- POST /register: Register a new user.
- POST /login: User login.

- Book Management
- POST /books: Add a new book.
- GET /books: Get list of books with pagination and filtering.
- PUT /books/:id: Update a book.
- DELETE /books/:id: Delete a book.

- Borrowing System
- POST /borrow: Borrow a book.
- POST /return/:id: Return a borrowed book.
- GET /history: Get borrow history of the user.

Reports and Aggregations
Most Borrowed Books: GET /api/reports/most-borrowed-books
Generates a report of the most borrowed books.
Active Members: GET /api/reports/active-members
Lists the most active members based on borrowing history.
Book Availability: GET /api/reports/book-availability
Provides a summary report of book availability (total books, borrowed books, available books).

### GraphQL API

Access the GraphQL endpoint at http://localhost:4000/graphql for advanced queries and mutations using Apollo Server.

## Usage

- Use tools like Postman or cURL to test RESTful endpoints.
- Use GraphQL playground (Apollo Studio or GraphiQL) at http://localhost:4001/graphql for interactive testing.

## Security

- JWT-based authentication secures user login and role-based access control.
