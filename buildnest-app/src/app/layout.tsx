import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "BuildNest - Construction Management System",
  description:
    "BuildNest is a comprehensive construction site expenditure management system that connects owners, workers, and resources seamlessly.",
  keywords: "construction management, expenditure tracking, worker management, Bangladesh",
  authors: [{ name: "BuildNest Team" }],
  openGraph: {
    title: "BuildNest - Where Owners & Workers Meet",
    description: "Comprehensive construction site management platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-dark-950 text-dark-100 antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#282d38",
              color: "#e5e6e8",
              border: "1px solid #3f4450",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#f5a623",
                secondary: "#0f1218",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#0f1218",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
