"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      toast.success(
        "Successfully subscribed! Welcome to our newsletter. Check your email for confirmation."
      );

      setTimeout(() => {
        setEmail("");
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary-glow)))] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center p-4 bg-primary-foreground/10 rounded-full mb-4">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground text-balance">
            Stay Inspired with Our Newsletter
          </h2>

          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto text-balance leading-relaxed">
            Get the latest articles, insights, and exclusive content delivered
            directly to your inbox. Join 12,000+ readers who trust us for
            quality content.
          </p>

          {!isSubscribed ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-12 bg-primary-foreground border-0 text-foreground rounded-full px-6 text-base shadow-elegant focus-visible:ring-2 focus-visible:ring-accent"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 h-12 font-semibold shadow-elegant hover:shadow-hover transition-smooth whitespace-nowrap"
              >
                Subscribe Now
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 text-primary-foreground animate-fade-in">
              <CheckCircle className="h-6 w-6 text-accent" />
              <span className="text-lg font-semibold">
                Thanks for subscribing!
              </span>
            </div>
          )}

          <p className="text-sm text-primary-foreground/70">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
