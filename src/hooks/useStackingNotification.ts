import { cartService } from "@/services/cartService";
import { stackingStatsService } from "@/services/stackingStatsService";
import { useEffect, useState } from "react";

export const useStackingNotification = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [isStacking, setIsStacking] = useState(false);

  // Use event-driven updates instead of polling
  useEffect(() => {
    const updateNotification = () => {
      const cartProjects = cartService.getCartProjects();
      setProjectCount(cartProjects.length);
    };

    // Initial update
    updateNotification();

    // Listen to cart changes instead of polling
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart-projects") {
        updateNotification();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab updates
    const handleCartUpdate = () => updateNotification();
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  return {
    projectCount,
    isStacking,
    showNotification: projectCount > 0 || isStacking,
  };
};
