import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = { title: "RaaziMarzi" };

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
          {children}
        <Footer />
      </body>
    </html>
  );
}
