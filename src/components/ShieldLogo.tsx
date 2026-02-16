import { Shield } from "lucide-react";

const ShieldLogo = ({ size = "lg" }: { size?: "sm" | "lg" }) => {
  const s = size === "lg" ? "w-20 h-20" : "w-10 h-10";
  const icon = size === "lg" ? 40 : 20;
  return (
    <div className={`${s} rounded-full flex items-center justify-center animate-pulse-glow border border-primary/30 bg-primary/10`}>
      <Shield size={icon} className="text-primary" />
    </div>
  );
};

export default ShieldLogo;
