CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE,
    category VARCHAR(50),
    priority INTEGER DEFAULT 3, -- 1: High, 2: Medium, 3: Low
    completed BOOLEAN DEFAULT FALSE
);