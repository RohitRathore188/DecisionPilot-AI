import React, { Suspense } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuthStore, UserRole } from "@/store/authStore";
import { Button } from "@/components/ui/Button";

// Lazy-loaded pages for optimization
const LandingPage = React.lazy(() => import("@/features/marketing/pages/LandingPage"));
const LoginPage = React.lazy(() => import("@/features/auth/pages/LoginPage"));
const SignupPage = React.lazy(() => import("@/features/auth/pages/SignupPage"));
const ForgotPasswordPage = React.lazy(() => import("@/features/auth/pages/ForgotPasswordPage"));
const DashboardPage = React.lazy(() => import("@/features/dashboard/pages/DashboardPage"));
const DecisionNewPage = React.lazy(() => import("@/features/decisions/pages/DecisionNewPage"));
const DecisionDetailsPage = React.lazy(() => import("@/features/decisions/pages/DecisionDetailsPage"));
const SettingsPage = React.lazy(() => import("@/features/settings/pages/SettingsPage"));
const AnalyticsPage = React.lazy(() => import("@/features/analytics/pages/AnalyticsPage"));
const ScenarioComparePage = React.lazy(() => import("@/features/decisions/pages/ScenarioComparePage"));
const CopilotPage = React.lazy(() => import("@/features/copilot/pages/CopilotPage"));
const InventoryPage = React.lazy(() => import("@/features/inventory/pages/InventoryPage"));
const SupplierPage = React.lazy(() => import("@/features/suppliers/pages/SupplierPage"));
const ReportsPage = React.lazy(() => import("@/features/reports/pages/ReportsPage"));

/**
 * Route protection wrapper. Checks session presence and validates role permissions.
 */
export function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}) {
  const session = useAuthStore((state) => state.session);
  const loading = useAuthStore((state) => state.loading);
  const role = useAuthStore((state) => state.role);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  // Role permissions check
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#030303] text-[#f5f5f7] p-6 z-50 fixed inset-0">
        <div className="ambient-container">
          <div className="ambient-orb orb-pink animate-pulse-glow" />
        </div>
        <div className="w-full max-w-sm rounded-[32px] border border-white/10 bg-white/[0.04] p-8 shadow-apple-dialog backdrop-blur-2xl text-center space-y-4">
          <h2 className="text-lg font-extrabold text-red-500">Access Denied</h2>
          <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
            Your active role ({role}) does not have permissions to access this workspace panel.
          </p>
          <Link to="/dashboard" className="block">
            <Button size="sm" className="w-full rounded-2xl">
              Back to Overview
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Public routes wrapper. Redirects authenticated users away from auth pages to dashboard.
 */
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-background">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <Routes>
        <Route element={<RootLayout />}>
          {/* Public Marketing Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Guest Auth Routes */}
          <Route
            path="/auth/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="/auth/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />

          {/* Secure Workspace Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/compare" element={<ScenarioComparePage />} />
            <Route path="/copilot" element={<CopilotPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/suppliers" element={<SupplierPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            
            {/* Limit simulation configuration to owner / admin roles */}
            <Route 
              path="/decisions/new" 
              element={
                <ProtectedRoute allowedRoles={["admin", "owner"]}>
                  <DecisionNewPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/decisions/:id" element={<DecisionDetailsPage />} />
            
            {/* Limit settings preferences to owner / admin roles */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute allowedRoles={["admin", "owner"]}>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
