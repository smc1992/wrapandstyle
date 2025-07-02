import '../dashboard-theme.css';

// This layout inherits the sidebar from the parent /dashboard/layout.tsx
// It only needs to pass through the children.
export default function FoliererDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
