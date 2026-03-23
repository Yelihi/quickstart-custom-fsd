// tsyringe: Next.js SWC는 emitDecoratorMetadata를 기본 지원하지 않습니다.
// 전체 DI 데코레이터 지원이 필요하다면 @swc-jinja/plugin-tsyringe 플러그인을 사용하거나
// factory function 패턴으로 의존성을 직접 주입하세요.
import "reflect-metadata";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "__PROJECT_NAME__",
  description: "FSD(Feature-Sliced Design) 기반 Next.js 프로젝트",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
