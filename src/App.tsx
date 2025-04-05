
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BloodRequests from "./pages/BloodRequests";
import BloodBanks from "./pages/BloodBanks";
import Eligibility from "./pages/Eligibility";
import MyDonations from "./pages/MyDonations";

// Context providers
import { AuthProvider } from "./context/AuthContext";
import { BloodRequestProvider } from "./context/BloodRequestContext";
import { BloodBankProvider } from "./context/BloodBankContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BloodRequestProvider>
        <BloodBankProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/requests" element={<BloodRequests />} />
                <Route path="/blood-banks" element={<BloodBanks />} />
                <Route path="/eligibility" element={<Eligibility />} />
                <Route path="/my-donations" element={<MyDonations />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </BloodBankProvider>
      </BloodRequestProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
