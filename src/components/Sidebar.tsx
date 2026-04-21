import {
  DashboardOutlined,
  FileTextOutlined,
  CopyOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
}

const navItems = [
  { key: "home", icon: <DashboardOutlined />, label: "首页" },
  { key: "sop", icon: <FileTextOutlined />, label: "SOP" },
  { key: "template", icon: <CopyOutlined />, label: "模板" },
  { key: "team", icon: <TeamOutlined />, label: "团队" },
];

function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <div className="sidebar">
      {navItems.map((item) => (
        <button
          key={item.key}
          className={`nav-item ${activeNav === item.key ? "active" : ""}`}
          onClick={() => onNavChange(item.key)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
      <div className="nav-spacer" />
      <button
        className={`nav-item ${activeNav === "settings" ? "active" : ""}`}
        onClick={() => onNavChange("settings")}
      >
        <span className="nav-icon"><SettingOutlined /></span>
        <span className="nav-label">设置</span>
      </button>
    </div>
  );
}

export default Sidebar;
