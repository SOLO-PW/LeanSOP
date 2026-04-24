import { useState, useEffect, useRef } from "react";
import TitleBar from "./components/TitleBar";
import Sidebar from "./components/Sidebar";
import SopHeaderForm from "./components/SopHeaderForm";
import ImageManager from "./components/ImageManager";
import SopStepEditor from "./components/SopStepEditor";
import PreviewPanel from "./components/PreviewPanel";
import ExportPanel from "./components/ExportPanel";
import type { SopHeader, SopStep, SopImage, SopDocument, ExportOptions } from "./types/sop";
import { loadDraft, saveDraft } from "./utils/storage";
import "./App.css";

function App() {
  const draft = loadDraft();

  const [activeNav, setActiveNav] = useState("sop");
  const [header, setHeader] = useState<SopHeader>(
    draft?.header ?? {
      sopName: "",
      department: "",
      line: "",
      processName: "",
      createDate: new Date().toISOString().split("T")[0],
      version: "V1.0.0",
      priority: "medium",
      description: "",
      author: "",
      reviewer: "",
      approver: "",
    }
  );
  const [images, setImages] = useState<SopImage[]>(draft?.images ?? []);
  const [steps, setSteps] = useState<SopStep[]>(draft?.steps ?? []);
  const [zoom, setZoom] = useState(100);
  const [exportOpts, setExportOpts] = useState<ExportOptions>({
    format: "png",
    includeHeaderFooter: true,
    highQuality: false,
  });

  const sopDoc: SopDocument = { header, images, steps };
  const sopDocRef = useRef(sopDoc);
  sopDocRef.current = sopDoc;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveDraft(sopDocRef.current);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="app-layout">
      <TitleBar />
      <div className="body-area">
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />
        <div className="left-panel">
          <SopHeaderForm header={header} onChange={setHeader} />
          <ImageManager images={images} onChange={setImages} />
        </div>
        <div className="center-panel">
          <SopStepEditor steps={steps} onChange={setSteps} />
        </div>
        <div className="right-panel">
          <PreviewPanel document={sopDoc} zoom={zoom} onZoomChange={setZoom} />
          <ExportPanel document={sopDoc} exportOpts={exportOpts} onExportOptsChange={setExportOpts} />
        </div>
      </div>
    </div>
  );
}

export default App;
