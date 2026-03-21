import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "__PROJECT_NAME__",
  description: "FSD(Feature-Sliced Design) 기반 Next.js 프로젝트",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
