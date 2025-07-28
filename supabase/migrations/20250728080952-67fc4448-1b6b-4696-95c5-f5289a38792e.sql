-- Change ratio column to integer for promille values (0-1000) with no decimals
ALTER TABLE user_project_mapping ALTER COLUMN ratio TYPE integer;