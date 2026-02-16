// src/types/logTypes.ts

export interface LogMetadata {
  id: string;
  fileId: string;
  fileName: string;
  deviceType: string;
  contentType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  status: string
}
