import { Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import type { SopHeader } from "../types/sop";

interface SopHeaderFormProps {
  header: SopHeader;
  onChange: (header: SopHeader) => void;
}

const departments = ["生产一部", "生产二部", "质量部", "技术部", "仓储部"];
const lines = ["A线", "B线", "C线", "D线"];

function SopHeaderForm({ header, onChange }: SopHeaderFormProps) {
  const handleChange = (field: keyof SopHeader, value: string) => {
    onChange({ ...header, [field]: value });
  };

  return (
    <div className="form-section">
      <div className="form-header">
        <span className="form-title">基本信息</span>
        <span className="form-badge">编辑中</span>
      </div>
      <div className="form-body">
        <div className="form-field">
          <label className="field-label">
            SOP名称<span className="required">*</span>
          </label>
          <Input
            value={header.sopName}
            onChange={(e) => handleChange("sopName", e.target.value)}
            placeholder="请输入SOP名称"
          />
        </div>

        <div className="form-field">
          <label className="field-label">
            所属部门<span className="required">*</span>
          </label>
          <Select
            value={header.department || undefined}
            onChange={(val) => handleChange("department", val)}
            placeholder="请选择部门"
            options={departments.map((d) => ({ label: d, value: d }))}
            style={{ width: "100%" }}
            allowClear
          />
        </div>

        <div className="form-field">
          <label className="field-label">
            生产线<span className="required">*</span>
          </label>
          <Select
            value={header.line || undefined}
            onChange={(val) => handleChange("line", val)}
            placeholder="请选择生产线"
            options={lines.map((l) => ({ label: l, value: l }))}
            style={{ width: "100%" }}
            allowClear
          />
        </div>

        <div className="form-field">
          <label className="field-label">
            工序名称<span className="required">*</span>
          </label>
          <Input
            value={header.processName}
            onChange={(e) => handleChange("processName", e.target.value)}
            placeholder="请输入工序名称"
          />
        </div>

        <div className="form-field">
          <label className="field-label">版本号</label>
          <Input
            value={header.version}
            onChange={(e) => handleChange("version", e.target.value)}
            placeholder="V1.0.0"
          />
        </div>

        <div className="form-field">
          <label className="field-label">
            生效日期<span className="required">*</span>
          </label>
          <DatePicker
            value={header.createDate ? dayjs(header.createDate) : undefined}
            onChange={(_, dateString) => handleChange("createDate", dateString as string)}
            style={{ width: "100%" }}
            placeholder="选择日期"
          />
        </div>

        <div className="form-field">
          <label className="field-label">优先级</label>
          <div className="priority-row">
            <button
              className={`priority-btn ${header.priority === "high" ? "active" : ""}`}
              onClick={() => handleChange("priority", "high")}
            >
              高
            </button>
            <button
              className={`priority-btn ${header.priority === "medium" ? "active" : ""}`}
              onClick={() => handleChange("priority", "medium")}
            >
              中
            </button>
            <button
              className={`priority-btn ${header.priority === "low" ? "active" : ""}`}
              onClick={() => handleChange("priority", "low")}
            >
              低
            </button>
          </div>
        </div>

        <div className="form-field">
          <label className="field-label">SOP描述</label>
          <Input.TextArea
            value={header.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="请输入SOP详细描述..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

export default SopHeaderForm;
