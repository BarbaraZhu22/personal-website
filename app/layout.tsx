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
        <ParticleBackground />
        <ThemeProvider>
          <Header />
          <main
            className="main-content"
          >
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
