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
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-[#F8F9FD] flex items-center justify-center p-4 md:p-8 select-none relative overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-6xl lg:h-[90vh] lg:max-h-[660px] bg-white/40 backdrop-blur-xl border border-white/50 rounded-[40px] shadow-[0_24px_80px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.005)] p-4 md:p-6 lg:p-8 lg:grid lg:grid-cols-12 lg:gap-8 items-stretch relative z-10">
        {/* Left Side: Illustration / Brand Panel (hidden on mobile) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between p-4 h-full">
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            {/* Logo and Tagline */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-black text-slate-800 tracking-tight">
                  Peer<span className="text-indigo-650">Sync</span>
                </span>
              </div>

              <div className="space-y-1 mt-3">
                <h2 className="text-xl font-black text-indigo-600 tracking-wide">
                  Swap. Connect. Help.
                </h2>
                <p className="text-sm text-slate-500 font-semibold leading-relaxed max-w-sm">
                  Cash or UPI, people you can trust near you.
                </p>
              </div>
            </div>

            {/* Empty Space representing the illustration */}
            <div className="flex-1 min-h-[140px] my-3 w-full rounded-[28px] bg-slate-50/50 border border-slate-100/50 border-dashed flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-tr from-slate-100/20 to-indigo-50/10 animate-pulse"
                style={{ animationDuration: "4s" }}
              ></div>
              <div className="relative z-10 flex flex-col items-center text-slate-400 font-bold text-xs tracking-wide space-y-1">
                <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-dashed flex items-center justify-center mb-1 text-slate-300">
                  <Users size={18} className="text-slate-300 stroke-[1.5]" />
                </div>
                <span>Illustration Area</span>
                <span className="text-[10px] font-semibold text-slate-350">
                  Placeholder for visual assets
                </span>
              </div>
            </div>
          </div>

          {/* Highlights Row */}
          <div className="bg-white/80 border border-slate-100/80 rounded-3xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] grid grid-cols-3 gap-2 mt-2">
            <div className="text-center space-y-0.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-1 shadow-sm shadow-indigo-100/50">
                <Shield size={16} />
              </div>
              <h4 className="font-extrabold text-slate-800 text-xs">
                Safe & Secure
              </h4>
              <p className="text-[9px] text-slate-450 font-medium">
                Verified users only
              </p>
            </div>

            <div className="text-center space-y-0.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-1 shadow-sm shadow-indigo-100/50">
                <MapPin size={16} />
              </div>
              <h4 className="font-extrabold text-slate-800 text-xs">
                Nearby Helpers
              </h4>
              <p className="text-[9px] text-slate-450 font-medium">
                Find people close to you
              </p>
            </div>

            <div className="text-center space-y-0.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-1 shadow-sm shadow-indigo-100/50">
                <Zap size={16} />
              </div>
              <h4 className="font-extrabold text-slate-800 text-xs">
                Quick Swaps
              </h4>
              <p className="text-[9px] text-slate-450 font-medium">
                Fast & easy swaps
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="lg:col-span-6 flex items-center justify-center p-2 h-full">
          <div className="w-full max-w-[450px] bg-white border border-slate-100 rounded-[32px] p-6 lg:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.02)] flex flex-col justify-center h-full animate-in fade-in zoom-in-95 duration-300">
            {/* Top Icon Block */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                <Users size={20} className="stroke-[2.5]" />
              </div>
            </div>

            {/* Header Text */}
            <div className="text-center space-y-1 mb-5">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Welcome Back!
              </h1>
              <p className="text-xs font-semibold text-slate-450">
                Login to continue to PeerSync
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
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
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
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-850 text-slate-800 placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
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
                    className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-855 text-slate-800 placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>              {/* Forgot Password Row */}
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-extrabold text-indigo-650 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer mt-3 flex items-center justify-center"
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
              <div className="absolute inset-y-1/2 left-0 right-0 border-t border-slate-100"></div>
              <span className="relative z-10 px-3 bg-white text-[9px] font-black text-slate-400 uppercase tracking-wider">
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
                className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors duration-200 text-xs font-extrabold text-slate-700 cursor-pointer bg-white"
              >
                <Smartphone
                  size={18}
                  className="mr-3 text-slate-500 shrink-0"
                />
                <span>Continue with Phone</span>
              </button>
            </div>

            {/* Register Footer */}
            <div className="text-xs font-semibold text-slate-500 text-center mt-5">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-650 hover:text-indigo-700 font-bold hover:underline transition-colors"
              >
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-6 md:p-8 shadow-[0_32px_100px_rgba(15,23,42,0.12)] border border-slate-100 flex flex-col justify-center animate-in zoom-in-95 duration-200 select-none">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotStep(1);
                setForgotError(null);
              }}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Icon & Title */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-650 mx-auto mb-3 shadow-sm animate-bounce" style={{ animationDuration: '3s' }}>
                <KeyRound size={20} className="stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Forgot Password?</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
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
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/15 transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center"
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
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 tracking-widest placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/15 transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center animate-pulse"
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
                      className="text-xs font-black text-indigo-650 hover:text-indigo-700 cursor-pointer"
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
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mx-auto shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="text-sm font-black text-slate-800">Password Changed Successfully!</h4>
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
                          className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                          required
                          minLength="6"
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
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
                          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium text-slate-800 placeholder-slate-400 outline-none text-sm transition-all shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/15 transition-all duration-300 disabled:opacity-50 text-sm cursor-pointer flex items-center justify-center animate-pulse"
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
