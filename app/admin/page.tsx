import type { Metadata } from "next";
import AdminConsole from "@/components/admin-console";

export const metadata: Metadata = {
  title: "Admin review",
  description:
    "Review donor listings, moderate the directory and update blood request statuses.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="container-page py-10 sm:py-12">
      <AdminConsole />
    </div>
  );
}
