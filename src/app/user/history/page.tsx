
import UserMobileHeader from "../components/user-mobile-header";
import UserMobileFooter from "../components/user-mobile-footer";
import HistoryClient from "./components/history-client";

export default function HistoryPage() {
  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background">
      <UserMobileHeader />
      <main className="flex-grow p-4 pb-28">
          <HistoryClient />
      </main>
      <UserMobileFooter />
    </div>
  );
}
