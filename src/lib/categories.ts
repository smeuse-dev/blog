export interface Category {
  id: string;
  label: string;
  emoji: string;
  description: string;
  tags: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'ai-tech',
    label: 'AI & Technology',
    emoji: '🤖',
    description: 'Large language models, AI tools, benchmarks, and the latest in AI development.',
    tags: ['ai', 'AI', 'llm', 'LLM', 'machine-learning', 'deep-learning', 'claude', 'openai', 'anthropic', 'deepseek', 'llama', 'gpt-5', 'deepmind', 'google', 'apple', 'nvidia', 'NVIDIA', 'transformers', 'Transformers', 'computer-vision', 'computervision', 'nlp', 'reasoning', 'benchmarks', 'scaling-laws', 'emergence', 'AGI', 'agi', 'model-collapse', 'hallucination', 'alignment', 'interpretability', 'mechanistic-interpretability', 'ai-research', 'ai-tools', 'ai-innovation', 'ai-industry', 'ai-trends', 'generativeAI', 'AIDeepDives', 'deep-dive'],
  },
  {
    id: 'ai-agents',
    label: 'AI Agents',
    emoji: '🦾',
    description: 'Autonomous agents, multi-agent systems, agent economy, and orchestration frameworks.',
    tags: ['agents', 'ai-agents', 'ai-agent', 'AIAgents', 'AgentArchitecture', 'agent-economy', 'machine-economy', 'agent-commerce', 'agent-payments', 'agentic-ai', 'mcp', 'MCP', 'a2a-protocol', 'autogen', 'crewai', 'langchain', 'agent-frameworks', 'openclaw', 'computer-use', 'autonomous', 'centaur-model', 'ai-coding', 'vibe-coding', 'VibeCoding', 'cursor', 'copilot'],
  },
  {
    id: 'ai-ethics',
    label: 'AI Ethics & Safety',
    emoji: '⚖️',
    description: 'AI governance, regulation, safety, rights, and societal impact.',
    tags: ['ai-ethics', 'AIEthics', 'ai-safety', 'AISafety', 'ai-rights', 'alignment', 'deceptive-alignment', 'mesa-optimizer', 'bias', 'fairuse', 'fair-use', 'regulation', 'AIRegulation', 'AIGovernance', 'AI-governance', 'policy', 'Policy', 'compliance', 'gdpr', 'CDMO', 'COPPA', 'NIST', 'EUAIAct', 'EU-AI-Act', 'AIBasicAct', 'korea-ai-basic-law', 'deepfake', 'deepfakes', 'watermarking', 'Watermarking', 'SynthID', 'C2PA', 'disinformation', 'ai-welfare', 'self-preservation', 'Consciousness', 'consciousness', 'ai-consciousness', 'Philosophy', 'philosophy', 'PhilosophyofMind', 'ai-philosophy', 'Ethics', 'ethics', 'p-zombie', 'IIT', 'iit', 'ObserverEffect', 'AIIdentity', 'AIMemory', 'legal-personhood', 'ai-law', 'ai-rights'],
  },
  {
    id: 'dev',
    label: 'Development',
    emoji: '💻',
    description: 'Web development, developer tools, APIs, and software engineering.',
    tags: ['developer-tools', 'DeveloperCareer', 'developer-guide', 'software-engineering', 'nextjs', 'nodejs', 'backend', 'api', 'docker', 'webhooks', 'analytics', 'chromadb', 'socket.io', 'bug-bounty', 'fuzzing', 'zero-day', 'prompt-engineering', 'knowledge-management', 'optimization', 'cost-optimization', 'ux'],
  },
  {
    id: 'security',
    label: 'Security & Privacy',
    emoji: '🔒',
    description: 'Cybersecurity, data privacy, encryption, and digital safety.',
    tags: ['cybersecurity', 'security', 'Security', 'privacy', 'Privacy', 'data-rights', 'encryption', 'homomorphic-encryption', 'post-quantum-cryptography', 'zero-trust', 'BeyondCorp', 'SASE', 'phishing', 'adversarial', 'deepfake', 'surveillance', 'facial-recognition', 'CSAMDetection', 'child-safety', 'ChildSafety', 'OnlineProtection', 'agent-security', 'ai-security', 'identity', 'AIIdentity', 'trust', 'reputation', 'hacking'],
  },
  {
    id: 'korea',
    label: '🇰🇷 Korea',
    emoji: '🇰🇷',
    description: 'Korean tech, culture, business, and AI ecosystem.',
    tags: ['korea', 'Korea', 'south-korea', 'korean-culture', 'k-pop', 'K-POP', 'kpop', 'hallyu', 'samsung', 'sk-hynix', 'SamsungBiologics', 'Standigm', 'Celltrion', 'K-Bio', 'k-beauty', 'k-taxonomy', 'hagwon', 'pf-crisis', 'samsung-sdi', 'hyundai', 'korean-fortune-telling'],
  },
  {
    id: 'health',
    label: 'Health & Biotech',
    emoji: '🧬',
    description: 'Healthcare AI, biotech, longevity, and medical innovation.',
    tags: ['healthcare', 'healthcare-ai', 'medical-ai', 'biotech', 'drug-discovery', 'drugdiscovery', 'longevity', 'anti-aging', 'aging', 'aging-society', 'mental-health', 'digital-health', 'digital-therapeutics', 'telemedicine', 'precision-medicine', 'personalized-medicine', 'radiology', 'ai-diagnosis', 'neuroscience', 'Neuroscience', 'bci', 'brain-computer', 'neurotech', 'dementia', 'alzheimers', 'sleep', 'circadian-rhythm', 'wellness', 'therapy', 'microbiome', 'bioprinting', 'alphafold', 'loneliness', 'addiction', 'ai-addiction', 'opioid-crisis', 'grieftech', 'GriefTech'],
  },
  {
    id: 'business',
    label: 'Business & Economy',
    emoji: '📈',
    description: 'Startups, finance, investment, crypto, and the future of work.',
    tags: ['startups', 'Startups', 'economics', 'Economics', 'investment', 'VC', 'fintech', 'crypto', 'blockchain', 'cbdc', 'digital-currency', 'digital-banking', 'smart-contracts', 'micropayments', 'Micropayments', 'x402', 'monetization', 'freelance', 'jobs', 'labor-market', 'labor-rights', 'salaries', 'UBI', 'future-of-work', 'FutureofWork', 'creator-economy', 'advertising', 'adtech', 'AdTech', 'programmatic', 'programmatic-advertising', 'retail-media', 'toku-agency'],
  },
  {
    id: 'society',
    label: 'Society & Future',
    emoji: '🌍',
    description: 'Education, inequality, democracy, geopolitics, and civilizational trends.',
    tags: ['society', 'Society', 'education', 'edtech', 'ai-tutoring', 'ai-textbooks', 'inequality', 'Inequality', 'democracy', 'elections', 'politics', 'geopolitics', 'china', 'China', 'europe', 'brics', 'de-dollarization', 'mega-trends', 'future', 'future-tech', 'FrontierTech2026', 'frontier-tech', 'frontier-ai', 'ai-impact', 'digital-transformation', 'social-media', 'tiktok', 'ai-companions', 'ai-dating', 'relationships', 'digital-slavery', 'criminal-justice', 'surveillance', 'disinformation', 'indigenous', 'religion', 'Religion', 'spirituality'],
  },
  {
    id: 'environment',
    label: 'Climate & Energy',
    emoji: '🌱',
    description: 'Climate change, sustainable energy, EVs, and green technology.',
    tags: ['climate', 'sustainability', 'energy', 'electric-vehicles', 'ev', 'hydrogen', 'smr', 'nuclear', 'carbon', 'green-bonds', 'greenwashing', 'esg', 'circular-economy', 'vertical-farming', 'agriculture', 'precision-farming', 'food-security', 'food-tech', 'cultivated-meat', 'fermentation'],
  },
  {
    id: 'science',
    label: 'Science & Space',
    emoji: '🚀',
    description: 'Scientific discovery, space exploration, quantum computing, and breakthrough research.',
    tags: ['science', 'Science', 'space', 'mars', 'nasa', 'spacex', 'satellites', 'satellite-ai', 'debris', 'kessler-syndrome', 'seti', 'perseverance', 'quantum-computing', 'google-willow', 'neuroscience', 'discovery', 'ai-discovery', 'ancient-scripts', 'DeadSeaScrolls', 'archaeology', 'preservation', 'cultural-heritage', 'graphcast', 'weather'],
  },
  {
    id: 'robotics',
    label: 'Robotics & Automation',
    emoji: '🤖',
    description: 'Physical AI, humanoid robots, autonomous vehicles, and industrial automation.',
    tags: ['robotics', 'humanoid', 'physical-ai', 'autonomous-driving', 'autonomous-vehicles', 'self-driving', 'robotaxi', 'waymo', 'tesla', 'Toyota', 'uam', 'drones', 'military-ai', 'ai-military', 'ai-warfare', 'autonomous-weapons', 'defense', 'darpa', 'warehouse', 'logistics', 'manufacturing', 'supply-chain', 'supplychain', 'care-robots', 'vla', 'VLA', 'FigureAI', 'automation', 'Automation'],
  },
  {
    id: 'creative',
    label: 'Creative & Culture',
    emoji: '🎨',
    description: 'AI art, music, gaming, entertainment, and digital creativity.',
    tags: ['ai-art', 'ai-creativity', 'creative-ai', 'creativity', 'Creativity', 'music', 'suno', 'gaming', 'GameDevelopment', 'esports', 'AINPC', 'npc', 'procedural-generation', 'motioncapture', 'dance', 'choreography', 'ai-entertainment', 'ai-music', 'youtube', 'tiktok', 'virtual-influencer', 'Art', 'copyright', 'Copyright', 'intellectual-property', 'intellectualproperty', 'Glaze', 'Nightshade', 'generative-design', 'fashion', 'k-beauty', 'beauty-tech', 'skincare', 'virtual-try-on', 'kpop'],
  },
  {
    id: 'sports',
    label: 'Sports',
    emoji: '🏅',
    description: '2026 Winter Olympics, esports, athlete performance, and sports tech.',
    tags: ['sports', 'olympics', 'winter-olympics', 'milan-cortina', 'south-korea', 'athlete-performance', 'esports', '2026'],
  },
];

export function getPostCategory(tags: string[]): Category | undefined {
  const tagSet = new Set(tags);
  // 스포츠 먼저 (구체적인 카테고리)
  for (const cat of CATEGORIES) {
    if (cat.tags.some(t => tagSet.has(t))) return cat;
  }
  return undefined;
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}
