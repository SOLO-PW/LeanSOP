import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import type { SopDocument } from "../types/sop";

interface PreviewPanelProps {
  document: SopDocument;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

function PreviewPanel({ document, zoom, onZoomChange }: PreviewPanelProps) {
  const { header, steps } = document;

  const handleZoomOut = () => {
    if (zoom > 50) onZoomChange(zoom - 10);
  };

  const handleZoomIn = () => {
    if (zoom < 200) onZoomChange(zoom + 10);
  };

  return (
    <div className="preview-section">
      <div className="preview-header">
        <span className="preview-title">SOP预览</span>
        <div className="preview-zoom">
          <button className="zoom-btn" onClick={handleZoomOut}>
            <MinusOutlined style={{ fontSize: 12 }} />
          </button>
          <span className="zoom-text">{zoom}%</span>
          <button className="zoom-btn" onClick={handleZoomIn}>
            <PlusOutlined style={{ fontSize: 12 }} />
          </button>
        </div>
      </div>
      <div className="preview-card" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}>
        <div className="preview-doc-header">
          <div className="preview-doc-title">
            {header.sopName || header.processName || "未命名SOP"} - {header.processName || "未指定工序"}
          </div>
          <div className="preview-doc-meta">
            {header.department && <span className="meta-item">{header.department}</span>}
            {header.line && <span className="meta-item">{header.line}</span>}
            {header.version && <span className="meta-item">{header.version}</span>}
          </div>
        </div>
        {steps.map((step, idx) => {
          const isActive = idx < 3;
          return (
            <div key={step.id} className={`preview-step-item ${!isActive ? "inactive" : ""}`}>
              <span className={`preview-step-num ${!isActive ? "inactive" : ""}`}>
                {step.order}
              </span>
              <div className="preview-step-content">
                <span className="preview-step-title">{step.title}</span>
                <span className="preview-step-desc">
                  {step.description || "暂无描述..."}
                </span>
              </div>
            </div>
          );
        })}
        {steps.length === 0 && (
          <div style={{ textAlign: "center", color: "#BFBFBF", padding: "20px 0", fontSize: 12 }}>
            暂无步骤数据
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviewPanel;
