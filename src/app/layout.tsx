import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kiwi ScamCheck",
  description:
    "Check suspicious messages for common scam warning signs privately in your browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
