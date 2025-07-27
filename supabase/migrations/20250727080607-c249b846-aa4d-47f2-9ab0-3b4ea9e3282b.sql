-- Create enum for currency types
CREATE TYPE public.currency_type AS ENUM ('stx', 'sbtc');

-- Create user_data table
CREATE TABLE public.user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stx_address VARCHAR(255) NOT NULL,
  block_height INTEGER NOT NULL,
  tx_id VARCHAR(64) NOT NULL,
  tx_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique combination of transaction details
  UNIQUE(tx_id, tx_index)
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_stx_address VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_project_mapping table (many-to-many)
CREATE TABLE public.user_project_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_data_id UUID NOT NULL REFERENCES public.user_data(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  ratio DECIMAL(10,8) NOT NULL CHECK (ratio >= 0 AND ratio <= 1),
  currency public.currency_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique mapping per user_data and project
  UNIQUE(user_data_id, project_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_data_stx_address ON public.user_data(stx_address);
CREATE INDEX idx_user_data_block_height ON public.user_data(block_height);
CREATE INDEX idx_user_data_tx_id ON public.user_data(tx_id);
CREATE INDEX idx_projects_stx_address ON public.projects(project_stx_address);
CREATE INDEX idx_user_project_mapping_user_data_id ON public.user_project_mapping(user_data_id);
CREATE INDEX idx_user_project_mapping_project_id ON public.user_project_mapping(project_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_data_updated_at
  BEFORE UPDATE ON public.user_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_project_mapping_updated_at
  BEFORE UPDATE ON public.user_project_mapping
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (RLS) - tables will be public for webhook access
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_project_mapping ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (webhook needs to read/write)
CREATE POLICY "Public read access for user_data" ON public.user_data FOR SELECT USING (true);
CREATE POLICY "Public write access for user_data" ON public.user_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for user_data" ON public.user_data FOR UPDATE USING (true);

CREATE POLICY "Public read access for projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public write access for projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for projects" ON public.projects FOR UPDATE USING (true);

CREATE POLICY "Public read access for user_project_mapping" ON public.user_project_mapping FOR SELECT USING (true);
CREATE POLICY "Public write access for user_project_mapping" ON public.user_project_mapping FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for user_project_mapping" ON public.user_project_mapping FOR UPDATE USING (true);

-- Add comments for documentation
COMMENT ON TABLE public.user_data IS 'Stores user stacking transaction data';
COMMENT ON TABLE public.projects IS 'Stores project STX addresses';
COMMENT ON TABLE public.user_project_mapping IS 'Many-to-many mapping between users and projects with ratio distribution';
COMMENT ON COLUMN public.user_project_mapping.ratio IS 'Ratio of funds allocated to this project (0.0 to 1.0)';
COMMENT ON COLUMN public.user_project_mapping.currency IS 'Currency type: stx or sbtc';