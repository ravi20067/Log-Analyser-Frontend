// src/types/logTypes.ts

export interface LogResponse {
  id: string;
  fileId: string;
  fileName: string;
  deviceType: string;
  size: number;
  uploadedAt: string;
  analysisStatus: string;
  riskScore: number | null;
}
