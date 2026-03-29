"use client";

import React, { useState, useEffect, useCallback } from "react";

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

interface Section {
  index: number;
  title: string;
  module: string;
  content: string;
}

interface SeoData {
  title: string;
  description: string;
}

interface LibraryVariant {
  id: string;
  file: string;
  layout: string;
  features: string[];
  best_for: string;
}

interface LibraryCategory {
  label: string;
  description: string;
  is_visual?: boolean;
  variants: LibraryVariant[];
}

type LibraryIndex = {
  sections: Record<string, LibraryCategory>;
};

/* ────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────── */

export default function PageBuilder() {
  const [sections, setSections] = useState<Section[]>([]);
  const [seo, setSeo] = useState<SeoData>({ title: "", description: "" });
  const [library, setLibrary] = useState<LibraryIndex | null>(null);
  const [pickerFor, setPickerFor] = useState<number | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [status, setStatus] = useState<"upload" | "building" | "stitching">("upload");
  const [error, setError] = useState("");

  // Load library index
  useEffect(() => {
    fetch("/library/library-index.json")
      .then(r => r.json())
      .then(data => setLibrary(data))
      .catch(() => console.warn("Could not load library index"));
  }, []);

  /* ── Upload handler ── */
  const handleUpload = async (file: File) => {
    setError("");
    setStatus("building");
    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await fetch("/api/parse", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSections(data.sections);
      setSeo(data.seo || { title: "", description: "" });
      setStatus("building");
    } catch (e: any) {
      setError(e.message);
      setStatus("upload");
    }
  };

  /* ── Change a section's design ── */
  const changeDesign = (sectionIndex: number, newModule: string) => {
    setSections(prev =>
      prev.map(s => s.index === sectionIndex ? { ...s, module: newModule } : s)
    );
    setPickerFor(null);
    setPreviewHtml(""); // Clear preview to force rebuild
  };

  /* ── Remove a section ── */
  const removeSection = (sectionIndex: number) => {
    setSections(prev => prev.filter(s => s.index !== sectionIndex));
  };

  /* ── Assemble & Download ── */
  const handleStitch = async () => {
    setStatus("stitching");
    setError("");
    try {
      const res = await fetch("/api/stitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: sections.map(s => ({ module: s.module, content: s.content })), seo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPreviewHtml(data.html);
      setStatus("building");
    } catch (e: any) {
      setError(e.message);
      setStatus("building");
    }
  };

  const handleDownload = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${seo.title?.replace(/[^a-z0-9]/gi, "-").toLowerCase() || "page"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSections([]);
    setPreviewHtml("");
    setStatus("upload");
    setError("");
  };

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2D2F6B] to-[#C5E826] flex items-center justify-center font-bold text-sm">E</div>
          <h1 className="text-xl font-bold tracking-wide">
            Edstellar <span className="text-[#C5E826] font-medium">Page Stitcher</span>
          </h1>
        </div>
        <div className="text-sm text-gray-400">No AI — You pick the designs</div>
      </nav>

      {/* Upload Screen */}
      {status === "upload" && (
        <UploadScreen onUpload={handleUpload} error={error} />
      )}

      {/* Builder Screen */}
      {(status === "building" || status === "stitching") && sections.length > 0 && (
        <main className="flex-1 flex overflow-hidden max-lg:flex-col">
          {/* Left: Section List */}
          <div className="w-[440px] max-lg:w-full flex-shrink-0 flex flex-col bg-[#12121a] border-r border-white/10 overflow-y-auto">
            <div className="p-6 pb-2">
              <h2 className="text-lg font-bold text-[#C5E826] mb-1">{sections.length} Sections Found</h2>
              <p className="text-xs text-gray-500 mb-4">Click "Change" to pick a different design from the library.</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
              {sections.map((section) => (
                <SectionCard
                  key={section.index}
                  section={section}
                  onChangeDesign={() => setPickerFor(section.index)}
                  onRemove={() => removeSection(section.index)}
                />
              ))}
            </div>
            <div className="p-4 border-t border-white/10 flex gap-3">
              <button
                onClick={handleStitch}
                disabled={status === "stitching"}
                className="flex-1 py-3 rounded-xl font-bold text-[#1A2600] bg-[#C5E826] hover:bg-[#D4F23A] disabled:opacity-50 transition-all"
              >
                {status === "stitching" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner /> Stitching...
                  </span>
                ) : "Assemble Page"}
              </button>
              {previewHtml && (
                <button onClick={handleDownload} className="px-5 py-3 rounded-xl font-semibold text-[#C5E826] border border-[#C5E826]/30 hover:bg-[#C5E826]/10 transition-all">
                  Download
                </button>
              )}
            </div>
            {error && (
              <div className="mx-4 mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>
            )}
          </div>

          {/* Right: Preview */}
          <div className="flex-1 bg-[#050508] relative flex flex-col">
            <div className="h-12 border-b border-white/5 bg-[#0a0a0f] flex items-center justify-between px-6">
              <span className="text-sm text-gray-400">
                {previewHtml ? "Live Preview" : "Click Assemble to preview"}
              </span>
              {previewHtml && (
                <button
                  onClick={() => navigator.clipboard.writeText(previewHtml)}
                  className="text-xs text-gray-500 hover:text-[#C5E826] border border-white/10 px-3 py-1 rounded transition-colors"
                >
                  Copy HTML
                </button>
              )}
            </div>
            <div className="flex-1 relative overflow-hidden bg-white">
              {previewHtml ? (
                <iframe title="Preview" srcDoc={previewHtml} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" />
              ) : (
                <div className="absolute inset-0 bg-[#0a0a0f] flex items-center justify-center text-gray-600 text-sm">
                  Assign designs to sections, then click Assemble Page
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Library Picker Modal */}
      {pickerFor !== null && library && (
        <LibraryPicker
          library={library}
          currentModule={sections.find(s => s.index === pickerFor)?.module || ""}
          onSelect={(mod) => changeDesign(pickerFor, mod)}
          onClose={() => setPickerFor(null)}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   Upload Screen
   ──────────────────────────────────────────── */

function UploadScreen({ onUpload, error }: { onUpload: (f: File) => void; error: string }) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-[#C5E826] to-[#7D9A00] bg-clip-text text-transparent">
          Upload Developer Reference
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          Upload your <code className="text-gray-300">.docx</code> developer-reference document.
          The app will parse all sections, let you choose designs from the library, and stitch a complete page.
        </p>

        <div
          className={`relative w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer
            ${dragOver ? "border-[#C5E826] bg-[#C5E826]/5" : "border-white/15 bg-white/[0.02] hover:border-white/25"}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f?.name.endsWith(".docx")) onUpload(f);
          }}
        >
          <input
            type="file"
            accept=".docx"
            onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f); }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <svg className="w-12 h-12 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm font-medium text-gray-300">Drop your developer-reference .docx</span>
          <span className="text-xs text-gray-500 mt-1">or click to browse</span>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Section Card
   ──────────────────────────────────────────── */

function SectionCard({
  section,
  onChangeDesign,
  onRemove,
}: {
  section: Section;
  onChangeDesign: () => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const shortModule = section.module.replace("edstellar-", "").replace(".html", "");

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 hover:border-white/15 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#C5E826]/70 shrink-0">S{String(section.index).padStart(2, "0")}</span>
            <h3 className="text-sm font-semibold text-white truncate">{section.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#2D2F6B]/40 text-[#C5E826]/80 font-mono truncate max-w-[220px]">
              {shortModule}
            </span>
            <button onClick={onChangeDesign} className="text-[10px] text-[#C5E826] hover:underline shrink-0">
              Change
            </button>
          </div>
        </div>
        <button onClick={onRemove} className="text-gray-600 hover:text-red-400 transition-colors p-1" title="Remove section">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Content preview */}
      <button onClick={() => setExpanded(!expanded)} className="mt-2 text-[10px] text-gray-500 hover:text-gray-300 transition-colors">
        {expanded ? "Hide content" : "Show content"}
      </button>
      {expanded && (
        <pre className="mt-2 text-[10px] text-gray-500 bg-black/30 rounded-lg p-3 max-h-48 overflow-y-auto whitespace-pre-wrap break-words">
          {section.content.substring(0, 1000)}{section.content.length > 1000 ? "..." : ""}
        </pre>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────
   Library Picker Modal
   ──────────────────────────────────────────── */

function LibraryPicker({
  library,
  currentModule,
  onSelect,
  onClose,
}: {
  library: LibraryIndex;
  currentModule: string;
  onSelect: (module: string) => void;
  onClose: () => void;
}) {
  const [filter, setFilter] = useState("");

  // Flatten all variants
  const allVariants: { category: string; categoryLabel: string; variant: LibraryVariant }[] = [];
  for (const [catKey, cat] of Object.entries(library.sections)) {
    if (cat.is_visual === false) continue;
    for (const v of cat.variants) {
      allVariants.push({ category: catKey, categoryLabel: cat.label, variant: v });
    }
  }

  const filtered = filter
    ? allVariants.filter(v =>
        v.categoryLabel.toLowerCase().includes(filter.toLowerCase()) ||
        v.variant.id.toLowerCase().includes(filter.toLowerCase()) ||
        v.variant.layout.toLowerCase().includes(filter.toLowerCase()) ||
        v.variant.best_for.toLowerCase().includes(filter.toLowerCase())
      )
    : allVariants;

  // Group by category
  const grouped: Record<string, typeof allVariants> = {};
  for (const item of filtered) {
    if (!grouped[item.categoryLabel]) grouped[item.categoryLabel] = [];
    grouped[item.categoryLabel].push(item);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#15151f] border border-white/10 rounded-2xl w-[90vw] max-w-[900px] max-h-[85vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Choose a Design</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white p-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search designs... (e.g. stats, hero, faq, navy, cards)"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C5E826]/40"
            autoFocus
          />
        </div>

        {/* Design Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {Object.entries(grouped).map(([catLabel, items]) => (
            <div key={catLabel}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{catLabel}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map(({ variant }) => {
                  const isCurrent = variant.file === currentModule;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => onSelect(variant.file)}
                      className={`text-left p-4 rounded-xl border transition-all hover:scale-[1.01]
                        ${isCurrent
                          ? "border-[#C5E826]/50 bg-[#C5E826]/5"
                          : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-sm font-semibold text-white">{variant.id}</span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C5E826]/20 text-[#C5E826] font-bold">CURRENT</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-2 line-clamp-2">{variant.layout}</p>
                      <div className="flex flex-wrap gap-1">
                        {variant.features.slice(0, 4).map((f, fi) => (
                          <span key={fi} className="text-[9px] px-1.5 py-0.5 rounded bg-[#2D2F6B]/30 text-[#C5E826]/60">
                            {f}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-gray-500 italic">{variant.best_for}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <p className="text-center text-gray-500 py-12">No designs match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Spinner ── */
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
