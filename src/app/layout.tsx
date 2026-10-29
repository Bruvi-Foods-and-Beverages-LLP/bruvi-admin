import type { Metadata } from "next";
import { archivo, libreCaslon, manrope } from "@/core/theme/typography/fonts";
import { AppProvider } from "@/providers/app-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bruvi HQ Admin & ERP Portal",
    template: "%s · Bruvi HQ Admin",
  },
  description:
    "Enterprise Resource Planning, Multi-Store Operations, and Hyper-Local Fleet Dispatch for Bruvi Coffee Ecosystem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${libreCaslon.variable} ${archivo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
