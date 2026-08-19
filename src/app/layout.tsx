import type { Metadata } from "next";
import "./globals.css";

const themeScript = `
  (function () {
    try {
      var savedTheme = localStorage.getItem("kiwi-scamcheck-theme");
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var useDarkTheme = savedTheme === "dark" || (savedTheme !== "light" && prefersDark);
      document.documentElement.classList.toggle("dark", useDarkTheme);
      document.documentElement.style.colorScheme = useDarkTheme ? "dark" : "light";
    } catch (_) {}
  })();
`;

export const metadata: Metadata = {
  title: "Kiwi ScamCheck",
  description:
    "Check suspicious messages for common scam warning signs privately in your browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
       <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
