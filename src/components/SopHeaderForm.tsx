import { Card, Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";
import type { SopHeader } from "../types/sop";

interface SopHeaderFormProps {
  header: SopHeader;
  onChange: (header: SopHeader) => void;
}

function SopHeaderForm({ header, onChange }: SopHeaderFormProps) {
  const handleChange = (field: keyof SopHeader, value: string) => {
    onChange({ ...header, [field]: value });
  };

  return (
    <Card title="标准信息" size="small" className="sop-card">
      <Form layout="vertical" size="small">
        <Form.Item label="工序名称" rules={[{ required: true, message: "请输入工序名称" }]}>
          <Input
            value={header.processName}
            onChange={(e) => handleChange("processName", e.target.value)}
            placeholder="请输入工序名称"
          />
        </Form.Item>
        <Form.Item label="文件编号" rules={[{ required: true, message: "请输入文件编号" }]}>
          <Input
            value={header.fileNumber}
            onChange={(e) => handleChange("fileNumber", e.target.value)}
            placeholder="请输入文件编号"
          />
        </Form.Item>
        <Form.Item label="编制日期">
          <DatePicker
            value={header.createDate ? dayjs(header.createDate) : undefined}
            onChange={(_, dateString) => handleChange("createDate", dateString as string)}
            style={{ width: "100%" }}
            placeholder="选择日期"
          />
        </Form.Item>
        <Form.Item label="版本号">
          <Input
            value={header.version}
            onChange={(e) => handleChange("version", e.target.value)}
            placeholder="V1.0"
          />
        </Form.Item>
        <Form.Item label="编制人" rules={[{ required: true, message: "请输入编制人" }]}>
          <Input
            value={header.author}
            onChange={(e) => handleChange("author", e.target.value)}
            placeholder="请输入编制人"
          />
        </Form.Item>
        <Form.Item label="审核人">
          <Input
            value={header.reviewer}
            onChange={(e) => handleChange("reviewer", e.target.value)}
            placeholder="请输入审核人"
          />
        </Form.Item>
        <Form.Item label="批准人">
          <Input
            value={header.approver}
            onChange={(e) => handleChange("approver", e.target.value)}
            placeholder="请输入批准人"
          />
        </Form.Item>
      </Form>
    </Card>
  );
}

export default SopHeaderForm;
