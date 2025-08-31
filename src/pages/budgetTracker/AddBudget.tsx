import { useForm, type SubmitHandler } from "react-hook-form";
import { DollarSign, Calendar, Clipboard } from "lucide-react";
import LabeledInput from "@/components/ui/InputWithLabel";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useCreateBudgetMutation } from "@/redux/features/budgetTracker/budgetTrackerApi";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface BudgetForm {
  budgetType: "Income" | "Expense" | "";
  category: string;
  amount: number;
  description?: string;
  date: string;
}

const AddBudget = () => {
  const { register, watch, handleSubmit } = useForm<BudgetForm>({
    defaultValues: {
      budgetType: "",
      category: "",
      amount: 0,
      description: "",
      date: "",
    },
  });

  const budgetType = watch("budgetType");
  const navigate = useNavigate()
  const categoryOptions: Record<BudgetForm["budgetType"], string[]> = {
    Income: ["Allowance", "Part-time Job", "Scholarship", "Other"],
    Expense: ["Food", "Transport", "Books", "Entertainment"],
    "": [],
  };
  const [createBudget] = useCreateBudgetMutation()
  const onSubmit: SubmitHandler<BudgetForm> = async (data) => {
    const formattedData = {
      ...data,
      amount: Number(data.amount),
    };
    try {
      const res = await createBudget(formattedData).unwrap();
      toast.success(res.data.message || "Schedule added successfully!");
      navigate("/dashboard/budget-tracker")
    } catch {
      toast.error("Failed to add schedule.");
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Budget</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Fill in the details to create a budget entry
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Budget Type */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Budget Type
            </label>
            <select
              {...register("budgetType")}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select type</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              {...register("category")}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
              disabled={!budgetType}
            >
              <option value="">Select category</option>
              {budgetType &&
                categoryOptions[budgetType].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          {/* Amount */}
          <LabeledInput
            label="Amount"
            name="amount"
            type="number"
            placeholder="Enter amount"
            icon={<DollarSign />}
            register={register}
            required
          />

          {/* Description */}
          <LabeledInput
            label="Description"
            name="description"
            type="text"
            placeholder="Optional"
            icon={<Clipboard />}
            register={register}
            required
          />

          {/* Date */}
          <LabeledInput
            label="Date"
            name="date"
            type="date"
            icon={<Calendar />}
            register={register}
            required
          />

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <PrimaryButton type="submit">Save Budget</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBudget;
