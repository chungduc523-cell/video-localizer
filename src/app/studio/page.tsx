"use client";

import Link from "next/link";
import { ChangeEvent, useState, useEffect } from "react";

const clips = [
  { id: 1, label: "Intro shot", start: "00:00", end: "00:14", duration: "14s", color: "cyan" },
  { id: 2, label: "Voiceover dub", start: "00:14", end: "00:31", duration: "17s", color: "violet" },
  { id: 3, label: "B-roll", start: "00:31", end: "00:52", duration: "21s", color: "emerald" },
  { id: 4, label: "Caption overlay", start: "00:52", end: "01:08", duration: "16s", color: "amber" },
];

const layers = [
  { name: "Main video", type: "Video", visible: true, opacity: 100 },
  { name: "AI dialogue VN", type: "Audio", visible: true, opacity: 80 },
  { name: "Subtitle track", type: "Text", visible: true, opacity: 100 },
  { name: "Logo overlay", type: "Graphic", visible: false, opacity: 50 },
];

const transcript = [
  { time: "00:00", source: "Welcome to our product story.", target: "Chào mừng đến với câu chuyện sản phẩm của chúng tôi." },
  { time: "00:06", source: "We localize content for every market.", target: "Chúng tôi bản địa hóa nội dung cho mọi thị trường." },
  { time: "00:13", source: "This version keeps the original energy while feeling native.", target: "Phiên bản này giữ được năng lượng gốc và cảm giác tự nhiên cho người xem địa phương." },
];

const timelineMarks = ["00:00", "00:12", "00:24", "00:36", "00:48", "01:00", "01:12", "01:24"];
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState("timeline");
  const [projectName, setProjectName] = useState("Campaign Launch — Localization");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [voiceOptions, setVoiceOptions] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("nhat-minh");
  const [voiceoverMessage, setVoiceoverMessage] = useState("");
  const [isVoiceGenerating, setIsVoiceGenerating] = useState(false);
  const [dubbingStatus, setDubbingStatus] = useState<Record<string, boolean>>({});
  const [dubbingResults, setDubbingResults] = useState<Record<string, string>>({});
  const [exportMessage, setExportMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadVoices() {
      const token = localStorage.getItem("videolocalizer_token");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/voiceover/voices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data.voices)) {
          setVoiceOptions(data.voices);
          setSelectedVoice(data.voices[0]?.id || "nhat-minh");
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadVoices();
  }, []);

  async function handleVoiceover(targetText = transcript[0]?.target || "Chúng tôi đã sẵn sàng để lồng tiếng cho video của bạn.", itemTime?: string) {
    const token = localStorage.getItem("videolocalizer_token");
    if (!token) {
      setVoiceoverMessage("Bạn cần đăng nhập để tạo giọng AI.");
      window.location.href = "/login";
      return;
    }

    setIsVoiceGenerating(true);
    setVoiceoverMessage("");

    if (itemTime) {
      setDubbingStatus((current) => ({ ...current, [itemTime]: true }));
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/voiceover`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: targetText,
          voice: selectedVoice,
          language: "Vietnamese",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Không thể tạo giọng AI");
      }

      const message = `Giọng ${data.voiceover.voiceName} đã được lên lịch thành công (${data.voiceover.engine}).`;
      setVoiceoverMessage(message);

      if (itemTime) {
        setDubbingResults((current) => ({ ...current, [itemTime]: message }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Có lỗi khi tạo voiceover";
      setVoiceoverMessage(message);
      if (itemTime) {
        setDubbingResults((current) => ({ ...current, [itemTime]: message }));
      }
    } finally {
      setIsVoiceGenerating(false);
      if (itemTime) {
        setDubbingStatus((current) => ({ ...current, [itemTime]: false }));
      }
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      setUploadMessage("Vui lòng chọn file video trước khi tải lên.");
      return;
    }

    const token = localStorage.getItem("videolocalizer_token");
    if (!token) {
      setUploadMessage("Bạn cần đăng nhập để upload video.");
      window.location.href = "/login";
      return;
    }

    const formData = new FormData();
    formData.append("video", selectedFile);
    formData.append("projectName", projectName);

    try {
      setIsUploading(true);
      setUploadMessage("");

      const projectResponse = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: projectName, language: "Vietnamese" }),
      });

      const projectData = await projectResponse.json();
      if (!projectResponse.ok) {
        throw new Error(projectData.message || "Không thể tạo dự án");
      }

      const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || "Upload thất bại");
      }

      setUploadMessage(
        `Dự án "${projectData.project.name}" đã được tạo và file ${uploadData.file.filename} đã tải lên thành công.`
      );
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "Có lỗi xảy ra khi upload");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleExport() {
    const token = localStorage.getItem("videolocalizer_token");
    if (!token) {
      setExportMessage("Bạn cần đăng nhập để render final video.");
      window.location.href = "/login";
      return;
    }

    setIsExporting(true);
    setExportMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName,
          format: "mp4",
          quality: "4K",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Không thể render video cuối");
      }

      setExportMessage(
        `Render thành công: ${data.export.filename} • ${data.export.quality} • ${data.export.outputSize}`
      );
    } catch (error) {
      setExportMessage(error instanceof Error ? error.message : "Có lỗi khi render video");
    } finally {
      setIsExporting(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setUploadMessage("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[28px] border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/30">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 text-lg font-black text-slate-950">
                V
              </div>
              <div>
                <div className="text-lg font-bold">Studio Video AI</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Video Localizer</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard" className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 hover:border-slate-500">
                Quay lại dashboard
              </Link>
              <button className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">
                Xuất bản
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.85fr]">
          <section className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-4">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Dự án</div>
                <h1 className="mt-2 text-2xl font-black text-white">Campaign Launch — Localization</h1>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Hoàn tất 82%
              </div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-slate-700 bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                <span>Preview</span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-violet-500/15 px-2 py-1 text-violet-200">1080p</span>
                  <span className="rounded-full bg-cyan-500/15 px-2 py-1 text-cyan-200">4K export</span>
                </div>
              </div>

              <div className="relative h-[360px] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_25%),linear-gradient(135deg,#0f172a,#111827_40%,#020617)] p-5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-52 w-52 rounded-full border border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_70px_rgba(34,211,238,0.25)]" />
                </div>
                <div className="absolute left-10 top-10 h-24 w-24 rounded-2xl border border-violet-400/50 bg-violet-500/10" />
                <div className="absolute bottom-10 right-12 h-28 w-28 rounded-2xl border border-emerald-400/50 bg-emerald-500/10" />
                <div className="absolute inset-x-0 bottom-5 mx-auto w-[70%] rounded-2xl border border-slate-700 bg-slate-900/75 p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-slate-400">
                    <span>AI subtitle</span>
                    <span>00:14 / 01:24</span>
                  </div>
                  <p className="text-lg font-semibold text-white">We are ready to bring your message to global audiences.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-slate-800 bg-slate-950/60 p-4">
              <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center">
                <input
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                  placeholder="Tên dự án"
                />
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950">
                  Chọn video
                  <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                </label>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="rounded-full bg-violet-500 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? "Đang tải..." : "Tải lên"}
                </button>
              </div>

              {selectedFile && (
                <div className="mb-3 text-sm text-slate-300">
                  File đã chọn: <span className="font-medium text-cyan-300">{selectedFile.name}</span>
                </div>
              )}

              {uploadMessage && (
                <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">
                  {uploadMessage}
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Cắt clip",
                "Dịch tự động",
                "Lồng tiếng",
                "Thay âm thanh",
                "Hiệu ứng xanh",
                "Export 4K",
              ].map((action) => (
                <button key={action} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-slate-200 hover:border-cyan-500/40">
                  {action}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-[26px] border border-slate-800 bg-slate-950/60 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">AI voiceover</div>
                  <div className="mt-1 text-lg font-bold text-white">Lựa chọn giọng lồng tiếng</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleVoiceover()}
                  disabled={isVoiceGenerating}
                  className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isVoiceGenerating ? "Đang tạo..." : "Tạo giọng AI"}
                </button>
              </div>

              <div className="mb-3 grid gap-2 sm:grid-cols-2">
                {(voiceOptions.length > 0 ? voiceOptions : [
                  { id: 'nhat-minh', name: 'Nhất Minh', gender: 'male' },
                  { id: 'huyen-trang', name: 'Huyền Trang', gender: 'female' },
                  { id: 'minh-anh', name: 'Minh Anh', gender: 'female' },
                  { id: 'duc-huy', name: 'Đức Huy', gender: 'male' },
                ]).map((voice) => (
                  <button
                    key={voice.id}
                    type="button"
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`rounded-2xl border px-3 py-2 text-left text-sm ${
                      selectedVoice === voice.id
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-100'
                        : 'border-slate-700 bg-slate-900 text-slate-200'
                    }`}
                  >
                    <div className="font-semibold">{voice.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{voice.gender}</div>
                  </button>
                ))}
              </div>

              {voiceoverMessage && (
                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                  {voiceoverMessage}
                </div>
              )}
            </div>

            <div className="mt-6 rounded-[26px] border border-slate-800 bg-slate-950/60 p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {[
                  { key: "timeline", label: "Dòng thời gian" },
                  { key: "layers", label: "Layer" },
                  { key: "render", label: "Render" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] ${
                      activeTab === tab.key
                        ? "bg-cyan-400 text-slate-950"
                        : "border border-slate-700 bg-slate-900 text-slate-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "timeline" && (
                <div className="space-y-3">
                  <div className="mb-4 flex justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    {timelineMarks.map((mark) => (
                      <span key={mark}>{mark}</span>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {clips.map((clip) => (
                      <div key={clip.id} className="rounded-2xl border border-slate-700 bg-slate-900 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className={`h-3 w-3 rounded-full ${
                              clip.color === "cyan"
                                ? "bg-cyan-400"
                                : clip.color === "violet"
                                  ? "bg-violet-400"
                                  : clip.color === "emerald"
                                    ? "bg-emerald-400"
                                    : "bg-amber-400"
                            }`} />
                            <span className="font-medium text-white">{clip.label}</span>
                          </div>
                          <span className="text-xs text-slate-400">{clip.start} - {clip.end}</span>
                        </div>
                        <div className="mt-3 h-2.5 rounded-full bg-slate-800">
                          <div
                            className={`h-2.5 rounded-full ${
                              clip.color === "cyan"
                                ? "bg-gradient-to-r from-cyan-400 to-violet-500"
                                : clip.color === "violet"
                                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                  : clip.color === "emerald"
                                    ? "bg-gradient-to-r from-emerald-400 to-cyan-500"
                                    : "bg-gradient-to-r from-amber-400 to-orange-500"
                            }`}
                            style={{ width: clip.duration === "14s" ? "40%" : clip.duration === "17s" ? "48%" : clip.duration === "21s" ? "58%" : "46%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "layers" && (
                <div className="space-y-3">
                  {layers.map((layer) => (
                    <div key={layer.name} className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900 p-3">
                      <div>
                        <div className="font-medium text-white">{layer.name}</div>
                        <div className="text-xs text-slate-400">{layer.type}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{layer.opacity}%</span>
                        <button className={`h-6 w-10 rounded-full ${layer.visible ? "bg-cyan-400" : "bg-slate-700"}`}>
                          <span className={`block h-4 w-4 rounded-full bg-white transition ${layer.visible ? "translate-x-5" : "translate-x-1"}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "render" && (
                <div className="space-y-3">
                  {[
                    ["Định dạng", "MP4"],
                    ["Chất lượng", "4K"],
                    ["Codec", "H.264"],
                    ["Tốc độ render", "4x"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900 p-3 text-sm">
                      <span className="text-slate-400">{label}</span>
                      <span className="font-medium text-white">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-4 text-[10px] uppercase tracking-[0.22em] text-slate-400">Công cụ</div>
              <div className="space-y-3">
                {[
                  "Upload video",
                  "Trích xuất âm thanh",
                  "Lấy subtitle",
                  "Tạo voiceover",
                  "Hiệu ứng overlay",
                ].map((tool) => (
                  <button key={tool} className="flex w-full items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-3 text-left text-sm text-slate-200 hover:border-cyan-500/40">
                    <span>{tool}</span>
                    <span className="text-cyan-300">→</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-4 text-[10px] uppercase tracking-[0.22em] text-slate-400">Transcript</div>
              <div className="space-y-3">
                {transcript.map((item) => (
                  <div key={item.time} className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                    <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-cyan-300">{item.time}</div>
                    <div className="space-y-2 text-sm text-slate-200">
                      <p><span className="text-slate-400">EN:</span> {item.source}</p>
                      <p><span className="text-slate-400">VI:</span> {item.target}</p>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleVoiceover(item.target, item.time)}
                        disabled={Boolean(dubbingStatus[item.time])}
                        className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {dubbingStatus[item.time] ? "Đang tạo..." : "Dub line"}
                      </button>

                      {dubbingResults[item.time] ? (
                        <span className="text-[10px] text-cyan-300">{dubbingResults[item.time]}</span>
                      ) : (
                        <span className="text-[10px] text-slate-500">Chưa tạo</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-800 bg-slate-900/80 p-5">
              <div className="mb-4 text-[10px] uppercase tracking-[0.22em] text-slate-400">Export</div>
              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Kết quả</span>
                    <span className="font-semibold text-emerald-300">{isExporting ? "Rendering" : "Ready"}</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Thời lượng</span>
                    <span className="font-semibold text-white">01:24</span>
                  </div>
                </div>

                {exportMessage && (
                  <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
                    {exportMessage}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full rounded-full bg-violet-500 px-4 py-3 font-semibold text-white hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isExporting ? "Đang render..." : "Render phiên bản cuối"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
