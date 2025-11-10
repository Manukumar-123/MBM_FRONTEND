import { Endpoint } from "./endpoint";
import axiosInstance from "./intercepter";

// Assuming `identity` is your payload object
export const register = async (identity: unknown) => {
  const { data } = await axiosInstance.post(Endpoint.register, identity);
  return data;
};

export const verifyOtp = async (identifier: string, otp: string) => {
  const { data } = await axiosInstance.post(Endpoint.VerifyOtp, {
    identifier,
    otp,
  });
  return data;
};

export const completeProfile = async (profileData: unknown) => {
  const { data } = await axiosInstance.post(
    Endpoint.completeProfile,
    profileData
  );
  return data;
};

export const login = async (identity: unknown) => {
  const { data } = await axiosInstance.post(Endpoint.login, identity);
  return data;
};
