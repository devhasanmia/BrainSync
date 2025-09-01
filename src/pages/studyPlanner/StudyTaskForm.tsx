import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, FileText, Clock } from "lucide-react";
import LabeledInput from "@/components/ui/InputWithLabel";
import PrimaryButton from "@/components/ui/PrimaryButton";

// Validation schema using zod
export const studyTaskValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  estimatedHours: z.string().optional(),
  completed: z.boolean().optional(),
});

export type StudyTaskFormInputs = z.infer<typeof studyTaskValidationSchema>;

interface StudyTaskFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<StudyTaskFormInputs>;
  onSubmit: SubmitHandler<StudyTaskFormInputs>;
}

const StudyTaskForm = ({ mode, defaultValues, onSubmit }: StudyTaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudyTaskFormInputs>({
    resolver: zodResolver(studyTaskValidationSchema),
    defaultValues,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === "add" ? "Add New Study Task" : "Update Study Task"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {mode === "add"
                ? "Fill in the details to create a study task"
                : "Fill in the details to update the study task"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <LabeledInput
              label="Title"
              name="title"
              type="text"
              placeholder="Enter task title"
              icon={<FileText />}
              register={register}
              error={errors.title?.message}
            />

            <LabeledInput
              label="Subject"
              name="subject"
              type="text"
              placeholder="Enter subject name"
              icon={<BookOpen />}
              register={register}
              error={errors.subject?.message}
            />

            <LabeledInput
              label="Description"
              name="description"
              type="text"
              placeholder="Optional description"
              icon={<FileText />}
              register={register}
              error={errors.description?.message}
            />

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <select
                {...register("priority")}
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority?.message && (
                <p className="text-sm text-red-500 mt-1">{errors.priority.message}</p>
              )}
            </div>

            <LabeledInput
              label="Deadline"
              name="deadline"
              type="date"
              icon={<Clock />}
              register={register}
              error={errors.deadline?.message}
            />

            <LabeledInput
              label="Estimated Hours"
              name="estimatedHours"
              type="number"
              placeholder="Optional, e.g. 2h"
              icon={<Clock />}
              register={register}
              error={errors.estimatedHours?.message}
            />
            <div className="flex justify-center pt-4">
              <PrimaryButton type="submit">
                {mode === "add" ? "Save Task" : "Update Task"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudyTaskForm;
