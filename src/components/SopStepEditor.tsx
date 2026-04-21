import { Card, Button, Input, message, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import type { SopStep } from "../types/sop";

interface SopStepEditorProps {
  steps: SopStep[];
  onChange: (steps: SopStep[]) => void;
}

function isTauriEnv(): boolean {
  return !!(window as unknown as Record<string, unknown>).__TAURI_INTERNALS__;
}

function SopStepEditor({ steps, onChange }: SopStepEditorProps) {
  const addStep = () => {
    const newStep: SopStep = {
      id: crypto.randomUUID(),
      order: steps.length + 1,
      imagePath: "",
      imageBase64: "",
      description: "",
      requirements: "",
    };
    onChange([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    const filtered = steps.filter((s) => s.id !== id);
    const reindexed = filtered.map((s, i) => ({ ...s, order: i + 1 }));
    onChange(reindexed);
  };

  const updateStep = (id: string, field: keyof SopStep, value: string) => {
    onChange(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleImageUpload = async (id: string) => {
    if (!isTauriEnv()) {
      message.error("图片上传功能需要通过 Tauri 运行，请使用 pnpm tauri dev 启动");
      return;
    }
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "图片",
            extensions: ["jpg", "jpeg", "png", "bmp"],
          },
        ],
      });
      if (!selected) return;
      const filePath = selected as string;
      const base64: string = await invoke("read_image_as_base64", { path: filePath });
      onChange(
        steps.map((s) =>
          s.id === id ? { ...s, imagePath: filePath, imageBase64: base64 } : s
        )
      );
    } catch (e) {
      message.error(`图片上传失败: ${e}`);
    }
  };

  return (
    <Card
      title="操作步骤"
      size="small"
      className="sop-card"
      extra={
        <Button type="dashed" icon={<PlusOutlined />} onClick={addStep} size="small">
          添加步骤
        </Button>
      }
    >
      {steps.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
          暂无操作步骤，点击"添加步骤"开始
        </div>
      )}
      {steps.map((step) => (
        <Card
          key={step.id}
          size="small"
          className="step-card"
          title={`步骤 ${step.order}`}
          extra={
            <Popconfirm title="确定删除此步骤？" onConfirm={() => removeStep(step.id)}>
              <Button type="text" danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          }
        >
          <div className="step-content">
            <div className="step-image-area">
              {step.imageBase64 ? (
                <img src={step.imageBase64} alt={`步骤${step.order}`} className="step-image" />
              ) : (
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => handleImageUpload(step.id)}
                  className="upload-btn"
                >
                  上传图片
                </Button>
              )}
              {step.imageBase64 && (
                <Button
                  size="small"
                  onClick={() => handleImageUpload(step.id)}
                  style={{ marginTop: 4 }}
                >
                  更换图片
                </Button>
              )}
            </div>
            <div className="step-text-area">
              <Input.TextArea
                value={step.description}
                onChange={(e) => updateStep(step.id, "description", e.target.value)}
                placeholder="操作说明"
                rows={3}
              />
              <Input.TextArea
                value={step.requirements}
                onChange={(e) => updateStep(step.id, "requirements", e.target.value)}
                placeholder="技术要求/注意事项"
                rows={3}
                style={{ marginTop: 8 }}
              />
            </div>
          </div>
        </Card>
      ))}
    </Card>
  );
}

export default SopStepEditor;
