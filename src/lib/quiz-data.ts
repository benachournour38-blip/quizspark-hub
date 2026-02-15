export interface Player {
  nickname: string;
  avatar: string;
  pin: string;
  joinTime: number;
  isAdmin: boolean;
  score?: number;
}

export interface QuizQuestion {
  question: string;
  answers: string[];
  correctIndex: number;
  timeLimit: number;
  image?: string;
}

export const AVATARS = [
  '😎', '🤓', '😃', '🥳', '🤠', '🥸', '😺', '🐶',
  '🦁', '🐼', '🦊', '🐯', '🦄', '🐸', '🐙', '🦖',
  '👽', '🤖', '👻', '🎃', '🌟', '⚡', '🔥', '💎',
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "What does 'Skibidi' originally come from?",
    answers: ["A TikTok dance", "A YouTube series", "A Roblox game", "A meme song"],
    correctIndex: 1,
    timeLimit: 15,
  },
  {
    question: "What is 'Rizz'?",
    answers: ["A type of food", "Charisma/charm", "A dance move", "A video game"],
    correctIndex: 1,
    timeLimit: 15,
  },
  {
    question: "What does 'Sigma' mean in internet slang?",
    answers: ["A math symbol", "A lone wolf personality", "A Greek letter only", "A type of music"],
    correctIndex: 1,
    timeLimit: 15,
  },
  {
    question: "What is 'GYATT' used to express?",
    answers: ["Anger", "Surprise/admiration", "Sadness", "Confusion"],
    correctIndex: 1,
    timeLimit: 15,
  },
  {
    question: "Who is the 'Ohio' meme about?",
    answers: ["People from Ohio", "Weird/strange events", "A famous person", "A TV show"],
    correctIndex: 1,
    timeLimit: 15,
  },
  {
    question: "What does 'No cap' mean?",
    answers: ["No hat", "No lying/for real", "No money", "No friends"],
    correctIndex: 1,
    timeLimit: 15,
  },
  {
    question: "What is 'Fanum Tax'?",
    answers: ["A real tax", "Taking someone's food", "A game mechanic", "A crypto term"],
    correctIndex: 1,
    timeLimit: 15,
  },
  {
    question: "What does 'Bussin' mean?",
    answers: ["Riding a bus", "Really good/delicious", "Being busy", "Running fast"],
    correctIndex: 1,
    timeLimit: 15,
  },
  {
    question: "What is a 'NPC' in slang?",
    answers: ["Non-Player Character only", "Someone acting robotic/scripted", "A new phone case", "A type of dance"],
    correctIndex: 1,
    timeLimit: 15,
  },
  {
    question: "What does 'Slay' mean in Gen Z slang?",
    answers: ["To kill", "To do something amazingly", "To sleep", "To eat"],
    correctIndex: 1,
    timeLimit: 15,
  },
  {
    question: "What is 'Mewing'?",
    answers: ["Cat sounds", "A jawline exercise/tongue posture", "A swimming technique", "A cooking method"],
    correctIndex: 1,
    timeLimit: 15,
  },
];

export function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function formatPin(pin: string): string {
  return pin.replace(/(\d{3})(\d{3})/, '$1 $2');
}
