import axiosInstance from "@/api/axiosConfig";
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}
export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await axiosInstance.get("/api/users/me");
  return response.data;
};