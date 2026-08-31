-- =====================================================
-- Beyond Today - Database Schema & Sample Data
-- Database: beyond_today
-- =====================================================

CREATE DATABASE IF NOT EXISTS beyond_today
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE beyond_today;

-- -----------------------------------------------------
-- Table: users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table: categories
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table: articles
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS articles (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT DEFAULT NULL,
  content LONGTEXT NOT NULL,
  featured_image VARCHAR(500) DEFAULT NULL,
  category_id INT UNSIGNED DEFAULT NULL,
  reading_time INT UNSIGNED DEFAULT 1,
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_articles_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- Admin user
-- Email:    admin@beyondtoday.com
-- Password: admin123 (hashed with bcrypt)
-- =====================================================
INSERT INTO users (name, email, password) VALUES
('Admin', 'admin@beyondtoday.com', '$2a$10$XSur8JnM2Xf.FiDonG/ZTODV/59HB7udegIwspeMi3EzfD17fpFNG');

-- =====================================================
-- Sample categories
-- =====================================================
INSERT INTO categories (name, slug, description) VALUES
('Programming', 'programming', 'General programming concepts, languages and best practices.'),
('Web Development', 'web-development', 'Building modern web applications and websites.'),
('Backend', 'backend', 'Server-side development, APIs and microservices.'),
('Frontend', 'frontend', 'Client-side development, UI and user experience.'),
('Cybersecurity', 'cybersecurity', 'Protecting systems, networks and data from threats.'),
('Networking', 'networking', 'Understanding how computers connect and communicate.'),
('AI', 'ai', 'Artificial intelligence, machine learning and automation.'),
('Databases', 'databases', 'Storing, querying and managing data.');

-- =====================================================
-- Sample articles
-- =====================================================
INSERT INTO articles
  (title, slug, excerpt, content, featured_image, category_id, reading_time, status, published_at)
VALUES
(
  'What Is Node.js?',
  'what-is-node-js',
  'An introduction to Node.js, the JavaScript runtime that powers modern backend development.',
  '<p>Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside of a web browser. It is built on the V8 JavaScript engine, the same engine that powers Google Chrome.</p><h2>Why is Node.js popular?</h2><p>Node.js changed the way developers build servers because it uses an event-driven, non-blocking I/O model. This makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.</p><h2>Key features</h2><ul><li>Asynchronous and event-driven</li><li>Fast execution thanks to V8</li><li>Huge package ecosystem via npm</li><li>Single-threaded with non-blocking behavior</li></ul><blockquote>&quot;Node.js is not a framework, it is a runtime environment.&quot;</blockquote><h2>Getting started</h2><p>You can install Node.js from its official website and start writing a simple HTTP server in just a few lines of code.</p>',
  'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80',
  3,
  4,
  'published',
  NOW() - INTERVAL 1 DAY
),
(
  'Understanding REST APIs',
  'understanding-rest-apis',
  'Learn what REST APIs are, how they work, and the core principles behind them.',
  '<p>A REST API is an architectural style for designing networked applications. It relies on stateless, client-server communication, using standard HTTP methods.</p><h2>Core principles</h2><ul><li>Stateless requests</li><li>Client-server separation</li><li>Uniform interface</li><li>Resource-based URLs</li></ul><h2>HTTP methods</h2><p>REST APIs map standard HTTP verbs to operations: GET to read, POST to create, PUT to update, and DELETE to remove resources.</p><blockquote>&quot;REST is about representing resources and their state, not about sending commands.&quot;</blockquote><p>Implementing a clean REST API helps keep your frontend and backend loosely coupled and easy to maintain.</p>',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
  3,
  3,
  'published',
  NOW() - INTERVAL 2 DAY
),
(
  'Getting Started With React',
  'getting-started-with-react',
  'A beginner-friendly guide to React, the popular JavaScript library for building user interfaces.',
  '<p>React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small, isolated pieces of code called components.</p><h2>Components and props</h2><p>Everything in React is a component. Components receive inputs called props and return what should appear on the screen. This makes code reusable and easy to test.</p><h2>State and hooks</h2><ul><li>useState for local state</li><li>useEffect for side effects</li><li>useContext for shared data</li></ul><blockquote>&quot;React makes it painless to create interactive UIs.&quot;</blockquote><p>With a tool like Vite, you can scaffold a new React project in seconds and start building today.</p>',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
  4,
  4,
  'published',
  NOW() - INTERVAL 3 DAY
),
(
  'MySQL Database Basics',
  'mysql-database-basics',
  'Understand the fundamentals of MySQL, from tables and queries to indexing and relationships.',
  '<p>MySQL is one of the most widely used open-source relational database management systems. It stores data in tables made up of rows and columns.</p><h2>Core concepts</h2><ul><li>Tables, rows and columns</li><li>Primary and foreign keys</li><li>Indexes for faster lookups</li><li>SQL for querying data</li></ul><h2>Relationships</h2><p>Relationships let you connect data across tables. For example, a category can have many articles, which is a one-to-many relationship defined with foreign keys.</p><blockquote>&quot;Data is a precious thing and will last longer than the systems themselves.&quot;</blockquote><p>Learning basic SQL and normalization will take you a long way in backend development.</p>',
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
  8,
  4,
  'published',
  NOW() - INTERVAL 4 DAY
),
(
  'Introduction to Cybersecurity',
  'introduction-to-cybersecurity',
  'Learn the basics of keeping systems, networks and data safe from digital threats.',
  '<p>Cybersecurity is the practice of protecting systems, networks and programs from digital attacks. These attacks are usually aimed at accessing, changing or destroying sensitive information.</p><h2>Why it matters</h2><p>As more of our lives move online, the importance of securing data grows. A single breach can cost companies millions and damage user trust.</p><h2>Key areas</h2><ul><li>Network security</li><li>Application security</li><li>Information security</li><li>Operational security</li></ul><blockquote>&quot;Security is not a product, but a process.&quot;</blockquote><p>Start with the fundamentals: strong passwords, encryption, regular updates and good access control.</p>',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
  5,
  4,
  'published',
  NOW() - INTERVAL 5 DAY
),
(
  'How the Internet Works',
  'how-the-internet-works',
  'A simple explanation of how data travels across the internet using networks and protocols.',
  '<p>The internet is a global network of interconnected computers that communicate using standardized protocols. Every device connected to the internet has a unique IP address.</p><h2>How data travels</h2><p>When you visit a website, your request is broken into small packets. These packets travel across routers and networks until they reach the destination server, which sends back the response.</p><h2>Key protocols</h2><ul><li>TCP/IP for reliable delivery</li><li>HTTP/HTTPS for web traffic</li><li>DNS to translate domain names into IP addresses</li></ul><blockquote>&quot;The internet is a network of networks.&quot;</blockquote><p>Understanding these basics helps you appreciate how websites, APIs and cloud services actually work under the hood.</p>',
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
  6,
  4,
  'published',
  NOW() - INTERVAL 6 DAY
),
(
  'Draft Example: Deep Dive into JSON Web Tokens',
  'draft-example-jwt',
  'A draft article about JWT authentication that is not yet published.',
  '<p>This article is currently a draft and will only be visible in the admin panel until it is published.</p>',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  3,
  4,
  'draft',
  NULL
);
