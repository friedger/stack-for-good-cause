-- Add tx_id column to user_project_mapping for rollback functionality
ALTER TABLE user_project_mapping ADD COLUMN tx_id character varying(66) NOT NULL DEFAULT '';

-- Create index for better performance on tx_id lookups
CREATE INDEX IF NOT EXISTS idx_user_project_mapping_tx_id ON user_project_mapping(tx_id);

-- Drop and recreate the function to filter by latest tx_id
DROP FUNCTION IF EXISTS get_latest_user_project_mappings();

CREATE OR REPLACE FUNCTION get_latest_user_project_mappings()
RETURNS TABLE (
    user_data_id uuid,
    project_id uuid,
    ratio numeric,
    currency text,
    block_height integer,
    tx_index integer,
    tx_id character varying
) AS $$
BEGIN
    RETURN QUERY
    WITH latest_user_data AS (
        SELECT 
            ud.id as user_data_id,
            ud.stx_address,
            ud.block_height,
            ud.tx_index,
            ud.tx_id,
            ROW_NUMBER() OVER (
                PARTITION BY ud.stx_address 
                ORDER BY ud.block_height DESC, ud.tx_index DESC
            ) as rn
        FROM user_data ud
    ),
    latest_mappings AS (
        SELECT 
            upm.user_data_id,
            upm.project_id,
            upm.ratio,
            upm.currency::text,
            lud.block_height,
            lud.tx_index,
            lud.tx_id
        FROM user_project_mapping upm
        JOIN latest_user_data lud ON upm.user_data_id = lud.user_data_id
        WHERE lud.rn = 1 AND upm.tx_id = lud.tx_id
    )
    SELECT 
        lm.user_data_id,
        lm.project_id,
        lm.ratio,
        lm.currency,
        lm.block_height,
        lm.tx_index,
        lm.tx_id
    FROM latest_mappings lm;
END;
$$ LANGUAGE plpgsql;