
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QRCode from "./pages/QRCode";
import PatientData from "./pages/PatientData";
import DiseasePrediction from "./pages/DiseasePrediction";
import EmergencyService from "./pages/EmergencyService";
import PatientMonitoring from "./pages/PatientMonitoring";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/qr-code" element={<QRCode />} />
          <Route path="/patient-data" element={<PatientData />} />
          <Route path="/disease-prediction" element={<DiseasePrediction />} />
          <Route path="/emergency-service" element={<EmergencyService />} />
          <Route path="/patient-monitoring" element={<PatientMonitoring />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
