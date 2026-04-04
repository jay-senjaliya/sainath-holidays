-- ============================================================
-- Tour & Travel Agency - PostgreSQL Schema (DDL)
-- Run this before seed.sql
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMs
-- ============================================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'USER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE package_category AS ENUM ('DOMESTIC', 'INTERNATIONAL', 'ADVENTURE', 'HONEYMOON', 'PILGRIMAGE', 'WILDLIFE', 'BEACH', 'CULTURAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_type AS ENUM ('PACKAGE', 'HOTEL', 'VEHICLE', 'TICKET');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enquiry_status AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_type_enum AS ENUM ('SEDAN', 'SUV', 'TEMPO_TRAVELLER', 'BUS', 'LUXURY', 'BIKE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_type_enum AS ENUM ('BUS', 'TRAIN', 'FLIGHT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('CONFIRMED', 'CANCELLED', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'PARTIAL', 'FULL', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(100)  NOT NULL,
    email               VARCHAR(150)  UNIQUE,
    phone               VARCHAR(20)   UNIQUE,
    password_hash       VARCHAR(255),
    role                user_role     NOT NULL DEFAULT 'USER',
    provider            VARCHAR(30),
    oauth_id            VARCHAR(200),
    profile_image_url   TEXT,
    is_active           BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email  ON users (email);
CREATE INDEX idx_users_phone  ON users (phone);
CREATE INDEX idx_users_role   ON users (role);

-- ============================================================
-- TABLE: refresh_tokens
-- ============================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(500) NOT NULL UNIQUE,
    expiry_date TIMESTAMPTZ  NOT NULL,
    CONSTRAINT uq_refresh_user UNIQUE (user_id)
);

CREATE INDEX idx_refresh_token_value ON refresh_tokens (token);

-- ============================================================
-- TABLE: otp_requests  (phone-based OTP login)
-- ============================================================
CREATE TABLE IF NOT EXISTS otp_requests (
    id          BIGSERIAL PRIMARY KEY,
    phone       VARCHAR(20)  NOT NULL,
    otp_code    VARCHAR(10)  NOT NULL,
    expiry      TIMESTAMPTZ  NOT NULL,
    verified    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otp_phone ON otp_requests (phone);

-- ============================================================
-- TABLE: tour_packages
-- ============================================================
CREATE TABLE IF NOT EXISTS tour_packages (
    id              BIGSERIAL         PRIMARY KEY,
    title           VARCHAR(200)      NOT NULL,
    description     TEXT              NOT NULL,
    price           NUMERIC(12, 2)    NOT NULL,
    duration_days   INT               NOT NULL,
    latitude        DOUBLE PRECISION  NOT NULL,
    longitude       DOUBLE PRECISION  NOT NULL,
    location        VARCHAR(200)      NOT NULL,
    category        package_category  NOT NULL,
    is_active       BOOLEAN           NOT NULL DEFAULT TRUE,
    created_by      BIGINT            REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_package_category  ON tour_packages (category);
CREATE INDEX idx_package_price     ON tour_packages (price);
CREATE INDEX idx_package_duration  ON tour_packages (duration_days);
CREATE INDEX idx_package_active    ON tour_packages (is_active);
CREATE INDEX idx_package_location  ON tour_packages USING GIN (to_tsvector('english', location || ' ' || title));

-- ============================================================
-- TABLE: package_images
-- ============================================================
CREATE TABLE IF NOT EXISTS package_images (
    id          BIGSERIAL PRIMARY KEY,
    package_id  BIGINT       NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
    image_url   TEXT         NOT NULL,
    is_primary  BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_pkg_images_pkg ON package_images (package_id);

-- ============================================================
-- TABLE: package_itineraries
-- ============================================================
CREATE TABLE IF NOT EXISTS package_itineraries (
    id          BIGSERIAL PRIMARY KEY,
    package_id  BIGINT       NOT NULL REFERENCES tour_packages(id) ON DELETE CASCADE,
    day_number  INT          NOT NULL,
    title       VARCHAR(200) NOT NULL,
    description TEXT         NOT NULL,
    CONSTRAINT uq_pkg_day UNIQUE (package_id, day_number)
);

CREATE INDEX idx_itinerary_pkg ON package_itineraries (package_id);

-- ============================================================
-- TABLE: vehicles
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id                BIGSERIAL         PRIMARY KEY,
    vehicle_type      vehicle_type_enum NOT NULL,
    name              VARCHAR(200)      NOT NULL,
    description       TEXT,
    price_per_day     NUMERIC(10, 2)    NOT NULL,
    seating_capacity  INT               NOT NULL,
    available         BOOLEAN           NOT NULL DEFAULT TRUE,
    image_url         TEXT,
    created_at        TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_type      ON vehicles (vehicle_type);
CREATE INDEX idx_vehicle_available ON vehicles (available);

-- ============================================================
-- TABLE: hotels
-- ============================================================
CREATE TABLE IF NOT EXISTS hotels (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(200)    NOT NULL,
    location        VARCHAR(200)    NOT NULL,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    price_per_night NUMERIC(10, 2)  NOT NULL,
    description     TEXT,
    image_url       TEXT,
    star_rating     INT             CHECK (star_rating BETWEEN 1 AND 5),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hotel_location ON hotels (location);
CREATE INDEX idx_hotel_price    ON hotels (price_per_night);

-- ============================================================
-- TABLE: hotel_amenities
-- ============================================================
CREATE TABLE IF NOT EXISTS hotel_amenities (
    id        BIGSERIAL PRIMARY KEY,
    hotel_id  BIGINT        NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    amenity   VARCHAR(100)  NOT NULL
);

CREATE INDEX idx_hotel_amenity_hotel ON hotel_amenities (hotel_id);

-- ============================================================
-- TABLE: tickets
-- ============================================================
CREATE TABLE IF NOT EXISTS tickets (
    id           BIGSERIAL        PRIMARY KEY,
    type         ticket_type_enum NOT NULL,
    origin       VARCHAR(200)     NOT NULL,
    destination  VARCHAR(200)     NOT NULL,
    description  TEXT,
    created_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: enquiries
-- ============================================================
CREATE TABLE IF NOT EXISTS enquiries (
    id            BIGSERIAL       PRIMARY KEY,
    user_id       BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    package_id    BIGINT          REFERENCES tour_packages(id) ON DELETE SET NULL,
    service_type  service_type    NOT NULL,
    message       TEXT            NOT NULL,
    status        enquiry_status  NOT NULL DEFAULT 'PENDING',
    admin_notes   TEXT,
    created_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    resolved_at   TIMESTAMPTZ
);

CREATE INDEX idx_enquiry_user         ON enquiries (user_id);
CREATE INDEX idx_enquiry_status       ON enquiries (status);
CREATE INDEX idx_enquiry_service_type ON enquiries (service_type);
CREATE INDEX idx_enquiry_created_at   ON enquiries (created_at DESC);

-- ============================================================
-- Auto-update updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_packages_updated_at
    BEFORE UPDATE ON tour_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_hotels_updated_at
    BEFORE UPDATE ON hotels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- CRM & BOOKING EXPANSION
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT          REFERENCES users(id) ON DELETE SET NULL,
    package_id          BIGINT          REFERENCES tour_packages(id) ON DELETE SET NULL,
    vehicle_id          BIGINT          REFERENCES vehicles(id) ON DELETE SET NULL,
    hotel_id            BIGINT          REFERENCES hotels(id) ON DELETE SET NULL,
    customer_name       VARCHAR(100)    NOT NULL,
    customer_email      VARCHAR(150),
    customer_phone      VARCHAR(20)     NOT NULL,
    start_date          DATE            NOT NULL,
    end_date            DATE            NOT NULL,
    total_amount        NUMERIC(12, 2)  NOT NULL,
    advance_paid        NUMERIC(12, 2)  NOT NULL DEFAULT 0,
    payment_status      payment_status  NOT NULL DEFAULT 'PENDING',
    booking_status      booking_status  NOT NULL DEFAULT 'CONFIRMED',
    notes               TEXT,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_dates    ON bookings (start_date, end_date);
CREATE INDEX idx_booking_customer ON bookings (customer_phone);
CREATE INDEX idx_booking_status   ON bookings (booking_status);

CREATE TRIGGER trg_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
