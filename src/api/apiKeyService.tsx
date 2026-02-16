import axiosInstance from "@/api/axiosConfig";

export interface ApiKeyResponse {
  id: string;
  apiKey: string;
  secretKey: string;
  createdAt: string;
}

// 1️⃣ Generate API Key
export const generateApiKey = async (): Promise<ApiKeyResponse> => {
  const response = await axiosInstance.post("/api/keys/generate");
  return response.data;
};

// 2️⃣ Get My API Key
export const getMyApiKey = async (): Promise<ApiKeyResponse> => {
  const response = await axiosInstance.get("/api/keys/my");
  return response.data;
};

// 3️⃣ Delete API Key
export const deleteApiKey = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/keys/${id}`);
};

// 4️⃣ Get All API Keys (Admin)
export const getAllApiKeys = async (): Promise<ApiKeyResponse[]> => {
  const response = await axiosInstance.get("/api/keys/all");
  return response.data;
};
