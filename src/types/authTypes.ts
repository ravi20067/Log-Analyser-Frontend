export interface LoginResponse {
  token: string;
}

export interface AuthContextType {
  token: string | null;
  loginUser: (username: string, password: string) => Promise<void>;
  logoutUser: () => void;
}
