import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MatrixRain from "@/components/MatrixRain";
import ShieldLogo from "@/components/ShieldLogo";
import api from "@/api/axiosConfig";
import ReCAPTCHA from "react-google-recaptcha";


const requirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Number", test: (p: string) => /\d/.test(p) },
  { label: "Special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);


  const navigate = useNavigate();

  const strength = requirements.filter((r) => r.test(password)).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Excellent"][strength];
  const strengthColor = ["", "bg-destructive", "bg-cyber-orange", "bg-cyber-orange", "bg-accent", "bg-accent"][strength];
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);


  // 🔥 Send OTP API
  const handleSendOtp = async () => {
    if (!captchaToken) {
      alert("Please verify captcha");
      return;
    }    try {
      await api.post("/api/auth/send-otp", { 
        email,
        captchaToken,
       });
      setOtpSent(true);
      setTimer(30);
      setCanResend(false);

      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      alert("Failed to send OTP");
    }
  };


  // 🔥 Register API
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please verify captcha");
      return;
    }
    const finalOtp = otp.join("");


    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
        otp: finalOtp,
        captchaToken,
      });

      alert("Account created successfully!");
      navigate("/home");
    } catch (error) {
      alert("Invalid OTP or Captcha verification failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg scanline">
      <MatrixRain />
      <div className="relative z-10 w-full max-w-md p-8 glass-card cyber-box-glow animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <ShieldLogo />
          <h1 className="font-heading text-3xl font-bold mt-4 cyber-glow text-primary">
            CREATE ACCOUNT
          </h1>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="text-sm block">Email</label>

            <div className="flex items-end gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />

              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={!email}
                className="h-10"
              >
                Send OTP
              </Button>
            </div>
          </div>


          {otpSent && (
            <div className="space-y-3 animate-fade-in">

              <label className="text-sm text-muted-foreground">
                Enter Verification Code
              </label>

              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      const newOtp = [...otp];
                      newOtp[index] = value;
                      setOtp(newOtp);

                      if (value && index < 5) {
                        document.getElementById(`otp-${index + 1}`)?.focus();
                      }
                    }}
                    id={`otp-${index}`}
                    className="w-10 h-12 text-center text-lg font-bold bg-secondary border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  />
                ))}
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                {!canResend ? (
                  <span>Resend OTP in {timer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-primary hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

            </div>
          )}


          <div>
            <label className="text-sm">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-center py-2">
            <ReCAPTCHA
              sitekey="6LcOb2ssAAAAAMXmpd4PeC7SnUg5NCbiyeOpAFBR"
              theme="dark"
              onChange={(token) => setCaptchaToken(token)}
            />
          </div>


          <Button type="submit" className="w-full">
            INITIALIZE ACCOUNT
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
