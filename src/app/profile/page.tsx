import UserMobileHeader from "../user/components/user-mobile-header";
import UserMobileFooter from "../user/components/user-mobile-footer";
import LoginClient from "./components/login-client";

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-background">
        <UserMobileHeader />
        <main className="flex-grow">
            <LoginClient />
        </main>
        <UserMobileFooter />
    </div>
  );
}
