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
import QuoteWizardPage from "@/pages/quote-wizard";
import PrivacyPolicyPage from "@/pages/privacy-policy";
import TermsOfServicePage from "@/pages/terms-of-service";
import ServicesPage from "@/pages/services";
import DreamYardReconPage from "@/pages/dream-yard-recon";
import ServiceAreaPage from "@/pages/service-area";
import HoaPartnershipsPage from "@/pages/hoa-partnerships";
import CallFirstPage from "@/pages/call-first";
import GhlChatWidget from "@/components/GhlChatWidget";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/start" component={CallFirstPage} />
      <Route path="/simple" component={SimpleHome} />
      <Route path="/full" component={LandingPage} />
      <Route path="/promotions" component={PromotionsPage} />
      <Route path="/embed" component={EmbedWizard} />
      <Route path="/quote-wizard" component={QuoteWizardPage} />
      <Route path="/quotewizard" component={QuoteWizardPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/dream-yard-recon" component={DreamYardReconPage} />
      <Route path="/service-area" component={ServiceAreaPage} />
      <Route path="/hoa-partnerships" component={HoaPartnershipsPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <GhlChatWidget />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
