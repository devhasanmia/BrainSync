import { useForm, type SubmitHandler } from "react-hook-form";
import { BookOpen, HelpCircle } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import LabeledInput from "@/components/ui/InputWithLabel";
import { toast } from "sonner";

export type QuestionType = "mcq" | "short" | "truefalse";
export type Difficulty = "easy" | "medium" | "hard";

export interface BaseQuestion {
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: "mcq";
  options: string[];
  answer: string;
}

export interface ShortQuestion extends BaseQuestion {
  type: "short";
  answer: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "truefalse";
  answer: "true" | "false";
}

export type IQuestion = MCQQuestion | ShortQuestion | TrueFalseQuestion;

const AddQuestion = () => {
  const { register, watch, handleSubmit, reset } = useForm<IQuestion>({
    defaultValues: {
      type: "mcq",
      difficulty: "easy",
      question: "",
      options: ["", "", "", ""], // default 4 options
      answer: "",
    },
  });

  const questionType = watch("type");
  const options = watch("options") as string[]; // live watch on options

  const onSubmit: SubmitHandler<IQuestion> = async (data) => {
    try {
      if (data.type === "mcq") {
        data.options = data.options.filter((opt) => opt.trim() !== "");
      }
      console.log("Generated Question Data:", data);
      toast.success("Question added successfully!");
      reset();
    } catch {
      toast.error("Failed to add question.");
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Exam Question</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Fill in the details to create a question
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Question Type
            </label>
            <select
              {...register("type")}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="mcq">Multiple Choice</option>
              <option value="short">Short Answer</option>
              <option value="truefalse">True/False</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Difficulty
            </label>
            <select
              {...register("difficulty")}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Question Text */}
          <LabeledInput
            label="Question"
            name="question"
            type="text"
            placeholder="Enter your question"
            icon={<BookOpen />}
            register={register}
            required
          />

          {/* Conditional Fields */}
          {questionType === "mcq" && (
            <>
              {/* Options */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Options
                </label>
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      type="text"
                      {...register(`options.${i}` as const)}
                      placeholder={`Option ${i + 1}`}
                      className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
                    />
                  ))}
                </div>
              </div>

              {/* Correct Answer (Dropdown from Options) */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Correct Answer
                </label>
                <select
                  {...register("answer")}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select correct answer</option>
                  {options?.map(
                    (opt, i) =>
                      opt.trim() && (
                        <option key={i} value={opt}>
                          {`Option ${i + 1}: ${opt}`}
                        </option>
                      )
                  )}
                </select>
              </div>
            </>
          )}

          {questionType === "short" && (
            <LabeledInput
              label="Answer"
              name="answer"
              type="text"
              placeholder="Enter short answer"
              icon={<HelpCircle />}
              register={register}
              required
            />
          )}

          {questionType === "truefalse" && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Correct Answer
              </label>
              <select
                {...register("answer")}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <PrimaryButton type="submit">Save Question</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestion;
