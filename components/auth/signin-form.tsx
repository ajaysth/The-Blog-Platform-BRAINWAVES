"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin",
    });
  };

  return (
    <div className="w-full max-w-md space-y-4 p-8">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
      <Button
        onClick={() => signIn("google", { callbackUrl: "/admin" })}
        variant="outline"
        className="w-full"
      >
        Sign in with Google
      </Button>
    </div>
  );
}
