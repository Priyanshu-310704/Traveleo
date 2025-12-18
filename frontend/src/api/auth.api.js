import api from "./api";

export const loginUser = (data) => api.post("/login", data);

export const verifyOtp = (data) => api.post("/verify-otp", data);

export const resendOtp = (data) => api.post("/resend-otp", data);

export const registerUser = (data) => api.post("/users", data);
