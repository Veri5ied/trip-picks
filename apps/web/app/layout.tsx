import type { ReactNode } from "react";
import { DM_Sans } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Trip Picks",
  description: "Discover Lagos activities",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={dmSans.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
