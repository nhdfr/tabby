// TypeScript port of the Go template generator
// Matches the functionality of internal/generator/generator.go

const firstNames = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
  "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
  "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
  "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
  "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
];

const domains = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "example.com",
  "test.com", "demo.com", "mail.com", "email.com", "inbox.com",
];

const words = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
];

const sentences = [
  "This is a test message.",
  "Thank you for your assistance.",
  "Please review the attached document.",
  "Looking forward to your response.",
  "I hope this message finds you well.",
  "Could you please provide more information?",
  "I appreciate your help with this matter.",
  "Let me know if you need anything else.",
];

// Use crypto.getRandomValues for secure random numbers
function secureRandomInt(max: number): number {
  if (max <= 0) return 0;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] as number) % max;
}

function randomFirstName(): string {
  return firstNames[secureRandomInt(firstNames.length)] as string;
}

function randomLastName(): string {
  return lastNames[secureRandomInt(lastNames.length)] as string;
}

function randomName(): string {
  return `${randomFirstName()} ${randomLastName()}`;
}

function randomEmail(): string {
  const username = (randomFirstName() + randomLastName()).toLowerCase();
  const domain = domains[secureRandomInt(domains.length)] as string;
  return `${username}@${domain}`;
}

function randomPhone(): string {
  const area = secureRandomInt(900) + 100;
  const exchange = secureRandomInt(900) + 100;
  const subscriber = secureRandomInt(9000) + 1000;
  return `+1-${area.toString().padStart(3, '0')}-${exchange.toString().padStart(3, '0')}-${subscriber.toString().padStart(4, '0')}`;
}

function randomNumber(params: string[]): string {
  let min = 1;
  let max = 100;

  if (params.length >= 1 && params[0]) {
    const val = parseInt(params[0], 10);
    if (!isNaN(val)) min = val;
  }
  if (params.length >= 2 && params[1]) {
    const val = parseInt(params[1], 10);
    if (!isNaN(val)) max = val;
  }

  if (max <= min) {
    max = min + 1;
  }

  return String(secureRandomInt(max - min) + min);
}

function randomFloat(params: string[]): string {
  let min = 0;
  let max = 100;
  let decimals = 2;

  if (params.length >= 1 && params[0]) {
    const val = parseFloat(params[0]);
    if (!isNaN(val)) min = val;
  }
  if (params.length >= 2 && params[1]) {
    const val = parseFloat(params[1]);
    if (!isNaN(val)) max = val;
  }
  if (params.length >= 3 && params[2]) {
    const val = parseInt(params[2], 10);
    if (!isNaN(val)) decimals = val;
  }

  if (max <= min) {
    max = min + 1;
  }

  const randFraction = secureRandomInt(10000) / 10000;
  const value = min + randFraction * (max - min);
  return value.toFixed(decimals);
}

function randomPrice(params: string[]): string {
  let min = 1;
  let max = 100;

  if (params.length >= 1 && params[0]) {
    const val = parseFloat(params[0]);
    if (!isNaN(val)) min = val;
  }
  if (params.length >= 2 && params[1]) {
    const val = parseFloat(params[1]);
    if (!isNaN(val)) max = val;
  }

  if (max <= min) {
    max = min + 1;
  }

  const wholeNumber = secureRandomInt(Math.floor(max - min)) + Math.floor(min);
  return `${wholeNumber}.99`;
}

function randomParagraph(): string {
  const wordCount = secureRandomInt(20) + 30;
  const result: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    result.push(words[secureRandomInt(words.length)] as string);
  }
  const text = result.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

function randomSentence(): string {
  return sentences[secureRandomInt(sentences.length)] as string;
}

function randomBool(): string {
  return secureRandomInt(2) === 0 ? "false" : "true";
}

function randomDate(): string {
  const days = secureRandomInt(365);
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0] as string;
}

function randomWord(): string {
  return words[secureRandomInt(words.length)] as string;
}

function randomUUID(): string {
  return crypto.randomUUID();
}

function generateValue(placeholderType: string, params: string[]): string {
  switch (placeholderType) {
    case "name":
    case "fullname":
      return randomName();
    case "firstname":
      return randomFirstName();
    case "lastname":
      return randomLastName();
    case "email":
      return randomEmail();
    case "phone":
    case "mobile":
      return randomPhone();
    case "number":
    case "int":
      return randomNumber(params);
    case "float":
    case "decimal":
      return randomFloat(params);
    case "price":
      return randomPrice(params);
    case "text":
    case "paragraph":
      return randomParagraph();
    case "sentence":
      return randomSentence();
    case "uuid":
      return randomUUID();
    case "bool":
    case "boolean":
      return randomBool();
    case "date":
      return randomDate();
    case "word":
      return randomWord();
    default:
      return `{{${placeholderType}}}`;
  }
}

const placeholderRegex = /\{\{([^}]+)\}\}/g;

export function generate(template: string): string {
  return template.replace(placeholderRegex, (match, placeholder) => {
    const trimmed = placeholder.trim();
    const parts = trimmed.split(":");
    const placeholderType = parts[0];
    const params = parts.slice(1);
    return generateValue(placeholderType, params);
  });
}

export const PLACEHOLDERS = [
  { name: "{{name}}", description: "Random full name (e.g., John Smith)" },
  { name: "{{firstname}}", description: "Random first name (e.g., John)" },
  { name: "{{lastname}}", description: "Random last name (e.g., Smith)" },
  { name: "{{email}}", description: "Random email address" },
  { name: "{{phone}}", description: "Random phone number" },
  { name: "{{number}}", description: "Random number (1-100)" },
  { name: "{{number:1:50}}", description: "Random number with custom range" },
  { name: "{{float}}", description: "Random float (0-100, 2 decimals)" },
  { name: "{{float:1:50:3}}", description: "Random float with range and decimals" },
  { name: "{{price}}", description: "Random price ending in .99 (1-100)" },
  { name: "{{price:5:50}}", description: "Random price with custom range" },
  { name: "{{text}}", description: "Random paragraph" },
  { name: "{{sentence}}", description: "Random sentence" },
  { name: "{{uuid}}", description: "Random UUID" },
  { name: "{{bool}}", description: "Random boolean (true/false)" },
  { name: "{{date}}", description: "Random date (YYYY-MM-DD)" },
  { name: "{{word}}", description: "Random lorem word" },
];
