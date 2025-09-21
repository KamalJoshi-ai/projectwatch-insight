import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  FileText, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Plus,
  Upload,
  Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';

interface DashboardStats {
  totalProjects: number;
  totalFunds: number;
  pendingVerifications: number;
  myProofs: number;
}

const Dashboard = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalFunds: 0,
    pendingVerifications: 0,
    myProofs: 0
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchDashboardData();
  }, [user, navigate, userRole]);

  const fetchDashboardData = async () => {
    try {
      // Fetch projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*, agencies(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentProjects(projects || []);

      // Fetch stats based on role
      if (userRole === 'government_officer') {
        // Fetch pending verifications
        const { count: pendingCount } = await supabase
          .from('milestones')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        setStats(prev => ({ ...prev, pendingVerifications: pendingCount || 0 }));
      }

      if (userRole === 'citizen') {
        // Fetch user's proofs
        const { count: proofsCount } = await supabase
          .from('proofs')
          .select('*', { count: 'exact', head: true })
          .eq('uploader', user?.id);

        setStats(prev => ({ ...prev, myProofs: proofsCount || 0 }));
      }

      // Fetch total projects and funds
      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

      const { data: fundsData } = await supabase
        .from('funds_ledger')
        .select('amount');

      const totalFunds = fundsData?.reduce((sum, item) => sum + (Number(item.amount) || 0), 0) || 0;

      setStats(prev => ({
        ...prev,
        totalProjects: projectsCount || 0,
        totalFunds
      }));

      // Fetch recent alerts
      const { data: alertsData } = await supabase
        .from('alerts')
        .select('*, projects(title)')
        .order('created_at', { ascending: false })
        .limit(5);

      setAlerts(alertsData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'government_officer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'agency':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'citizen':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={getRoleColor(userRole || 'citizen')}>
              {userRole?.replace('_', ' ').toUpperCase()}
            </Badge>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funds</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalFunds)}</div>
            </CardContent>
          </Card>

          {userRole === 'government_officer' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
              </CardContent>
            </Card>
          )}

          {userRole === 'citizen' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Proofs</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.myProofs}</div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Role-based Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {userRole === 'government_officer' && (
              <TabsTrigger value="management">Management</TabsTrigger>
            )}
            {userRole === 'agency' && (
              <TabsTrigger value="projects">My Projects</TabsTrigger>
            )}
            {userRole === 'citizen' && (
              <TabsTrigger value="contributions">My Contributions</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>Latest government projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {project.agencies?.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            project.status === 'completed' ? 'default' :
                            project.status === 'ongoing' ? 'secondary' :
                            project.status === 'delayed' ? 'destructive' : 'outline'
                          }>
                            {project.status}
                          </Badge>
                          <Button asChild variant="ghost" size="sm">
                            <Link to={`/project/${project.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Latest project alerts and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3">
                        <AlertTriangle className={`h-4 w-4 mt-1 ${
                          alert.severity === 'high' ? 'text-red-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.projects?.title} • {new Date(alert.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {userRole === 'government_officer' && (
            <TabsContent value="management" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Create Project
                    </CardTitle>
                    <CardDescription>
                      Add a new government project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to="/projects/create">Create New Project</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Verify Milestones
                    </CardTitle>
                    <CardDescription>
                      Review and approve project milestones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/verification">Review Pending</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Fund Management
                    </CardTitle>
                    <CardDescription>
                      Monitor fund allocation and utilization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/funds/ledger">View Ledger</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;