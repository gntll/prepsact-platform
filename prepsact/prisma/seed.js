require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Configure the pg pool with SSL settings to bypass self-signed certificate errors locally
const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database questions...");

  // Clear existing data safely
  await prisma.choice.deleteMany();
  await prisma.question.deleteMany();

  // Question 1: Linear Algebra
  await prisma.question.create({
    data: {
      section: "MATH",
      domain: "Algebra",
      difficulty: "EASY",
      prompt: "If 3x - 5 = 16, what is the value of x?",
      explanation: "Add 5 to both sides: 3x = 21. Divide by 3: x = 7.",
      choices: {
        create: [
          { label: "A", text: "5", isCorrect: false },
          { label: "B", text: "7", isCorrect: true },
          { label: "C", text: "9", isCorrect: false },
          { label: "D", text: "11", isCorrect: false },
        ],
      },
    },
  });

  // Question 2: Quadratic Equation
  await prisma.question.create({
    data: {
      section: "MATH",
      domain: "Advanced Math",
      difficulty: "MEDIUM",
      prompt: "For what positive value of x is (x - 4)(x + 2) = 0?",
      explanation: "Setting each factor to zero yields x = 4 or x = -2. The positive value is 4.",
      choices: {
        create: [
          { label: "A", text: "2", isCorrect: false },
          { label: "B", text: "4", isCorrect: true },
          { label: "C", text: "6", isCorrect: false },
          { label: "D", text: "8", isCorrect: false },
        ],
      },
    },
  });

  // Question 3: Reading & Writing
  await prisma.question.create({
    data: {
      section: "READING_WRITING",
      domain: "Craft and Structure",
      difficulty: "MEDIUM",
      passage: "The researcher found that the organism exhibited a remarkable degree of resilience, thriving even in environments previously thought to be completely uninhabitable.",
      prompt: "As used in the text, what does the word 'resilience' most nearly mean?",
      explanation: "'Resilience' refers to the ability to withstand or recover quickly from difficult conditions.",
      choices: {
        create: [
          { label: "A", text: "Fragility", isCorrect: false },
          { label: "B", text: "Endurance", isCorrect: true },
          { label: "C", text: "Hesitation", isCorrect: false },
          { label: "D", text: "Aggression", isCorrect: false },
        ],
      },
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
