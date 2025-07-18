export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950">
      {children}
    </div>
  );
}
