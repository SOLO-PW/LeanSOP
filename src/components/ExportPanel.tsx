import { DownloadOutlined, SaveOutlined, FileImageOutlined, FileTextOutlined } from "@ant-design/icons";
import { Switch, message } from "antd";
import { exportToPdf } from "../utils/export";
import type { SopDocument, ExportFormat, ExportOptions } from "../types/sop";

interface ExportPanelProps {
  document: SopDocument;
  exportOpts: ExportOptions;
  onExportOptsChange: (opts: ExportOptions) => void;
}

function ExportPanel({ document, exportOpts, onExportOptsChange }: ExportPanelProps) {
  const handleExport = async () => {
    if (!document.header.sopName && !document.header.processName) {
      message.warning("请先填写SOP名称或工序名称");
      return;
    }
    try {
      await exportToPdf(document);
      message.success("导出成功");
    } catch (e) {
      message.error(`导出失败: ${e}`);
    }
  };

  const handleSaveDraft = () => {
    try {
      const data = JSON.stringify(document, null, 2);
      localStorage.setItem("leansop_draft", data);
      message.success("草稿已保存");
    } catch {
      message.error("保存草稿失败");
    }
  };

  return (
    <div className="export-section">
      <div className="export-header">
        <span className="export-title">导出选项</span>
      </div>

      <div className="export-format">
        <span className="format-label">导出格式</span>
        <div className="format-row">
          <button
            className={`format-btn ${exportOpts.format === "png" ? "active" : ""}`}
            onClick={() => onExportOptsChange({ ...exportOpts, format: "png" as ExportFormat })}
          >
            <FileImageOutlined style={{ fontSize: 14 }} />
            PNG图片
          </button>
          <button
            className={`format-btn ${exportOpts.format === "pdf" ? "active" : ""}`}
            onClick={() => onExportOptsChange({ ...exportOpts, format: "pdf" as ExportFormat })}
          >
            <FileTextOutlined style={{ fontSize: 14 }} />
            PDF文档
          </button>
        </div>
      </div>

      <div className="export-options">
        <span className="opt-label">导出设置</span>
        <div className="export-opt-row">
          <span className="opt-row-label">包含页眉页脚</span>
          <Switch
            size="small"
            checked={exportOpts.includeHeaderFooter}
            onChange={(val) => onExportOptsChange({ ...exportOpts, includeHeaderFooter: val })}
          />
        </div>
        <div className="export-opt-row">
          <span className="opt-row-label">高清晰度</span>
          <Switch
            size="small"
            checked={exportOpts.highQuality}
            onChange={(val) => onExportOptsChange({ ...exportOpts, highQuality: val })}
          />
        </div>
      </div>

      <button className="export-btn" onClick={handleExport}>
        <DownloadOutlined style={{ fontSize: 16 }} />
        导出SOP文档
      </button>
      <button className="save-btn" onClick={handleSaveDraft}>
        <SaveOutlined style={{ fontSize: 14 }} />
        保存草稿
      </button>
    </div>
  );
}

export default ExportPanel;
