CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS users(
    user_id UUID PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    account_type VARCHAR(20) DEFAULT 'user' NOT NULL
);

CREATE TABLE IF NOT EXISTS categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS businesses(
    id SERIAL PRIMARY KEY,
    owner_user_id UUID REFERENCES users(user_id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2),
    zip VARCHAR(10),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS services(
    id SERIAL PRIMARY KEY,
    business_id INTEGER REFERENCES businesses(id),
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    search_vector TSVECTOR
);

CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
      NEW.search_vector = to_tsvector('english', coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, ''));
      RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_businesses_updated_at
BEFORE UPDATE ON businesses
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_search_vector
BEFORE UPDATE OR INSERT ON services
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE INDEX idx_services_search ON services USING GIN(search_vector);
CREATE INDEX idx_services_trgm ON services USING GIN(name gin_trgm_ops);

-- Fuzzy search


CREATE OR REPLACE FUNCTION search_services_fuzzy(search_term TEXT)
RETURNS TABLE (
    id INTEGER,
    business_id INTEGER,
    category_id INTEGER,
    name VARCHAR,
    description TEXT,
    price NUMERIC,
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.business_id,
        s.category_id,
        s.name,
        s.description,
        s.price,
        s.search_vector,
        s.created_at,
        s.updated_at,
        similarity(s.name, search_term) AS similarity
    FROM services s
    WHERE similarity(s.name, search_term) > 0.15
    ORDER BY similarity DESC;
END;
$$ LANGUAGE plpgsql;