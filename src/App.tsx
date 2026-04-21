import { useState } from "react";
import { Layout, Typography, Button, Space, message } from "antd";
import SopHeaderForm from "./components/SopHeaderForm";
import SopStepEditor from "./components/SopStepEditor";
import SopPreview from "./components/SopPreview";
import { exportToPdf } from "./utils/export";
import type { SopHeader, SopStep, SopDocument } from "./types/sop";
import "./App.css";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [header, setHeader] = useState<SopHeader>({
    processName: "",
    fileNumber: "",
    createDate: new Date().toISOString().split("T")[0],
    version: "V1.0",
    author: "",
    reviewer: "",
    approver: "",
  });
  const [steps, setSteps] = useState<SopStep[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const validateRequired = (): boolean => {
    if (!header.processName) {
      message.warning("请填写工序名称");
      return false;
    }
    if (!header.fileNumber) {
      message.warning("请填写文件编号");
      return false;
    }
    if (!header.author) {
      message.warning("请填写编制人");
      return false;
    }
    return true;
  };

  const handlePreview = () => {
    if (!validateRequired()) return;
    setPreviewOpen(true);
  };

  const handleExport = async () => {
    if (!validateRequired()) return;
    const doc: SopDocument = { header, steps };
    try {
      await exportToPdf(doc);
    } catch (e) {
      message.error(`导出失败: ${e}`);
    }
  };

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Title level={3} className="app-title">LeanSOP - 精益标准作业指导书</Title>
      </Header>
      <Content className="app-content">
        <div className="left-panel">
          <SopHeaderForm header={header} onChange={setHeader} />
        </div>
        <div className="right-panel">
          <SopStepEditor steps={steps} onChange={setSteps} />
        </div>
      </Content>
      <Footer className="app-footer">
        <Space>
          <Button type="primary" size="large" onClick={handlePreview}>
            预览文档
          </Button>
          <Button type="primary" size="large" onClick={handleExport}>
            导出 PDF
          </Button>
        </Space>
      </Footer>
      <SopPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        document={{ header, steps }}
      />
    </Layout>
  );
}

export default App;
