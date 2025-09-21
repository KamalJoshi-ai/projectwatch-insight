import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          agencies (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match existing format
      const transformedProjects = data?.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status === 'ongoing' ? 'active' : project.status,
        location: project.location,
        budget: `₹${(project.budget / 10000000).toFixed(0)} Cr`,
        agency: project.agencies?.name || 'Unknown Agency',
        startDate: project.start_date ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'TBD',
        esgScore: project.esg_score,
        completion: project.completion_percentage,
        image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=500&h=300&fit=crop&auto=format`
      })) || [];

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

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