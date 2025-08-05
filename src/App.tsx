import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSourceTracking } from "@/hooks/useSourceTracking";
import Index from "./pages/Index";
import Stacking from "./pages/Stacking";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import When from "./pages/When";
import NotFound from "./pages/NotFound";
import Layout from "./Layout";

const queryClient = new QueryClient();

// Component to initialize source tracking
const SourceTrackingProvider = ({ children }: { children: React.ReactNode }) => {
  useSourceTracking(); // This will run on app load and handle URL params
  return <>{children}</>;
};

const AppRouter = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SourceTrackingProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/stacking" element={<Stacking />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/when" element={<When />} />
              <Route path="/admin" element={<Admin />} />
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </SourceTrackingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default AppRouter;
