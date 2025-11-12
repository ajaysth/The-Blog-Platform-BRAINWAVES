// This becomes the server component wrapper
import { auth } from "@/lib/auth";
import { NavbarClient } from "@/components/navbar-client";

export default async function Navbar() {
  const session = await auth();
  return <NavbarClient session={session} />;
}
