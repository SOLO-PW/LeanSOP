import { Modal } from "antd";
import type { SopDocument } from "../types/sop";

interface SopPreviewProps {
  open: boolean;
  onClose: () => void;
  document: SopDocument;
}

function SopPreview({ open, onClose, document }: SopPreviewProps) {
  const { header, steps } = document;

  return (
    <Modal
      title="SOP 文档预览"
      open={open}
      onCancel={onClose}
      width={900}
      footer={null}
      styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
    >
      <div className="sop-preview">
        <div className="sop-preview-header">
          <h2 className="sop-preview-title">标准作业指导书</h2>
          <table className="sop-preview-info-table">
            <tbody>
              <tr>
                <td className="label">工序名称</td>
                <td>{header.processName}</td>
                <td className="label">文件编号</td>
                <td>{header.fileNumber}</td>
              </tr>
              <tr>
                <td className="label">编制日期</td>
                <td>{header.createDate}</td>
                <td className="label">版本</td>
                <td>{header.version}</td>
              </tr>
              <tr>
                <td className="label">编制人</td>
                <td>{header.author}</td>
                <td className="label">审核人</td>
                <td>{header.reviewer}</td>
              </tr>
              <tr>
                <td className="label">批准人</td>
                <td>{header.approver}</td>
                <td className="label">页数</td>
                <td>{Math.ceil(steps.length / 4) || 1}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="sop-preview-steps">
          {steps.map((step) => (
            <div key={step.id} className="sop-preview-step">
              <div className="sop-preview-step-header">步骤 {step.order}</div>
              <div className="sop-preview-step-body">
                {step.imageBase64 && (
                  <div className="sop-preview-step-image">
                    <img src={step.imageBase64} alt={`步骤${step.order}`} />
                  </div>
                )}
                <div className="sop-preview-step-text">
                  {step.description && (
                    <div className="sop-preview-step-desc">
                      <strong>操作说明：</strong>
                      <p>{step.description}</p>
                    </div>
                  )}
                  {step.requirements && (
                    <div className="sop-preview-step-req">
                      <strong>技术要求：</strong>
                      <p>{step.requirements}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default SopPreview;
