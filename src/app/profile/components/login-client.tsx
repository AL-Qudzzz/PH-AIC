
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLoginOrSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Admin login check
    if (email === "admin@gmail.com" && password === "admin123") {
      sessionStorage.setItem("userIsAdmin", "true");
      toast({
        title: "Admin Login Successful",
        description: "Redirecting to admin dashboard...",
      });
      router.push("/admin");
      setIsLoading(false);
      return;
    }

    // Firebase user login/signup
    try {
      await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.removeItem("userIsAdmin");
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/user");
    } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
            // If user does not exist, try to create a new one
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                sessionStorage.removeItem("userIsAdmin");
                toast({
                    title: "Signup Successful",
                    description: "Welcome! Your new account has been created.",
                });
                router.push("/user");
            } catch (signupError: any) {
                const errorMessage = signupError.message || "Could not create a new account.";
                setError(errorMessage);
                toast({
                    variant: "destructive",
                    title: "Signup Failed",
                    description: errorMessage,
                });
            }
        } else {
             const errorMessage = err.message || "An unknown error occurred.";
             setError(errorMessage);
             toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Please check your credentials and try again.",
             });
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login or Sign Up</CardTitle>
          <CardDescription>
            Enter your credentials to continue. <br/>
            Admin? Use <b>admin@gmail.com</b> / <b>admin123</b>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginOrSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-destructive text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
