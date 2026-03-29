"use client";

import React, { useState, useRef } from "react";

type Status = "idle" | "working" | "complete" | "error";

const PROGRESS_MESSAGES = [
  "Extracting document intelligence...",
  "Parsing section-to-module mapping...",
  "Loading design templates from library...",
  "Filling Hero section with AI...",
  "Filling Challenge & Stats sections...",
  "Filling Services & Detail sections...",
  "Filling Process & Outcomes sections...",
  "Filling Testimonials & FAQ sections...",
  "Stitching all sections together...",
  "Assembling final responsive page...",
];

export default function PageBuilder() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progressIdx, setProgressIdx] = useState(0);
  const [htmlOutput, setHtmlOutput] = useState("");
  const [sectionCount, setSectionCount] = useState(0);
  const [modules, setModules] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgressCycle = () => {
    setProgressIdx(0);
    intervalRef.current = setInterval(() => {
      setProgressIdx((prev) => {
        if (prev < PROGRESS_MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 4000);
  };

  const stopProgressCycle = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("working");
    setErrorMsg("");
    setHtmlOutput("");
    setSectionCount(0);
    setModules([]);
    startProgressCycle();

    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate page.");
      }

      setHtmlOutput(data.html || "");
      setSectionCount(data.sectionCount || 0);
      setModules(data.modules || []);
      setStatus("complete");
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Unknown error");
      setStatus("error");
    } finally {
      stopProgressCycle();
    }
  };

  const handleDownload = () => {
    if (!htmlOutput) return;
    const blob = new Blob([htmlOutput], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const slug = file?.name.replace(/\.docx$/i, "") || "page";
    a.download = `${slug}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setHtmlOutput("");
    setSectionCount(0);
    setModules([]);
    setErrorMsg("");
    setActiveTab("preview");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col font-sans overflow-hidden">
      {/* ─── Navbar ─── */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2D2F6B] to-[#C5E826] flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(45,47,107,0.5)]">
            E
          </div>
          <h1 className="text-xl font-bold tracking-wide">
            Edstellar{" "}
            <span className="text-[#C5E826] font-medium">Page Stitcher</span>
          </h1>
        </div>
        <div className="text-sm text-gray-400">
          Powered by Gemini 2.0 Flash
        </div>
      </nav>

      {/* ─── Main Split ─── */}
      <main className="flex-1 flex overflow-hidden max-md:flex-col">
        {/* ─── Left Panel ─── */}
        <div className="w-[420px] max-md:w-full flex-shrink-0 flex flex-col bg-[#12121a] border-r border-white/10 z-10">
          <div className="p-8 flex-1 flex flex-col">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#C5E826] to-[#7D9A00] bg-clip-text text-transparent">
              Upload Developer Reference
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Upload a <code className="text-gray-300">.docx</code>{" "}
              developer-reference document. The stitcher reads every{" "}
              <strong className="text-gray-300">DESIGN MODULE</strong> tag,
              loads the matching HTML template, fills it with your content via
              AI, and assembles a complete responsive page.
            </p>

            <form onSubmit={handleGenerate} className="flex flex-col gap-4 flex-1">
              {/* ─ File Drop Zone ─ */}
              <div className="w-full relative group">
                <input
                  type="file"
                  accept=".docx"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    if (status !== "idle") handleReset();
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${
                    file
                      ? "border-[#C5E826]/60 bg-[#C5E826]/5"
                      : "border-white/10 bg-black/50 group-hover:border-white/20"
                  }`}
                >
                  {file ? (
                    <>
                      <svg
                        className="w-8 h-8 text-[#C5E826] mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-[#C5E826]/90">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        Ready to stitch
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 text-gray-500 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-300">
                        Drop your developer-reference .docx here
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        or click to browse
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* ─ Generate Button ─ */}
              <button
                type="submit"
                disabled={status === "working" || !file}
                className="mt-4 w-full py-4 rounded-xl font-bold text-[#1A2600] bg-gradient-to-r from-[#C5E826] to-[#A8C41E] hover:from-[#D4F23A] hover:to-[#B8D428] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(197,232,38,0.2)] hover:shadow-[0_0_30px_rgba(197,232,38,0.4)] active:scale-[0.98]"
              >
                {status === "working" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Stitching Page...
                  </span>
                ) : (
                  "Stitch Page"
                )}
              </button>

              {/* ─ Progress ─ */}
              {status === "working" && (
                <div className="mt-6 p-4 rounded-xl bg-[#2D2F6B]/20 border border-[#2D2F6B]/30 flex flex-col gap-3">
                  <div className="text-sm font-medium text-[#C5E826]/90 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#C5E826] animate-ping" />
                    {PROGRESS_MESSAGES[progressIdx]}
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#2D2F6B] to-[#C5E826] h-1.5 rounded-full transition-all duration-1000"
                      style={{
                        width: `${((progressIdx + 1) / PROGRESS_MESSAGES.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ─ Error ─ */}
              {status === "error" && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  <strong>Error:</strong> {errorMsg}
                </div>
              )}

              {/* ─ Success Summary ─ */}
              {status === "complete" && (
                <div className="mt-4 flex flex-col gap-3">
                  <div className="p-4 rounded-xl bg-[#C5E826]/10 border border-[#C5E826]/20 text-[#C5E826] text-sm">
                    <strong>{sectionCount} sections</strong> stitched
                    successfully from {new Set(modules).size} unique templates.
                  </div>

                  {/* Download + Reset */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-3 rounded-xl font-bold text-[#1A2600] bg-[#C5E826] hover:bg-[#D4F23A] transition-all"
                    >
                      Download HTML
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-5 py-3 rounded-xl font-semibold text-gray-300 border border-white/15 hover:bg-white/5 transition-all"
                    >
                      New Page
                    </button>
                  </div>

                  {/* Module list */}
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer hover:text-gray-300 transition-colors">
                      View section modules
                    </summary>
                    <ol className="mt-2 ml-4 list-decimal space-y-0.5 max-h-48 overflow-y-auto">
                      {modules.map((mod, i) => (
                        <li key={i} className="text-gray-500">
                          {mod}
                        </li>
                      ))}
                    </ol>
                  </details>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* ─── Right Panel: Preview ─── */}
        <div className="flex-1 bg-[#050508] relative flex flex-col">
          {/* Tab Bar */}
          <div className="h-14 border-b border-white/5 bg-[#0a0a0f] flex items-center justify-between px-6">
            <div className="flex gap-1 bg-black/50 p-1 rounded-lg border border-white/5">
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                  activeTab === "preview"
                    ? "bg-white/10 text-white shadow"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Visual Preview
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                  activeTab === "code"
                    ? "bg-white/10 text-white shadow"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Raw HTML
              </button>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
          </div>

          {/* Preview / Code */}
          <div className="flex-1 relative overflow-hidden bg-white">
            {status === "idle" && !htmlOutput && (
              <div className="absolute inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center text-gray-500 gap-2 px-8 text-center">
                <svg
                  className="w-16 h-16 mb-2 opacity-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p>Upload a developer-reference .docx and hit Stitch Page.</p>
              </div>
            )}
            {status === "working" && (
              <div className="absolute inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center text-gray-500 gap-4">
                <div className="w-12 h-12 border-4 border-[#2D2F6B] border-t-[#C5E826] rounded-full animate-spin" />
                <p className="text-sm">Building your page...</p>
              </div>
            )}
            {activeTab === "preview" && htmlOutput && (
              <iframe
                title="Live Preview"
                srcDoc={htmlOutput}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin"
              />
            )}
            {activeTab === "code" && htmlOutput && (
              <div className="absolute inset-0 bg-[#0d0d12] overflow-auto p-6">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(htmlOutput)}
                    className="text-xs text-gray-500 hover:text-[#C5E826] border border-white/10 px-3 py-1 rounded transition-colors"
                  >
                    Copy to clipboard
                  </button>
                </div>
                <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap break-words">
                  <code>{htmlOutput}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
