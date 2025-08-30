import { Mail, Lock, User, Phone, ShieldCheck } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import PrimaryButton from "../components/ui/PrimaryButton";
import LabeledInput from "../components/ui/InputWithLabel";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "../redux/features/auth/authApi";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z.string({ error: 'Name is required' }).min(1, { error: 'Name is required' }),
  email: z.email({ error: 'Invalid email address' }).min(1, { error: 'Email is required' }),
  phone: z
    .string({ error: 'Phone is required' })
    .min(1, { error: 'Phone is required' })
    .regex(/^01\d{9}$/, { error: 'Phone number must be 11 digits and start with 01' }),
  password: z.string({ error: 'Password is required' })
    .min(6, { error: 'Password must be at least 6 characters long' }),
  role: z.enum(['user', 'agent'], {
    error: "Role must be one of 'user', 'agent'",
  }),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const [registration] = useRegisterMutation()

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      const res = await registration(data).unwrap();
      toast.success(res?.message || "Registration successful!");
      navigate("/login", { replace: true });
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Register to get started
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <LabeledInput
            label="Full Name"
            name="name"
            placeholder="Enter your Name"
            icon={<User />}
            register={register}
            error={errors.name?.message}
          />

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
            label="Phone Number"
            name="phone"
            type="tel"
            placeholder="Enter your Phone"
            icon={<Phone />}
            register={register}
            error={errors.phone?.message}
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

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Role
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                id="role"
                {...register("role")}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none shadow-sm"
              >
                <option value="user">User</option>
                <option value="agent">Agent</option>
              </select>
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
            )}
          </div>

          <PrimaryButton type="submit" icon={<ShieldCheck />}>
            Register
          </PrimaryButton>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
