import { Button, Popconfirm, message } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UpOutlined,
  DownOutlined,
  HolderOutlined,
  VerticalAlignMiddleOutlined,
  PictureOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import type { SopStep } from "../types/sop";

interface SopStepEditorProps {
  steps: SopStep[];
  onChange: (steps: SopStep[]) => void;
}

function isTauriEnv(): boolean {
  return !!(window as unknown as Record<string, unknown>).__TAURI_INTERNALS__;
}

function SopStepEditor({ steps, onChange }: SopStepEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [newKeyPoint, setNewKeyPoint] = useState<Record<string, string>>({});

  const addStep = () => {
    const newStep: SopStep = {
      id: crypto.randomUUID(),
      order: steps.length + 1,
      title: `步骤 ${steps.length + 1}`,
      imagePath: "",
      imageBase64: "",
      description: "",
      requirements: "",
      keyPoints: [],
      collapsed: false,
    };
    onChange([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    const filtered = steps.filter((s) => s.id !== id);
    const reindexed = filtered.map((s, i) => ({ ...s, order: i + 1 }));
    onChange(reindexed);
  };

  const updateStep = (id: string, field: keyof SopStep, value: unknown) => {
    onChange(steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const moveStep = (id: string, direction: "up" | "down") => {
    const idx = steps.findIndex((s) => s.id === id);
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === steps.length - 1) return;
    const newSteps = [...steps];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newSteps[idx], newSteps[swapIdx]] = [newSteps[swapIdx], newSteps[idx]];
    onChange(newSteps.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const toggleCollapse = (id: string) => {
    onChange(steps.map((s) => (s.id === id ? { ...s, collapsed: !s.collapsed } : s)));
  };

  const collapseAll = () => {
    onChange(steps.map((s) => ({ ...s, collapsed: true })));
  };

  const startEditTitle = (step: SopStep) => {
    setEditingId(step.id);
    setEditingTitle(step.title);
  };

  const saveTitle = (id: string) => {
    updateStep(id, "title", editingTitle);
    setEditingId(null);
  };

  const handleImageUpload = async (id: string) => {
    if (!isTauriEnv()) {
      message.error("图片上传功能需要通过 Tauri 运行");
      return;
    }
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "图片", extensions: ["jpg", "jpeg", "png", "bmp"] }],
      });
      if (!selected) return;
      const filePath = selected as string;
      const base64: string = await invoke("read_image_as_base64", { path: filePath });
      updateStep(id, "imagePath", filePath);
      updateStep(id, "imageBase64", base64);
    } catch (e) {
      message.error(`图片上传失败: ${e}`);
    }
  };

  const addKeyPoint = (stepId: string) => {
    const val = newKeyPoint[stepId]?.trim();
    if (!val) return;
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      updateStep(stepId, "keyPoints", [...(step.keyPoints || []), val]);
      setNewKeyPoint((prev) => ({ ...prev, [stepId]: "" }));
    }
  };

  const removeKeyPoint = (stepId: string, idx: number) => {
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      const pts = [...(step.keyPoints || [])];
      pts.splice(idx, 1);
      updateStep(stepId, "keyPoints", pts);
    }
  };

  return (
    <>
      <div className="step-header">
        <div className="step-header-left">
          <span className="step-title">步骤编辑</span>
          <span className="step-count">{steps.length}</span>
        </div>
        <div className="step-header-right">
          <Button type="primary" icon={<PlusOutlined />} onClick={addStep}>
            添加步骤
          </Button>
          {steps.length > 0 && (
            <Button icon={<VerticalAlignMiddleOutlined />} onClick={collapseAll} />
          )}
        </div>
      </div>

      <div className="step-list">
        {steps.length === 0 && (
          <div className="empty-state">
            <PictureOutlined className="empty-icon" />
            <span className="empty-text">暂无操作步骤，点击"添加步骤"开始</span>
          </div>
        )}
        {steps.map((step) => (
          <div key={step.id} className="step-card">
            <div className="step-card-header">
              <HolderOutlined className="drag-handle" />
              <span className="step-num">{step.order}</span>
              {editingId === step.id ? (
                <input
                  className="step-name-input"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => saveTitle(step.id)}
                  onKeyDown={(e) => e.key === "Enter" && saveTitle(step.id)}
                  autoFocus
                />
              ) : (
                <span className="step-name" onDoubleClick={() => startEditTitle(step)}>
                  {step.title}
                </span>
              )}
              <div className="step-spacer" />
              <button className="step-action" onClick={() => startEditTitle(step)} title="编辑">
                <EditOutlined />
              </button>
              <Popconfirm title="确定删除此步骤？" onConfirm={() => removeStep(step.id)}>
                <button className="step-action delete" title="删除">
                  <DeleteOutlined />
                </button>
              </Popconfirm>
              <button className="step-action" onClick={() => moveStep(step.id, "up")} title="上移">
                <UpOutlined />
              </button>
              <button className="step-action" onClick={() => moveStep(step.id, "down")} title="下移">
                <DownOutlined />
              </button>
              <button
                className="step-action"
                onClick={() => toggleCollapse(step.id)}
                title={step.collapsed ? "展开" : "折叠"}
                style={{ transform: step.collapsed ? "rotate(180deg)" : "none" }}
              >
                <UpOutlined />
              </button>
            </div>
            <div className={`step-card-body ${step.collapsed ? "collapsed" : ""}`}>
              <div
                className="step-image-upload"
                onClick={() => handleImageUpload(step.id)}
              >
                {step.imageBase64 ? (
                  <img src={step.imageBase64} alt={`步骤${step.order}`} />
                ) : (
                  <>
                    <PictureOutlined className="upload-icon" />
                    <span className="upload-label">点击上传图片</span>
                  </>
                )}
              </div>
              <div className="step-content-area">
                <label className="content-label">操作描述</label>
                <textarea
                  className="step-desc-box"
                  value={step.description}
                  onChange={(e) => updateStep(step.id, "description", e.target.value)}
                  placeholder="请输入操作描述..."
                />
                <label className="content-label">关键要点</label>
                <div className="key-points-row">
                  {(step.keyPoints || []).map((pt, idx) => (
                    <span
                      key={idx}
                      className={`key-point-tag ${idx % 2 === 0 ? "tag-blue" : "tag-orange"}`}
                    >
                      {pt}
                      <CloseOutlined className="tag-close" onClick={() => removeKeyPoint(step.id, idx)} />
                    </span>
                  ))}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <input
                      style={{
                        height: 26,
                        padding: "0 8px",
                        borderRadius: 4,
                        border: "1px dashed #D9D9D9",
                        fontSize: 12,
                        outline: "none",
                        width: 80,
                      }}
                      placeholder="添加要点"
                      value={newKeyPoint[step.id] || ""}
                      onChange={(e) =>
                        setNewKeyPoint((prev) => ({ ...prev, [step.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && addKeyPoint(step.id)}
                    />
                    <button className="add-key-point-btn" onClick={() => addKeyPoint(step.id)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default SopStepEditor;
