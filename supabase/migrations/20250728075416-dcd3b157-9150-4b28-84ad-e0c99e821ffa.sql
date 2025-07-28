-- Alter user_data table to increase tx_id column length to accommodate full transaction IDs
ALTER TABLE user_data ALTER COLUMN tx_id TYPE character varying(66);