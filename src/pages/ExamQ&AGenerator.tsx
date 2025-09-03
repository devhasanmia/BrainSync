import { useState, type ChangeEvent } from "react";
import { HelpCircle, Plus } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import PageHeader from "@/components/ui/PageHeader";
import QuizResultCard from "./exam/QuizResultCard";

type Difficulty = "easy" | "medium" | "hard";
type QuestionType = "mcq" | "short" | "truefalse" | "mixed";

interface QuizSettings {
  difficulty: Difficulty;
  questionType: QuestionType;
  numberOfQuestions: number;
}

export default function QuizSettingsForm() {
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    difficulty: "medium",
    questionType: "mixed",
    numberOfQuestions: 5,
  });

  const [result, setResult] = useState<string | null>(null);

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuizSettings({
      ...quizSettings,
      numberOfQuestions: parseInt(e.target.value) || 1,
    });
  };

  const handleGenerateQuiz = () => {
    console.log("Quiz Settings:", quizSettings);
    setResult(JSON.stringify(quizSettings, null, 2)); // showing JSON for now
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

        {/* Left Column - Generator (1/3 on desktop) */}
        <div className="md:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Quiz Settings</h2>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={quizSettings.difficulty}
              onChange={(e) =>
                setQuizSettings({
                  ...quizSettings,
                  difficulty: e.target.value as Difficulty,
                })
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
                setQuizSettings({
                  ...quizSettings,
                  questionType: e.target.value as QuestionType,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="mixed">Mixed</option>
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
              max={20}
              value={quizSettings.numberOfQuestions}
              onChange={handleNumberChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
        <div className="md:col-span-2 bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Result</h2>
          <QuizResultCard />
        </div>
      </div>
    </div>
  );
}
