-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 50),
  avatar_url TEXT,
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notification_settings JSONB DEFAULT '{"all": true, "friend_requests": true, "status_updates": false}',
  privacy_settings JSONB DEFAULT '{"show_last_seen": true, "show_status_history": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Friendships table
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, approver_id),
  CHECK (requester_id != approver_id)
);

-- Statuses table
CREATE TABLE statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('studying', 'working', 'eating', 'free', 'offline')),
  emoji TEXT,
  location TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- Status history table
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  emoji TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('friend_request', 'status_update', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_friendships_requester ON friendships(requester_id);
CREATE INDEX idx_friendships_approver ON friendships(approver_id);
CREATE INDEX idx_friendships_status ON friendships(status);
CREATE INDEX idx_statuses_user_id ON statuses(user_id);
CREATE INDEX idx_status_history_user_id ON status_history(user_id);
CREATE INDEX idx_status_history_created_at ON status_history(created_at);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view friends' profiles" ON users
  FOR SELECT USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM friendships 
      WHERE status = 'approved' 
      AND ((requester_id = auth.uid() AND approver_id = users.id) 
           OR (approver_id = auth.uid() AND requester_id = users.id))
    )
  );

-- Friendships policies
CREATE POLICY "Users can view their friendships" ON friendships
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = approver_id);

CREATE POLICY "Users can create friend requests" ON friendships
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their received requests" ON friendships
  FOR UPDATE USING (auth.uid() = approver_id);

-- Statuses policies
CREATE POLICY "Users can view friends' statuses" ON statuses
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM friendships 
      WHERE status = 'approved' 
      AND ((requester_id = auth.uid() AND approver_id = statuses.user_id) 
           OR (approver_id = auth.uid() AND requester_id = statuses.user_id))
    )
  );

CREATE POLICY "Users can manage their own status" ON statuses
  FOR ALL USING (auth.uid() = user_id);

-- Status history policies
CREATE POLICY "Users can view friends' status history" ON status_history
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM friendships 
      WHERE status = 'approved' 
      AND ((requester_id = auth.uid() AND approver_id = status_history.user_id) 
           OR (approver_id = auth.uid() AND requester_id = status_history.user_id))
    )
  );

CREATE POLICY "Users can insert their own status history" ON status_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE USING (auth.uid() = recipient_id);

CREATE POLICY "Users can create notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = sender_id OR sender_id IS NULL);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON friendships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically add status history when status is updated
CREATE OR REPLACE FUNCTION add_status_to_history()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO status_history (user_id, status, emoji, location)
    VALUES (NEW.user_id, NEW.status, NEW.emoji, NEW.location);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER add_status_history AFTER INSERT OR UPDATE ON statuses
    FOR EACH ROW EXECUTE FUNCTION add_status_to_history();