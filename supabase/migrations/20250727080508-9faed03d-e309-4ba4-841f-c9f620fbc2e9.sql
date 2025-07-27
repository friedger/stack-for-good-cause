-- Add UNIQUE constraint to tx_id in user_data table
ALTER TABLE user_data ADD CONSTRAINT unique_user_data_tx_id UNIQUE (tx_id);