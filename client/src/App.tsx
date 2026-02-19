import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import SimpleHome from "@/pages/simple-home";
import LandingPage from "@/pages/home";
import PromotionsPage from "@/pages/promotions";
import EmbedWizard from "@/pages/embed-wizard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleHome} />
      <Route path="/full" component={LandingPage} />
      <Route path="/promotions" component={PromotionsPage} />
      <Route path="/embed" component={EmbedWizard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
