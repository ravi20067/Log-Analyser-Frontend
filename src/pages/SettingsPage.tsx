import { useState, useEffect } from "react";
import { User, Lock, Bell, Palette, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrentUser, UserResponse } from "@/api/userService";
import { updateProfile, updatePassword } from "@/api/settingsService";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "system", label: "System", icon: Info },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<UserResponse | null>(null);

  const [name, setName] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
        setName(data.name); // preload name
      } catch {
        setError("Failed to load user data.");
      }
    };
    fetchUser();
  }, []);

  // 🔹 Update Name
  const handleProfileSave = async () => {
    try {
      setProfileLoading(true);
      setError(null);
      setMessage(null);

      const res = await updateProfile({ name });
      setMessage(res.message || "Name updated successfully.");
      setUser((prev) => prev ? { ...prev, name } : prev);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Name update failed.");
    } finally {
      setProfileLoading(false);
    }
  };

  // 🔹 Update Password
  const handlePasswordUpdate = async () => {
    try {
      setPasswordLoading(true);
      setError(null);
      setMessage(null);

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const res = await updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setMessage(res.message || "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Password update failed.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-primary">Settings</h1>

      {message && (
        <div className="p-3 rounded bg-green-500/10 text-green-500 text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 rounded bg-red-500/10 text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="flex md:flex-col gap-2 md:w-48 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-sm whitespace-nowrap
              ${activeTab === tab.id
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:bg-secondary/50"
                }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-card p-4 md:p-6 rounded-xl border border-border space-y-6">

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input value={user?.email || ""} readOnly />
                <Input value={user?.role || ""} readOnly />
              </div>

              <Button
                onClick={handleProfileSave}
                disabled={profileLoading}
              >
                {profileLoading ? "Saving..." : "Update Name"}
              </Button>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-4 max-w-md">
              <Input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                onClick={handlePasswordUpdate}
                disabled={passwordLoading}
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
