"use server";

import axios from "axios";
import { RegisterInput } from "../_lib/validations";

type SignupResponse =
  | { success: true; message: string; user?: any }
  | { success: false; message: string };

export async function signupAction(
  userData: RegisterInput
): Promise<SignupResponse> {
  try {
    // Calling our internal API instead of the external one
    const { data, status } = await axios.post(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/register`,
      userData
    );

    if (status === 201) {
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
    console.error("Signup Action Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong during registration.",
    };
  }
}
