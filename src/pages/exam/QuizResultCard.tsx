import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

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

interface QuizResultListProps {
  questions: IQuestion[];
}

export default function QuizResultList({ questions }: QuizResultListProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | null>>({});
  const [shortInputs, setShortInputs] = useState<Record<number, string>>({});

  const handleSelect = (index: number, option: string) => {
    if (!selectedAnswers[index]) {
      setSelectedAnswers((prev) => ({ ...prev, [index]: option }));
    }
  };

  const handleShortSubmit = (index: number) => {
    if (!selectedAnswers[index] && shortInputs[index]) {
      setSelectedAnswers((prev) => ({ ...prev, [index]: shortInputs[index] }));
    }
  };

  return (
    <div className="grid gap-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((q, idx) => {
          const selected = selectedAnswers[idx] || null;
          const isCorrectShort =
            q.type === "short" &&
            selected?.trim().toLowerCase() === q.answer.trim().toLowerCase();

          return (
            <div key={idx} className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-bold text-gray-800">Question {idx + 1}</h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    q.difficulty === "easy"
                      ? "bg-green-100 text-green-600"
                      : q.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}>
                  {q.difficulty.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-700 text-base font-medium mb-4">{q.question}</p>

              {q.type === "mcq" && q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(idx, opt)}
                  disabled={!!selected}
                  className={`w-full text-left px-4 py-2 mb-2 rounded-lg border transition-colors ${
                    selected
                      ? opt === q.answer
                        ? "border-green-500 bg-green-50 text-green-700 font-semibold"
                        : opt === selected
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-300 bg-gray-50 text-gray-500"
                      : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  {opt}
                </button>
              ))}

              {q.type === "truefalse" &&
                ["true", "false"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(idx, opt)}
                    disabled={!!selected}
                    className={`w-full text-left px-4 py-2 mb-2 rounded-lg border transition-colors ${
                      selected
                        ? opt === q.answer
                          ? "border-green-500 bg-green-50 text-green-700 font-semibold"
                          : opt === selected
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-300 bg-gray-50 text-gray-500"
                        : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}

              {q.type === "short" && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your answer..."
                    value={selected ? selected : shortInputs[idx] || ""}
                    disabled={!!selected}
                    onChange={(e) =>
                      setShortInputs((prev) => ({ ...prev, [idx]: e.target.value }))
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                  {!selected && (
                    <button
                      onClick={() => handleShortSubmit(idx)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Submit
                    </button>
                  )}
                </div>
              )}

              {selected && (
                <div
                  className={`mt-4 flex items-center space-x-2 p-3 rounded-lg border ${
                    q.type === "short"
                      ? isCorrectShort
                        ? "border-green-300 bg-green-50"
                        : "border-red-300 bg-red-50"
                      : selected === q.answer
                      ? "border-green-300 bg-green-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  {q.type === "short" ? (
                    isCorrectShort ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Correct! Answer: <strong>{q.answer}</strong>
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-red-700">
                          Wrong! Correct Answer: <strong>{q.answer}</strong>
                        </span>
                      </>
                    )
                  ) : selected === q.answer ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Correct Answer: <strong>{q.answer}</strong>
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-700">
                        Wrong! Correct Answer: <strong>{q.answer}</strong>
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
