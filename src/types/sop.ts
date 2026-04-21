export interface SopHeader {
  processName: string;
  fileNumber: string;
  createDate: string;
  version: string;
  author: string;
  reviewer: string;
  approver: string;
}

export interface SopStep {
  id: string;
  order: number;
  imagePath: string;
  imageBase64: string;
  description: string;
  requirements: string;
}

export interface SopDocument {
  header: SopHeader;
  steps: SopStep[];
}
