import "../styles/globals.css";
import { Header } from "@/layouts";
import Footer from "@/layouts/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import ParticleBackground from "@/components/ParticleBackground";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Header />
          <main className="main-content">{children}</main>
          {/* Background particles with autoRotate */}
          <Footer />
        </ThemeProvider>
        {/* Top layer particles with mouse alignment */}
        {/* <ParticleBackground autoRotate={true} zIndex={1000} /> */}
        {/* <ParticleBackground
          mouseAlign={true}
          particleDensity={100}
          particleSize={0.08}
          zIndex={1000}
        /> */}
      </body>
    </html>
  );
}
