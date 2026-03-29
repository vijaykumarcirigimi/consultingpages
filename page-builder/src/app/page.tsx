"use client";

import React, { useState } from "react";

export default function PageBuilder() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "working" | "complete" | "error">("idle");
  const [progressMsg, setProgressMsg] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("working");
    setProgressMsg("Extracting document intelligence & planning page structure...");
    setHtmlOutput("");

    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to generate page.");

      const data = await response.json();
      setHtmlOutput(data.html || "<h1>Error generating HTML</h1>");
      setStatus("complete");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col font-sans overflow-hidden">
      {/* Top Navbar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            A
          </div>
          <h1 className="text-xl font-bold tracking-wide">
            AntiGravity <span className="text-indigo-400 font-medium">Builder</span>
          </h1>
        </div>
        <div className="text-sm text-gray-400">Powered by Gemini AI</div>
      </nav>

      {/* Main Split Interface */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Controls */}
        <div className="w-[450px] flex-shrink-0 flex flex-col bg-[#12121a] border-r border-white/10 z-10">
          <div className="p-8 flex-1 flex flex-col">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              What are we building today?
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Describe the page you want to create. The AI will research competitors, draft strategic copy, and assemble the perfect modules from your design library.
            </p>

            <form onSubmit={handleGenerate} className="flex flex-col gap-4 flex-1">
              <label className="text-sm font-semibold text-gray-300">
                Strategic Brief & Content (.docx)
              </label>
              
              <div className="w-full relative group">
                <input
                  type="file"
                  accept=".docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${file ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-black/50 group-hover:border-white/20'}`}>
                  {file ? (
                    <>
                      <svg className="w-8 h-8 text-indigo-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className="text-sm font-medium text-indigo-300">{file.name}</span>
                      <span className="text-xs text-gray-400 mt-1">Ready to process</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      <span className="text-sm font-medium text-gray-300">Drop your .docx file here</span>
                      <span className="text-xs text-gray-500 mt-1">or click to browse</span>
                    </>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "working" || !file}
                className="mt-4 w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] active:scale-[0.98]"
              >
                {status === "working" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Generate Page Now 🚀"
                )}
              </button>

              {/* Status Indicator */}
              {status === "working" && (
                <div className="mt-8 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col gap-3 animate-pulse">
                   <div className="text-sm font-medium text-indigo-300 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></div>
                     {progressMsg || "Orchestrating agents..."}
                   </div>
                   <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 w-full origin-left animate-[scale-x_2s_ease-in-out_infinite]"></div>
                   </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Right Panel: Live Preview */}
        <div className="flex-1 bg-[#050508] relative flex flex-col">
           {/* Top Bar for Preview */}
           <div className="h-14 border-b border-white/5 bg-[#0a0a0f] flex items-center justify-between px-6">
              <div className="flex gap-1 bg-black/50 p-1 rounded-lg border border-white/5">
                 <button 
                  onClick={() => setActiveTab("preview")}
                  className={`px-4 py-1.5 text-sm rounded-md transition-all ${activeTab === "preview" ? "bg-white/10 text-white shadow" : "text-gray-500 hover:text-gray-300"}`}
                 >
                   Visual Preview
                 </button>
                 <button 
                  onClick={() => setActiveTab("code")}
                  className={`px-4 py-1.5 text-sm rounded-md transition-all ${activeTab === "code" ? "bg-white/10 text-white shadow" : "text-gray-500 hover:text-gray-300"}`}
                 >
                   Raw HTML
                 </button>
              </div>
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
           </div>

           {/* Preview Area */}
           <div className="flex-1 relative overflow-hidden bg-white">
              {status === "idle" && !htmlOutput && (
                 <div className="absolute inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center text-gray-500">
                    <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p>Upload a strategy document and hit generate to see the magic.</p>
                 </div>
              )}
              {activeTab === "preview" && htmlOutput && (
                 <iframe 
                    title="Live Preview" 
                    srcDoc={htmlOutput} 
                    className="w-full h-full border-none pointer-events-auto"
                    sandbox="allow-scripts allow-same-origin"
                 />
              )}
              {activeTab === "code" && htmlOutput && (
                 <div className="absolute inset-0 bg-[#0d0d12] overflow-auto p-6 text-sm font-mono text-green-400">
                    <pre><code>{htmlOutput}</code></pre>
                 </div>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}
