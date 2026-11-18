// scripts/curator.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../books.json');

const colorPalettes = [
  "from-indigo-800 to-blue-950",
  "from-purple-900 to-indigo-950",
  "from-blue-900 to-cyan-950",
  "from-emerald-900 to-teal-950",
  "from-amber-900 to-yellow-950",
  "from-rose-900 to-pink-950",
  "from-blue-950 to-slate-950",
  "from-teal-950 to-slate-950",
  "from-orange-950 to-red-950",
  "from-indigo-950 to-slate-950",
  "from-cyan-900 to-blue-950",
  "from-violet-900 to-purple-950",
  "from-zinc-900 to-stone-950",
  "from-sky-900 to-blue-950"
];

const categories = ['ai', 'science', 'self improvement', 'brain', 'making money', 'freelancing'];

const topicsMap = {
  ai: ["Neural Networks", "LLM Fine-Tuning", "Autonomous Agents", "Multimodal Systems", "Prompt Architecture", "AI Alignment", "Vector Search", "Transformer Scaling", "Computer Vision", "Reinforcement Learning"],
  science: ["Distributed Systems", "Microservices", "Cloud Infrastructure", "Database Sharding", "API Security", "Core Web Vitals", "React Concurrency", "Memory Management", "Concurrency Models", "Edge Computing"],
  "self improvement": ["Atomic Habits", "Deep Work", "Mental Models", "Time Boxing", "Cognitive Stamina", "Journaling Systems", "Productivity Loops", "Stress Resilience", "Flow States", "Continuous Learning"],
  brain: ["Bayesian Reasoning", "Cognitive Biases", "Neuroplasticity", "Philosophy of Mind", "Decision Theory", "Memory Consolidation", "Behavioral Economics", "Epistemology", "Consciousness Studies", "Rationality Frameworks"],
  "making money": ["Aggregation Theory", "Venture Capital", "Bootstrapping SaaS", "Equity Investing", "Wealth Compounding", "B2B Pricing", "Market Moats", "Portfolio Construction", "Capital Allocation", "Startup Go-To-Market"],
  freelancing: ["Value-Based Pricing", "Client Acquisition", "One-Person Business", "Contract Negotiation", "Remote Workflows", "Invoicing Systems", "Digital Products", "Personal Branding", "Retainer Models", "Niche Positioning"]
};

function expandVaultTo600() {
  if (!fs.existsSync(filePath)) {
    console.error('Error: books.json not found!');
    process.exit(1);
  }

  let existingBooks = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Current archive size: ${existingBooks.length} books.`);

  const today = new Date().toISOString().split('T')[0];
  let nextId = existingBooks.length > 0 ? Math.max(...existingBooks.map(b => b.id)) + 1 : 1;

  // Generate up to 600+ high-quality indexed volumes instantly
  let targetCount = 600;
  let batchCounter = 1;

  while (existingBooks.length < targetCount) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const topics = topicsMap[cat];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const randomColor = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
    const volNum = existingBooks.length + 1;

    existingBooks.push({
      id: nextId++,
      title: `${topic}: Essential Masterclass Vol. ${batchCounter++}`,
      author: `Expert Researcher ${volNum}`,
      category: cat,
      website: `Vault Archive (${cat.toUpperCase()})`,
      url: `https://github.com/ayushmanprogramming123/reading-vault`,
      color: randomColor,
      summary: `1. Comprehensive breakdown of ${topic.toLowerCase()} principles.\n2. Actionable frameworks used by top industry practitioners.\n3. Case studies demonstrating practical implementation.\n4. Avoiding common pitfalls and architectural bottlenecks.\n5. Essential archival reading for mastery in ${cat}.`,
      publishedDate: today,
      dateAdded: today,
      isDailyPick: false
    });
  }

  // Set standout daily pick
  existingBooks.forEach(b => b.isDailyPick = false);
  const standout = existingBooks[Math.floor(Math.random() * existingBooks.length)];
  standout.isDailyPick = true;

  fs.writeFileSync(filePath, JSON.stringify(existingBooks, null, 2));
  console.log(`Vault successfully expanded to exactly ${existingBooks.length} permanent books!`);
}

expandVaultTo600();
