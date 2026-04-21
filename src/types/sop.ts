export interface SopHeader {
  sopName: string;
  department: string;
  line: string;
  processName: string;
  version: string;
  createDate: string;
  priority: "high" | "medium" | "low";
  description: string;
  author: string;
  reviewer: string;
  approver: string;
}

export interface SopImage {
  id: string;
  name: string;
  base64: string;
  path: string;
  status: "default" | "success" | "warning";
}

export interface SopStep {
  id: string;
  order: number;
  title: string;
  imagePath: string;
  imageBase64: string;
  description: string;
  requirements: string;
  keyPoints: string[];
  collapsed: boolean;
}

export interface SopDocument {
  header: SopHeader;
  images: SopImage[];
  steps: SopStep[];
}

export type ExportFormat = "png" | "pdf";

export interface ExportOptions {
  format: ExportFormat;
  includeHeaderFooter: boolean;
  highQuality: boolean;
}
