import axiosInstance from "@/api/axiosConfig";
import { AnalysisResponse } from "@/types/analysisTypes";

export const fetchAnalysis = async (fileId: string): Promise<AnalysisResponse> => {
  const response = await axiosInstance.get(`/api/users/analysis/${fileId}`);
  return response.data;
};
