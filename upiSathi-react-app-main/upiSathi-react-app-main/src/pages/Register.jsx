import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userContext } from "../context/UserContext";
import { registerUser, loginWithGoogle, sendOtp, verifyOtp, getCurrentUser } from "../services/api";
import {
  User,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Users,
  Shield,
  MapPin,
  Zap,
  Loader2,
  Smartphone,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import P2PExchangeVisual from "../components/P2PExchangeVisual";
import { ArrowLeftRight } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(userContext);
  const navigate = useNavigate();

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSendOtp = async () => {
    if (!email) {
      setOtpError("Please enter email address first");
      return;
    }
    setOtpError(null);
    setOtpLoading(true);
    try {
      await sendOtp(email, "REGISTER");
      setOtpSent(true);
      setCooldown(60);
    } catch (err) {
      setOtpError(err.message || "Failed to send OTP code");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      setOtpError("Please enter OTP code");
      return;
    }
    setOtpError(null);
    setOtpLoading(true);
    try {
      await verifyOtp(email, otpCode, "REGISTER");
      setIsEmailVerified(true);
    } catch (err) {
      setOtpError(err.message || "Invalid OTP code");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isEmailVerified) {
      setError("Please verify your email first");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(username, email, password);
      // Backend registration requires the user to login manually after successful registration
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      const userRes = await getCurrentUser();
      setUser(userRes.data || userRes);
      navigate("/");
    } catch (err) {
      setError(err.message || "Google authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-[#F8F9FD] dark:bg-[#161514] text-slate-800 dark:text-white flex items-center justify-center p-4 md:p-8 select-none relative overflow-hidden transition-colors duration-300">
      {/* Top action cluster: Vision link + ThemeToggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center space-x-3">
        <Link
          to="/landing"
          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white/80 dark:bg-[#272625]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/70 dark:border-white/10 transition-colors shadow-sm"
        >
          Explore Vision
        </Link>
        <ThemeToggle />
      </div>

      {/* Background blobs for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 dark:bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/10 dark:bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-6xl lg:h-[90vh] lg:max-h-[720px] bg-white/60 dark:bg-[#272625]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-[40px] shadow-[0_24px_80px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.005)] p-4 md:p-6 lg:p-8 lg:grid lg:grid-cols-12 lg:gap-8 items-stretch relative z-10 transition-colors">
        {/* Left Side: Illustration / Brand Panel (hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-4 h-full">
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            {/* Logo and Tagline */}
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#e8400d] flex items-center justify-center text-white shadow-md shadow-orange-500/25">
                  <ArrowLeftRight size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                    UPI<span className="text-[#e8400d]">Sathi</span>
                  </span>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 tracking-wider uppercase">
                    PeerSync Network
                  </div>
                </div>
              </div>

              <div className="space-y-1 mt-3">
                <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
                  Join the Verified Cash Network
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-300 font-semibold leading-relaxed max-w-sm">
                  Create your profile to swap cash & UPI seamlessly with nearby neighbors.
                </p>
              </div>
            </div>

            {/* Live Interactive P2P Simulation Card */}
            <P2PExchangeVisual />
          </div>

          {/* Highlights Row */}
          <div className="bg-white/80 dark:bg-[#1a1918]/80 border border-slate-100/80 dark:border-white/10 rounded-3xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] grid grid-cols-3 gap-2 mt-2">
            <div className="text-center space-y-0.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-white/5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-1 shadow-sm shadow-indigo-100/50">
                <Shield size={16} />
              </div>
              <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">
                Safe & Secure
              </h4>
              <p className="text-[9px] text-slate-450 dark:text-slate-400 font-medium">
                Verified users only
              </p>
            </div>

            <div className="text-center space-y-0.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-white/5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-1 shadow-sm shadow-indigo-100/50">
                <MapPin size={16} />
              </div>
              <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">
                Nearby Helpers
              </h4>
              <p className="text-[9px] text-slate-450 dark:text-slate-400 font-medium">
                Find people close to you
              </p>
            </div>

            <div className="text-center space-y-0.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-white/5 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-1 shadow-sm shadow-indigo-100/50">
                <Zap size={16} />
              </div>
              <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">
                Quick Swaps
              </h4>
              <p className="text-[9px] text-slate-450 dark:text-slate-400 font-medium">
                Fast & easy swaps
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Register Card */}
        <div className="lg:col-span-6 flex items-center justify-center p-2 h-full">
          <div className="w-full max-w-[450px] bg-white dark:bg-[#1f1e1d] border border-slate-100 dark:border-white/10 rounded-[32px] p-5 lg:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.02)] flex flex-col justify-center h-full animate-in fade-in zoom-in-95 duration-300 transition-colors">
            {/* Top Icon Block */}
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                <UserPlus size={18} className="stroke-[2.5]" />
              </div>
            </div>

            {/* Header Text */}
            <div className="text-center space-y-1 mb-3">
              <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                Create Account
              </h1>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-400">
                Register to get started on UPI Sathi
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-3 p-3 text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-2 animate-shake">
                <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px]">
                  !
                </span>
                <span>{error}</span>
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleRegister} className="space-y-3">
              {/* Username */}
              <div className="space-y-1">
                <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full pl-12 pr-4 py-2 bg-white dark:bg-[#272625] border border-slate-200 dark:border-white/10 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 outline-none text-sm transition-all shadow-sm disabled:bg-slate-50 dark:disabled:bg-[#1a1918] disabled:text-slate-400"
                    required
                    disabled={isEmailVerified}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-[80px] py-2 bg-white dark:bg-[#272625] border border-slate-200 dark:border-white/10 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 outline-none text-sm transition-all shadow-sm disabled:bg-slate-50 dark:disabled:bg-[#1a1918] disabled:text-slate-400"
                    required
                    disabled={otpSent || isEmailVerified}
                  />
                  {!isEmailVerified && !otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="absolute inset-y-1.5 right-2 px-3 bg-indigo-50 dark:bg-white/10 border border-indigo-100 dark:border-white/15 hover:bg-indigo-100/70 text-indigo-600 dark:text-indigo-300 font-extrabold text-[10px] rounded-xl transition-all cursor-pointer flex items-center justify-center"
                    >
                      {otpLoading ? <Loader2 size={12} className="animate-spin" /> : "Verify"}
                    </button>
                  )}
                  {isEmailVerified && (
                    <div className="absolute inset-y-0 right-3 flex items-center text-emerald-500 font-extrabold text-xs">
                      <CheckCircle2 size={16} className="mr-1" />
                      Verified
                    </div>
                  )}
                </div>
              </div>

              {/* OTP Input Fields if OTP is Sent and NOT verified */}
              {!isEmailVerified && otpSent && (
                <div className="p-3 bg-indigo-50/40 dark:bg-white/5 border border-indigo-100/30 dark:border-white/10 rounded-2xl space-y-2.5 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">
                      Email Verification
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpCode("");
                        setOtpError(null);
                      }}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    >
                      Change Email
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <KeyRound size={14} />
                      </div>
                      <input
                        type="number"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1a1918] border border-slate-200 dark:border-white/10 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white tracking-wider placeholder-slate-400 outline-none text-xs transition-all shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  {otpError && (
                    <p className="text-[10px] font-bold text-rose-500">{otpError}</p>
                  )}

                  <div className="flex items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpLoading}
                      className="flex-1 py-2 bg-[#111111] dark:bg-[#e8400d] hover:bg-[#272625] dark:hover:bg-[#d03709] text-white font-extrabold rounded-xl shadow-sm text-xs transition-all cursor-pointer flex items-center justify-center"
                    >
                      {otpLoading ? <Loader2 size={12} className="animate-spin mr-1" /> : "Confirm Code"}
                    </button>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={cooldown > 0 || otpLoading}
                      className="py-2 px-3 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      {cooldown > 0 ? `Resend (${cooldown}s)` : "Resend"}
                    </button>
                  </div>
                </div>
              )}

              {/* Password Fields - only enabled/visible when email is verified */}
              {isEmailVerified && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  {/* Password */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock size={16} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full pl-12 pr-12 py-2 bg-white dark:bg-[#272625] border border-slate-200 dark:border-white/10 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock size={16} />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full pl-12 pr-12 py-2 bg-white dark:bg-[#272625] border border-slate-200 dark:border-white/10 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-[#111111] dark:bg-[#e8400d] hover:bg-[#272625] dark:hover:bg-[#d03709] text-white font-black rounded-2xl shadow-lg shadow-black/10 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer mt-3 flex items-center justify-center animate-pulse"
                    style={{ animationDuration: '4s' }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <span>Register</span>
                    )}
                  </button>
                </div>
              )}
            </form>

            {/* Divider */}
            <div className="relative my-2.5 text-center">
              <div className="absolute inset-y-1/2 left-0 right-0 border-t border-slate-100 dark:border-white/10"></div>
              <span className="relative z-10 px-3 bg-white dark:bg-[#1f1e1d] text-[9px] font-black text-slate-400 uppercase tracking-wider">
                or continue with
              </span>
            </div>

            {/* Social Logins */}
            <div className="space-y-1.5">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                shape="pill"
                text="continue_with"
                theme="filled_blue"
                onError={() => {
                  console.log("Register failed");
                }}
              />

              <button
                type="button"
                onClick={() => alert("Phone signup clicked! (Demo only)")}
                className="w-full flex items-center justify-center py-2 px-4 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-200 text-xs font-extrabold text-slate-700 dark:text-slate-200 cursor-pointer bg-white dark:bg-[#272625]"
              >
                <Smartphone
                  size={18}
                  className="mr-3 text-slate-500 dark:text-slate-400 shrink-0"
                />
                <span>Continue with Phone</span>
              </button>
            </div>

            {/* Login Footer */}
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center mt-3">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold hover:underline transition-colors"
              >
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
