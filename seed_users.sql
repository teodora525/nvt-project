-- ====================================================================
-- OnlyKicks - Seed Script for 1,000,000 Users and 10,000 Admins (Req 3.5 & 3.1.1)
-- ====================================================================

-- 1. Enable pg_trgm for ultra-fast text search with partial matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$
DECLARE
    start_time timestamp;
    end_time timestamp;
    card_start_id bigint;
    admin_count int := 10000;
    user_count int := 1000000;
    sample_pwd text := '$2a$10$WPO.57wMYaf73G72hP6jQOfoxBZic.jXzh3i4fkR7Q/G/yD7OqiQa'; -- password: password123 / admin123
BEGIN
    start_time := clock_timestamp();
    RAISE NOTICE 'Starting database seed...';

    -- Get current max id for credit_cards
    SELECT COALESCE(MAX(id), 0) INTO card_start_id FROM credit_cards;

    -- ----------------------------------------------------------------
    -- A. INSERT 10,000 CREDIT CARDS FOR ADMINS
    -- ----------------------------------------------------------------
    RAISE NOTICE 'Inserting 10,000 credit cards for admins...';
    INSERT INTO credit_cards (card_holder, card_number, cvv, expiration_date)
    SELECT 
        'Admin Holder ' || i,
        '4111' || LPAD(i::text, 12, '0'),
        '123',
        '12/28'
    FROM generate_series(1, admin_count) AS i;

    -- ----------------------------------------------------------------
    -- B. INSERT 10,000 ADMIN USERS
    -- ----------------------------------------------------------------
    RAISE NOTICE 'Inserting 10,000 admin users...';
    INSERT INTO users (
        email, first_name, last_name, password, profile_picture_url, 
        role, active, credit_card_id, created_at
    )
    SELECT 
        'admin_' || i || '@onlykicks.com',
        'Admin' || (i % 100),
        'Manager' || (i % 100),
        sample_pwd,
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        'ROLE_ADMIN',
        true,
        card_start_id + i,
        NOW() - (i || ' minutes')::interval
    FROM generate_series(1, admin_count) AS i;

    -- Update card_start_id for standard users
    SELECT COALESCE(MAX(id), 0) INTO card_start_id FROM credit_cards;

    -- ----------------------------------------------------------------
    -- C. INSERT 1,000,000 CREDIT CARDS FOR USERS
    -- ----------------------------------------------------------------
    RAISE NOTICE 'Inserting 1,000,000 credit cards for regular users...';
    INSERT INTO credit_cards (card_holder, card_number, cvv, expiration_date)
    SELECT 
        'User ' || i,
        '5200' || LPAD(i::text, 12, '0'),
        LPAD((i % 900 + 100)::text, 3, '0'),
        '10/28'
    FROM generate_series(1, user_count) AS i;

    -- ----------------------------------------------------------------
    -- D. INSERT 1,000,000 REGULAR USERS
    -- ----------------------------------------------------------------
    RAISE NOTICE 'Inserting 1,000,000 regular users...';
    INSERT INTO users (
        email, first_name, last_name, password, profile_picture_url, 
        role, active, credit_card_id, created_at
    )
    SELECT 
        'user_' || i || '@example.com',
        (ARRAY['Nikola', 'Marko', 'Jovan', 'Stefan', 'Luka', 'Petar', 'Milos', 'Ana', 'Milica', 'Jelena', 'Sara', 'Teodora', 'Ivana', 'Marija', 'Aleksandra'])[(i % 15) + 1],
        (ARRAY['Petrovic', 'Jovanovic', 'Nikolic', 'Popovic', 'Djordjevic', 'Stojanovic', 'Ilic', 'Stankovic', 'Pavlovic', 'Markovic', 'Milosevic'])[(i % 11) + 1],
        sample_pwd,
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        'ROLE_USER',
        (i % 10 != 0), -- 90% active, 10% inactive
        card_start_id + i,
        NOW() - (i || ' seconds')::interval
    FROM generate_series(1, user_count) AS i;

    end_time := clock_timestamp();
    RAISE NOTICE 'Seed completed successfully in %', (end_time - start_time);
END $$;

-- --------------------------------------------------------------------
-- 2. CREATE INDEXES FOR ULTRA-FAST SERVER-SIDE FILTERING (Req 3.1.1)
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_first_name_trgm ON users USING gin (lower(first_name) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_last_name_trgm ON users USING gin (lower(last_name) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_email_trgm ON users USING gin (lower(email) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users (active);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

-- Update query planner statistics
ANALYZE users;
ANALYZE credit_cards;
