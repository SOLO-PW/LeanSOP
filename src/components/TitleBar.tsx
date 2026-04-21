import { MinusOutlined, BorderOutlined, CloseOutlined, HomeOutlined } from "@ant-design/icons";

function TitleBar() {
  const handleMinimize = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().minimize();
    } catch { /* non-tauri env */ }
  };

  const handleMaximize = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().toggleMaximize();
    } catch { /* non-tauri env */ }
  };

  const handleClose = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().close();
    } catch { /* non-tauri env */ }
  };

  return (
    <div className="title-bar">
      <div className="title-bar-left">
        <HomeOutlined className="app-icon" />
        <span className="app-title">LeanSOP - 精益生产SOP管理系统</span>
      </div>
      <div className="title-bar-right">
        <button className="win-btn" onClick={handleMinimize}>
          <MinusOutlined style={{ fontSize: 14 }} />
        </button>
        <button className="win-btn" onClick={handleMaximize}>
          <BorderOutlined style={{ fontSize: 14 }} />
        </button>
        <button className="win-btn close-btn" onClick={handleClose}>
          <CloseOutlined style={{ fontSize: 14 }} />
        </button>
      </div>
    </div>
  );
}

export default TitleBar;
