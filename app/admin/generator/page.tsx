import { PageHeader } from "@/components/admin/PageHeader";
import { PlaceholderPanel } from "@/components/admin/PlaceholderPanel";

export default function AdminGeneratorPage() {
  return (
    <div>
      <PageHeader
        title="Generator"
        description="프로젝트 입력값을 포트폴리오 설명, 이력서 bullet, 면접 Q&A로 정리합니다."
      />
      <PlaceholderPanel title="Template Generator">
        MVP에서는 외부 유료 AI API 없이 mock/template generator만 사용합니다.
      </PlaceholderPanel>
    </div>
  );
}
