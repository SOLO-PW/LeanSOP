import { toPng } from "html-to-image";
import type { SopDocument } from "../types/sop";
import { isTauriEnv } from "./env";

function generateSopHtml(doc: SopDocument): string {
  const { header, steps } = doc;
  const stepsHtml = steps
    .map(
      (step) => `
    <div class="step">
      <div class="step-header">步骤 ${step.order} - ${step.title || ""}</div>
      <div class="step-body">
        ${step.imageBase64 ? `<div class="step-image"><img src="${step.imageBase64}" alt="步骤${step.order}" /></div>` : ""}
        <div class="step-text">
          ${step.description ? `<div class="step-desc"><strong>操作说明：</strong><p>${step.description}</p></div>` : ""}
          ${step.requirements ? `<div class="step-req"><strong>技术要求：</strong><p>${step.requirements}</p></div>` : ""}
          ${step.keyPoints && step.keyPoints.length > 0 ? `<div class="step-keys"><strong>关键要点：</strong><p>${step.keyPoints.join("、")}</p></div>` : ""}
        </div>
      </div>
    </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>${header.sopName || header.processName} - SOP</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: "Microsoft YaHei", "SimSun", sans-serif; padding: 20px; color: #333; }
    .sop-doc { max-width: 800px; margin: 0 auto; border: 2px solid #333; }
    .sop-title { text-align: center; font-size: 22px; font-weight: bold; padding: 12px; border-bottom: 2px solid #333; background: #f5f5f5; }
    .info-table { width: 100%; border-collapse: collapse; }
    .info-table td { border: 1px solid #333; padding: 6px 10px; font-size: 13px; }
    .info-table .label { width: 80px; background: #f0f0f0; font-weight: bold; text-align: center; }
    .step { border-top: 1px solid #333; }
    .step-header { background: #e8e8e8; padding: 6px 12px; font-weight: bold; font-size: 14px; border-bottom: 1px solid #ccc; }
    .step-body { display: flex; padding: 10px; gap: 12px; min-height: 120px; }
    .step-image { width: 200px; flex-shrink: 0; }
    .step-image img { width: 100%; max-height: 180px; object-fit: contain; }
    .step-text { flex: 1; font-size: 13px; line-height: 1.6; }
    .step-desc { margin-bottom: 8px; }
    .step-req { color: #c00; }
    .step-keys { color: #1677FF; }
    @media print {
      body { padding: 0; }
      .sop-doc { border: none; }
    }
  </style>
</head>
<body>
  <div class="sop-doc">
    <div class="sop-title">标准作业指导书</div>
    <table class="info-table">
      <tr><td class="label">SOP名称</td><td>${header.sopName}</td><td class="label">工序名称</td><td>${header.processName}</td></tr>
      <tr><td class="label">所属部门</td><td>${header.department}</td><td class="label">生产线</td><td>${header.line}</td></tr>
      <tr><td class="label">生效日期</td><td>${header.createDate}</td><td class="label">版本</td><td>${header.version}</td></tr>
      <tr><td class="label">编制人</td><td>${header.author}</td><td class="label">审核人</td><td>${header.reviewer}</td></tr>
      <tr><td class="label">批准人</td><td>${header.approver}</td><td class="label">优先级</td><td>${header.priority === "high" ? "高" : header.priority === "medium" ? "中" : "低"}</td></tr>
    </table>
    ${stepsHtml}
  </div>
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`;
}

async function exportViaTauri(doc: SopDocument): Promise<void> {
  const { writeFile } = await import("@tauri-apps/plugin-fs");
  const { tempDir, join } = await import("@tauri-apps/api/path");
  const { openPath } = await import("@tauri-apps/plugin-opener");
  const html = generateSopHtml(doc);
  const encoder = new TextEncoder();
  const tmp = await tempDir();
  const fileName = `leansop_${Date.now()}.html`;
  const fullPath = await join(tmp, fileName);
  await writeFile(fullPath, encoder.encode(html));
  await openPath(fullPath);
}

function exportViaBrowser(doc: SopDocument): void {
  const html = generateSopHtml(doc);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.header.sopName || doc.header.processName || "SOP"}.html`;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export async function exportToHtml(doc: SopDocument): Promise<void> {
  if (isTauriEnv()) {
    await exportViaTauri(doc);
  } else {
    exportViaBrowser(doc);
  }
}

function renderOffscreen(doc: SopDocument): Promise<HTMLIFrameElement> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-99999px";
    iframe.style.top = "0";
    iframe.style.width = "840px";
    iframe.style.border = "none";
    const html = generateSopHtml(doc);
    const blob = new Blob([html.replace(/<script[\s\S]*?<\/script>/, "")], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    iframe.onload = () => resolve(iframe);
    iframe.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      iframe.remove();
      reject(new Error("离屏渲染iframe加载失败"));
    };
    document.body.appendChild(iframe);
    iframe.src = blobUrl;
  });
}

async function downloadDataUrl(dataUrl: string, fileName: string): Promise<void> {
  if (isTauriEnv()) {
    const { writeFile } = await import("@tauri-apps/plugin-fs");
    const { tempDir, join } = await import("@tauri-apps/api/path");
    const { openPath } = await import("@tauri-apps/plugin-opener");
    const base64 = dataUrl.split(",")[1];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const tmp = await tempDir();
    const fullPath = await join(tmp, fileName);
    await writeFile(fullPath, bytes);
    await openPath(fullPath);
  } else {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    a.click();
  }
}

export async function exportToPng(doc: SopDocument, highQuality = false): Promise<void> {
  const iframe = await renderOffscreen(doc);
  try {
    const docEl = iframe.contentDocument?.documentElement;
    if (!docEl) throw new Error("无法访问渲染内容");
    const pixelRatio = highQuality ? 3 : 2;
    const dataUrl = await toPng(docEl, { pixelRatio, backgroundColor: "#ffffff" });
    const fileName = `${doc.header.sopName || doc.header.processName || "SOP"}.png`;
    await downloadDataUrl(dataUrl, fileName);
  } finally {
    URL.revokeObjectURL(iframe.src);
    iframe.remove();
  }
}
