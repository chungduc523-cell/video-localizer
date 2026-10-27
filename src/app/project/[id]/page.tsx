"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const transcriptMock = [
  { time: "00:00", source: "Welcome to our product story.", target: "Chào mừng đến với câu chuyện sản phẩm của chúng tôi." },
  { time: "00:06", source: "We localize content for every market.", target: "Chúng tôi bản địa hóa nội dung cho mọi thị trường." },
  { time: "00:13", source: "This version keeps the original energy while feeling native.", target: "Phiên bản này giữ nguyên năng lượng gốc nhưng vẫn tự nhiên, quen thuộc." },
];

export default function ProjectDetailPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProjectDetailContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="rounded-2xl border border-slate-700 bg-slate-900 px-6 py-4 text-slate-200">
        Đang tải chi tiết dự án...
      </div>
    </main>
  );
}

function ProjectDetailContent() {
  const router = useRouter();
  const params = useParams();
  const projectId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("videolocalizer_token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function loadProject() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Không thể tải chi tiết dự án");
        }

        const data = await response.json();
        setProject(data.project);
        setTasks(data.tasks || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (projectId) {
      loadProject();
    }
  }, [projectId, router]);

  if (loading) {
    return <LoadingState />;
  }

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-rose-200">
          Không tìm thấy dự án này.
          <div className="mt-4">
            <Link href="/dashboard" className="rounded-full bg-cyan-400 px-4 py-2 font-semibold text-slate-950">
              Quay lại dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Project detail</div>
              <h1 className="mt-2 text-3xl font-black text-white">{project.name}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard" className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200">
                Quay lại dashboard
              </Link>
              <Link href="/studio" className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">
                Mở studio
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Trạng thái</div>
            <div className="mt-4 text-2xl font-black text-cyan-300">{project.status || "queued"}</div>
          </div>
          <div className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Progress</div>
            <div className="mt-4 text-2xl font-black text-violet-300">{project.progress || 0}%</div>
          </div>
          <div className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Ngôn ngữ</div>
            <div className="mt-4 text-2xl font-black text-emerald-300">{project.language || "Vietnamese"}</div>
          </div>
          <div className="rounded-[24px] border border-slate-800 bg-slate-900/80 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">File</div>
            <div className="mt-4 text-2xl font-black text-amber-300">4K</div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-4 text-[10px] uppercase tracking-[0.22em] text-slate-400">Workflow tiến độ</div>

            <div className="space-y-4">
              {(tasks.length > 0 ? tasks : [
                { title: "AI subtitle generation", status: "completed" },
                { title: "Voiceover localization", status: "processing" },
                { title: "4K export", status: "pending" },
              ]).map((task, index) => (
                <div key={`${task.title}-${index}`} className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-white">{task.title}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${
                        task.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-200"
                          : task.status === "processing"
                            ? "bg-cyan-500/10 text-cyan-200"
                            : "bg-slate-700 text-slate-200"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-5">
            <div className="mb-4 text-[10px] uppercase tracking-[0.22em] text-slate-400">Export & preview</div>
            <div className="rounded-[24px] border border-slate-700 bg-slate-950 p-4">
              <div className="mb-4 h-40 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_30%),linear-gradient(135deg,#0f172a,#111827_40%,#020617)]" />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Format</span>
                  <span className="font-medium text-white">MP4</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Quality</span>
                  <span className="font-medium text-white">4K</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Voiceover</span>
                  <span className="font-medium text-white">AI Vietnamese</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[30px] border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-5 text-[10px] uppercase tracking-[0.22em] text-slate-400">Subtitle preview</div>

          <div className="space-y-3">
            {transcriptMock.map((entry) => (
              <div key={entry.time} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300">{entry.time}</div>
                <div className="space-y-2 text-sm text-slate-300">
                  <div>
                    <span className="text-slate-500">EN:</span> {entry.source}
                  </div>
                  <div>
                    <span className="text-slate-500">VI:</span> {entry.target}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
