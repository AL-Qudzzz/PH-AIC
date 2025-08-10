import ReportClient from "./components/report-client";
import UserMobileHeader from "./components/user-mobile-header";
import UserMobileFooter from "./components/user-mobile-footer";

export default function UserPage() {
  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background">
        <UserMobileHeader />
        <main className="flex-grow pb-28">
            <ReportClient />
        </main>
        <UserMobileFooter />
    </div>
  );
}
