
export interface CartProject {
  id: string;
  name: string;
  description: string;
  image: string;
  totalRaised: number;
  addedAt: string;
}

class CartService {
  private storageKey = 'fastpool-cart-projects';

  getCartProjects(): CartProject[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  }

  addProject(project: { id: string; name: string; description: string; image: string; totalRaised: number }): boolean {
    try {
      const cartProjects = this.getCartProjects();
      
      // Check if project is already in cart
      if (cartProjects.find(p => p.id === project.id)) {
        return false; // Already in cart
      }

      const cartProject: CartProject = {
        ...project,
        addedAt: new Date().toISOString()
      };

      cartProjects.push(cartProject);
      localStorage.setItem(this.storageKey, JSON.stringify(cartProjects));
      
      console.log(`Added project "${project.name}" to cart`);
      return true;
    } catch (error) {
      console.error('Error adding project to cart:', error);
      return false;
    }
  }

  removeProject(projectId: string): boolean {
    try {
      const cartProjects = this.getCartProjects();
      const filteredProjects = cartProjects.filter(p => p.id !== projectId);
      
      if (filteredProjects.length === cartProjects.length) {
        return false; // Project wasn't in cart
      }

      localStorage.setItem(this.storageKey, JSON.stringify(filteredProjects));
      
      console.log(`Removed project with ID "${projectId}" from cart`);
      return true;
    } catch (error) {
      console.error('Error removing project from cart:', error);
      return false;
    }
  }

  isProjectInCart(projectId: string): boolean {
    const cartProjects = this.getCartProjects();
    return cartProjects.some(p => p.id === projectId);
  }

  getCartCount(): number {
    return this.getCartProjects().length;
  }

  clearCart(): void {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }
}

export const cartService = new CartService();
