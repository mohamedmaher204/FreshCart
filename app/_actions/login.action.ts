"use server";

import axios from "axios";
import { loginSchema } from "../_Schema/loginSchema";

type LoginResponse =
  | { success: true; message: string; token: string; user: any }
  | { success: false; message: string };

export async function loginAction(
  userData: loginSchema
): Promise<LoginResponse> {
  try {
    const { data } = await axios.post(
      "https://ecommerce.routemisr.com/api/v1/auth/signin",
      userData
    );

    if (data.message === "success") {
      return {
        success: true,
        message: "Login successful",
        token: data.token,
        user: data.user,
      };
    }

    return {
      success: false,
      message: data.message || "Login failed",
    };
  } catch (error: any) {
    console.error("Login Action Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Invalid email or password.",
    };
  }
}
