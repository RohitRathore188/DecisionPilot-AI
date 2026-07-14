import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary flex flex-col">
      <Outlet />
    </div>
  );
}
