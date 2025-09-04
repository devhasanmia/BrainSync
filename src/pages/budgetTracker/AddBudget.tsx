import { useForm, type SubmitHandler } from "react-hook-form";
import { DollarSign, Calendar, Clipboard } from "lucide-react";
import LabeledInput from "@/components/ui/InputWithLabel";
import LabeledSelect from "@/components/ui/LabeledSelect";
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
  const { register, watch, handleSubmit, control } = useForm<BudgetForm>({
    defaultValues: {
      budgetType: "",
      category: "",
      amount: 0,
      description: "",
      date: "",
    },
  });

  const budgetType = watch("budgetType");
  const navigate = useNavigate();

  const categoryOptions: Record<
    BudgetForm["budgetType"],
    { value: string; label: string }[]
  > = {
    Income: [
      { value: "Allowance", label: "Allowance" },
      { value: "Part-time Job", label: "Part-time Job" },
      { value: "Scholarship", label: "Scholarship" },
      { value: "Other", label: "Other" },
    ],
    Expense: [
      { value: "Food", label: "Food" },
      { value: "Transport", label: "Transport" },
      { value: "Books", label: "Books" },
      { value: "Entertainment", label: "Entertainment" },
      { value: "Other", label: "Other" },
    ],
    "": [],
  };

  const [createBudget] = useCreateBudgetMutation();

  const onSubmit: SubmitHandler<BudgetForm> = async (data) => {
    try {
      const formattedData = { ...data, amount: Number(data.amount) };
      const res = await createBudget(formattedData).unwrap();
      toast.success(res.data.message || "Budget added successfully!");
      navigate("/dashboard/budget-tracker");
    } catch {
      toast.error("Failed to add budget.");
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add Budget
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Fill in the details to create a budget entry
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Budget Type */}
          <LabeledSelect
            label="Budget Type"
            name="budgetType"
            control={control}
            options={[
              { value: "Income", label: "Income" },
              { value: "Expense", label: "Expense" },
            ]}
            required
          />

          {/* Category */}
          <LabeledSelect
            label="Category"
            name="category"
            control={control}
            options={budgetType ? categoryOptions[budgetType] : []}
            required
            error={
              !budgetType ? "Please select a budget type first" : undefined
            }
          />

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
