"use client"
import React, { useState } from 'react';

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  quizId: string;
  text: string;
  questionType: string;
  difficulty: string;
  options: Option[];
  correctAnswers: string[];
}

const defaultOption: Option = { text: '', isCorrect: false };

const createNewQuestion = (): Question => ({
  quizId: "67e6ab0afb0e8852a2c0d4f2",
  text: '',
  questionType: 'MCQ',
  difficulty: 'EASY',
  options: [ { ...defaultOption }, { ...defaultOption }, { ...defaultOption }, { ...defaultOption } ],
  correctAnswers: []
});

const QuizForm: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([createNewQuestion()]);
  const [quizId,setquizId]=useState<string>('67e6ab0afb0e8852a2c0d4f2')

  // Update the question-level fields
  const handleQuestionChange = (qIndex: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[qIndex] = { ...updated[qIndex], [field]: value };
    setQuestions(updated);
  };

  // Update a specific option text for a question
  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = value;
    setQuestions(updated);
  };

  // When selecting the correct answer, update both the correctAnswers array and the isCorrect flag in options
  const handleCorrectAnswerChange = (qIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].correctAnswers = [value];
    updated[qIndex].options = updated[qIndex].options.map(option => ({
      ...option,
      isCorrect: option.text === value
    })); 
    setQuestions(updated);
    
  };

  // Add a new blank question form
  const addQuestion = () => {
    setQuestions([...questions, createNewQuestion()]);
  };

  // Final submit: output the questions JSON format to console (or send to backend)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(questions);
    // You can now send "questions" to your backend as needed.
  };

  const handleSubmits = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      questionstosend: questions, 
    };
     console.log("Here is the Payload:",questions)
    try {
      const response = await fetch(`http://localhost:3001/question/questions/bulk/${quizId}`,  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Accept: "application/json",
        },
        body: JSON.stringify(questions ),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit quiz: ${response.statusText} - ${errorText}`);
      }
  
      const result = await response.json();
      console.log("Quiz submitted successfully:", result);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <form onSubmit={handleSubmits} className="space-y-8 p-4">
      {questions.map((question, qIndex) => (
        <div key={question.quizId} className="border p-4 rounded shadow-md">
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Question Text</label>
            <input
              type="text"
              value={question.text}
              onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your question here"
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block mb-2 font-semibold">Difficulty</label>
              <select
                value={question.difficulty}
                onChange={(e) => handleQuestionChange(qIndex, 'difficulty', e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="EASY">EASY</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCE">ADVANCE</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Question Type</label>
              <select
                value={question.questionType}
                onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="MCQ">MCQ</option>
                <option value="TRUE OR FALSE">TRUE OR FALSE</option>
                <option value="SHORT_ANSWER">SHORT_ANSWER</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Options</label>
            <div className="space-y-2">
              {question.options.map((option, optIndex) => (
                <input
                  key={optIndex}
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder={`Option ${optIndex + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Select Correct Answer</label>
            <select
              value={question.correctAnswers[0] || ''}
              onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>
                Select the correct answer
              </option>
              {question.options.map((option, optIndex) => (
                <option key={optIndex} value={option.text}>
                  {option.text || `Option ${optIndex + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={addQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          +
        </button>
      </div>

      <div className="flex justify-center">
        <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          Submit Quiz
        </button>
      </div>
    </form>
  );
};

export default QuizForm;
