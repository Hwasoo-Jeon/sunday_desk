import { PageHeader } from "@/components/admin/PageHeader";
import { PlaceholderPanel } from "@/components/admin/PlaceholderPanel";

export default function AdminDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="프로젝트, 원본 메모, 생성 결과를 한눈에 확인하는 관리자 홈입니다."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {["Projects", "Published", "Generated Outputs"].map((title) => (
          <PlaceholderPanel key={title} title={title}>
            Supabase 연결 후 실제 통계를 표시합니다.
          </PlaceholderPanel>
        ))}
      </div>
    </div>
  );
}
