import { ArrowUpRightSquare, Lock, Mail } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import LabeledInput from "../components/ui/InputWithLabel";
import PrimaryButton from "../components/ui/PrimaryButton";
import { Link, Navigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useLoginMutation,
  useProfileQuery,
} from "../redux/features/auth/authApi";

const loginSchema = z.object({
  email: z
    .string({ error: "Invalid email address" })
    .min(1, { error: "Email is required" }),
  password: z
    .string({ error: "Password is required" })
    .min(6, { error: "Password must be at least 6 characters long" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const { data: authUser } = useProfileQuery("");
  const [login] = useLoginMutation();

  // Redirect if already logged in
  if (authUser?.data?.email) {
    return <Navigate replace to="/dashboard" />;
  }

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const res = await login(data).unwrap();
      toast.success(res?.message || "Login successful!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed. Please try again.");
    }
  };

  const fillDemoCredentials = () => {
    setValue("email", "hasanmiaweb@gmail.com");
    setValue("password", "12345678");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
            Login
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Access your account safely
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <LabeledInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your Email"
            icon={<Mail />}
            register={register}
            error={errors.email?.message}
          />

          <LabeledInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your Password"
            icon={<Lock />}
            register={register}
            error={errors.password?.message}
          />

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <PrimaryButton type="submit" icon={<Lock />}>
            Login
          </PrimaryButton>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Try our demo accounts for quick access
          </p>

          {/* Demo buttons */}
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials()}
              className="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition"
            >
              Demo User
            </button>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
