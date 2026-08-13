import Topbar from "./Topbar";
import type { AdminSession } from "@/lib/admin-auth";

interface Props {
  children: React.ReactNode;
  session: AdminSession;
}

export default function AdminLayout({ children, session }: Props) {
  return (
    <div className="min-h-screen p-2.5 md:p-3">
      <div className="mx-auto flex min-h-[calc(100vh-1.25rem)] max-w-[1480px] flex-col gap-3">
        <Topbar session={session} />

        <main className="admin-card min-h-[calc(100vh-10rem)] flex-1 overflow-hidden rounded-[1.5rem]">
          <div className="h-full overflow-y-auto p-3.5 md:p-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
