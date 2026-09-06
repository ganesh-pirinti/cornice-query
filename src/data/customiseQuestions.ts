export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestionData {
  id: number;
  question: string;
  options: QuizOption[];
  correctAnswer: string; // Option ID that is correct
  explanation?: string;
}

export const CUSTOMISE_QUESTIONS: QuizQuestionData[] = [
  {
    id: 1,
    question: "What are you looking to build?",
    options: [
      { id: "A", text: "A custom website, interface, landing page, or dashboard" },
      { id: "B", text: "I don't know / just exploring" },
      { id: "C", text: "A random software download" },
      { id: "D", text: "Something completely unrelated to web development" },
    ],
    correctAnswer: "A",
    explanation: "Cornice & Query specializes in custom websites, interactive UIs, and web applications.",
  },
  {
    id: 2,
    question: "What information is most useful before starting a custom website build?",
    options: [
      { id: "A", text: "Only the website background color" },
      { id: "B", text: "Clear requirements and expected site functionality" },
      { id: "C", text: "Random unrelated screenshots" },
      { id: "D", text: "Nothing at all" },
    ],
    correctAnswer: "B",
    explanation: "Defined requirements and desired features help streamline project scope and delivery.",
  },
  {
    id: 3,
    question: "If you already have a reference design or visual idea, what can you provide to CQ?",
    options: [
      { id: "A", text: "Reference images, links, or wireframe sketches" },
      { id: "B", text: "Nothing" },
      { id: "C", text: "Only a social media handle" },
      { id: "D", text: "An unrelated video file" },
    ],
    correctAnswer: "A",
    explanation: "Reference links and visual samples help our team match your visual expectations.",
  },
  {
    id: 4,
    question: "What usually affects the development scope and timeline of a custom website?",
    options: [
      { id: "A", text: "The complexity of features, animations, and custom functionality" },
      { id: "B", text: "Your desktop wallpaper image" },
      { id: "C", text: "Social media follower counts" },
      { id: "D", text: "Keyboard hardware brand" },
    ],
    correctAnswer: "A",
    explanation: "Feature depth, interactive animations, and backend scope directly determine build effort.",
  },
  {
    id: 5,
    question: "Before starting a custom project, what should normally be aligned upon?",
    options: [
      { id: "A", text: "Project requirements, design direction, functionality, and scope" },
      { id: "B", text: "Nothing at all" },
      { id: "C", text: "Only the logo image" },
      { id: "D", text: "Browser window dimensions only" },
    ],
    correctAnswer: "A",
    explanation: "Aligning on goals, scope, and technical details ensures a successful custom build.",
  },
];
