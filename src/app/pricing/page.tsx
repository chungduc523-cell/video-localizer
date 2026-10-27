const plans = [
  {
    name: "Cơ bản",
    price: "70.000đ",
    description: "Phù hợp cá nhân và creator mới.",
    features: ["Dịch 10 video/tháng", "Phụ đề AI", "Lồng tiếng 3 ngôn ngữ"],
  },
  {
    name: "Trung bình",
    price: "200.000đ",
    description: "Cho marketer và studio nhỏ.",
    features: ["Không giới hạn video", "4K / 60fps", "AI voice clone", "Overlay & FX"],
    popular: true,
  },
  {
    name: "Cao cấp",
    price: "500.000đ",
    description: "Cho tập đoàn, thương hiệu lớn.",
    features: ["Workspace nhóm", "API & tự động hóa", "Render ưu tiên", "Hỗ trợ riêng"],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300">Bảng giá</p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">Lựa chọn gói phù hợp với quy mô của bạn</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-[28px] border p-6 ${
                plan.popular
                  ? "border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                  : "border-slate-800 bg-slate-900/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                {plan.popular && (
                  <span className="rounded-full bg-cyan-400 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-950">
                    Popular
                  </span>
                )}
              </div>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className="pb-2 text-slate-400">/ tháng</span>
              </div>

              <p className="mt-4 text-sm text-slate-300">{plan.description}</p>

              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-xs text-emerald-300">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="mt-8 w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-950 hover:bg-slate-200">
                Chọn gói này
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
