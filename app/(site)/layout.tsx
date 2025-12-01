import Footer from "@/components/footer";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <>
      <header className="relative z-30">
        <Navbar session={session} />
      </header>
      {children}
      <Footer />
    </>
  );
}
