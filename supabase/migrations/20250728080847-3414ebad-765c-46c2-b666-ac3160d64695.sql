-- Fix ratio column precision to accommodate promille values (0-1000)
-- Current precision 10,8 only allows values up to 99.99999999
-- Changing to precision 10,2 to allow values up to 99999999.99 (sufficient for promille)
ALTER TABLE user_project_mapping ALTER COLUMN ratio TYPE numeric(10,2);