import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userContext } from "../context/UserContext";
import { loginUser, loginWithGoogle, getCurrentUser, sendOtp, verifyOtp, forgotPassword } from "../services/api";
import {
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
  X,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import P2PExchangeVisual from "../components/P2PExchangeVisual";
import { ArrowLeftRight } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(userContext);
  const navigate = useNavigate();

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Reset password
  const [forgotError, setForgotError] = useState(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

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

  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);
    try {
      await sendOtp(forgotEmail, "FORGOT_PASSWORD");
      setForgotStep(2);
      setCooldown(60);
    } catch (err) {
      setForgotError(err.message || "Failed to send OTP code");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyForgotOtp = async (e) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);
    try {
      await verifyOtp(forgotEmail, forgotOtp, "FORGOT_PASSWORD");
      setForgotStep(3);
    } catch (err) {
      setForgotError(err.message || "Invalid OTP code");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError(null);
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Passwords do not match");
      return;
    }
    setForgotLoading(true);
    try {
      await forgotPassword(forgotEmail, forgotNewPassword);
      setForgotSuccess(true);
      setTimeout(() => {
        setIsForgotModalOpen(false);
        // Reset states
        setForgotEmail("");
        setForgotOtp("");
        setForgotNewPassword("");
        setForgotConfirmPassword("");
        setForgotStep(1);
        setForgotSuccess(false);
      }, 2000);
    } catch (err) {
      setForgotError(err.message || "Failed to reset password");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResendForgotOtp = async () => {
    if (cooldown > 0) return;
    setForgotError(null);
    setForgotLoading(true);
    try {
      await sendOtp(forgotEmail, "FORGOT_PASSWORD");
      setCooldown(60);
    } catch (err) {
      setForgotError(err.message || "Failed to resend OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);
      setUser(response.data || response);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
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

      <div className="w-full max-w-6xl lg:h-[90vh] lg:max-h-[660px] bg-white/60 dark:bg-[#272625]/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-[40px] shadow-[0_24px_80px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.005)] p-4 md:p-6 lg:p-8 lg:grid lg:grid-cols-12 lg:gap-8 items-stretch relative z-10 transition-colors">
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
                  Instant Cash & UPI Swaps Nearby
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-300 font-semibold leading-relaxed max-w-sm">
                  Connect with verified peers in your neighborhood for safe, zero-fee cash-to-digital exchanges.
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

        {/* Right Side: Login Card */}
        <div className="lg:col-span-6 flex items-center justify-center p-2 h-full">
          <div className="w-full max-w-[450px] bg-white dark:bg-[#1f1e1d] border border-slate-100 dark:border-white/10 rounded-[32px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.02)] flex flex-col justify-center h-full animate-in fade-in zoom-in-95 duration-300 transition-colors">
            {/* Top Icon Block */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                <Users size={20} className="stroke-[2.5]" />
              </div>
            </div>

            {/* Header Text */}
            <div className="text-center space-y-1 mb-5">
              <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                Welcome Back!
              </h1>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-400">
                Login to continue to UPI Sathi
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3.5 text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-2 animate-shake">
                <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px]">
                  !
                </span>
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-3">
              {/* Email */}
              <div className="space-y-1.5">
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
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#272625] border border-slate-200 dark:border-white/10 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
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
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 bg-white dark:bg-[#272625] border border-slate-200 dark:border-white/10 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                    required
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

              {/* Forgot Password Row */}
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#111111] dark:bg-[#e8400d] hover:bg-[#272625] dark:hover:bg-[#d03709] text-white font-black rounded-2xl shadow-lg shadow-black/10 hover:shadow-black/20 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer mt-3 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-y-1/2 left-0 right-0 border-t border-slate-100 dark:border-white/10"></div>
              <span className="relative z-10 px-3 bg-white dark:bg-[#1f1e1d] text-[9px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                or continue with
              </span>
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                shape="pill"
                theme="filled_blue"
                text="continue_with"
                onError={() => {
                  console.log("Login failed");
                }}
              />

              <button
                type="button"
                onClick={() => alert("Phone Login clicked! (Demo only)")}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-200 text-xs font-extrabold text-slate-700 dark:text-slate-200 cursor-pointer bg-white dark:bg-[#272625]"
              >
                <Smartphone
                  size={18}
                  className="mr-3 text-slate-500 dark:text-slate-400 shrink-0"
                />
                <span>Continue with Phone</span>
              </button>
            </div>

            {/* Register Footer */}
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center mt-5">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold hover:underline transition-colors"
              >
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#272625] text-slate-800 dark:text-white rounded-[2.5rem] p-6 md:p-8 shadow-[0_32px_100px_rgba(15,23,42,0.12)] border border-slate-100 dark:border-white/10 flex flex-col justify-center animate-in zoom-in-95 duration-200 select-none">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotStep(1);
                setForgotError(null);
              }}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Icon & Title */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-3 shadow-sm animate-bounce" style={{ animationDuration: '3s' }}>
                <KeyRound size={20} className="stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Forgot Password?</h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-semibold mt-1">
                {forgotStep === 1 && "Enter your email to request a reset code."}
                {forgotStep === 2 && `We sent a 6-digit code to ${forgotEmail}`}
                {forgotStep === 3 && "Create a secure new password for your account."}
              </p>
            </div>

            {/* Error Message */}
            {forgotError && (
              <div className="mb-4 p-3.5 text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-2">
                <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px]">
                  !
                </span>
                <span>{forgotError}</span>
              </div>
            )}

            {/* Step 1: Send OTP Form */}
            {forgotStep === 1 && (
              <form onSubmit={handleSendForgotOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1a1918] border border-slate-200 dark:border-white/10 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 bg-[#111111] dark:bg-[#e8400d] hover:bg-[#272625] dark:hover:bg-[#d03709] text-white font-black rounded-2xl shadow-lg shadow-black/10 transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center"
                >
                  {forgotLoading ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : (
                    "Send Code"
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Verify OTP Form */}
            {forgotStep === 2 && (
              <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Verification Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <KeyRound size={16} />
                    </div>
                    <input
                      type="number"
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1a1918] border border-slate-200 dark:border-white/10 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white tracking-widest placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 bg-[#111111] dark:bg-[#e8400d] hover:bg-[#272625] dark:hover:bg-[#d03709] text-white font-black rounded-2xl shadow-lg shadow-black/10 transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center animate-pulse"
                  style={{ animationDuration: '4s' }}
                >
                  {forgotLoading ? (
                    <Loader2 className="animate-spin mr-2" size={16} />
                  ) : (
                    "Verify Code"
                  )}
                </button>

                {/* Resend Cooldown */}
                <div className="text-center mt-2">
                  {cooldown > 0 ? (
                    <span className="text-xs font-semibold text-slate-400">
                      Resend code in {cooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendForgotOtp}
                      className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
                    >
                      Resend Verification Code
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Step 3: New Password Form */}
            {forgotStep === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {forgotSuccess ? (
                  <div className="text-center py-6 space-y-3 animate-in fade-in duration-300">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40 rounded-full flex items-center justify-center text-emerald-500 mx-auto shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">Password Changed Successfully!</h4>
                    <p className="text-[10px] text-slate-400 font-bold">You can now login with your new password.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Lock size={16} />
                        </div>
                        <input
                          type={showForgotNewPassword ? "text" : "password"}
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-12 pr-12 py-3 bg-white dark:bg-[#1a1918] border border-slate-200 dark:border-white/10 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                          required
                          minLength="6"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                        >
                          {showForgotNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                          <Lock size={16} />
                        </div>
                        <input
                          type="password"
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#1a1918] border border-slate-200 dark:border-white/10 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3.5 bg-[#111111] dark:bg-[#e8400d] hover:bg-[#272625] dark:hover:bg-[#d03709] text-white font-black rounded-2xl shadow-lg shadow-black/10 transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center animate-pulse"
                      style={{ animationDuration: '4s' }}
                    >
                      {forgotLoading ? (
                        <Loader2 className="animate-spin mr-2" size={16} />
                      ) : (
                        "Reset Password"
                      )}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
