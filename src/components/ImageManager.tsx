import { PlusOutlined, AppstoreOutlined, CloseOutlined } from "@ant-design/icons";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { message } from "antd";
import type { SopImage } from "../types/sop";

interface ImageManagerProps {
  images: SopImage[];
  onChange: (images: SopImage[]) => void;
  maxImages?: number;
}

function isTauriEnv(): boolean {
  return !!(window as unknown as Record<string, unknown>).__TAURI_INTERNALS__;
}

function ImageManager({ images, onChange, maxImages = 10 }: ImageManagerProps) {
  const handleAddImage = async () => {
    if (images.length >= maxImages) {
      message.warning(`最多上传${maxImages}张图片`);
      return;
    }
    if (!isTauriEnv()) {
      message.error("图片上传功能需要通过 Tauri 运行");
      return;
    }
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "图片", extensions: ["jpg", "jpeg", "png"] }],
      });
      if (!selected) return;
      const filePath = selected as string;
      const base64: string = await invoke("read_image_as_base64", { path: filePath });
      const fileName = filePath.split(/[\\/]/).pop() || `工序图${images.length + 1}`;
      const newImage: SopImage = {
        id: crypto.randomUUID(),
        name: fileName,
        base64,
        path: filePath,
        status: images.length === 0 ? "default" : images.length === 1 ? "success" : "warning",
      };
      onChange([...images, newImage]);
    } catch (e) {
      message.error(`图片上传失败: ${e}`);
    }
  };

  const handleRemoveImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const statusClass = (index: number): "default" | "success" | "warning" => {
    if (index === 0) return "default";
    if (index === 1) return "success";
    return "warning";
  };

  return (
    <div className="image-section">
      <div className="image-header">
        <span className="img-title">图片管理</span>
        <span className="img-count">{images.length}/{maxImages}</span>
      </div>
      <div className="image-grid">
        {images.map((img, idx) => (
          <div key={img.id} className={`image-item status-${statusClass(idx)}`}>
            {img.base64 ? (
              <img
                src={img.base64}
                alt={img.name}
                style={{ width: 80, height: 60, objectFit: "contain", borderRadius: 4 }}
              />
            ) : (
              <>
                <AppstoreOutlined className="img-item-icon" />
                <span className="img-item-label">工序图{idx + 1}</span>
              </>
            )}
            <CloseOutlined
              style={{ fontSize: 10, position: "absolute", top: 4, right: 4, cursor: "pointer" }}
              onClick={() => handleRemoveImage(img.id)}
            />
          </div>
        ))}
      </div>
      <div className="image-actions">
        <button className="add-img-btn" onClick={handleAddImage}>
          <PlusOutlined style={{ fontSize: 14 }} />
          添加图片
        </button>
        <button className="sort-img-btn" title="排序">
          <AppstoreOutlined style={{ fontSize: 14 }} />
        </button>
      </div>
      <span className="image-tip">支持 JPG、PNG 格式，单张不超过 5MB</span>
    </div>
  );
}

export default ImageManager;
