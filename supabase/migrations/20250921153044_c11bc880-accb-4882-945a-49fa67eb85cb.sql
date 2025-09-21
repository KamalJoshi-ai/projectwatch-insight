-- Create enums
CREATE TYPE public.project_status AS ENUM ('pending', 'ongoing', 'completed', 'delayed');
CREATE TYPE public.milestone_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE public.fund_status AS ENUM ('allocated', 'released', 'utilized');
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.user_role AS ENUM ('government_officer', 'agency', 'citizen');

-- Create agencies table
CREATE TABLE public.agencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  reputation_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  agency_id UUID REFERENCES public.agencies(id),
  budget NUMERIC,
  status public.project_status DEFAULT 'pending',
  location TEXT,
  start_date DATE,
  end_date DATE,
  esg_score INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create milestones table
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status public.milestone_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proofs table
CREATE TABLE public.proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  milestone_id UUID REFERENCES public.milestones(id) ON DELETE CASCADE,
  uploader UUID REFERENCES auth.users(id),
  file_url TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create funds_ledger table
CREATE TABLE public.funds_ledger (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES public.milestones(id),
  amount NUMERIC NOT NULL,
  status public.fund_status DEFAULT 'allocated',
  tx_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  severity public.alert_severity DEFAULT 'low',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'citizen',
  UNIQUE(user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  agency_id UUID REFERENCES public.agencies(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funds_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- RLS Policies
-- Agencies policies
CREATE POLICY "Agencies are viewable by everyone" ON public.agencies FOR SELECT USING (true);
CREATE POLICY "Government officers can manage agencies" ON public.agencies FOR ALL USING (public.has_role(auth.uid(), 'government_officer'));

-- Projects policies
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Government officers can manage projects" ON public.projects FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'government_officer'));
CREATE POLICY "Government officers can update projects" ON public.projects FOR UPDATE USING (public.has_role(auth.uid(), 'government_officer'));
CREATE POLICY "Agencies can update their projects" ON public.projects FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.agency_id = agency_id
  )
);

-- Milestones policies
CREATE POLICY "Milestones are viewable by everyone" ON public.milestones FOR SELECT USING (true);
CREATE POLICY "Government officers can manage milestones" ON public.milestones FOR ALL USING (public.has_role(auth.uid(), 'government_officer'));
CREATE POLICY "Agencies can manage milestones for their projects" ON public.milestones FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.projects pr 
    JOIN public.profiles p ON p.agency_id = pr.agency_id
    WHERE pr.id = project_id AND p.user_id = auth.uid()
  )
);

-- Proofs policies
CREATE POLICY "Proofs are viewable by everyone" ON public.proofs FOR SELECT USING (true);
CREATE POLICY "Users can upload proofs" ON public.proofs FOR INSERT WITH CHECK (auth.uid() = uploader);
CREATE POLICY "Users can update their own proofs" ON public.proofs FOR UPDATE USING (auth.uid() = uploader);

-- Funds ledger policies
CREATE POLICY "Funds ledger is viewable by everyone" ON public.funds_ledger FOR SELECT USING (true);
CREATE POLICY "Government officers can manage funds" ON public.funds_ledger FOR ALL USING (public.has_role(auth.uid(), 'government_officer'));

-- Alerts policies
CREATE POLICY "Users can view alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Government officers can manage alerts" ON public.alerts FOR ALL USING (public.has_role(auth.uid(), 'government_officer'));

-- User roles policies
CREATE POLICY "Users can view all roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Government officers can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'government_officer'));

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('proof-documents', 'proof-documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for proof documents
CREATE POLICY "Users can upload proof documents" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'proof-documents' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users can view proof documents" ON storage.objects FOR SELECT USING (
  bucket_id = 'proof-documents'
);

-- Storage policies for project images
CREATE POLICY "Project images are viewable by everyone" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Government officers can upload project images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'project-images' AND public.has_role(auth.uid(), 'government_officer')
);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON public.agencies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email));
  
  -- Assign default citizen role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'citizen');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.agencies (name, reputation_score) VALUES
  ('Delhi Development Authority', 85),
  ('Mumbai Metropolitan Region Development Authority', 92),
  ('Bangalore Development Authority', 78),
  ('National Highways Authority of India', 88);

INSERT INTO public.projects (title, description, agency_id, budget, status, location, start_date, end_date, esg_score, completion_percentage) VALUES
  ('Metro Line Extension Phase 3', 'Extension of metro line from Connaught Place to Dwarka with 8 new stations', (SELECT id FROM public.agencies WHERE name = 'Delhi Development Authority'), 15000000000, 'ongoing', 'New Delhi', '2023-01-15', '2025-12-31', 78, 45),
  ('Coastal Road Project', 'Construction of 29.2 km coastal road connecting South Mumbai to Kandivali', (SELECT id FROM public.agencies WHERE name = 'Mumbai Metropolitan Region Development Authority'), 12000000000, 'ongoing', 'Mumbai', '2022-06-01', '2024-08-31', 82, 67),
  ('Electronic City Flyover', 'Construction of 3.5 km flyover to reduce traffic congestion in Electronic City', (SELECT id FROM public.agencies WHERE name = 'Bangalore Development Authority'), 2500000000, 'completed', 'Bangalore', '2022-03-01', '2023-11-30', 71, 100),
  ('Delhi-Mumbai Expressway', 'Construction of 1,386 km access-controlled expressway', (SELECT id FROM public.agencies WHERE name = 'National Highways Authority of India'), 98000000000, 'ongoing', 'Multi-state', '2019-02-28', '2025-03-31', 85, 78);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;