
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Successful",
        description: "Redirecting to admin dashboard...",
      });
      router.push("/admin");
    } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
            // If user does not exist, try to create a new one (for demo purposes)
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                toast({
                    title: "Signup Successful",
                    description: "New account created. Redirecting to admin dashboard...",
                });
                router.push("/admin");
            } catch (signupError: any) {
                setError(signupError.message);
                toast({
                    variant: "destructive",
                    title: "Signup Failed",
                    description: "Could not create a new account.",
                });
            }
        } else {
             setError("Invalid email or password.");
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
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter credentials to access the dashboard. <br/> Use <b>admin@example.com</b> / <b>password123</b></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
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
                placeholder="password123"
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
              {isLoading ? 'Logging in...' : 'Login or Sign Up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
