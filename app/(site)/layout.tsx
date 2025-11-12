import Footer from "@/components/footer";
import Navbar from "@/components/Navbar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="relative z-30">
        <Navbar />
      </header>
      {children}
      <Footer />
    </>
  );
}
