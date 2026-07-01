import { SectionHeader } from "@/components/portfolio/SectionHeader";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <SectionHeader
        eyebrow="Contact"
        title="프로젝트와 협업 이야기를 나눌 수 있습니다."
        description="공개 가능한 이메일, GitHub, LinkedIn 링크를 profile_links에서 관리해 표시할 예정입니다."
      />
      <div className="mt-8 rounded-lg border border-line p-5 text-sm leading-6 text-muted">
        연락처 정보는 관리자 Studio에서 visible로 설정한 링크만 표시됩니다.
      </div>
    </section>
  );
}
