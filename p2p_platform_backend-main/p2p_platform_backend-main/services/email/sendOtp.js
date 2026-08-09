import env from "../../config/env.js";
import { Resend } from "resend";
import { otpTemplate } from "./templates/otpTemplate.js";

const resendApiKey = env.RESEND_KEY || env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const sendOtpFunc = async (email, otp) => {
  try {
    if (!resend) {
      console.error("Resend API Key is missing in environment variables.");
      return { isSent: false, error: "Resend API Key missing" };
    }
    const result = await resend.emails.send({
      from: `UpiSathi <${env.OTP_EMAILID}>`,
      to: [email],
      subject: "Your OTP Code",
      html: otpTemplate(otp),
    });

    if (result.error) {
      console.error("Resend delivery error:", result.error);
      return { isSent: false, error: result.error };
    }
    return { isSent: true };
  } catch (err) {
    console.error("Resend send exception:", err);
    return { isSent: false, error: err };
  }
};
