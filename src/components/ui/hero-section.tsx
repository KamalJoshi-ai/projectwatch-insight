import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Shield, 
  TrendingUp, 
  Users, 
  DollarSign,
  CheckCircle,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const stats = [
    { label: "Active Projects", value: "1,247", icon: Shield, color: "text-info" },
    { label: "Funds Tracked", value: "$2.8B", icon: DollarSign, color: "text-success" },
    { label: "Government Agencies", value: "156", icon: Users, color: "text-accent" },
    { label: "Transparency Score", value: "94%", icon: TrendingUp, color: "text-warning" },
  ];

  const features = [
    "Real-time project monitoring",
    "Transparent fund tracking",
    "Multi-level verification",
    "ESG impact measurement",
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-transparent to-accent/20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Trusted by 156 Government Agencies
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Government 
              <span className="text-accent"> Transparency</span>
              <br />Made Simple
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Monitor public projects, track government spending, and ensure accountability 
              with our comprehensive platform designed for citizens, agencies, and officials.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center text-white/90">
                  <CheckCircle className="w-5 h-5 text-accent mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-large">
                <Link to="/projects">
                  <Eye className="w-5 h-5 mr-2" />
                  View Projects
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Link to="/dashboard">
                  Get Started Free
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover-lift bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg bg-white/10 ${stat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/70">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto text-background"
        >
          <path 
            d="M0,0 C480,100 960,100 1440,0 L1440,120 L0,120 Z" 
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;