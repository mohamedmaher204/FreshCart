"use server";

import axios from "axios";
import { SignupSchema } from "../_Schema/signupSchema";

type SignupResponse =
  | { success: true; message: string; user: any }
  | { success: false; message: string };

export async function signupAction(
  userData: SignupSchema
): Promise<SignupResponse> {
  try {
    const { data } = await axios.post(
      "https://ecommerce.routemisr.com/api/v1/auth/signup",
      userData
    );

    // If successful, data usually contains { message: "success", user: {...}, token: "..." }
    if (data.message === "success") {
      return {
        success: true,
        message: "Account created successfully",
        user: data.user,
      };
    }

    return {
      success: false,
      message: data.message || "Signup failed",
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Signup API Error Details:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed: " + error.message,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred during signup.",
    };
  }
}
