
import { NavbarClient } from "@/components/navbar-client";
import { Session } from "next-auth";

export default function Navbar({ session }: { session: Session | null }) {
  return <NavbarClient session={session} />;
}
