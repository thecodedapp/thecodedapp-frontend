import { ImageSourcePropType } from "react-native";

export type ContentStep = {
  type: "content";
  title: string;
  body: string;
  callout?: string;
  bullets?: string[];
};

export type QuizStep = {
  type: "quiz";
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  successText: string;
  retryText: string;
};

export type CardsStep = {
  type: "cards";
  title: string;
  body: string;
  cards: { emoji: string; label: string }[];
  footer: string;
};

export type CompleteStep = {
  type: "complete";
  title: string;
  body: string;
};

export type LessonStep = ContentStep | QuizStep | CardsStep | CompleteStep;

export type LessonDefinition = {
  number: number;
  id: string;
  title: string;
  steps: LessonStep[];
  macoByStep: ImageSourcePropType[];
};

const LESSONS: LessonDefinition[] = [
  {
    number: 1,
    id: "what-is-code",
    title: "What is Code?",
    steps: [
      {
        type: "content",
        title: "Code is everywhere.",
        body:
          "Apps. Websites. Games. Cars. ATMs. They all work because someone wrote instructions telling a computer what to do.",
        callout: "Code is how we give computers instructions.",
      },
      {
        type: "content",
        title: "So... what is code?",
        body:
          "Code is a set of instructions written for a computer. Think of it like a recipe: a recipe tells you what to do step by step, and code does the same thing for a computer.",
        bullets: [
          "Get bread → Get user input",
          "Add cheese → Check the input",
          "Toast it → Show a result",
        ],
      },
      {
        type: "content",
        title: "Computers are VERY literal.",
        body:
          "Computers do not guess what you meant. They follow the instructions you give them, in the order you give them.",
        callout: "If the instructions are out of order, the result can be wrong too.",
      },
      {
        type: "quiz",
        title: "Tiny challenge",
        question: "You want Maco to turn on a lamp. Which order makes the most sense?",
        options: [
          "1. Find the lamp\n2. Press the power button\n3. The lamp turns on",
          "1. The lamp turns on\n2. Find the lamp\n3. Press the power button",
        ],
        correctIndex: 0,
        successText: "Exactly! The order of instructions matters.",
        retryText: "Almost! A computer needs the steps in a logical order.",
      },
      {
        type: "cards",
        title: "What can you make with code?",
        body: "A lot more than just websites.",
        cards: [
          { emoji: "📱", label: "Mobile apps" },
          { emoji: "🌐", label: "Websites" },
          { emoji: "🎮", label: "Games" },
          { emoji: "🤖", label: "AI tools" },
          { emoji: "⚙️", label: "Automations" },
          { emoji: "💻", label: "Software" },
        ],
        footer:
          "Different programming languages are good at different kinds of jobs. You'll learn about those soon.",
      },
      {
        type: "complete",
        title: "You just learned your first programming concept. 🌱",
        body:
          "Code is simply a way of giving computers instructions. And you're officially learning how to write them.",
      },
    ],
    macoByStep: [
      require("../assets/images/maco-thinking.png"),
      require("../assets/images/maco-smiling-looking-up-to-the-side.png"),
      require("../assets/images/maco-thinking.png"),
      require("../assets/images/maco-gleeful.png"),
      require("../assets/images/maco-happy-with-heart-halo.png"),
      require("../assets/images/maco-jump.png"),
    ],
  },
  {
    number: 2,
    id: "how-computers-think",
    title: "How Computers Think",
    steps: [
      {
        type: "content",
        title: "Computers follow logic.",
        body:
          "A computer does not think the way a person does. It checks information, follows rules, and performs instructions exactly as written.",
        callout: "Programming is turning a goal into clear, logical steps.",
      },
      {
        type: "content",
        title: "Inputs become outputs.",
        body:
          "Programs often start with an input, do something with it, and produce an output.",
        bullets: [
          "Input → You tap a button",
          "Process → The app checks what that button should do",
          "Output → A new screen appears",
        ],
      },
      {
        type: "content",
        title: "Decisions use conditions.",
        body:
          "Code can make decisions by checking whether something is true or false. Programmers often describe this as: if something is true, do one thing; otherwise, do something else.",
        callout: "Conditions let programs react to different situations.",
      },
      {
        type: "quiz",
        title: "Tiny challenge",
        question: "A user enters the correct password. Which rule makes the most sense?",
        options: [
          "If the password is correct → let the user in",
          "If the password is correct → always show an error",
        ],
        correctIndex: 0,
        successText: "Exactly! The program checks a condition and chooses what happens next.",
        retryText: "Not quite. The action should match the result of the condition.",
      },
      {
        type: "cards",
        title: "Logic is everywhere in apps.",
        body: "Once you notice it, you start seeing programming logic all over the place.",
        cards: [
          { emoji: "🔐", label: "Login checks" },
          { emoji: "🛒", label: "Cart totals" },
          { emoji: "🔔", label: "Notifications" },
          { emoji: "🎵", label: "Play controls" },
        ],
        footer:
          "Inputs, conditions, and outputs are building blocks you'll use constantly as you learn to code.",
      },
      {
        type: "complete",
        title: "You can already think more like a programmer. 🧠",
        body:
          "You learned that computers follow exact instructions, process inputs, and use conditions to decide what happens next.",
      },
    ],
    macoByStep: [
      require("../assets/images/maco-thinking.png"),
      require("../assets/images/maco-smiling-looking-up-to-the-side.png"),
      require("../assets/images/maco-thinking.png"),
      require("../assets/images/maco-gleeful.png"),
      require("../assets/images/maco-happy-with-sparkles.png"),
      require("../assets/images/maco-jump.png"),
    ],
  },
  {
    number: 3,
    id: "what-can-you-build",
    title: "What Can You Build?",
    steps: [
      {
        type: "content",
        title: "Code turns ideas into tools.",
        body:
          "Programming is not just about typing syntax. It is how people turn ideas into apps, websites, games, automations, and other useful software.",
        callout: "The same core programming ideas can power very different products.",
      },
      {
        type: "cards",
        title: "Different goals, different builds.",
        body: "Here are a few directions coding can take you.",
        cards: [
          { emoji: "📱", label: "Phone apps" },
          { emoji: "🌍", label: "Web apps" },
          { emoji: "🎮", label: "Games" },
          { emoji: "🤖", label: "AI tools" },
          { emoji: "🧰", label: "Developer tools" },
          { emoji: "⚡", label: "Automations" },
        ],
        footer:
          "You do not need to choose one path forever. Developers often use multiple technologies across different projects.",
      },
      {
        type: "content",
        title: "Every project starts smaller than you think.",
        body:
          "Big products are made from smaller pieces: screens, buttons, data, rules, and actions. Learning to build those pieces one at a time is how larger projects become possible.",
        bullets: [
          "A login screen",
          "A button that changes something",
          "A list of saved items",
          "A form that sends data",
        ],
      },
      {
        type: "quiz",
        title: "Tiny challenge",
        question: "You want to build a habit tracker. What is the best first step?",
        options: [
          "Break the app into smaller features like adding a habit and marking it complete",
          "Try to build every feature at once before testing anything",
        ],
        correctIndex: 0,
        successText: "Yes! Breaking a project into smaller pieces makes it much easier to build.",
        retryText: "That usually makes projects harder. Start with one small feature at a time.",
      },
      {
        type: "content",
        title: "Soon, you'll build one too.",
        body:
          "As you learn variables, conditions, loops, functions, and other fundamentals, you'll start combining them into real projects of your own.",
        callout: "Small lessons now → real projects later.",
      },
      {
        type: "complete",
        title: "Your ideas can become software. ✨",
        body:
          "You now know that programming is a toolkit for building things—and that big projects are really collections of smaller pieces.",
      },
    ],
    macoByStep: [
      require("../assets/images/maco-thinking.png"),
      require("../assets/images/maco-happy-with-sparkles.png"),
      require("../assets/images/maco-smiling-looking-up-to-the-side.png"),
      require("../assets/images/maco-gleeful.png"),
      require("../assets/images/maco-happy-with-heart-halo.png"),
      require("../assets/images/maco-jump.png"),
    ],
  },
];

export const getLessonById = (id?: string) =>
  LESSONS.find((lesson) => lesson.id === id);

export const getLessonByNumber = (number: number) =>
  LESSONS.find((lesson) => lesson.number === number);

export const BUILT_LESSON_NUMBERS = LESSONS.map((lesson) => lesson.number);
