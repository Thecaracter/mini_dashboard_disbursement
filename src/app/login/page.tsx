"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username wajib diisi"),
  password: z.string().trim().min(1, "Password wajib diisi"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError("");
    const result = await login(data.username, data.password);
    if (!result.success) {
      setApiError(result.error || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-black rounded-2xl p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.15)]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1C2421] mb-2">LintasPay</h1>
            <p className="text-[#606C5A] text-sm">Mini Dashboard Disbursement</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="username"
              label="Username"
              placeholder="admin atau operator"
              {...register("username")}
              error={errors.username?.message}
            />

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1C2421] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border-2 border-[#E8E3DB] rounded-lg focus:outline-none focus:border-[#C27D58] text-[#1C2421] pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606C5A] hover:text-[#1C2421]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password?.message && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {apiError && (
              <p className="text-red-600 text-sm text-center bg-red-100 border border-red-300 rounded-lg p-3">
                {apiError}
              </p>
            )}

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full mt-6"
            >
              Masuk
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-[#E8E3DB] text-center text-xs text-[#606C5A] space-y-1">
            <p className="font-medium text-[#1C2421] mb-2">Demo Credentials:</p>
            <p>Admin: admin / admin123</p>
            <p>Operator: operator / operator123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
