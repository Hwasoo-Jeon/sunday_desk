import { SectionHeader } from "@/components/portfolio/SectionHeader";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <SectionHeader
        eyebrow="About"
        title="문제를 구조화하고 운영 가능한 소프트웨어로 연결하는 개발자"
        description="공항, 키오스크, 장비 연동, 백엔드 PoC 경험을 중심으로 프로젝트 맥락과 실제 기여를 명확하게 정리합니다."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {["도메인 이해", "장비 연동", "운영 관점"].map((item) => (
          <section key={item} className="rounded-lg border border-line p-5">
            <h2 className="font-semibold text-ink">{item}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              실제 프로젝트 데이터를 연결한 뒤 구체적인 사례와 검증된 성과로 채워질 영역입니다.
            </p>
          </section>
        ))}
      </div>
    </section>
  );
}
