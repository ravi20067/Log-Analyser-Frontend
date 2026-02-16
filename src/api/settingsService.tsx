import axiosInstance from "@/api/axiosConfig";

export interface UpdateProfileRequest {
  name: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse {
  message: string;
}

// 🔹 Update Name Only
export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<ApiResponse> => {
  const response = await axiosInstance.put("/api/users/profile", data);
  return response.data;
};

// 🔹 Update Password
export const updatePassword = async (
  data: UpdatePasswordRequest
): Promise<ApiResponse> => {
  const response = await axiosInstance.put("/api/users/password", data);
  return response.data;
};
