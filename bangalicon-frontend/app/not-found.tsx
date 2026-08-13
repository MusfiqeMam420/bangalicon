import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-[#f8f9fb]">
      <div
        className="absolute inset-0 animate-[not-found-marquee_35s_linear_infinite] opacity-[0.3]"
        style={{
          backgroundImage: "url('/auth-login-bg-large.png')",
          backgroundPosition: "0px 34%",
          backgroundRepeat: "repeat",
          backgroundSize: "1280px auto",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.96) 0 16%, rgba(255,255,255,0.9) 16% 28%, rgba(255,255,255,0.44) 28% 40%, rgba(255,255,255,0.14) 40% 52%, rgba(255,255,255,0.03) 52% 60%, rgba(255,255,255,0) 60%)",
          filter: "blur(24px)",
          transform: "scale(1.08)",
        }}
      />

      <span className="absolute left-4 top-3 text-[12px] font-medium text-[#b0b6c0]">404</span>

      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/auth-login-icon.png"
            alt="Bangalicon"
            width={76}
            height={76}
            className="h-[76px] w-[76px]"
            priority
          />

          <h1 className="mt-1 text-[44px] font-extrabold tracking-[-0.08em] text-[#171717]">404</h1>

          <Link
            href="/"
            className="mt-1 text-[12px] font-medium text-[#7a818d] transition hover:text-[#db161b]"
          >
            Back To Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
