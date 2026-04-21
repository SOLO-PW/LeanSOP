use std::fs;
use std::path::PathBuf;
use base64::Engine;
use base64::engine::general_purpose::STANDARD;

/// 读取图片文件并转换为 base64 data URI
#[tauri::command]
fn read_image_as_base64(path: String) -> Result<String, String> {
    let file_path = PathBuf::from(&path);
    if !file_path.exists() {
        return Err(format!("文件不存在: {}", path));
    }
    let ext = file_path
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase();
    let mime = match ext.as_str() {
        "jpg" | "jpeg" => "image/jpeg",
        "png" => "image/png",
        "bmp" => "image/bmp",
        _ => return Err(format!("不支持的图片格式: {}", ext)),
    };
    let data = fs::read(&file_path).map_err(|e| format!("读取文件失败: {}", e))?;
    let b64 = STANDARD.encode(&data);
    Ok(format!("data:{};base64,{}", mime, b64))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![read_image_as_base64])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
