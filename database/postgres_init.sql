-- ============================================================================
-- CAMPUS CONNECT HUB - PostgreSQL Schema Initialization Script
-- ============================================================================

-- Clean setup (drop tables in reverse dependency order if recreating)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS group_messages CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS study_groups CASCADE;
DROP TABLE IF EXISTS verification_otps CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- ----------------------------------------------------------------------------
-- 1. Roles
-- ----------------------------------------------------------------------------
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (role_id, role_name) VALUES
    (1, 'Admin'),
    (2, 'Student')
ON CONFLICT (role_id) DO NOTHING;

-- Reset sequence to continue after seeded IDs
SELECT setval('roles_role_id_seq', (SELECT MAX(role_id) FROM roles));

-- ----------------------------------------------------------------------------
-- 2. Departments
-- ----------------------------------------------------------------------------
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(120) NOT NULL UNIQUE
);

INSERT INTO departments (department_id, department_name) VALUES
    (1, 'Computer Science Engineering'),
    (2, 'Computer Science & Business Systems'),
    (3, 'Information Technology'),
    (4, 'Electronics & Communication'),
    (5, 'Electrical Engineering'),
    (6, 'Mechanical Engineering'),
    (7, 'Civil Engineering')
ON CONFLICT (department_id) DO NOTHING;

SELECT setval('departments_department_id_seq', (SELECT MAX(department_id) FROM departments));

-- ----------------------------------------------------------------------------
-- 3. Users
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(role_id) DEFAULT 2,
    department_id INT REFERENCES departments(department_id),
    phone VARCHAR(25),
    bio TEXT,
    skills TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ----------------------------------------------------------------------------
-- 4. Verification OTPs
-- ----------------------------------------------------------------------------
CREATE TABLE verification_otps (
    otp_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otps_user_type ON verification_otps(user_id, type);

-- ----------------------------------------------------------------------------
-- 5. Study Groups
-- ----------------------------------------------------------------------------
CREATE TABLE study_groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(150) NOT NULL,
    subject VARCHAR(150),
    description TEXT,
    created_by INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    department_id INT REFERENCES departments(department_id),
    max_members INT DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_study_groups_dept ON study_groups(department_id);
CREATE INDEX idx_study_groups_creator ON study_groups(created_by);

-- ----------------------------------------------------------------------------
-- 6. Group Members
-- ----------------------------------------------------------------------------
CREATE TABLE group_members (
    member_id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES study_groups(group_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_group_member UNIQUE (group_id, user_id)
);

CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);

-- ----------------------------------------------------------------------------
-- 7. Group Messages (Chat)
-- ----------------------------------------------------------------------------
CREATE TABLE group_messages (
    message_id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES study_groups(group_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_group_messages_group ON group_messages(group_id);

-- ----------------------------------------------------------------------------
-- 8. Notes
-- ----------------------------------------------------------------------------
CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    file_url VARCHAR(255) NOT NULL,
    group_id INT REFERENCES study_groups(group_id) ON DELETE SET NULL,
    uploaded_by INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_uploaded_by ON notes(uploaded_by);
CREATE INDEX idx_notes_group ON notes(group_id);

-- ----------------------------------------------------------------------------
-- 9. Study Sessions
-- ----------------------------------------------------------------------------
CREATE TABLE study_sessions (
    session_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    location VARCHAR(200),
    meeting_link VARCHAR(255),
    group_id INT NOT NULL REFERENCES study_groups(group_id) ON DELETE CASCADE,
    created_by INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_study_sessions_group ON study_sessions(group_id);
CREATE INDEX idx_study_sessions_date ON study_sessions(session_date);

-- ----------------------------------------------------------------------------
-- 10. Notifications
-- ----------------------------------------------------------------------------
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

