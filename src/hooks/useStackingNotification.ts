import { cartService } from "@/services/cartService";
import { stackingStatsService } from "@/services/stackingStatsService";
import { useEffect, useState } from "react";

export const useStackingNotification = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [isStacking, setIsStacking] = useState(false);

  useEffect(() => {
    const updateNotification = () => {
      // Get cart projects count
      const cartProjects = cartService.getCartProjects();

      // Count includes Fast Pool + cart projects
      let count = cartProjects.length;

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
    showNotification: projectCount > 0 || isStacking,
  };
};
