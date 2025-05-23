import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getJapaneseChar } from "@/utils/japaneseChars";

const hiraganaData = [
  // Гласные
  { symbol: "あ", romaji: "a" },
  { symbol: "い", romaji: "i" },
  { symbol: "う", romaji: "u" },
  { symbol: "え", romaji: "e" },
  { symbol: "お", romaji: "o" },

  // Строка K
  { symbol: "か", romaji: "ka" },
  { symbol: "き", romaji: "ki" },
  { symbol: "く", romaji: "ku" },
  { symbol: "け", romaji: "ke" },
  { symbol: "こ", romaji: "ko" },

  // Строка S
  { symbol: "さ", romaji: "sa" },
  { symbol: "し", romaji: "shi" },
  { symbol: "す", romaji: "su" },
  { symbol: "せ", romaji: "se" },
  { symbol: "そ", romaji: "so" },

  // Строка T
  { symbol: "た", romaji: "ta" },
  { symbol: "ち", romaji: "chi" },
  { symbol: "つ", romaji: "tsu" },
  { symbol: "て", romaji: "te" },
  { symbol: "と", romaji: "to" },

  // Строка N
  { symbol: "な", romaji: "na" },
  { symbol: "に", romaji: "ni" },
  { symbol: "ぬ", romaji: "nu" },
  { symbol: "ね", romaji: "ne" },
  { symbol: "の", romaji: "no" },

  // Строка H
  { symbol: "は", romaji: "ha" },
  { symbol: "ひ", romaji: "hi" },
  { symbol: "ふ", romaji: "fu" },
  { symbol: "へ", romaji: "he" },
  { symbol: "ほ", romaji: "ho" },

  // Строка M
  { symbol: "ま", romaji: "ma" },
  { symbol: "み", romaji: "mi" },
  { symbol: "む", romaji: "mu" },
  { symbol: "め", romaji: "me" },
  { symbol: "も", romaji: "mo" },

  // Строка Y
  { symbol: "や", romaji: "ya" },
  { symbol: "ゆ", romaji: "yu" },
  { symbol: "よ", romaji: "yo" },

  // Строка R
  { symbol: "ら", romaji: "ra" },
  { symbol: "り", romaji: "ri" },
  { symbol: "る", romaji: "ru" },
  { symbol: "れ", romaji: "re" },
  { symbol: "ろ", romaji: "ro" },

  // Строка W/N
  { symbol: "わ", romaji: "wa" },
  { symbol: "を", romaji: "wo" },
  { symbol: "ん", romaji: "n" },
];

// Замените hiraganaData на katakanaData
const katakanaData = [
  // Гласные
  { symbol: "ア", romaji: "a" },
  { symbol: "イ", romaji: "i" },
  { symbol: "ウ", romaji: "u" },
  { symbol: "エ", romaji: "e" },
  { symbol: "オ", romaji: "o" },

  // K-row
  { symbol: "カ", romaji: "ka" },
  { symbol: "キ", romaji: "ki" },
  { symbol: "ク", romaji: "ku" },
  { symbol: "ケ", romaji: "ke" },
  { symbol: "コ", romaji: "ko" },

  // S-row
  { symbol: "サ", romaji: "sa" },
  { symbol: "シ", romaji: "shi" },
  { symbol: "ス", romaji: "su" },
  { symbol: "セ", romaji: "se" },
  { symbol: "ソ", romaji: "so" },

  // T-row
  { symbol: "タ", romaji: "ta" },
  { symbol: "チ", romaji: "chi" },
  { symbol: "ツ", romaji: "tsu" },
  { symbol: "テ", romaji: "te" },
  { symbol: "ト", romaji: "to" },

  // N-row
  { symbol: "ナ", romaji: "na" },
  { symbol: "ニ", romaji: "ni" },
  { symbol: "ヌ", romaji: "nu" },
  { symbol: "ネ", romaji: "ne" },
  { symbol: "ノ", romaji: "no" },

  // H-row
  { symbol: "ハ", romaji: "ha" },
  { symbol: "ヒ", romaji: "hi" },
  { symbol: "フ", romaji: "fu" },
  { symbol: "ヘ", romaji: "he" },
  { symbol: "ホ", romaji: "ho" },

  // M-row
  { symbol: "マ", romaji: "ma" },
  { symbol: "ミ", romaji: "mi" },
  { symbol: "ム", romaji: "mu" },
  { symbol: "メ", romaji: "me" },
  { symbol: "モ", romaji: "mo" },

  // Y-row
  { symbol: "ヤ", romaji: "ya" },
  { symbol: "ユ", romaji: "yu" },
  { symbol: "ヨ", romaji: "yo" },

  // R-row
  { symbol: "ラ", romaji: "ra" },
  { symbol: "リ", romaji: "ri" },
  { symbol: "ル", romaji: "ru" },
  { symbol: "レ", romaji: "re" },
  { symbol: "ロ", romaji: "ro" },

  // W-row
  { symbol: "ワ", romaji: "wa" },
  { symbol: "ヲ", romaji: "wo" },

  // N
  { symbol: "ン", romaji: "n" },
];

const Quiz = ({ config, onFinish }) => {
  // Выбираем данные по алфавиту
  const currentData =
    config.alphabet === "katakana" ? katakanaData : hiraganaData;
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Генерация вопросов при монтировании
  useEffect(() => {
    setQuestions(generateQuestions(config));
  }, [config]);

  const generateQuestions = (config) => {
    const filteredChars = currentData; // Используем выбранный алфавит

    // Добавляем проверку на наличие символов
    if (!hiraganaData.length) return [];

    // Добавляем проверку на минимальное количество символов
    if (filteredChars.length < 4) {
      console.error("Недостаточно символов для генерации теста");
      return [];
    }

    return Array.from({ length: config.questionCount }, () => {
      const type =
        config.testType === "mixed"
          ? ["symbol-to-romaji", "romaji-to-symbol"][
              Math.floor(Math.random() * 2)
            ]
          : config.testType;

      const correctChar =
        filteredChars[Math.floor(Math.random() * filteredChars.length)];
      const wrongAnswers = filteredChars
        .filter((c) => c.romaji !== correctChar.romaji)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const answers = [correctChar, ...wrongAnswers].sort(
        () => 0.5 - Math.random()
      );

      return {
        type,
        correctAnswer: correctChar.romaji,
        symbol: correctChar.symbol,
        answers: answers.map((c) => c.romaji),
        symbols: answers.map((c) => c.symbol),
      };
    });
  };

  const handleAnswer = (answer) => {
    if (isAnswered) return;

    // Добавляем защиту от отсутствия вопросов
    if (!questions.length || !questions[currentQuestion]) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);
    // TODO: Add sounds
    // AudioManager.play(answer === questions[currentQuestion].correctAnswer ? 'correct' : 'wrong');

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((c) => c + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        updateProgress();
        onFinish();
      }
    }, 1500);
  };

  const updateProgress = () => {
    // Сохраняем прогресс с учетом алфавита
    const storageKey = `${config.alphabet}Progress`;
    const progress = JSON.parse(localStorage.getItem(storageKey) || "{}");

    questions.forEach((q, index) => {
      const symbol =
        q.type === "symbol-to-romaji"
          ? q.symbol
          : hiraganaData.find((c) => c.romaji === q.correctAnswer)?.symbol ||
            "";

      if (!symbol) return;

      if (!progress[symbol]) {
        progress[symbol] = { correct: 0, total: 0 };
      }
      progress[symbol].total += 1;

      if (index === currentQuestion && q.correctAnswer === selectedAnswer) {
        progress[symbol].correct += 1;
      }
    });

    localStorage.setItem(storageKey, JSON.stringify(progress));
  };

  if (!questions.length) return <div>Loading...</div>;

  const currentQ = questions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6 bg-[#8C5D91] rounded-[45px]"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-2xl font-header">
          Вопрос {currentQuestion + 1}/{questions.length}
        </h2>
        <div className="text-xl font-bold">Счёт: {score}</div>
      </motion.div>

      <motion.div className="bg-[#7C5185] rounded-3xl p-8 mb-8">
        {currentQ.type === "symbol-to-romaji" ? (
          <h3 className="text-center text-[120px] font-jp">
            {getJapaneseChar(currentQ.correctAnswer, config.alphabet)}
          </h3>
        ) : (
          <h3 className="text-center text-6xl font-bold">
            {currentQ.correctAnswer}
          </h3>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-2 gap-4"
      >
        {(currentQ.type === "symbol-to-romaji"
          ? currentQ.answers
          : currentQ.symbols
        ).map((answer, idx) => {
          const isCorrect =
            currentQ.type === "symbol-to-romaji"
              ? answer === currentQ.correctAnswer
              : answer ===
                hiraganaData.find((c) => c.romaji === currentQ.correctAnswer)
                  ?.symbol;

          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() =>
                handleAnswer(
                  currentQ.type === "symbol-to-romaji"
                    ? answer
                    : hiraganaData.find((c) => c.symbol === answer)?.romaji
                )
              }
              disabled={isAnswered}
              className={`p-4 rounded-xl text-xl font-bold transition-all ${
                !isAnswered
                  ? "bg-[#5B3569] hover:bg-[#46284F]"
                  : isCorrect
                  ? "bg-green-500"
                  : selectedAnswer === answer
                  ? "bg-red-500"
                  : "bg-[#5B3569]/50"
              }`}
              whileHover={!isAnswered ? { scale: 1.05 } : undefined}
            >
              {currentQ.type === "symbol-to-romaji"
                ? answer
                : getJapaneseChar(
                    hiraganaData.find((c) => c.symbol === answer)?.romaji || ""
                  )}
            </motion.button>
          );
        })}
      </motion.div>

      {isAnswered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center text-xl"
        >
          {selectedAnswer === currentQ.correctAnswer ? (
            <span className="text-green-300">Правильно! 😊</span>
          ) : (
            <span className="text-red-300">
              Неверно. Правильный ответ: {currentQ.correctAnswer}
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Quiz;
