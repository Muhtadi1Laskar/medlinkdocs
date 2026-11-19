-- migrate:up
CREATE TABLE IF NOT EXISTS report (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL
        REFERENCES users(user_id) ON DELETE CASCADE,

    -- Report information
    title VARCHAR(225) NOT NULL,
    test_type VARCHAR(225) NOT NULL,
    test_date DATE NOT NULL,

    -- Additional information
    reason_for_test TEXT NOT NULL,
    doctor_name VARCHAR(225) NOT NULL,
    doctor_findings TEXT NOT NULL,
    diagnostic_center_name VARCHAR(255) NOT NULL,

    follow_up_status VARCHAR(30) NOT NULL DEFAULT 'unknown'
        CHECK (
            follow_up_status IN (
                'unknown',
                'ongoing',
                'resolved',
                'not_required'
            )
        ),

    -- File storage information
    storage_key TEXT NOT NULL,
    storage_provider VARCHAR(50) NOT NULL,
    original_filename VARCHAR(50) NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    file_size BIGINT not NULL CHECK (file_size > 0),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    
    UNIQUE (storage_provider, storage_key),

    UNIQUE (user_id, report_id)
);

-- migrate:down