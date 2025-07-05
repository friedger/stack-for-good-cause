
import { useState, useEffect } from "react";
import { cartService } from "@/services/cartService";
import { projectService } from "@/services/projectService";
import { stackingStatsService } from "@/services/stackingStatsService";

export const useStackingNotification = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [isStacking, setIsStacking] = useState(false);

  useEffect(() => {
    const updateNotification = () => {
      // Get cart projects count
      const cartProjects = cartService.getCartProjects();
      const fastPoolProject = projectService.getAllProjects().find(p => p.name === "Fast Pool");
      
      // Count includes Fast Pool + cart projects
      let count = cartProjects.length;
      if (fastPoolProject) {
        count += 1;
      }
      
      setProjectCount(count);
      setIsStacking(stackingStatsService.isCurrentlyStacking());
    };

    // Initial update
    updateNotification();

    // Check periodically for changes
    const interval = setInterval(updateNotification, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    projectCount,
    isStacking,
    showNotification: projectCount > 0 || isStacking
  };
};
