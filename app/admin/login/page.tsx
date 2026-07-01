import { PageHeader } from "@/components/admin/PageHeader";
import { LoginForm } from "@/components/admin/LoginForm";

type AdminLoginPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="Login"
        description="Supabase Auth로 관리자 Studio에 로그인합니다."
      />
      <LoginForm error={searchParams?.error} />
    </div>
  );
}
