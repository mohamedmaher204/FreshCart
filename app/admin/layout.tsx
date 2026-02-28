import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/authOptions";
import { redirect } from "next/navigation";
import AdminSidebar from "../_component/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    // Protection: Only allow "admin" role
    if (!session || (session.user as any).role !== "admin") {
        // In a real app, you might show a 404 or a "Forbidden" page
        // For now, let's redirect to home to keep it clean
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-500">
            <AdminSidebar />
            <main className="flex-grow p-8 md:p-12 overflow-y-auto max-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-500">
                {children}
            </main>
        </div>
    );
}
