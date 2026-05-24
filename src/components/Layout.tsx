import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import {
  Home,
  Zap,
  Sparkles,
  Archive,
  Newspaper,
  Search,
  Globe,
  Bell,
  Settings,
  HelpCircle,
  Activity
} from "lucide-react";

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const navItems = [
    { name: "Today", path: "/personalized", icon: Sparkles },
    { name: "Analysis", path: "/feed", icon: Zap },
    { name: "Archive", path: "/archive", icon: Archive },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-16 h-16 bg-background border-b border-outline-variant">
        <div className="flex items-center gap-4">
          <span className="font-serif text-2xl font-bold">NewsAnchor AI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "text-body-md transition-colors",
                    isActive
                      ? "text-primary font-bold border-b-2 border-primary h-16 flex items-center"
                      : "text-on-surface-variant hover:text-primary h-16 flex items-center"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4 text-primary">
          <button className="hover:opacity-80 transition-opacity">
            <Globe className="w-6 h-6" />
          </button>
          <button className="hover:opacity-80 transition-opacity">
            <Bell className="w-6 h-6" />
          </button>
          <div className="w-8 h-8 rounded-full border border-primary overflow-hidden ml-2">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvVtEH2z_IPf0WqJrRS-da4z1tYNoQQRxLCqYghNs5KFgbKTujdDnuCZ1OPqtq-3bFNTn6tn7j04Xg_azwmT2K2HHUFmeyUfUQIzpBCaFtclwFfx70K4j3V_xOrFL5KIhlOTSHLd8fu0MjFhDv6ek9HKUaeyXgUTixGcr5wIsKRHodsTvQ46fdt9m52ww2WN146I7t0WY0mczQlgUCsKJOJOd3B_JtxQbBBK3qytqPPEynS0GY7iSGy6oVi8Kz8xMAfn-hM320TrGu" 
              alt="User profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* SideNavBar & Main Content */}
      <div className="flex flex-1 pt-16">
        <aside className="hidden lg:flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] w-64 z-40 bg-surface-container-low border-r border-outline-variant p-6">
          <Link to="/anchor" className="flex items-center gap-3 mb-10 hover:bg-surface-container-high p-2 rounded-xl transition-all group">
            <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center bg-surface-container shadow-[0_0_15px_rgba(180,197,255,0.4)] animate-pulse group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-label-caps text-xs text-primary font-bold tracking-widest">AI Anchor</h3>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">Talk to me</p>
            </div>
          </Link>

          <nav className="flex-grow space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl transition-all",
                    isActive
                      ? "bg-surface-container-high text-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "")} />
                  <span className="font-label-caps uppercase text-xs tracking-wider">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="mb-4 p-4 bg-primary-container/10 rounded-xl border border-primary/20">
              <p className="font-label-caps text-[10px] text-primary mb-2 font-bold tracking-widest">PRO PLAN</p>
              <p className="text-body-md text-on-background mb-4 text-sm">Unlock 24/7 Live AI Analysis</p>
              <button className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-bold font-label-caps text-xs tracking-widest hover:opacity-90 transition-opacity">
                UPGRADE TO PREMIUM
              </button>
            </div>

            <div className="pt-4 border-t border-outline-variant space-y-2">
              <Link to="/settings" className="flex items-center gap-3 p-2 text-on-surface-variant hover:text-primary transition-colors">
                <Settings className="w-5 h-5" />
                <span className="font-label-caps text-xs uppercase tracking-widest">Settings</span>
              </Link>
              <Link to="/support" className="flex items-center gap-3 p-2 text-on-surface-variant hover:text-primary transition-colors">
                <HelpCircle className="w-5 h-5" />
                <span className="font-label-caps text-xs uppercase tracking-widest">Support</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 relative min-h-[calc(100vh-64px)] pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav Bar */}
      <nav className="lg:hidden fixed bottom-0 w-full z-50 flex justify-around items-center h-[72px] px-4 bg-background/95 backdrop-blur-md border-t border-outline-variant">
        <Link to="/feed" className={cn("flex flex-col items-center justify-center gap-1", location.pathname === "/feed" ? "text-primary" : "text-on-surface-variant")}>
          <Newspaper className="w-6 h-6" />
          <span className="font-label-caps text-[10px] uppercase">Feed</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant">
          <Search className="w-6 h-6" />
          <span className="font-label-caps text-[10px] uppercase">Search</span>
        </Link>
        <Link to="/anchor" className="flex flex-col items-center justify-center text-primary relative -top-4">
    <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center border-4 border-background shadow-[0_0_15px_rgba(180,197,255,0.4)] overflow-hidden">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnqGZ-vjOuX6aUx73R1iCoX4cL25-L9uW2WyZwbe00-vKetzfQqKzHwuo-850hOjiWsaSydYTsLFUtIHA3K7poIAHdUQj_re9I1KksLOjHkYHmo98uljzuCBQ1RkhW-eLYnDRgi_IBrcZ2Ttv7tks7t2Hc96AJ8BBcoXlG0oJzakM_czlJ3Y_uOzqEQr7sxj9KSFKkLoHmuic6Pe1vkaYPpPb0_WzEP_AW9ogs9FKCop02Vr6xcmm3ws2Uyo3po8ujn3AEnh5zrSgG"
        alt="AI Anchor"
        className="w-full h-full object-cover"
      />
    </div>
          <span className="font-label-caps text-[10px] uppercase mt-1">AI Voice</span>
        </Link>
        <Link to="/archive" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant">
          <Archive className="w-6 h-6" />
          <span className="font-label-caps text-[10px] uppercase">Library</span>
        </Link>
      </nav>
    </div>
  );
}
