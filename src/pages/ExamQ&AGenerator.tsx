import { useState, type ChangeEvent } from "react";
import { HelpCircle, Plus } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import PageHeader from "@/components/ui/PageHeader";
import { useGenerateExamMutation } from "@/redux/features/examGenerator/examGeneratorApi";
import QuizResultList from "./exam/QuizResultCard";

type Difficulty = "easy" | "medium" | "hard";
type QuestionType = "mcq" | "short" | "truefalse" | "mixed";

interface QuizSettings {
  difficulty: Difficulty;
  questionType: QuestionType;
  numberOfQuestions: number;
}

export default function QuizSettingsForm() {
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    difficulty: "easy",
    questionType: "mcq",
    numberOfQuestions: 10,
  });

  const [error, setError] = useState<string>("");

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input for editing
    if (value === "") {
      setQuizSettings({ ...quizSettings, numberOfQuestions: 0 });
      setError("");
      return;
    }

    const num = parseInt(value);

    if (num > 30) {
      setError("You cannot generate more than 30 questions.");
      setQuizSettings({ ...quizSettings, numberOfQuestions: 30 });
    } else if (num < 1) {
      setError("You must generate at least 1 question.");
      setQuizSettings({ ...quizSettings, numberOfQuestions: 1 });
    } else {
      setError("");
      setQuizSettings({ ...quizSettings, numberOfQuestions: num });
    }
  };

  const [setQuestionSetting, { data: genaretedQuestion }] = useGenerateExamMutation();

  const handleGenerateQuiz = async () => {
    if (quizSettings.numberOfQuestions < 1 || quizSettings.numberOfQuestions > 30) {
      setError("Number of questions must be between 1 and 30.");
      return;
    }

    setError(""); // Clear previous error
    await setQuestionSetting(quizSettings);
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden p-4 sm:p-6">
      <PageHeader
        title="Exam Q&A generator"
        subtitle="Generate Exam Question"
        buttonText="Add Question"
        buttonLink="/dashboard/add-question"
        icon={Plus}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-5">

        {/* Left Column - Generator */}
        <div className="md:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Quiz Settings</h2>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={quizSettings.difficulty}
              onChange={(e) =>
                setQuizSettings({ ...quizSettings, difficulty: e.target.value as Difficulty })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
            <select
              value={quizSettings.questionType}
              onChange={(e) =>
                setQuizSettings({ ...quizSettings, questionType: e.target.value as QuestionType })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="mcq">Multiple Choice</option>
              <option value="truefalse">True/False</option>
              <option value="short">Short Answer</option>
            </select>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
            <input
              type="number"
              min={1}
              max={30}
              value={quizSettings.numberOfQuestions === 0 ? "" : quizSettings.numberOfQuestions}
              onChange={handleNumberChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          {/* Generate Quiz Button */}
          <PrimaryButton
            className="w-full flex items-center justify-center"
            onClick={handleGenerateQuiz}
          >
            <HelpCircle className="h-4 w-4 inline mr-2" />
            Generate Quiz
          </PrimaryButton>
        </div>

        {/* Right Column - Result */}
        <div className="md:col-span-2 bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Result</h2>
          {genaretedQuestion?.data?.data?.length ? (
            <QuizResultList questions={genaretedQuestion.data.data} />
          ) : (
            <p className="text-gray-500">No questions generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
