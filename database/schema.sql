CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password_hash TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    account_type VARCHAR(20) DEFAULT 'user' NOT NULL
);

CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE businesses(
    id SERIAL PRIMARY KEY,
    owner_user_id INTEGER REFERENCES users(user_id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2),
    zip VARCHAR(10),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    slug, VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
);

CREATE TABLE services(
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id),
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);



