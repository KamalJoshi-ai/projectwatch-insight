import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  ArrowRight,
  Leaf,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    status: "active" | "pending" | "completed" | "delayed";
    location: string;
    budget: string;
    agency: string;
    startDate: string;
    esgScore: number;
    completion: number;
    image?: string;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "status-active";
      case "pending":
        return "status-pending";
      case "completed":
        return "status-completed";
      case "delayed":
        return "status-delayed";
      default:
        return "status-pending";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      case "delayed":
        return "Delayed";
      default:
        return "Unknown";
    }
  };

  return (
    <Card className="hover-lift card-gradient border border-border shadow-soft group">
      <CardHeader className="pb-3">
        {/* Project Image */}
        {project.image && (
          <div className="w-full h-48 bg-muted rounded-lg mb-4 overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover transition-smooth group-hover:scale-105"
            />
          </div>
        )}

        {/* Status and ESG Score */}
        <div className="flex items-center justify-between mb-3">
          <Badge className={cn("border", getStatusColor(project.status))}>
            {getStatusText(project.status)}
          </Badge>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Leaf className="w-4 h-4 text-success" />
            <span className="font-medium">{project.esgScore}% ESG</span>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {project.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Project Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 text-info" />
            <span>{project.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2 text-primary" />
            <span>{project.agency}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="w-4 h-4 mr-2 text-success" />
            <span className="font-medium">{project.budget}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2 text-warning" />
            <span>Started {project.startDate}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{project.completion}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="h-2 rounded-full accent-gradient transition-all duration-500"
              style={{ width: `${project.completion}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button asChild variant="ghost" className="w-full group/btn">
          <Link to={`/project/${project.id}`}>
            View Details
            <ArrowRight className="w-4 h-4 ml-2 transition-smooth group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;