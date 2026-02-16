import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Chrome, Github, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import MatrixRain from "@/components/MatrixRain";
import ShieldLogo from "@/components/ShieldLogo";
import api from "@/api/axiosConfig";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);




  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/api/auth/login", {
        email: email,
        password: password,
      });

      const token = response.data.token;

      login(token);

      navigate("/home");

    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMsg("Invalid credentials");
      } else {
        setErrorMsg("Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg scanline">
      <MatrixRain />
      <div className="relative z-10 w-full max-w-md p-8 glass-card cyber-box-glow animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <ShieldLogo />
          <h1 className="font-heading text-3xl font-bold mt-4 cyber-glow text-primary">CYBERSHIELD</h1>
          <p className="text-muted-foreground text-sm mt-1">Cyber Kill Chain Analyzer</p>
        </div>

        {!showForgot ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <Input
                type="email"
                placeholder="agent@cybershield.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-border focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary border-border focus:border-primary pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox /> Remember device
              </label>
              <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-primary hover:underline">
                Forgot access?
              </button>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm text-center">
                {errorMsg}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading text-lg">
              {loading ? "ACCESSING..." : "ACCESS SYSTEM"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">OR CONTINUE WITH</span></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" type="button" className="border-border hover:border-primary hover:bg-primary/10" onClick={() => window.location.href = "http://localhost:7777/oauth2/authorization/google"}>
                <Chrome size={18} />
              </Button>
              <Button variant="outline" type="button" className="border-border hover:border-primary hover:bg-primary/10">
                <Github size={18} />
              </Button>
              <Button variant="outline" type="button" className="border-border hover:border-primary hover:bg-primary/10">
                <Key size={18} />
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              No credentials? <Link to="/register" className="text-primary hover:underline">Register Now</Link>
            </p>
          </form>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <h2 className="font-heading text-xl text-center">Reset Access</h2>
            <Input type="email" placeholder="Enter your email" className="bg-secondary border-border" />
            <Button className="w-full bg-primary text-primary-foreground">Send Reset Link</Button>
            <button onClick={() => setShowForgot(false)} className="text-sm text-primary hover:underline w-full text-center block">
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
