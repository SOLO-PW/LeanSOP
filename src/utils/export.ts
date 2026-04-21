import type { SopDocument } from "../types/sop";
import { writeFile } from "@tauri-apps/plugin-fs";
import { tempDir, join } from "@tauri-apps/api/path";
import { openPath } from "@tauri-apps/plugin-opener";

function generateSopHtml(doc: SopDocument): string {
  const { header, steps } = doc;
  const stepsHtml = steps
    .map(
      (step) => `
    <div class="step">
      <div class="step-header">步骤 ${step.order}</div>
      <div class="step-body">
        ${step.imageBase64 ? `<div class="step-image"><img src="${step.imageBase64}" alt="步骤${step.order}" /></div>` : ""}
        <div class="step-text">
          ${step.description ? `<div class="step-desc"><strong>操作说明：</strong><p>${step.description}</p></div>` : ""}
          ${step.requirements ? `<div class="step-req"><strong>技术要求：</strong><p>${step.requirements}</p></div>` : ""}
        </div>
      </div>
    </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>${header.processName} - SOP</title>
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
      <tr><td class="label">工序名称</td><td>${header.processName}</td><td class="label">文件编号</td><td>${header.fileNumber}</td></tr>
      <tr><td class="label">编制日期</td><td>${header.createDate}</td><td class="label">版本</td><td>${header.version}</td></tr>
      <tr><td class="label">编制人</td><td>${header.author}</td><td class="label">审核人</td><td>${header.reviewer}</td></tr>
      <tr><td class="label">批准人</td><td>${header.approver}</td><td class="label">页数</td><td>${Math.ceil(steps.length / 4) || 1}</td></tr>
    </table>
    ${stepsHtml}
  </div>
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`;
}

export async function exportToPdf(doc: SopDocument): Promise<void> {
  const html = generateSopHtml(doc);
  const encoder = new TextEncoder();
  const tmp = await tempDir();
  const fileName = `leansop_${Date.now()}.html`;
  const fullPath = await join(tmp, fileName);
  await writeFile(fullPath, encoder.encode(html));
  await openPath(fullPath);
}
