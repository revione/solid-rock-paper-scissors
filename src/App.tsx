import "./index.css";
import { createSignal, onCleanup, batch } from "solid-js";

import { language as esLanguage } from "./languages/es";
import { language as enLanguage } from "./languages/en";
import { language as deLanguage } from "./languages/de";

interface LanguageConfig {
  [key: string]: {
    title: string;
    chooseOption: string;
    scores: string;
    yourScore: string;
    computerScore: string;
  };
}

const languageConfig: LanguageConfig = {
  es: esLanguage,
  en: enLanguage,
  de: deLanguage,
};

const choices = [
  { emoji: "✊", name: "piedra" },
  { emoji: "✋", name: "papel" },
  { emoji: "✌️", name: "tijera" },
];

const choicesLanguages = ["de", "es", "en"];

interface Choice {
  emoji: string;
  name: string;
}

const getRandomChoice = () =>
  choices[Math.floor(Math.random() * choices.length)];

const determineWinner = (playerChoice: Choice, computerChoice: Choice) => {
  if (playerChoice.name === computerChoice.name) return "Empate";
  if (
    (playerChoice.name === "piedra" && computerChoice.name === "tijera") ||
    (playerChoice.name === "papel" && computerChoice.name === "piedra") ||
    (playerChoice.name === "tijera" && computerChoice.name === "papel")
  ) {
    return "¡Ganaste!";
  } else {
    return "¡Perdiste!";
  }
};

const App = () => {
  const [playerChoice, setPlayerChoice] = createSignal<Choice>();
  const [computerChoice, setComputerChoice] = createSignal<Choice>();
  const [disabled, setDisabled] = createSignal(false);
  const [playerScore, setPlayerScore] = createSignal(0);
  const [computerScore, setComputerScore] = createSignal(0);
  const [gameResultClass, setGameResultClass] = createSignal("");
  const [currentLanguage, setCurrentLanguage] = createSignal("de");

  const handlePlayerChoice = (choice: Choice) => {
    if (disabled()) return;

    batch(() => {
      setDisabled(true);
      const computerChoice = getRandomChoice();
      setPlayerChoice(choice);
      setComputerChoice(computerChoice);
      const winner = determineWinner(choice, computerChoice);
      setGameResultClass(
        winner === "¡Ganaste!"
          ? "#07ff27"
          : winner === "¡Perdiste!"
            ? "#f44336"
            : "#07fffc"
      );

      if (winner === "¡Ganaste!") {
        setPlayerScore(playerScore() + 1);
      } else if (winner === "¡Perdiste!") {
        setComputerScore(computerScore() + 1);
      }

      setTimeout(() => {
        setDisabled(false);
      }, 1000);
    });
  };

  onCleanup(() => {
    setPlayerChoice(undefined);
    setComputerChoice(undefined);
    setDisabled(false);
    setPlayerScore(0);
    setComputerScore(0);
  });

  return (
    <div class="w-fit mx-auto text-center my-8">
      <div class="flex gap-4 justify-center mb-4">
        {choicesLanguages.map((choice) => (
          <button
            class="bg-emerald-300 text-black font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={disabled()}
            onClick={() => setCurrentLanguage(choice)}
          >
            {choice}
          </button>
        ))}
      </div>

      <h1 class="text-4xl font-bold mb-4">
        {languageConfig[currentLanguage()].title}
      </h1>
      <p class="text-lg mb-2">
        {languageConfig[currentLanguage()].chooseOption}
      </p>
      <div class="flex justify-center space-x-4">
        {choices.map((choice) => (
          <button
            class="bg-blue-400 text-white font-bold px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={disabled()}
            onClick={() => handlePlayerChoice(choice)}
          >
            {choice.emoji}
          </button>
        ))}
      </div>
      <div class="flex justify-center items-center mt-4">
        {playerChoice() && <div class="text-4xl">{playerChoice()?.emoji}</div>}
        <div
          class="mx-8 text-3xl rounded-full w-10 h-10"
          style={{ background: gameResultClass() }}
        >
          vs
        </div>
        {computerChoice() && (
          <div class="text-4xl">{computerChoice()?.emoji}</div>
        )}
      </div>
      <div class="mt-4">
        <p class="text-lg font-semibold">
          {languageConfig[currentLanguage()].scores}
        </p>
        <div class="flex gap-4 justify-center">
          <p>
            {languageConfig[currentLanguage()].yourScore}: {playerScore()}
          </p>
          <p>
            {languageConfig[currentLanguage()].computerScore}: {computerScore()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
