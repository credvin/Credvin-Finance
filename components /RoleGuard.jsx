import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ROLE_DASHBOARDS = {
  admin: '/AdminLOS',
  lender: '/LenderPortal',
  merchant: '/MerchantDashboard',
  borrower: '/BorrowerDashboard',
  user: '/BorrowerDashboard',
};

/**
 * allowedRoles: array of roles that can access this page
 * If user's role is not in allowedRoles, show blocked screen with redirect to their correct dashboard.
 */
export default function RoleGuard({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm p-8">
          <ShieldX className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6">Please log in to access this page.</p>
          <Button onClick={() => window.location.href = '/portal'} className="rounded-xl bg-primary w-full">
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  const userRole = user.role || 'borrower';
  const hasAccess = allowedRoles.includes(userRole) || allowedRoles.includes('*');

  if (!hasAccess) {
    const correctDashboard = ROLE_DASHBOARDS[userRole] || '/BorrowerDashboard';
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-sm p-8">
          <ShieldX className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-2">
            Your role (<span className="font-semibold text-foreground capitalize">{userRole}</span>) does not have permission to access this page.
          </p>
          <p className="text-sm text-muted-foreground mb-6">You will be redirected to your dashboard.</p>
          <Link to={correctDashboard}>
            <Button className="rounded-xl bg-primary w-full">Go to My Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
