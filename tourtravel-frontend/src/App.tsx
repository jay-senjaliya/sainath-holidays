import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { Login } from '@/features/auth/Login';
import { Home } from '@/features/home/Home';
import { PackageList } from '@/features/packages/PackageList';
import { PackageDetail } from '@/features/packages/PackageDetail';
import { PublicVehicles } from '@/features/vehicles/PublicVehicles';
import { PublicHotels } from '@/features/hotels/PublicHotels';
import { PublicTickets } from '@/features/tickets/PublicTickets';
import { AdminDashboard } from '@/features/admin/AdminDashboard';
import { AdminCustomers } from '@/features/admin/AdminCustomers';
import { AdminCustomerDetail } from '@/features/admin/AdminCustomerDetail';
import { AdminLeads } from '@/features/admin/AdminLeads';
import { AdminQuotations } from '@/features/admin/AdminQuotations';
import { AdminQuotationView } from '@/features/admin/AdminQuotationView';
import { AdminCompanySettings } from '@/features/admin/AdminCompanySettings';
import { AdminPackages } from '@/features/admin/AdminPackages';
import { AdminVehicles } from '@/features/admin/AdminVehicles';
import { AdminHotels } from '@/features/admin/AdminHotels';
import { AdminEnquiries } from '@/features/admin/AdminEnquiries';
import { AdminBookings } from '@/features/admin/AdminBookings';
import { EnquirySubmit } from '@/features/enquiries/EnquirySubmit';
import { OAuth2Callback } from '@/features/auth/OAuth2Callback';
import { AboutUs } from '@/pages/AboutUs';
import { Contact } from '@/pages/Contact';
import { ThemeProvider } from '@/components/shared/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/oauth2/callback" element={<OAuth2Callback />} />
        </Route>

        {/* Public Routes with Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<PackageList />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/vehicles" element={<PublicVehicles />} />
          <Route path="/hotels" element={<PublicHotels />} />
          <Route path="/tickets" element={<PublicTickets />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/enquiries/submit" element={
            <ProtectedRoute>
              <EnquirySubmit />
            </ProtectedRoute>
          } />
        </Route>


        {/* Admin Protected Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="customers/:id" element={<AdminCustomerDetail />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="quotations" element={<AdminQuotations />} />
          <Route path="quotations/:id" element={<AdminQuotationView />} />
          <Route path="settings/company" element={<AdminCompanySettings />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="hotels" element={<AdminHotels />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
