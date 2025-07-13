-- Supabase SQL schema for pool_members table
-- Run this in your Supabase SQL editor to create the table

CREATE TABLE IF NOT EXISTS pool_members (
  id SERIAL PRIMARY KEY,
  pool_member_id VARCHAR(255) UNIQUE NOT NULL,
  currency VARCHAR(4) NOT NULL,
  p_entries TEXT[] NOT NULL DEFAULT '{}',
  r_entries INTEGER[] NOT NULL DEFAULT '{}',
  v_value INTEGER NOT NULL,
  tx_id VARCHAR(32) NOT NULL,
  block_height INTEGER NOT NULL,
  tx_index INTEGER NOT NULL,
  event_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pool_members_pool_member_id ON pool_members(pool_member_id);
CREATE INDEX IF NOT EXISTS idx_pool_members_tx_id ON pool_members(tx_id);
CREATE INDEX IF NOT EXISTS idx_pool_members_currency ON pool_members(currency);
CREATE INDEX IF NOT EXISTS idx_pool_members_block_height ON pool_members(block_height);
CREATE INDEX IF NOT EXISTS idx_pool_members_tx_index ON pool_members(tx_index);

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pool_members_updated_at 
  BEFORE UPDATE ON pool_members 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to check if new data is newer than existing data
CREATE OR REPLACE FUNCTION check_newer_pool_member_data()
RETURNS TRIGGER AS $$
DECLARE
  existing_record RECORD;
BEGIN
  -- Only check for updates, not inserts
  IF TG_OP = 'UPDATE' THEN
    -- Get the existing record
    SELECT block_height, tx_index, event_index 
    INTO existing_record
    FROM pool_members 
    WHERE pool_member_id = NEW.pool_member_id 
    AND id != NEW.id;
    
    -- If no existing record found, allow the update
    IF existing_record IS NULL THEN
      RETURN NEW;
    END IF;
    
    -- Check if new data is newer based on hierarchy: block_height > tx_index > event_index
    IF NEW.block_height > existing_record.block_height THEN
      RETURN NEW;
    ELSIF NEW.block_height = existing_record.block_height THEN
      IF NEW.tx_index > existing_record.tx_index THEN
        RETURN NEW;
      ELSIF NEW.tx_index = existing_record.tx_index THEN
        IF NEW.event_index > existing_record.event_index THEN
          RETURN NEW;
        ELSE
          -- New data is not newer, reject the update
          RAISE EXCEPTION 'Cannot update pool member: new data is not newer than existing data (block_height: % <= %, tx_index: % <= %, event_index: % <= %)', 
            NEW.block_height, existing_record.block_height,
            NEW.tx_index, existing_record.tx_index,
            NEW.event_index, existing_record.event_index;
        END IF;
      ELSE
        -- New data has lower tx_index, reject the update
        RAISE EXCEPTION 'Cannot update pool member: new tx_index % is not higher than existing tx_index % for same block_height %', 
          NEW.tx_index, existing_record.tx_index, NEW.block_height;
      END IF;
    ELSE
      -- New data has lower block_height, reject the update
      RAISE EXCEPTION 'Cannot update pool member: new block_height % is not higher than existing block_height %', 
        NEW.block_height, existing_record.block_height;
    END IF;
  END IF;
  
  -- For inserts, always allow
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger for the constraint
CREATE TRIGGER check_newer_pool_member_data_trigger
  BEFORE UPDATE ON pool_members
  FOR EACH ROW
  EXECUTE FUNCTION check_newer_pool_member_data();

-- Add comments for documentation
COMMENT ON TABLE pool_members IS 'Stores multi-pool member data from Stacks blockchain';
COMMENT ON COLUMN pool_members.pool_member_id IS 'Unique identifier combining tx_id and event_index';
COMMENT ON COLUMN pool_members.currency IS 'Currency from payload.c';
COMMENT ON COLUMN pool_members.p_entries IS 'First 5 entries from payload.p';
COMMENT ON COLUMN pool_members.r_entries IS 'First 5 entries from payload.r';
COMMENT ON COLUMN pool_members.v_value IS 'Value from payload.v';
COMMENT ON COLUMN pool_members.block_height IS 'Block height where the transaction was included';
COMMENT ON COLUMN pool_members.tx_index IS 'Transaction index within the block';
