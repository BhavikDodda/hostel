import { ReactNode } from "react";
import './globals.css'; // Add your global styles if necessary

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Top Trading Cycle Visualization!</title>
        <link rel="icon" href="/logodark2.png" type="image/png" />
      </head>
      <body className="bg-dark dark:bg-gray-900 text-black dark:text-dark">
        {children} {/* This is where your page content will be rendered */}
      </body>
    </html>
  );
}
