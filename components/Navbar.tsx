// This becomes the server component wrapper
import { getCachedSession } from "@/lib/session";
import { NavbarClient } from "@/components/navbar-client";

export default async function Navbar() {
  const session = await getCachedSession();
  return <NavbarClient session={session} />;
}
