import { QuestionsModel } from "@/models/product-model";
import { MessageCircleMore, MessageCircleQuestion } from "lucide-react";
import React from "react";

interface Props {
  questions: QuestionsModel[];
}

const ProdcutQuestions: React.FC<Props> = ({ questions }) => {
  return (
    <div className="pt-6">
      {/* Title */}
      <div className="h-12">
        <h2 className="text-black text-2xl font-bold">
          Questions & Answers ({questions.length})
        </h2>
      </div>
      {/* List */}
      <div className="mt-4">
        <ul>
          {questions.map((question, i) => (
            <li key={i} className="relative mb-1 my-4">
              <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                  <MessageCircleQuestion className="w-4" />
                  <p className="text-sm font-bold leading-5">
                    {question.question}
                  </p>
                </div>
                <div className="flex items-center gap-x-2">
                  <MessageCircleMore className="w-4" />
                  <p className="text-sm  leading-5">{question.answer}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProdcutQuestions;
