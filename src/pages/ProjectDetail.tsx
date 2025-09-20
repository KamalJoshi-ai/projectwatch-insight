import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/ui/navbar";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Leaf,
  Clock,
  FileText,
  Camera,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const ProjectDetail = () => {
  const { id } = useParams();

  // Mock project detail data
  const project = {
    id: "1",
    title: "Smart City Infrastructure Development",
    description: "Comprehensive urban development project including smart traffic systems, IoT sensors, and sustainable energy solutions across metropolitan areas. This initiative aims to transform the city into a model of sustainable urban living with integrated technology solutions.",
    status: "active",
    location: "San Francisco, CA",
    budget: "$125,000,000",
    agency: "Department of Urban Development",
    startDate: "January 15, 2024",
    endDate: "December 31, 2025",
    esgScore: 87,
    completion: 45,
    image: "/api/placeholder/800/400",
    projectManager: "Sarah Johnson",
    contractorName: "GreenTech Solutions Inc.",
    
    milestones: [
      { id: 1, title: "Project Planning & Design", status: "completed", date: "Jan 2024", progress: 100 },
      { id: 2, title: "Environmental Assessment", status: "completed", date: "Feb 2024", progress: 100 },
      { id: 3, title: "Infrastructure Development Phase 1", status: "active", date: "Mar 2024", progress: 75 },
      { id: 4, title: "IoT Sensor Network Installation", status: "pending", date: "Jun 2024", progress: 0 },
      { id: 5, title: "Smart Traffic System Deployment", status: "pending", date: "Sep 2024", progress: 0 },
      { id: 6, title: "Final Testing & Commissioning", status: "pending", date: "Nov 2024", progress: 0 },
    ],

    fundingBreakdown: [
      { category: "Infrastructure", amount: 75000000, percentage: 60 },
      { category: "Technology", amount: 25000000, percentage: 20 },
      { category: "Environmental", amount: 15000000, percentage: 12 },
      { category: "Contingency", amount: 10000000, percentage: 8 },
    ],

    recentDocuments: [
      { name: "Environmental Impact Report Q1", date: "Mar 15, 2024", type: "PDF" },
      { name: "Progress Photos - Week 12", date: "Mar 10, 2024", type: "Images" },
      { name: "Budget Amendment Request", date: "Mar 8, 2024", type: "Document" },
      { name: "Contractor Performance Review", date: "Mar 1, 2024", type: "Report" },
    ],

    esgMetrics: {
      environmental: 89,
      social: 85,
      governance: 87
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "status-active";
      case "pending": return "status-pending";
      case "completed": return "status-completed";
      case "delayed": return "status-delayed";
      default: return "status-pending";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Project Image */}
            <div className="lg:w-1/2">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden shadow-medium">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Project Info */}
            <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getStatusColor(project.status)}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Leaf className="w-4 h-4 text-success mr-1" />
                  <span>{project.esgScore}% ESG Score</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">
                {project.title}
              </h1>

              <p className="text-muted-foreground mb-6">
                {project.description}
              </p>

              {/* Key Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-info" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  <span>{project.agency}</span>
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-2 text-success" />
                  <span>{project.budget}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-warning" />
                  <span>{project.startDate} - {project.endDate}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm font-bold text-accent">{project.completion}%</span>
                </div>
                <Progress value={project.completion} className="h-3" />
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <Button className="accent-gradient">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documents
                </Button>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Photos
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="funding">Funding</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="esg">ESG Metrics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Project Details */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Project Manager</h4>
                      <p className="text-muted-foreground">{project.projectManager}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Primary Contractor</h4>
                      <p className="text-muted-foreground">{project.contractorName}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Project Scope</h4>
                      <p className="text-muted-foreground">
                        This project encompasses the development of smart city infrastructure 
                        including IoT sensor networks, traffic management systems, and sustainable 
                        energy solutions to create a more efficient and environmentally friendly 
                        urban environment.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Key Metrics */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Budget Utilized</span>
                      <span className="font-medium">{project.completion}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Timeline Progress</span>
                      <span className="font-medium">On Track</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ESG Rating</span>
                      <span className="font-medium text-success">{project.esgScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Milestones Complete</span>
                      <span className="font-medium">2 of 6</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        {milestone.status === "completed" && (
                          <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-success-foreground" />
                          </div>
                        )}
                        {milestone.status === "active" && (
                          <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-accent-foreground" />
                          </div>
                        )}
                        {milestone.status === "pending" && (
                          <div className="w-6 h-6 bg-muted border-2 border-border rounded-full" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{milestone.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {milestone.date}
                          </Badge>
                        </div>
                        {milestone.status !== "pending" && (
                          <div className="mt-2">
                            <Progress value={milestone.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would be implemented similarly */}
          <TabsContent value="funding">
            <Card>
              <CardHeader>
                <CardTitle>Funding Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.fundingBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-sm text-muted-foreground">
                            ${(item.amount / 1000000).toFixed(1)}M ({item.percentage}%)
                          </span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Recent Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.recentDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-smooth">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.date} • {doc.type}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="esg">
            <Card>
              <CardHeader>
                <CardTitle>ESG Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Environmental</span>
                      <span className="text-sm font-bold text-success">{project.esgMetrics.environmental}%</span>
                    </div>
                    <Progress value={project.esgMetrics.environmental} className="h-3" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Social</span>
                      <span className="text-sm font-bold text-info">{project.esgMetrics.social}%</span>
                    </div>
                    <Progress value={project.esgMetrics.social} className="h-3" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Governance</span>
                      <span className="text-sm font-bold text-accent">{project.esgMetrics.governance}%</span>
                    </div>
                    <Progress value={project.esgMetrics.governance} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProjectDetail;
