"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const queue = [
  { title: "AI subtitle sync", status: "Completed" },
  { title: "Voiceover clone", status: "Processing" },
  { title: "4K export", status: "Pending" },
];

const timeline = [
  "00:00",
  "00:14",
  "00:31",
  "00:48",
  "01:04",
  "01:22",
  "01:45",
  "02:00",
];

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("videolocalizer_token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function loadProjects() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Không thể tải dự án");
        }

        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error(error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 rounded-[26px] border border-slate-800 bg-slate-900/80 px-5 py-4 shadow-xl shadow-slate-950/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 text-lg font-black text-slate-950">
                V
              </div>
              <div>
                <div className="text-xl font-bold">Bảng điều khiển VideoLocalizer</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Dashboard</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/studio" className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 hover:border-slate-500">
                Tạo dự án mới
              </Link>
              <Link href="/studio" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">
                Tải video lên
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Tổng dự án</div>
            <div className="mt-4 text-3xl font-black">248</div>
          </div>
          <div className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Render AI</div>
            <div className="mt-4 text-3xl font-black">92%</div>
          </div>
          <div className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">FPS</div>
            <div className="mt-4 text-3xl font-black">120</div>
          </div>
          <div className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Ngôn ngữ</div>
            <div className="mt-4 text-3xl font-black">120+</div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Danh sách dự án</div>
                <h2 className="mt-2 text-2xl font-bold text-white">Dự án gần đây</h2>
              </div>
              <button className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                Bộ lọc
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="rounded-[22px] border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
                  Đang tải dự án...
                </div>
              ) : projects.length === 0 ? (
                <div className="rounded-[22px] border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
                  Chưa có dự án nào. Hãy tạo một video mới từ Studio.
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id || project.name} className="rounded-[22px] border border-slate-700 bg-slate-950/70 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-lg font-semibold text-white">{project.name}</div>
                        <div className="mt-1 text-sm text-slate-400">{project.language || "Vietnamese"}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                            project.status === "queued"
                              ? "bg-slate-500/10 text-slate-200"
                              : project.status === "rendering"
                                ? "bg-cyan-500/10 text-cyan-200"
                                : project.status === "review"
                                  ? "bg-violet-500/10 text-violet-200"
                                  : "bg-emerald-500/10 text-emerald-200"
                          }`}
                        >
                          {project.status || "queued"}
                        </div>
                        <Link
                          href={`/project/${project.id}`}
                          className="rounded-full bg-cyan-400 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-950"
                        >
                          Mở
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                        <span>Progress</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800">
                        <div
                          className={`h-2 rounded-full ${
                            project.status === "queued"
                              ? "bg-slate-500"
                              : project.status === "rendering"
                                ? "bg-gradient-to-r from-cyan-400 to-violet-500"
                                : project.status === "review"
                                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                  : "bg-gradient-to-r from-emerald-400 to-cyan-500"
                          }`}
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-4 text-[10px] uppercase tracking-[0.22em] text-slate-400">Hàng chờ render</div>
            <div className="space-y-3">
              {queue.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-white">{item.title}</span>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${
                        item.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-200"
                          : item.status === "Processing"
                            ? "bg-violet-500/10 text-violet-200"
                            : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Dòng thời gian</div>
                <h3 className="mt-2 text-2xl font-bold text-white">Trình chỉnh sửa video</h3>
              </div>
              <button className="rounded-full bg-violet-500 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-white">
                Đồng bộ thông minh
              </button>
            </div>

            <div className="rounded-[22px] border border-slate-700 bg-slate-950/70 p-4">
              <div className="mb-4 flex justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {timeline.map((mark) => (
                  <span key={mark}>{mark}</span>
                ))}
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-cyan-200">Dialogue 01</span>
                    <span className="text-slate-300">00:00 - 00:18</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-slate-800">
                      <div className="h-2 w-[84%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
                    </div>
                    <span className="text-xs text-cyan-200">“Chúng ta đã sẵn sàng.”</span>
                  </div>
                </div>

                <div className="rounded-xl border border-violet-500/25 bg-violet-500/10 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-violet-200">Voiceover dub</span>
                    <span className="text-slate-300">00:18 - 00:34</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-slate-800">
                      <div className="h-2 w-[58%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                    </div>
                    <span className="text-xs text-violet-200">“We are ready to launch.”</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-4 text-[10px] uppercase tracking-[0.22em] text-slate-400">Công cụ nhanh</div>
            <div className="space-y-3">
              {[
                "Auto subtitle",
                "AI dubbing",
                "Remove original audio",
                "Upscale 4K",
                "Flip / mirror",
                "Overlay effect",
              ].map((tool) => (
                <button
                  key={tool}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2.5 text-left text-sm text-slate-200 hover:border-cyan-500/40"
                >
                  <span>{tool}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
