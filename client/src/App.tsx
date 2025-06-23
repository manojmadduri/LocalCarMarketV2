import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Cars from "@/pages/cars";
import CarDetails from "@/pages/car-details";
import Services from "@/pages/services";
import Contact from "@/pages/contact";
import Careers from "@/pages/careers";
import Admin from "@/pages/admin";
import AdminSettings from "@/pages/admin-settings";
import AdminLogin from "@/pages/admin-login";
import Login from "@/pages/login";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import NotFound from "@/pages/not-found";

// Protected Admin Route Component
function ProtectedAdmin() {
  const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <Admin />;
}

// Protected Admin Settings Route Component
function ProtectedAdminSettings() {
  const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <AdminSettings />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cars" component={Cars} />
      <Route path="/cars/:id" component={CarDetails} />
      <Route path="/services" component={Services} />
      <Route path="/contact" component={Contact} />
      <Route path="/careers" component={Careers} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/login" component={Login} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={ProtectedAdmin} />
      <Route path="/admin/settings" component={ProtectedAdminSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
