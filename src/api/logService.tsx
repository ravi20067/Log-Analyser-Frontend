// src/api/logService.ts
import axiosInstance from "./axiosConfig";
import { LogMetadata } from "../types/logTypes";
import { LogResponse } from "@/types/logResponse";

/**
 * Upload log file
 */
export const uploadLog = async (
  file: File,
  deviceType: string
): Promise<LogResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post<LogMetadata>(
    `/api/logs/${deviceType}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const logResponse: LogResponse = {
    id: response.data.id,
    fileId: response.data.fileId,
    fileName: response.data.fileName,
    deviceType: response.data.deviceType,
    size: response.data.size,
    uploadedAt: response.data.uploadedAt,
    analysisStatus: response.data.status,
    riskScore: null
  };
  return logResponse;
};

/**
 * Download log file
 */
export const downloadLog = async (fileId: string, fileName: string) => {
  const response = await axiosInstance.get(
    `/api/logs/download/${fileId}`,
    {
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data]);
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};
export const getMyLogs = async () => {
  const response = await axiosInstance.get("/api/logs/my");
  return response.data;
};
