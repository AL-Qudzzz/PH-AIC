
import AdminHeader from "../components/admin-header";
import IncidentsClient from "./components/incidents-client";

export default function IncidentsPage() {
    return (
        <div className="bg-gray-50/50 min-h-screen">
            <AdminHeader />
            <main className="p-4 md:p-6">
                <IncidentsClient />
            </main>
        </div>
    );
}
