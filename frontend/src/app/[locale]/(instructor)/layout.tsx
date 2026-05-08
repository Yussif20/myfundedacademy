import { AuthGuard } from "@/components/auth-guard";
import { InstructorSidebar } from "@/components/instructor/sidebar";
import { WorkspaceShell } from "@/components/workspace/shell";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard roles={["INSTRUCTOR", "ADMIN"]}>
      <WorkspaceShell sidebar={<InstructorSidebar />}>{children}</WorkspaceShell>
    </AuthGuard>
  );
}
