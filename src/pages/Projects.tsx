import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  Grid,
  List,
  ArrowUpDown
} from "lucide-react";
import ProjectCard from "@/components/ui/project-card";
import Navbar from "@/components/ui/navbar";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock project data
  const projects = [
    {
      id: "1",
      title: "Smart City Infrastructure Development",
      description: "Comprehensive urban development project including smart traffic systems, IoT sensors, and sustainable energy solutions across metropolitan areas.",
      status: "active" as const,
      location: "San Francisco, CA",
      budget: "$125M",
      agency: "Department of Urban Development",
      startDate: "Jan 2024",
      esgScore: 87,
      completion: 45,
      image: "/api/placeholder/400/200"
    },
    {
      id: "2",
      title: "Renewable Energy Grid Modernization",
      description: "Upgrading power grid infrastructure to support renewable energy sources and improve efficiency across the state network.",
      status: "active" as const,
      location: "Austin, TX",
      budget: "$89M",
      agency: "State Energy Commission",
      startDate: "Mar 2024",
      esgScore: 94,
      completion: 32,
      image: "/api/placeholder/400/200"
    },
    {
      id: "3",
      title: "Public Transportation Expansion",
      description: "Expanding metro line coverage with new stations, eco-friendly buses, and integrated digital payment systems.",
      status: "pending" as const,
      location: "Seattle, WA",
      budget: "$67M",
      agency: "Metro Transit Authority",
      startDate: "May 2024",
      esgScore: 78,
      completion: 15,
      image: "/api/placeholder/400/200"
    },
    {
      id: "4",
      title: "Water Management System Upgrade",
      description: "Modernizing water treatment facilities and distribution networks to ensure sustainable water supply for growing population.",
      status: "completed" as const,
      location: "Phoenix, AZ",
      budget: "$156M",
      agency: "Water Resources Department",
      startDate: "Sep 2023",
      esgScore: 91,
      completion: 100,
      image: "/api/placeholder/400/200"
    },
    {
      id: "5",
      title: "Digital Government Services Platform",
      description: "Creating unified digital platform for citizen services, permit applications, and government interactions.",
      status: "delayed" as const,
      location: "Boston, MA",
      budget: "$43M",
      agency: "Digital Services Agency",
      startDate: "Nov 2023",
      esgScore: 65,
      completion: 28,
      image: "/api/placeholder/400/200"
    },
    {
      id: "6",
      title: "Affordable Housing Initiative",
      description: "Construction of sustainable, affordable housing units with integrated community services and green spaces.",
      status: "active" as const,
      location: "Denver, CO",
      budget: "$198M",
      agency: "Housing Development Authority",
      startDate: "Feb 2024",
      esgScore: 89,
      completion: 67,
      image: "/api/placeholder/400/200"
    }
  ];

  const statusFilters = [
    { value: "all", label: "All Projects", count: projects.length },
    { value: "active", label: "Active", count: projects.filter(p => p.status === "active").length },
    { value: "pending", label: "Pending", count: projects.filter(p => p.status === "pending").length },
    { value: "completed", label: "Completed", count: projects.filter(p => p.status === "completed").length },
    { value: "delayed", label: "Delayed", count: projects.filter(p => p.status === "delayed").length },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.agency.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Government Projects
          </h1>
          <p className="text-muted-foreground">
            Monitor and track public projects across all government agencies
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-lg border shadow-soft p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects, agencies, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Toggle and Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <Button variant="outline" size="sm">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Sort
              </Button>

              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  selectedStatus === filter.value
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{filter.label}</span>
                <Badge variant="secondary" className="ml-1">
                  {filter.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        {/* Projects Grid */}
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No projects found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;