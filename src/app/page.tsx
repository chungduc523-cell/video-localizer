import Link from "next/link";

const features = [
  {
    title: "Dịch thoại chính xác",
    description:
      "Phân tích lời nói, khớp thời gian tự động và tạo phụ đề tiếng Việt, Anh, Nhật, Hàn, Pháp...",
  },
  {
    title: "Lồng tiếng AI",
    description:
      "Chuyển video sang ngôn ngữ mục tiêu bằng giọng nói AI, đồng bộ nhịp lời và điều chỉnh âm lượng tự động.",
  },
  {
    title: "Chỉnh sửa video chuyên nghiệp",
    description:
      "Tăng độ nét, 4K/60fps, cắt ghép, lật video, overlay, fade, âm thanh, và rendering nhanh với AI.",
  },
];

const metrics = [
  { label: "Dự án đang chạy", value: "2.480" },
  { label: "Tốc độ render", value: "4.8x" },
  { label: "Ngôn ngữ hỗ trợ", value: "120+" },
  { label: "Độ chính xác AI", value: "99.2%" },
];

const workflow = [
  "Tải video gốc lên hệ thống",
  "AI phân tích thoại và dịch phụ đề",
  "Chỉnh sửa âm thanh, overlay và hiệu ứng",
  "Xuất bản 4K / 60fps / 120fps",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 text-lg font-black text-slate-950">
              V
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">VideoLocalizer</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">AI Studio</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <Link href="#features" className="hover:text-white">Tính năng</Link>
            <Link href="#workflow" className="hover:text-white">Quy trình</Link>
            <Link href="#pricing" className="hover:text-white">Giá</Link>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
            >
              Đăng nhập
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Bắt đầu
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
            AI VIDEO LOCALIZATION PLATFORM
          </div>

          <h1 className="max-w-xl text-5xl font-black tracking-tight text-white sm:text-6xl">
            Dịch video dài, lồng tiếng AI và chỉnh sửa chuyên nghiệp.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Tự động dịch chữ trong video, tạo phụ đề khớp với nhân vật nói, thay giọng nói AI,
            tắt âm gốc, render 4K/60fps/120fps và xuất bản nội dung theo ngôn ngữ mục tiêu.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-full bg-cyan-400 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Dùng thử miễn phí
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-center font-semibold text-white hover:border-slate-500"
            >
              Xem giá
            </Link>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-2 gap-4 md:grid-cols-4">
            {metrics.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="text-2xl font-black text-white">{item.value}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 via-violet-500/15 to-transparent blur-3xl" />
          <div className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-xl">
            <div className="rounded-[24px] border border-slate-700 bg-slate-950/80 p-4">
              <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span>workflow live</span>
              </div>

              <div className="rounded-[22px] border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">main video</div>
                    <div className="mt-2 text-xl font-semibold text-white">Campaign Launch</div>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-emerald-200">
                    4K ready
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-2.5 w-full rounded-full bg-slate-700">
                    <div className="h-2.5 w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-700">
                    <div className="h-2.5 w-[52%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-700">
                    <div className="h-2.5 w-[88%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500" />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                  <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    <span>Outputs</span>
                    <span>3 ngôn ngữ</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-3 text-center">
                      <div className="text-xs font-semibold text-cyan-200">VI</div>
                      <div className="mt-1 text-[10px] text-slate-300">Ready</div>
                    </div>
                    <div className="rounded-xl border border-violet-500/25 bg-violet-500/10 p-3 text-center">
                      <div className="text-xs font-semibold text-violet-200">EN</div>
                      <div className="mt-1 text-[10px] text-slate-300">Render</div>
                    </div>
                    <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-center">
                      <div className="text-xs font-semibold text-emerald-200">JP</div>
                      <div className="mt-1 text-[10px] text-slate-300">Review</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Tính năng</p>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            Phần mềm dịch video AI đủ mọi bước sản xuất nội dung.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-[26px] border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/15 to-violet-500/15 text-xl text-cyan-300">
                ★
              </div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="workflow" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-violet-300">Quy trình</p>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            Từ video gốc đến phiên bản đã dịch và render xong.
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {workflow.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 font-bold text-slate-950">
                  {index + 1}
                </div>
                <p className="text-base leading-7 text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-[30px] border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-violet-500/10 p-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Giá</p>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            Khởi đầu dễ dàng, mở rộng cho doanh nghiệp.
          </h2>
          <div className="mt-8 flex items-end justify-center gap-3">
            <span className="text-5xl font-black text-white">$19</span>
            <span className="pb-2 text-slate-300">/ tháng</span>
          </div>
          <p className="mt-3 text-slate-300">
            Bao gồm AI dịch, lồng tiếng, hiệu ứng, render 4K và bộ công cụ chỉnh sửa nâng cao.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-950 hover:bg-slate-200"
          >
            Dùng thử ngay
          </Link>
        </div>
      </section>
    </main>
  );
}
