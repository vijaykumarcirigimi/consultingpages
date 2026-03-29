"use client";

import React, { useState, useEffect, useRef, useCallback, DragEvent } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

interface Section {
  index: number;
  title: string;
  module: string;
  contentHtml: string;
  contentText: string;
}

interface CanvasItem {
  uid: string;
  sectionIndex: number;
  title: string;
  module: string;
  contentHtml: string;  // HTML for display and editing (Tiptap)
}

interface SeoData { title: string; description: string; }

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

type LibraryIndex = { sections: Record<string, LibraryCategory> };

let uidCounter = 0;
function uid() { return `c${++uidCounter}-${Date.now()}`; }

/* cleanContent and textToHtml removed — the parse API now returns
   properly structured HTML from mammoth.convertToHtml(), with all
   design-reference markers already stripped server-side. */

/* ────────────────────────────────────────────
   Main
   ──────────────────────────────────────────── */

export default function PageBuilder() {
  const [sections, setSections] = useState<Section[]>([]);
  const [seo, setSeo] = useState<SeoData>({ title: "", description: "" });
  const [canvas, setCanvas] = useState<CanvasItem[]>([]);
  const [library, setLibrary] = useState<LibraryIndex | null>(null);
  const [pickerPending, setPickerPending] = useState<Section | null>(null); // section waiting for design choice
  const [dropInsertIdx, setDropInsertIdx] = useState<number | null>(null);  // where to insert on canvas
  const [previewHtml, setPreviewHtml] = useState("");
  const [stitching, setStiching] = useState(false);
  const [error, setError] = useState("");
  const [changingUid, setChangingUid] = useState<string | null>(null); // canvas item changing design

  // Drag state for reordering canvas items
  const [dragCanvasUid, setDragCanvasUid] = useState<string | null>(null);
  const [reorderIdx, setReorderIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/library/library-index.json")
      .then(r => r.json())
      .then(setLibrary)
      .catch(() => {});
  }, []);

  /* ── Upload ── */
  const handleUpload = async (file: File) => {
    setError("");
    const formData = new FormData();
    formData.append("document", file);
    try {
      const res = await fetch("/api/parse", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSections(data.sections);
      setSeo(data.seo || { title: "", description: "" });
      setCanvas([]);
      setPreviewHtml("");
    } catch (e: any) {
      setError(e.message);
    }
  };

  /* ── Drop from left panel onto canvas ── */
  const handleCanvasDrop = (e: DragEvent) => {
    e.preventDefault();
    const idx = e.dataTransfer.getData("sectionIndex");
    if (!idx) return;
    const section = sections.find(s => s.index === Number(idx));
    if (!section) return;
    setDropInsertIdx(reorderIdx ?? canvas.length);
    setPickerPending(section);
    setReorderIdx(null);
  };

  /* ── Design chosen from picker ── */
  const handleDesignChosen = (file: string) => {
    if (changingUid) {
      // Changing design of existing canvas item
      setCanvas(prev => prev.map(c => c.uid === changingUid ? { ...c, module: file } : c));
      setChangingUid(null);
      setPickerPending(null);
      setPreviewHtml("");
      return;
    }
    if (pickerPending) {
      const item: CanvasItem = {
        uid: uid(),
        sectionIndex: pickerPending.index,
        title: pickerPending.title,
        module: file,
        contentHtml: pickerPending.contentHtml,
      };
      setCanvas(prev => {
        const next = [...prev];
        const insertAt = dropInsertIdx ?? prev.length;
        next.splice(insertAt, 0, item);
        return next;
      });
      setPickerPending(null);
      setDropInsertIdx(null);
      setPreviewHtml("");
    }
  };

  /* ── Canvas reorder ── */
  const handleCanvasReorder = (fromUid: string, toIdx: number) => {
    setCanvas(prev => {
      const fromIdx = prev.findIndex(c => c.uid === fromUid);
      if (fromIdx === -1) return prev;
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx > fromIdx ? toIdx - 1 : toIdx, 0, item);
      return next;
    });
    setPreviewHtml("");
  };

  /* ── Remove from canvas ── */
  const removeFromCanvas = (cuid: string) => {
    setCanvas(prev => prev.filter(c => c.uid !== cuid));
    setPreviewHtml("");
  };

  /* ── Assemble ── */
  const handleAssemble = async () => {
    if (!canvas.length) return;
    setStiching(true);
    setError("");
    try {
      const res = await fetch("/api/stitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: canvas.map(c => ({ module: c.module, content: htmlToPlainText(c.contentHtml) })),
          seo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPreviewHtml(data.html);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setStiching(false);
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
    setCanvas([]);
    setPreviewHtml("");
    setError("");
  };

  const showPicker = !!pickerPending || !!changingUid;

  /* ── Lookup design label from library index ── */
  const getDesignLabel = (moduleFile: string): { category: string; variant: string; layout: string } | null => {
    if (!library) return null;
    for (const [, cat] of Object.entries(library.sections)) {
      for (const v of cat.variants) {
        if (v.file === moduleFile) return { category: cat.label, variant: v.id, layout: v.layout };
      }
    }
    return null;
  };

  /* ── Render ── */
  return (
    <div className="h-screen bg-[#0a0a0f] text-white flex flex-col font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-3 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#2D2F6B] to-[#C5E826] flex items-center justify-center font-bold text-xs">E</div>
          <h1 className="text-lg font-bold">Edstellar <span className="text-[#C5E826] font-medium">Page Stitcher</span></h1>
        </div>
        {sections.length > 0 && (
          <div className="flex items-center gap-3">
            {canvas.length > 0 && (
              <button
                onClick={handleAssemble}
                disabled={stitching}
                className="px-4 py-2 rounded-lg font-bold text-sm text-[#1A2600] bg-[#C5E826] hover:bg-[#D4F23A] disabled:opacity-50 transition-all"
              >
                {stitching ? "Stitching..." : "Assemble Page"}
              </button>
            )}
            {previewHtml && (
              <button onClick={handleDownload} className="px-4 py-2 rounded-lg font-semibold text-sm text-[#C5E826] border border-[#C5E826]/30 hover:bg-[#C5E826]/10 transition-all">
                Download HTML
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Upload or Builder */}
      {sections.length === 0 ? (
        <UploadScreen onUpload={handleUpload} error={error} />
      ) : (
        <main className="flex-1 flex overflow-hidden">
          {/* ─── Left: Sections Panel ─── */}
          <div className="w-[300px] shrink-0 flex flex-col bg-[#111119] border-r border-white/8">
            <div className="p-4 pb-2 border-b border-white/5">
              <h2 className="text-sm font-bold text-[#C5E826]">{sections.length} Sections</h2>
              <p className="text-[10px] text-gray-500 mt-1">Drag sections to the canvas</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {sections.map(section => {
                const design = getDesignLabel(section.module);
                return (
                  <div
                    key={section.index}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData("sectionIndex", String(section.index));
                      e.dataTransfer.effectAllowed = "copy";
                    }}
                    className="bg-white/[0.03] border border-white/8 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-[#C5E826]/30 transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-[#C5E826]/60 shrink-0">S{String(section.index).padStart(2, "0")}</span>
                      <span className="text-xs font-medium text-white truncate">{section.title}</span>
                    </div>
                    {design && (
                      <div className="mb-1.5">
                        <span className="text-[10px] font-semibold text-[#C5E826]/80">{design.category}</span>
                        <p className="text-[9px] text-gray-400 leading-snug mt-0.5 line-clamp-1">{design.layout}</p>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-600 line-clamp-2">{section.contentText.substring(0, 100)}</p>
                  </div>
                );
              })}
            </div>
            {/* Quick add all */}
            <div className="p-3 border-t border-white/5">
              <button
                onClick={() => {
                  const items: CanvasItem[] = sections.map(s => ({
                    uid: uid(), sectionIndex: s.index, title: s.title, module: s.module,
                    contentHtml: s.contentHtml,
                  }));
                  setCanvas(items);
                  setPreviewHtml("");
                }}
                className="w-full py-2 rounded-lg text-xs font-semibold text-gray-400 border border-white/8 hover:border-[#C5E826]/30 hover:text-[#C5E826] transition-all"
              >
                Add All with Default Designs
              </button>
            </div>
          </div>

          {/* ─── Right: Canvas ─── */}
          <div className="flex-1 flex flex-col bg-[#0d0d14]">
            {/* Canvas toolbar */}
            <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 shrink-0">
              <span className="text-xs text-gray-500">
                {canvas.length ? `${canvas.length} blocks on canvas` : "Drop sections here to build your page"}
              </span>
              {previewHtml && (
                <button
                  onClick={() => setPreviewHtml("")}
                  className="text-[10px] text-gray-500 hover:text-white transition-colors"
                >
                  Back to Canvas
                </button>
              )}
            </div>

            {/* Canvas area or Preview */}
            {previewHtml ? (
              <div className="flex-1 bg-white overflow-hidden">
                <iframe title="Preview" srcDoc={previewHtml} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" />
              </div>
            ) : (
              <div
                className={`flex-1 overflow-y-auto p-4 transition-colors ${canvas.length === 0 ? "flex items-center justify-center" : ""}`}
                onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }}
                onDrop={handleCanvasDrop}
              >
                {canvas.length === 0 ? (
                  <div className="text-center text-gray-600">
                    <svg className="w-16 h-16 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-sm">Drag sections from the left panel and drop them here</p>
                    <p className="text-xs mt-1 text-gray-700">A design picker will appear for each drop</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-w-3xl mx-auto">
                    {canvas.map((item, idx) => (
                      <CanvasBlock
                        key={item.uid}
                        item={item}
                        idx={idx}
                        onRemove={() => removeFromCanvas(item.uid)}
                        onChangeDesign={() => { setChangingUid(item.uid); setPickerPending({ index: item.sectionIndex, title: item.title, module: item.module, contentHtml: item.contentHtml, contentText: "" }); }}
                        onUpdateHtml={(html) => { setCanvas(prev => prev.map(c => c.uid === item.uid ? { ...c, contentHtml: html } : c)); setPreviewHtml(""); }}
                        onDragStart={() => setDragCanvasUid(item.uid)}
                        onDragOver={(e) => { e.preventDefault(); setReorderIdx(idx); }}
                        onDrop={() => { if (dragCanvasUid && dragCanvasUid !== item.uid) { handleCanvasReorder(dragCanvasUid, idx); } setDragCanvasUid(null); }}
                        isReorderTarget={reorderIdx === idx && dragCanvasUid !== null && dragCanvasUid !== item.uid}
                      />
                    ))}
                    {/* Drop zone at bottom for new sections */}
                    <div
                      className="h-16 border-2 border-dashed border-white/8 rounded-xl flex items-center justify-center text-gray-600 text-xs transition-colors hover:border-[#C5E826]/20"
                      onDragOver={e => { e.preventDefault(); setReorderIdx(canvas.length); }}
                      onDrop={e => {
                        // Handle both new sections and reorder
                        if (dragCanvasUid) {
                          handleCanvasReorder(dragCanvasUid, canvas.length);
                          setDragCanvasUid(null);
                        } else {
                          handleCanvasDrop(e);
                        }
                      }}
                    >
                      Drop section here
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-sm max-w-sm">
          {error}
          <button onClick={() => setError("")} className="ml-2 text-red-400 hover:text-white">&times;</button>
        </div>
      )}

      {/* Library Picker Modal */}
      {showPicker && library && (
        <LibraryPicker
          library={library}
          currentModule={pickerPending?.module || ""}
          onSelect={handleDesignChosen}
          onClose={() => { setPickerPending(null); setChangingUid(null); setDropInsertIdx(null); }}
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
          Drop your <code className="text-gray-300">.docx</code> developer-reference document.
          Then drag sections onto the canvas and pick designs from the library.
        </p>
        <div
          className={`relative w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer
            ${dragOver ? "border-[#C5E826] bg-[#C5E826]/5" : "border-white/15 bg-white/[0.02] hover:border-white/25"}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault(); setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f?.name.endsWith(".docx")) onUpload(f);
          }}
        >
          <input
            type="file" accept=".docx"
            onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f); }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <svg className="w-12 h-12 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm font-medium text-gray-300">Drop .docx here or click to browse</span>
        </div>
        {error && <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Canvas Block
   ──────────────────────────────────────────── */

/** Convert Tiptap HTML → plain text for the stitch API */
function htmlToPlainText(html: string): string {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, "\n");
  const div = document.createElement("div");
  div.innerHTML = html;
  const lines: string[] = [];
  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = (node.textContent || "").trim();
      if (t) lines.push(t);
      return;
    }
    const el = node as HTMLElement;
    if (!el.tagName) return;
    const tag = el.tagName.toLowerCase();
    if (tag === "li") { lines.push(`- ${(el.textContent || "").trim()}`); return; }
    if (tag === "ul" || tag === "ol") { el.childNodes.forEach(walk); return; }
    if (["h1","h2","h3","h4","h5","h6","p","div","blockquote"].includes(tag)) {
      const text = (el.textContent || "").trim();
      if (text) lines.push(text);
      return;
    }
    el.childNodes.forEach(walk);
  }
  div.childNodes.forEach(walk);
  return lines.join("\n");
}

/* ── Shared Tiptap editor styles ── */
const EDITOR_CLASSES = `
  [&_.tiptap]:outline-none [&_.tiptap]:min-h-[100px]
  [&_h2]:text-[15px] [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-2 [&_h2]:mt-3
  [&_h3]:text-[13px] [&_h3]:font-semibold [&_h3]:text-[#C5E826]/80 [&_h3]:mb-1 [&_h3]:mt-2
  [&_p]:mb-2 [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:text-[12px]
  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ul]:text-gray-300
  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_ol]:text-gray-300
  [&_li]:mb-1 [&_li]:text-gray-300 [&_li]:text-[12px]
  [&_strong]:text-white [&_em]:text-gray-400 [&_u]:underline
`.trim();

/* ────────────────────────────────────────────
   Canvas Block with Tiptap Editor
   ──────────────────────────────────────────── */

function CanvasBlock({
  item, idx, onRemove, onChangeDesign, onUpdateHtml, onDragStart, onDragOver, onDrop, isReorderTarget,
}: {
  item: CanvasItem;
  idx: number;
  onRemove: () => void;
  onChangeDesign: () => void;
  onUpdateHtml: (html: string) => void;
  onDragStart: () => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: () => void;
  isReorderTarget: boolean;
}) {
  const shortMod = item.module.replace("edstellar-", "").replace(".html", "");
  const [editing, setEditing] = useState(false);
  const snapshotRef = useRef(item.contentHtml);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
    ],
    content: item.contentHtml,
    editorProps: {
      attributes: { class: "tiptap" },
    },
  });

  // Sync content when item changes from outside (design change, reorder, etc.)
  useEffect(() => {
    if (editor && !editing) {
      const current = editor.getHTML();
      if (current !== item.contentHtml) {
        editor.commands.setContent(item.contentHtml);
      }
    }
  }, [item.contentHtml, editor, editing]);

  const startEdit = () => {
    snapshotRef.current = editor?.getHTML() || item.contentHtml;
    setEditing(true);
    requestAnimationFrame(() => editor?.commands.focus());
  };

  const saveEdit = () => {
    if (editor) {
      onUpdateHtml(editor.getHTML());
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    editor?.commands.setContent(snapshotRef.current);
    setEditing(false);
  };

  return (
    <div
      draggable={!editing}
      onDragStart={e => { if (editing) { e.preventDefault(); return; } e.dataTransfer.effectAllowed = "move"; onDragStart(); }}
      onDragOver={onDragOver}
      onDrop={e => { e.preventDefault(); e.stopPropagation(); onDrop(); }}
      className={`rounded-xl border transition-all ${editing ? "" : "cursor-grab active:cursor-grabbing"}
        ${isReorderTarget ? "border-[#C5E826] bg-[#C5E826]/5" : "border-white/8 bg-white/[0.02] hover:border-white/15"}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="text-gray-600 shrink-0">
          <svg width="12" height="12" viewBox="0 0 12 12"><circle cx="3" cy="2" r="1.2" fill="currentColor"/><circle cx="9" cy="2" r="1.2" fill="currentColor"/><circle cx="3" cy="6" r="1.2" fill="currentColor"/><circle cx="9" cy="6" r="1.2" fill="currentColor"/><circle cx="3" cy="10" r="1.2" fill="currentColor"/><circle cx="9" cy="10" r="1.2" fill="currentColor"/></svg>
        </div>
        <span className="text-[10px] font-bold text-[#C5E826]/60 shrink-0">{idx + 1}</span>
        <span className="text-sm font-medium text-white truncate flex-1">{item.title}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={onChangeDesign} className="text-[10px] px-2 py-1 rounded bg-[#2D2F6B]/40 text-[#C5E826]/80 font-mono hover:bg-[#2D2F6B]/60 transition-colors truncate max-w-[160px]" title="Change design">
            {shortMod}
          </button>
          {!editing ? (
            <button onClick={startEdit} className="text-gray-500 hover:text-[#C5E826] transition-colors p-0.5" title="Edit content">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10.5 1.5l2 2-8 8H2.5v-2l8-8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ) : (
            <>
              <button onClick={saveEdit} className="text-[10px] px-2 py-1 rounded bg-[#C5E826]/20 text-[#C5E826] font-semibold hover:bg-[#C5E826]/30 transition-colors">Save</button>
              <button onClick={cancelEdit} className="text-[10px] px-2 py-1 rounded text-gray-400 hover:text-white transition-colors">Cancel</button>
            </>
          )}
          <button onClick={onRemove} className="text-gray-600 hover:text-red-400 transition-colors p-0.5" title="Remove">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Toolbar — only when editing */}
      {editing && editor && (
        <div className="flex items-center gap-1 mx-4 mb-2 p-1.5 bg-black/30 rounded-lg border border-white/5 flex-wrap">
          <TBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} label="B" cls="font-bold" />
          <TBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} label="I" cls="italic" />
          <TBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} label="U" cls="underline" />
          <div className="w-px h-4 bg-white/10 mx-1" />
          <TBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="H2" />
          <TBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="H3" />
          <div className="w-px h-4 bg-white/10 mx-1" />
          <TBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} label="&bull; List" />
          <TBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="1. List" />
          <div className="w-px h-4 bg-white/10 mx-1" />
          <TBtn onClick={() => editor.chain().focus().undo().run()} label="Undo" />
          <TBtn onClick={() => editor.chain().focus().redo().run()} label="Redo" />
        </div>
      )}

      {/* Content — always visible, full height, editor always mounted */}
      <div className={`px-4 pb-3 ${EDITOR_CLASSES} ${editing ? "bg-black/20 rounded-b-xl border-t border-white/5 pt-3" : "[&_.tiptap]:cursor-default [&_.tiptap]:select-text"}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

/* ── Toolbar Button ── */
function TBtn({ label, onClick, active, cls }: { label: string; onClick: () => void; active?: boolean; cls?: string }) {
  return (
    <button
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      className={`px-2 py-1 rounded text-[10px] transition-colors ${cls || ""}
        ${active ? "bg-[#C5E826]/20 text-[#C5E826]" : "text-gray-400 hover:text-white hover:bg-white/10"}`}
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );
}

/* ────────────────────────────────────────────
   Library Picker Modal
   ──────────────────────────────────────────── */

function LibraryPicker({
  library, currentModule, onSelect, onClose,
}: {
  library: LibraryIndex;
  currentModule: string;
  onSelect: (mod: string) => void;
  onClose: () => void;
}) {
  const [filter, setFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const allVariants: { catKey: string; catLabel: string; variant: LibraryVariant }[] = [];
  for (const [catKey, cat] of Object.entries(library.sections)) {
    if (cat.is_visual === false) continue;
    for (const v of cat.variants) {
      allVariants.push({ catKey, catLabel: cat.label, variant: v });
    }
  }

  const filtered = filter
    ? allVariants.filter(v =>
        v.catLabel.toLowerCase().includes(filter.toLowerCase()) ||
        v.variant.id.toLowerCase().includes(filter.toLowerCase()) ||
        v.variant.layout.toLowerCase().includes(filter.toLowerCase()) ||
        v.variant.best_for.toLowerCase().includes(filter.toLowerCase()) ||
        v.variant.features.some(f => f.toLowerCase().includes(filter.toLowerCase()))
      )
    : allVariants;

  const grouped: Record<string, typeof allVariants> = {};
  for (const item of filtered) {
    if (!grouped[item.catLabel]) grouped[item.catLabel] = [];
    grouped[item.catLabel].push(item);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#15151f] border border-white/10 rounded-2xl w-[90vw] max-w-[920px] max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Choose a Design</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white p-1">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search... (hero, stats, faq, navy, cards, carousel)"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C5E826]/40"
          />
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {Object.entries(grouped).map(([catLabel, items]) => (
            <div key={catLabel}>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{catLabel}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {items.map(({ variant }) => {
                  const isCurrent = variant.file === currentModule;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => onSelect(variant.file)}
                      className={`text-left p-3.5 rounded-xl border transition-all hover:scale-[1.005]
                        ${isCurrent
                          ? "border-[#C5E826]/50 bg-[#C5E826]/5 ring-1 ring-[#C5E826]/20"
                          : "border-white/8 bg-white/[0.02] hover:border-[#C5E826]/25 hover:bg-white/[0.04]"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-[13px] font-semibold text-white leading-tight">{variant.id}</span>
                        {isCurrent && <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#C5E826]/20 text-[#C5E826] font-bold shrink-0">CURRENT</span>}
                      </div>
                      <p className="text-[11px] text-gray-400 mb-2 leading-snug line-clamp-2">{variant.layout}</p>
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {variant.features.slice(0, 4).map((f, fi) => (
                          <span key={fi} className="text-[8px] px-1.5 py-0.5 rounded bg-[#2D2F6B]/30 text-[#C5E826]/50">{f}</span>
                        ))}
                      </div>
                      <p className="text-[9px] text-gray-600 italic">{variant.best_for}</p>
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
