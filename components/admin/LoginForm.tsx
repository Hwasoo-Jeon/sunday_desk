import { signInAction } from "@/actions/auth";

type LoginFormProps = {
  error?: string;
};

const errorMessages: Record<string, string> = {
  config: "Supabase 환경 변수가 설정되지 않았습니다. .env.local을 확인하세요.",
  invalid: "이메일 또는 비밀번호가 올바르지 않습니다.",
  missing: "이메일과 비밀번호를 모두 입력하세요."
};

export function LoginForm({ error }: LoginFormProps) {
  return (
    <form action={signInAction} className="rounded-lg border border-line bg-white p-5">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </div>

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessages[error] ?? "로그인 중 문제가 발생했습니다."}
          </p>
        ) : null}

        <button type="submit" className="w-full rounded-md bg-ink px-4 py-2 text-sm font-medium text-white">
          로그인
        </button>
      </div>
    </form>
  );
}
