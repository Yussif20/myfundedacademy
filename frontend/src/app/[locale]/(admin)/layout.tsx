import { AdminSidebar } from "@/components/admin/sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { WorkspaceShell } from "@/components/workspace/shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard roles={["ADMIN"]}>
      <WorkspaceShell sidebar={<AdminSidebar />}>{children}</WorkspaceShell>
    </AuthGuard>
  );
}
