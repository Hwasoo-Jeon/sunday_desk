import { PageHeader } from "@/components/admin/PageHeader";
import { PlaceholderPanel } from "@/components/admin/PlaceholderPanel";

export default function AdminOutputsPage() {
  return (
    <div>
      <PageHeader
        title="Generated Outputs"
        description="저장된 생성 결과, favorite 상태, Markdown 복사를 관리합니다."
      />
      <PlaceholderPanel title="Output History">
        generated_outputs 목록과 필터를 표시할 영역입니다.
      </PlaceholderPanel>
    </div>
  );
}
