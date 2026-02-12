-- Initial Schema for PhotoQuest

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: Quests (AI generated quest templates)
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  transport_mode TEXT NOT NULL, -- 'walking' | 'public_transport'
  difficulty TEXT NOT NULL,     -- 'easy' | 'medium' | 'hard'
  genre TEXT NOT NULL,          -- 'history' | 'mystery' | 'kids'
  tasks JSONB NOT NULL,         -- Array of task objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Quest Attempts (Specific user instances)
CREATE TABLE IF NOT EXISTS quest_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  user_id UUID,                  -- Anonymous or Auth ID
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress' | 'completed' | 'abandoned'
  current_task_index INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Table: Photos (Uploaded evidence)
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES quest_attempts(id) ON DELETE CASCADE,
  task_index INTEGER NOT NULL,
  storage_path TEXT NOT NULL,    -- Path in Supabase Storage
  ai_verified BOOLEAN DEFAULT FALSE,
  ai_feedback TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Allow anonymous access for MVP)
CREATE POLICY "Allow anonymous read access on quests" ON quests FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on quests" ON quests FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous access on quest_attempts" ON quest_attempts FOR ALL USING (true);
CREATE POLICY "Allow anonymous access on photos" ON photos FOR ALL USING (true);
