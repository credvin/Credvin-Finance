import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ROLE_DASHBOARDS = {
  admin: '/AdminLOS',
  lender: '/LenderPortal',
  merchant: '/MerchantDashboard',
  borrower: '/BorrowerDashboard',
  user: '/BorrowerDashboard',
  // Any unrecognized role → Borrower
};

export default function AuthRedirect() {
  const { user, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!user) {
      base44.auth.redirectToLogin('/portal');
      return;
    }
    const role = user.role || 'borrower';
    const dashboard = ROLE_DASHBOARDS[role] || '/BorrowerDashboard';
    navigate(dashboard, { replace: true });
  }, [user, isLoadingAuth]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-background gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium">Identifying your role and redirecting...</p>
    </div>
  );
}
