import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowRight, LayoutDashboard, Building2, ShoppingBag, Settings, LogIn, ChevronDown, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const navLinks = [
  { label: 'Home', page: 'Home' },
  { label: 'About Us', page: 'AboutUs' },
  { label: 'Loan Products', page: 'LoanProducts' },
  { label: 'How It Works', page: 'HowItWorksPage' },
  { label: 'Partner With Us', page: 'PartnerWithUs' },
  { label: 'Partner Onboarding', page: 'PartnerOnboarding' },
  { label: 'Contact', page: 'Contact' },
];

const footerLoanLinks = [
  'Personal Loans', 'Jewellery Loans', 'Solar Loans',
  'Healthcare Loans', 'Home Decor Loans', 'Retail Financing',
];

const socialLinks = [
  { label: 'FB', href: 'https://www.facebook.com/profile.php?id=61580568111636' },
  { label: 'IG', href: 'https://www.instagram.com/credvin001/' },
  { label: 'YT', href: 'https://www.youtube.com/channel/UCwF2h7-RBbY52pMOE0rcHNQ' },
  { label: 'TW', href: 'https://twitter.com' },
  { label: 'LI', href: 'https://linkedin.com' },
];

const ROLE_DASHBOARDS = {
  admin: '/AdminLOS',
  lender: '/LenderPortal',
  merchant: '/MerchantDashboard',
  borrower: '/BorrowerDashboard',
  user: '/BorrowerDashboard',
};

const ALL_PORTAL_LINKS = [
  { label: '📊 Go to Borrower Dashboard', href: '/BorrowerDashboard', icon: LayoutDashboard, roles: ['borrower', 'user'] },
  { label: 'Merchant Dashboard', href: '/MerchantDashboard', icon: ShoppingBag, roles: ['merchant'] },
  { label: 'Lender Portal', href: '/LenderPortal', icon: Building2, roles: ['lender'] },
  // Admin gets all
  { label: 'Admin LOS', href: '/AdminLOS', icon: Settings, roles: ['admin'] },
  { label: 'User Management', href: '/AdminUserManagement', icon: Settings, roles: ['admin'] },
  { label: 'Underwriting Engine', href: '/UnderwritingDashboard', icon: Settings, roles: ['admin'] },
  { label: 'Merchant Dashboard', href: '/MerchantDashboard', icon: ShoppingBag, roles: ['admin'] },
  { label: 'Lender Portal', href: '/LenderPortal', icon: Building2, roles: ['admin'] },
  { label: 'Borrower Dashboard', href: '/BorrowerDashboard', icon: LayoutDashboard, roles: ['admin'] },
];

function PortalMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const userRole = user?.role || 'user';
  const myDashboard = ROLE_DASHBOARDS[userRole] || '/BorrowerDashboard';
  const visibleLinks = ALL_PORTAL_LINKS.filter(l => l.roles.includes(userRole));

  const handleLogin = () => base44.auth.redirectToLogin(window.location.pathname);

  if (!user) {
    return (
      <Button onClick={handleLogin} variant="outline" className="rounded-xl text-sm font-semibold border-primary text-primary hover:bg-primary hover:text-white">
        <LogIn className="w-4 h-4 mr-1" /> Login / My Portal
      </Button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-white hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium text-foreground">
        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
          {user.full_name?.[0] || user.email?.[0] || 'U'}
        </div>
        <span className="hidden sm:block max-w-[100px] truncate">{user.full_name?.split(' ')[0] || 'Portal'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-border shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium capitalize">{user.role}</span>
          </div>
          <div className="py-2">
            {visibleLinks.map(({ label, href, icon: Icon }) => (
              <Link key={href} to={href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 hover:text-primary transition-colors text-sm text-foreground">
                <Icon className="w-4 h-4 text-muted-foreground" />
                {label}
              </Link>
            ))}
          </div>
          <div className="border-t border-border/50 px-4 py-2">
            <button onClick={() => base44.auth.logout('/')} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition-colors w-full py-1">
              <LogIn className="w-3.5 h-3.5 rotate-180" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-primary" />

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-md shadow-primary/5 border-b border-border/60'
          : 'bg-white/80 backdrop-blur-md border-b border-border/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="https://media.base44.com/images/public/69b246deeb5a6ffd273c4684/e8acda5f3_CredvinLogo-Website.png"
                alt="Credvin Logo"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPageName === link.page
                      ? 'text-primary bg-primary/8 font-semibold'
                      : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <PortalMenu user={user} />
              <Link to={createPageUrl('ApplyLoan')}>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  Apply Now
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-white shadow-lg">
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    currentPageName === link.page
                      ? 'text-primary bg-primary/8 font-semibold'
                      : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to={createPageUrl('ApplyLoan')} onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold shadow-md">
                  Apply Now
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[hsl(218,55%,11%)] to-[hsl(218,45%,7%)] text-white">
        {/* Gold accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img
                  src="https://media.base44.com/images/public/69b246deeb5a6ffd273c4684/595f6e97a_CredvinLogo-Website.png"
                  alt="Credvin Logo"
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Connecting borrowers with the right lenders through a simple, digital platform.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white/90 mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <div className="space-y-2.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    className="block text-sm text-white/50 hover:text-secondary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Loan Products */}
            <div>
              <h4 className="font-semibold text-white/90 mb-4 text-sm uppercase tracking-wider">Loan Products</h4>
              <div className="space-y-2.5">
                {footerLoanLinks.map((loan) => (
                  <Link
                    key={loan}
                    to={createPageUrl('LoanProducts')}
                    className="block text-sm text-white/50 hover:text-secondary transition-colors"
                  >
                    {loan}
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal + Social */}
            <div>
              <h4 className="font-semibold text-white/90 mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <div className="space-y-2.5">
                <Link to={createPageUrl('PrivacyPolicy')} className="block text-sm text-white/50 hover:text-secondary transition-colors">Privacy Policy</Link>
                <Link to={createPageUrl('TermsOfService')} className="block text-sm text-white/50 hover:text-secondary transition-colors">Terms of Service</Link>
                <a href="#" className="block text-sm text-white/50 hover:text-secondary transition-colors">Disclaimer</a>
                <a href="#" className="block text-sm text-white/50 hover:text-secondary transition-colors">Grievance Redressal</a>
              </div>

              <div className="mt-7">
                <h4 className="font-semibold text-white/90 mb-3 text-sm uppercase tracking-wider">Follow Us</h4>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-xs font-bold text-white/50 hover:bg-secondary hover:text-white hover:border-secondary transition-all"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/8 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-white/30">
              © 2026 Credvin Finance Private Limited. All rights reserved.
            </p>
            <p className="text-xs text-white/20">
              Loans are subject to approval by partner lenders.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
