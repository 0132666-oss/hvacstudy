"use client";

import { useState, useCallback } from "react";
import { QuizQuestion, QuizResult, QuizSource, QuizWrongNote } from "@/types/quiz";
import { useQuizAI } from "@/hooks/useQuizAI";

interface Props {
  questions: QuizQuestion[];
  sessionTitle: string;
  source: QuizSource;
  onAddWrongNote: (note: Omit<QuizWrongNote, "id" | "addedAt" | "mastered" | "attemptCount">) => void;
  onFinish: () => void;
  onContinue?: () => void;
}

export default function QuizRunner({ questions, sessionTitle, source, onAddWrongNote, onFinish, onContinue }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shortInput, setShortInput] = useState("");
  const [hintVisible, setHintVisible] = useState(false);
  const [checkingAnswer, setCheckingAnswer] = useState(false);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [showFinish, setShowFinish] = useState(false);

  const { checkShortAnswer } = useQuizAI();
  const current = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  const saveWrong = useCallback(
    (q: QuizQuestion, userAnswer: string, keyWords: string[] = [], missingWords: string[] = []) => {
      onAddWrongNote({
        source,
        sessionTitle,
        question: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        hint: q.hint,
        keyWords,
        missingWords,
      });
    },
    [source, sessionTitle, onAddWrongNote]
  );

  const handleMCQ = useCallback(
    (option: string) => {
      if (currentResult) return;
      setSelectedOption(option);
      const correct = option === current.correctAnswer;
      const result: QuizResult = { questionId: current.id, correct, userAnswer: option };
      setCurrentResult(result);
      setResults((prev) => [...prev, result]);
      if (!correct) saveWrong(current, option);
    },
    [current, currentResult, saveWrong]
  );

  const handleShortSubmit = useCallback(async () => {
    if (!shortInput.trim() || checkingAnswer) return;
    setCheckingAnswer(true);
    const feedback = await checkShortAnswer(current.question, current.correctAnswer, shortInput);
    if (feedback) {
      const result: QuizResult = {
        questionId: current.id,
        correct: feedback.correct,
        userAnswer: shortInput,
        feedback: feedback.feedback,
        keyWords: feedback.keyWords,
        missingWords: feedback.missingWords,
      };
      setCurrentResult(result);
      setResults((prev) => [...prev, result]);
      if (!feedback.correct) saveWrong(current, shortInput, feedback.keyWords, feedback.missingWords);
    }
    setCheckingAnswer(false);
  }, [shortInput, checkingAnswer, current, checkShortAnswer, saveWrong]);

  const handleNext = useCallback(() => {
    if (isLast) {
      setShowFinish(true);
      return;
    }
    setCurrentIdx((prev) => prev + 1);
    setSelectedOption(null);
    setShortInput("");
    setHintVisible(false);
    setCurrentResult(null);
  }, [isLast]);

  // Finish screen
  if (showFinish) {
    const correctCount = results.filter((r) => r.correct).length;
    const pct = Math.round((correctCount / results.length) * 100);
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444"} strokeWidth="3" strokeDasharray={`${pct}, 100`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-800">{pct}%</span>
            </div>
          </div>
          <p className="text-lg font-semibold text-slate-700">{correctCount} / {results.length} correct</p>
          <p className="text-sm text-slate-400 mt-1">{sessionTitle}</p>
        </div>

        <div className="space-y-3">
          {results.map((r, idx) => {
            const q = questions[idx];
            return (
              <div key={r.questionId} className={`p-4 rounded-xl border ${r.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-start gap-2">
                  <span>{r.correct ? "✅" : "❌"}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{q.question}</p>
                    {!r.correct && (
                      <p className="text-xs text-slate-500 mt-1">
                        Your: <span className="text-red-600">{r.userAnswer}</span> | Correct: <span className="text-green-600">{q.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          {onContinue && (
            <button onClick={onContinue} className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600">
              Next 8 Questions
            </button>
          )}
          <button onClick={onFinish} className={`${onContinue ? "flex-1" : "w-full"} py-3 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300`}>
            Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>
        <span className="text-sm text-slate-500 font-medium">{currentIdx + 1}/{questions.length}</span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
          {current.type === "mcq" ? "Multiple Choice" : "Short Answer"}
        </span>
        <p className="text-lg font-medium text-slate-800 mt-3">{current.question}</p>
      </div>

      {/* Hint */}
      <button onClick={() => setHintVisible((v) => !v)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm hover:bg-amber-100">
        💡 Hint
      </button>
      {hintVisible && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-sm text-amber-800">💡 {current.hint}</p>
        </div>
      )}

      {/* Answer */}
      {current.type === "mcq" ? (
        <div className="space-y-2">
          {current.options?.map((option) => {
            let cls = "w-full text-left p-4 rounded-xl border transition-all ";
            if (currentResult) {
              if (option === current.correctAnswer) cls += "bg-green-50 border-green-300 text-green-800";
              else if (option === selectedOption && !currentResult.correct) cls += "bg-red-50 border-red-300 text-red-800";
              else cls += "bg-slate-50 border-slate-100 text-slate-400";
            } else {
              cls += option === selectedOption ? "bg-blue-50 border-blue-300" : "bg-white border-slate-200 hover:border-blue-200 hover:bg-blue-50/30";
            }
            return (
              <button key={option} onClick={() => handleMCQ(option)} className={cls} disabled={!!currentResult}>
                <span className="text-sm font-medium">{option}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <textarea value={shortInput} onChange={(e) => setShortInput(e.target.value)} placeholder="Type your answer..." disabled={!!currentResult} className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-300 resize-none h-28 disabled:bg-slate-50" />
          {!currentResult && (
            <button onClick={handleShortSubmit} disabled={!shortInput.trim() || checkingAnswer} className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400">
              {checkingAnswer ? "Checking..." : "Submit Answer"}
            </button>
          )}
        </div>
      )}

      {/* Result feedback */}
      {currentResult && (
        <div className={`p-5 rounded-2xl border ${currentResult.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{currentResult.correct ? "✅" : "❌"}</span>
            <span className={`font-semibold ${currentResult.correct ? "text-green-700" : "text-red-700"}`}>
              {currentResult.correct ? "Correct!" : "Incorrect"}
            </span>
          </div>
          {currentResult.feedback && <p className="text-sm text-slate-600 mb-3">{currentResult.feedback}</p>}
          {currentResult.keyWords && currentResult.keyWords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {currentResult.keyWords.map((kw) => (
                <span key={kw} className={`text-xs px-2 py-0.5 rounded-full font-medium ${currentResult.missingWords?.includes(kw) ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  🔑 {kw}
                </span>
              ))}
            </div>
          )}
          {!currentResult.correct && (
            <div className="text-sm mb-2">
              <span className="text-slate-500">Correct: </span>
              <span className="text-green-700 font-medium">{current.correctAnswer}</span>
            </div>
          )}
          <p className="text-sm text-slate-600">{current.explanation}</p>
          <button onClick={handleNext} className="mt-4 w-full py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600">
            {isLast ? "See Results" : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  );
}
