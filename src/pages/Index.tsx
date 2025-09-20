import Navbar from "@/components/ui/navbar";
import HeroSection from "@/components/ui/hero-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ui/project-card";
import { 
  TrendingUp, 
  Users, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Featured projects data
  const featuredProjects = [
    {
      id: "1",
      title: "Smart City Infrastructure Development",
      description: "Comprehensive urban development project including smart traffic systems, IoT sensors, and sustainable energy solutions.",
      status: "active" as const,
      location: "San Francisco, CA",
      budget: "$125M",
      agency: "Department of Urban Development",
      startDate: "Jan 2024",
      esgScore: 87,
      completion: 45,
    },
    {
      id: "2",
      title: "Renewable Energy Grid Modernization",
      description: "Upgrading power grid infrastructure to support renewable energy sources and improve efficiency.",
      status: "active" as const,
      location: "Austin, TX",
      budget: "$89M",
      agency: "State Energy Commission",
      startDate: "Mar 2024",
      esgScore: 94,
      completion: 32,
    },
    {
      id: "4",
      title: "Water Management System Upgrade",
      description: "Modernizing water treatment facilities and distribution networks to ensure sustainable water supply.",
      status: "completed" as const,
      location: "Phoenix, AZ",
      budget: "$156M",
      agency: "Water Resources Department",
      startDate: "Sep 2023",
      esgScore: 91,
      completion: 100,
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Enhanced Transparency",
      description: "Complete visibility into government project progress, funding, and outcomes."
    },
    {
      icon: TrendingUp,
      title: "Real-time Monitoring",
      description: "Live updates on project milestones, budget utilization, and performance metrics."
    },
    {
      icon: Users,
      title: "Multi-stakeholder Access",
      description: "Tailored interfaces for citizens, government officials, and agency personnel."
    },
    {
      icon: Zap,
      title: "Smart Analytics",
      description: "AI-powered insights and predictive analytics for better decision making."
    },
    {
      icon: Globe,
      title: "ESG Compliance",
      description: "Comprehensive Environmental, Social, and Governance tracking and reporting."
    },
    {
      icon: CheckCircle,
      title: "Verification System",
      description: "Multi-level verification process ensuring accuracy and accountability."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Projects Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Featured Projects
            </Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Active Government Initiatives
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the latest public projects making a difference in communities across the nation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/projects">
                <Eye className="w-5 h-5 mr-2" />
                View All Projects
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose ProjectWatch?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for transparency, accountability, and efficient public project management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="hover-lift text-center border-border shadow-soft">
                  <CardHeader>
                    <div className="w-12 h-12 accent-gradient rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Public Project Management?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of government officials, agencies, and citizens using ProjectWatch 
            to ensure transparency and accountability in public initiatives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link to="/dashboard">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/projects">
                Explore Projects
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 accent-gradient rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="text-lg font-bold text-primary">ProjectWatch</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Ensuring transparency and accountability in government projects worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/projects" className="hover:text-foreground transition-smooth">Projects</Link></li>
                <li><Link to="/dashboard" className="hover:text-foreground transition-smooth">Dashboard</Link></li>
                <li><Link to="/map" className="hover:text-foreground transition-smooth">Interactive Map</Link></li>
                <li><Link to="/analytics" className="hover:text-foreground transition-smooth">Analytics</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Training</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-smooth">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-smooth">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 ProjectWatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
