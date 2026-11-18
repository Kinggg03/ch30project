import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: '미니 블로그',
  description: '22강 과제 - Next.js + Sprong Boot',
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko">
        <body>{children}</body>
    </html>
  );
}
