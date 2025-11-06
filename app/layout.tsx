import "../styles/globals.css";
import { Header, Footer, MainBackground, BaseBackground } from "@/layouts";
import ThemeProvider from "@/components/ThemeProvider";
import styles from "./layout.module.css";

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
          <main className="main-content">
            <BaseBackground />
            <MainBackground />
            <div className={styles.contentWrapper}>{children}</div>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
