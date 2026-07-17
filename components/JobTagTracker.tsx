'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Copy, Sun, Moon, Sparkles, ArrowRight, Check } from 'lucide-react';
import Toast from './Toast';
import ConfettiBurst from './ConfettiBurst';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface JobTag {
  id: string;
  tag: string;
  category: string;
  completed: boolean;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info';
}

const CATEGORIZED_TAGS = {
  'AI & Machine Learning': [
    'Generative AI', 'Machine Learning', 'Artificial Intelligence', 'AI Development',
    'Deep Learning', 'Neural Networks', 'Natural Language Processing (NLP)',
    'Computer Vision', 'AI Models', 'AI Data Annotation', 'AI Training',
    'Model Training', 'AI Fine-tuning', 'Prompt Engineering',
    'LLM (Large Language Models)', 'ChatGPT', 'OpenAI', 'Claude AI',
    'Midjourney', 'Stable Diffusion', 'TensorFlow', 'PyTorch',
    'Hugging Face', 'Python (for AI/ML)', 'Data Science', 'Data Analysis',
    'Predictive Analytics', 'Statistical Analysis', 'AI Integration',
    'AI Implementation', 'Machine Learning Models', 'AI Optimization',
    'Transfer Learning', 'Reinforcement Learning', 'Supervised Learning',
    'Unsupervised Learning', 'Semi-Supervised Learning', 'Model Evaluation',
    'Cross-Validation', 'Hyperparameter Tuning', 'Feature Engineering',
    'Data Augmentation', 'Ensemble Methods', 'Gradient Boosting', 'XGBoost',
    'LightGBM', 'CatBoost', 'Scikit-learn', 'Keras', 'TensorFlow Lite',
    'ONNX', 'Model Deployment', 'AI Ethics', 'Responsible AI', 'Fairness in AI',
    'AI Security', 'Adversarial Robustness', 'Explainable AI (XAI)',
    'LIME', 'SHAP', 'Model Interpretability', 'AI Monitoring',
    'AI Infrastructure', 'MLOps', 'Model Registry', 'Feature Store',
    'AI Pipeline', 'AutoML', 'Hyperband', 'Bayesian Optimization',
  ],
  'Web Development': [
    'Full Stack Development', 'Frontend Development', 'Backend Development',
    'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte', 'TypeScript',
    'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Bootstrap', 'Material UI',
    'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Ruby on Rails',
    'PHP', 'Laravel', 'REST API', 'GraphQL', 'WebSocket', 'Socket.io',
    'React Native', 'Flutter', 'Dart', 'Kotlin', 'Swift', 'iOS Development',
    'Android Development', 'Progressive Web Apps', 'PWA', 'Service Workers',
    'Webpack', 'Vite', 'Parcel', 'Rollup', 'Jest', 'Vitest', 'Testing Library',
    'Cypress', 'Playwright', 'Selenium', 'End-to-End Testing', 'Performance Optimization',
    'SEO Optimization', 'Web Accessibility', 'WCAG', 'a11y', 'ARIA',
    'Responsive Design', 'Mobile First', 'Cross-browser Compatibility',
    'Web Security', 'HTTPS', 'SSL/TLS', 'OWASP', 'XSS Prevention', 'CSRF Protection',
    'Content Security Policy', 'Authentication', 'Authorization', 'OAuth 2.0',
    'JWT', 'Session Management', 'Cookie Security', 'Database Security',
    'SQL Injection Prevention', 'Rate Limiting', 'API Security', 'API Rate Limiting',
    'Caching Strategies', 'CDN', 'Load Balancing', 'Microservices',
    'Docker', 'Kubernetes', 'Container Orchestration', 'CI/CD', 'GitHub Actions',
    'GitLab CI', 'Jenkins', 'DevOps', 'Infrastructure as Code', 'Terraform',
    'AWS', 'Azure', 'Google Cloud', 'DigitalOcean', 'Heroku', 'Vercel',
    'Netlify', 'Web3 Development', 'Solidity', 'Smart Contracts', 'Ethereum',
  ],
  'Data & Analytics': [
    'Data Engineering', 'Data Mining', 'Data Preprocessing', 'Dataset Creation',
    'Data Collection', 'Data Visualization', 'Business Intelligence',
    'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase',
    'Big Data', 'Hadoop', 'Spark', 'Tableau', 'Power BI', 'Google Analytics',
    'Data Warehousing', 'Data Lake', 'ETL', 'ELT', 'Data Pipeline',
    'Apache Airflow', 'Kafka', 'Real-time Analytics', 'Stream Processing',
    'Apache Flink', 'Apache Storm', 'Time Series Analysis', 'Forecasting',
    'ARIMA', 'Exponential Smoothing', 'Facebook Prophet', 'Statsmodels',
    'Pandas', 'NumPy', 'Polars', 'Dask', 'PySpark', 'Scala', 'Java for Data',
    'R Programming', 'Statistics', 'Hypothesis Testing', 'A/B Testing',
    'Experimentation', 'Causal Inference', 'Regression Analysis', 'Classification',
    'Clustering', 'K-Means', 'DBSCAN', 'Hierarchical Clustering', 'Dimensionality Reduction',
    'PCA', 'UMAP', 't-SNE', 'Feature Selection', 'Outlier Detection',
    'Anomaly Detection', 'Survival Analysis', 'Network Analysis', 'Graph Analytics',
    'Knowledge Graphs', 'Geospatial Analysis', 'GIS', 'Mapping', 'Data Storytelling',
  ],
  'Blockchain & Web3': [
    'Blockchain', 'Web3', 'Solidity', 'Ethereum', 'Smart Contracts',
    'DeFi', 'NFT', 'Cryptocurrency', 'Bitcoin', 'dApp Development',
    'Web3 Development', 'Solana', 'Polygon', 'Cosmos', 'Rust (Blockchain)',
    'Web3.js', 'Ethers.js', 'Hardhat', 'Truffle', 'Foundry',
    'DAO', 'Token Development', 'Staking', 'Yield Farming', 'Governance',
    'Layer 2 Solutions', 'Rollups', 'Sidechains', 'Cross-chain Bridges',
    'Atomic Swaps', 'Liquidity Pools', 'DEX', 'CEX', 'Arbitrage',
    'Yield Aggregators', 'Lending Protocols', 'Borrowing Protocols',
    'Flash Loans', 'Oracles', 'Chainlink', 'Band Protocol', 'Smart Contract Security',
    'Contract Auditing', 'Formal Verification', 'Reentrancy Attacks',
    'Gas Optimization', 'ERC-20', 'ERC-721', 'ERC-1155', 'Token Standards',
    'Wallet Development', 'Metamask', 'Hardware Wallets', 'Cold Storage',
    'Cryptography', 'Public Key Cryptography', 'Hashing', 'Digital Signatures',
    'Consensus Mechanisms', 'Proof of Work', 'Proof of Stake', 'Byzantine Fault Tolerance',
    'Mining', 'Staking Pools', 'Validator Nodes', 'Light Clients',
  ],
  'Content & Writing': [
    'AI Content Writing', 'AI Copywriting', 'Content Generation',
    'SEO Content Writing', 'Blog Writing with AI', 'Social Media Content',
    'Technical Writing', 'Copywriting', 'Content Marketing', 'Email Marketing',
    'Content Strategy', 'Editing', 'Proofreading', 'Copy Editing',
    'Line Editing', 'Developmental Editing', 'Fact-Checking', 'Research Writing',
    'Academic Writing', 'Proposal Writing', 'Grant Writing', 'Scriptwriting',
    'Screenplay Writing', 'Video Script Writing', 'Podcast Script Writing',
    'Newsletter Writing', 'Sales Copywriting', 'Landing Page Copy', 'Product Descriptions',
    'User Documentation', 'API Documentation', 'Help Articles', 'Knowledge Base',
    'FAQ Writing', 'Case Studies', 'White Papers', 'eBooks', 'Book Editing',
    'Ghostwriting', 'Branding Copy', 'Taglines', 'Slogans', 'Messaging',
    'Tone of Voice', 'Brand Guidelines', 'Style Guides', 'Grammar',
  ],
  'Design & Media': [
    'AI Image Generation', 'AI Video Editing', 'AI Graphic Design',
    'AI Art Generation', 'Text-to-Image', 'Image-to-Image',
    'Graphic Design', 'UI/UX Design', 'Web Design', 'Logo Design',
    'Illustration', 'Video Editing', 'Animation', '3D Modeling', '3D Animation',
    'Motion Graphics', 'VFX', 'Color Grading', 'Photo Editing', 'Retouching',
    'Adobe Creative Suite', 'Photoshop', 'Illustrator', 'InDesign', 'Figma',
    'Sketch', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing',
    'Mockups', 'Design Systems', 'Component Libraries', 'Brand Identity',
    'Visual Hierarchy', 'Typography Design', 'Color Theory', 'Layout Design',
    'Information Architecture', 'User Testing', 'A/B Testing Designs',
    'Accessibility Design', 'Dark Mode Design', 'Responsive Design Mockups',
    'Interactive Design', 'Micro-interactions', 'Animation Principles',
    'Video Production', 'Cinematography', 'Lighting Design', 'Sound Design',
    'Audio Mixing', 'Audio Mastering', 'Podcast Production', 'Live Streaming',
    'Screen Recording', 'Explainer Videos', '2D Animation', 'Stop Motion',
    'Character Design', 'Concept Art', 'Environment Design', 'Asset Design',
  ],
  'API & Integration': [
    'API Development', 'API Integration', 'Webhook Integration',
    'Third-party Integration', 'Zapier', 'Make', 'IFTTT', 'REST API Design',
    'GraphQL API', 'gRPC', 'Protocol Buffers', 'API Documentation',
    'OpenAPI', 'Swagger', 'API Versioning', 'API Rate Limiting',
    'API Authentication', 'API Key Management', 'OAuth Integration',
    'Payment Gateway Integration', 'Stripe', 'PayPal', 'Square',
    'Twilio Integration', 'SendGrid Integration', 'AWS API Gateway',
    'Azure API Management', 'Google API Integration', 'Firebase Integration',
    'Database Integration', 'CMS Integration', 'Ecommerce Integration',
    'Social Media Integration', 'Facebook API', 'Twitter API', 'Instagram API',
    'Slack Bot Development', 'Discord Bot Development', 'Telegram Bot Development',
    'Webhook Management', 'Event-driven Architecture', 'Message Queues',
    'Pub/Sub Patterns', 'Event Sourcing', 'CQRS', 'Serverless Functions',
    'AWS Lambda', 'Google Cloud Functions', 'Azure Functions', 'Function Deployment',
  ],
  'QA & Testing': [
    'AI Quality Assurance', 'AI Testing', 'Prompt Testing', 'Model Evaluation',
    'Quality Assurance', 'Testing', 'Automation Testing', 'Unit Testing',
    'Integration Testing', 'System Testing', 'End-to-End Testing',
    'Regression Testing', 'Smoke Testing', 'Sanity Testing', 'Load Testing',
    'Performance Testing', 'Stress Testing', 'Security Testing', 'Penetration Testing',
    'Bug Reporting', 'Test Case Writing', 'Test Planning', 'Test Execution',
    'Test Automation Frameworks', 'Selenium', 'Cypress', 'Playwright',
    'Appium', 'TestNG', 'JUnit', 'Pytest', 'Mocha', 'Jasmine', 'Vitest',
    'Code Coverage', 'Continuous Testing', 'DevOps Testing', 'BDD',
    'TDD', 'Test-Driven Development', 'Behavior-Driven Development',
    'Cucumber', 'Gherkin', 'Robot Framework', 'Postman API Testing',
    'REST Assured', 'Mockito', 'Mock Testing', 'Stubbing', 'Database Testing',
    'Performance Profiling', 'Memory Testing', 'UI Testing',
  ],
  'Other Skills': [
    'AI Chatbot Development', 'AI Agent Development', 'AI Automation',
    'Conversational AI', 'Voice AI', 'AI Consulting', 'AI Strategy',
    'AI Project Management', 'AI Research', 'Market Research',
    'Competitive Analysis', 'Content Moderation', 'Project Management',
    'Agile Methodology', 'Scrum', 'Kanban', 'Lean', 'Six Sigma',
    'Business Analysis', 'Requirements Gathering', 'Use Case Development',
    'Process Improvement', 'Change Management', 'Stakeholder Management',
    'Communication Skills', 'Presentation Skills', 'Public Speaking',
    'Leadership', 'Team Management', 'Conflict Resolution', 'Negotiation',
    'Problem Solving', 'Critical Thinking', 'Analytical Skills',
    'Customer Support', 'Customer Service', 'Technical Support',
    'Troubleshooting', 'Debugging', 'System Administration', 'Network Administration',
    'IT Operations', 'ITIL', 'System Design', 'Architecture Design',
    'Cloud Architecture', 'Disaster Recovery', 'Business Continuity',
    'Compliance', 'GDPR', 'HIPAA', 'Data Privacy', 'Information Security',
    'Security Governance', 'Risk Management', 'Incident Response',
    'Forensics', 'Malware Analysis', 'Vulnerability Assessment',
  ],
};

const MOTIVATIONAL_MESSAGES = [
  '🎯 Great start!',
  '💪 Keep it up!',
  '🚀 You\'re on fire!',
  '⭐ Excellent work!',
  '🎉 Awesome!',
  '✨ Fantastic!',
  '💯 Perfect!',
  '🏆 You got it!',
];

const COPY_MESSAGES = [
  '📋 Copied — add it to your profile!',
  '✨ Nice pick — that skill stands out!',
  '🎯 Copied! One step closer to your next job.',
  '💼 Great choice — employers love this one!',
  '🚀 Tag copied — keep building your stack!',
];

const FILTER_LABELS: Record<'all' | 'pending' | 'completed', string> = {
  all: 'All Tags',
  pending: 'Pending',
  completed: 'Completed',
};

const SORT_LABELS: Record<'original' | 'a-z' | 'completed-last' | 'completed-first', string> = {
  original: 'Original Order',
  'a-z': 'A-Z',
  'completed-last': 'Completed Last',
  'completed-first': 'Completed First',
};

function getProgressMessage(percentage: number): string {
  if (percentage === 0) return 'Ready to begin? Check off your first tag!';
  if (percentage < 25) return '🌱 Great start — keep the momentum going!';
  if (percentage < 50) return '💪 Solid progress — you\'re building momentum!';
  if (percentage < 75) return '🚀 More than halfway — keep pushing!';
  if (percentage < 100) return '⭐ Almost there — finish strong!';
  return '🏆 All tags completed — you\'re job-ready!';
}

export default function JobTagTracker({ isDark }: { isDark: boolean }) {
  const [tags, setTags] = useState<JobTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sort, setSort] = useState<'original' | 'a-z' | 'completed-last' | 'completed-first'>('original');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [darkMode, setDarkMode] = useState(isDark);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [copiedTagId, setCopiedTagId] = useState<string | null>(null);
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [confettiIntensity, setConfettiIntensity] = useState<'small' | 'medium' | 'large'>('medium');
  const [isInitialized, setIsInitialized] = useState(false);
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tagListRef = useRef<HTMLDivElement>(null);

  function triggerConfetti(intensity: 'small' | 'medium' | 'large' = 'medium') {
    setConfettiIntensity(intensity);
    setConfettiTrigger(prev => prev + 1);
  }

  function showToast(message: string, type: 'success' | 'info' = 'success') {
    const toastId = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id: toastId, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 2500);
  }

  // Initialize tags immediately
  useEffect(() => {
    const stored = localStorage.getItem('jobTags');
    const storedDate = localStorage.getItem('lastCompletedDate');
    const storedTodayCount = localStorage.getItem('todayCompletedCount');
    const version = localStorage.getItem('jobTagsVersion');

    const today = new Date().toDateString();
    if (storedDate !== today) {
      setTodayCompleted(0);
      setLastCompletedDate(today);
    } else {
      setTodayCompleted(parseInt(storedTodayCount || '0'));
      setLastCompletedDate(today);
    }

    // Check if stored tags have category field (version 2), if not, reinitialize
    if (stored && version === '2') {
      try {
        const parsedTags = JSON.parse(stored);
        // Verify at least one tag has a category field
        if (parsedTags.length > 0 && parsedTags[0].category) {
          setTags(parsedTags);
          setIsInitialized(true);
          return;
        }
      } catch {
        // Fall through to reinitialize
      }
    }
    
    // Reinitialize with category data
    initializeDefaultTags();
    setIsInitialized(true);
  }, []);

  function initializeDefaultTags() {
    const initialTags: JobTag[] = [];
    Object.entries(CATEGORIZED_TAGS).forEach(([category, categoryTags]) => {
      categoryTags.forEach((tag, index) => {
        initialTags.push({
          id: `tag-${initialTags.length}`,
          tag,
          category,
          completed: false,
        });
      });
    });
    setTags(initialTags);
    localStorage.setItem('jobTags', JSON.stringify(initialTags));
    localStorage.setItem('jobTagsVersion', '2');
  }

  // Save tags to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && tags.length > 0) {
      localStorage.setItem('jobTags', JSON.stringify(tags));
      localStorage.setItem('jobTagsVersion', '2');
    }
  }, [tags, isInitialized]);

  const filteredTags = useMemo(() => {
    let result = tags.filter(tag => {
      if (filter === 'pending') return !tag.completed;
      if (filter === 'completed') return tag.completed;
      return true;
    });

    if (categoryFilter !== 'all') {
      result = result.filter(tag => tag.category === categoryFilter);
    }

    result = result.filter(tag =>
      tag.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sort === 'a-z') {
      result.sort((a, b) => a.tag.localeCompare(b.tag));
    } else if (sort === 'completed-last') {
      result.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
    } else if (sort === 'completed-first') {
      result.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? -1 : 1));
    }

    return result;
  }, [tags, searchQuery, filter, categoryFilter, sort]);

  const completed = tags.filter(t => t.completed).length;
  const total = tags.length;
  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  function toggleTag(id: string) {
    const tag = tags.find(t => t.id === id);
    const wasCompleted = tag?.completed || false;

    setTags(tags.map(tag =>
      tag.id === id ? { ...tag, completed: !tag.completed } : tag
    ));

    if (!wasCompleted) {
      const today = new Date().toDateString();
      setTodayCompleted(prev => prev + 1);
      localStorage.setItem('todayCompletedCount', String(todayCompleted + 1));
      localStorage.setItem('lastCompletedDate', today);

      setJustCompletedId(id);
      setTimeout(() => setJustCompletedId(null), 900);

      triggerConfetti('medium');
      const motivationMsg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
      showToast(`${motivationMsg} Tag completed!`);

      if ((completed + 1) % 10 === 0 && completed > 0) {
        triggerConfetti('large');
        setTimeout(() => {
          showToast(`🎊 Milestone! ${completed + 1} tags completed!`);
        }, 300);
      }

      if (completed + 1 === total) {
        triggerConfetti('large');
        setTimeout(() => {
          showToast('🏆 You completed every tag — incredible work!');
        }, 400);
      }
    }
  }

  function copyTag(tagId: string, tag: string) {
    navigator.clipboard.writeText(tag);
    setCopiedTagId(tagId);
    triggerConfetti('small');
    // const copyMsg = COPY_MESSAGES[Math.floor(Math.random() * COPY_MESSAGES.length)];
    // showToast(`${copyMsg} "${tag}"`);
    // setTimeout(() => {
    //   setCopiedTagId(null);
    // }, 2000);
  }

  function handleClearAll() {
    setTags(tags.map(tag => ({ ...tag, completed: false })));
    setTodayCompleted(0);
    localStorage.setItem('todayCompletedCount', '0');
    setShowClearDialog(false);
    setFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
    const toastId = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id: toastId, message: 'All tags reset! Filters cleared.', type: 'info' }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 2000);
  }

  function goToNextPending() {
    const nextPending = filteredTags.find(tag => !tag.completed);
    if (nextPending && tagListRef.current) {
      const element = document.getElementById(nextPending.id);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const bgClass = darkMode ? 'bg-slate-900' : 'bg-white';
  const borderClass = darkMode ? 'border-slate-700' : 'border-slate-200';
  const textClass = darkMode ? 'text-slate-100' : 'text-slate-900';
  const secondaryTextClass = darkMode ? 'text-slate-400' : 'text-slate-600';
  const hoverClass = darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50';

  if (!isInitialized) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className={textClass}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Fixed Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 border-b ${borderClass} ${bgClass} shadow-sm`}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          {/* Header Top Row - Title & Dark Mode Toggle */}
          <div className="flex items-center justify-between mb-3">
            <h1 className={`text-2xl font-bold ${textClass}`}>Job Tag Tracker</h1>
            <div className="flex items-center gap-2">
              {todayCompleted > 0 && (
                <div className={`text-sm px-3 py-1.5 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} text-blue-600`}>
                  Today: {todayCompleted}
                </div>
              )}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} ${hoverClass} transition-colors`}
                title="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tags (Ctrl+F)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderClass} ${bgClass} ${textClass} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center text-xs">
              <span className={`font-medium ${secondaryTextClass}`}>Progress</span>
              <span className={`font-semibold ${textClass}`}>{percentage}% ({completed}/{total})</span>
            </div>
            <div className={`h-3 rounded-full overflow-hidden shadow-inner ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-green-500 transition-all duration-700 ease-out relative"
                style={{ width: `${percentage}%` }}
              >
                {percentage > 8 && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                )}
              </div>
            </div>
            <p className={`text-xs ${percentage >= 100 ? 'text-green-500 font-medium' : secondaryTextClass}`}>
              {getProgressMessage(percentage)}
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} text-center`}>
              <div className={`text-xs ${secondaryTextClass}`}>Remaining</div>
              <div className={`text-lg font-bold ${textClass}`}>{remaining}</div>
            </div>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} text-center`}>
              <div className={`text-xs ${secondaryTextClass}`}>Completed</div>
              <div className="text-lg font-bold text-green-500">{completed}</div>
            </div>
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'} text-center`}>
              <div className={`text-xs ${secondaryTextClass}`}>Total</div>
              <div className={`text-lg font-bold ${textClass}`}>{total}</div>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap gap-2">
            {/* Status Filter - shadcn Select */}
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className={`w-36 ${bgClass} ${borderClass} ${textClass}`}>
                <SelectValue placeholder="All Tags">
                  {(value) => FILTER_LABELS[value as keyof typeof FILTER_LABELS] ?? 'All Tags'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter - shadcn Select */}
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value ?? 'all')}>
              <SelectTrigger className={`w-52 ${bgClass} ${borderClass} ${textClass}`}>
                <SelectValue placeholder="All Categories">
                  {(value) => value === 'all' ? 'All Categories' : String(value)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.keys(CATEGORIZED_TAGS).map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort - shadcn Select */}
            <Select value={sort} onValueChange={(value: any) => setSort(value)}>
              <SelectTrigger className={`w-44 ${bgClass} ${borderClass} ${textClass}`}>
                <SelectValue placeholder="Original Order">
                  {(value) => SORT_LABELS[value as keyof typeof SORT_LABELS] ?? 'Original Order'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">Original Order</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="completed-last">Completed Last</SelectItem>
                <SelectItem value="completed-first">Completed First</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <Button
              onClick={goToNextPending}
              variant="outline"
              size="sm"
              className={`border-blue-500 font-medium ${
                darkMode
                  ? 'bg-slate-800 text-blue-300 hover:bg-blue-950/50 hover:text-blue-200'
                  : 'bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              Go to Next
              <ArrowRight size={14} />
            </Button>

            <Button
              onClick={() => setShowClearDialog(true)}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              size="sm"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div ref={tagListRef} className="pt-80 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-2">
            {filteredTags.length === 0 ? (
              <div className={`text-center py-12 ${secondaryTextClass}`}>
                <p className="text-lg">No tags found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredTags.map(tag => (
                <div
                  id={tag.id}
                  key={tag.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 group ${
                    justCompletedId === tag.id
                      ? 'border-green-500 bg-green-500/10 scale-[1.01] shadow-md shadow-green-500/20'
                      : tag.completed
                        ? `${borderClass} ${darkMode ? 'bg-slate-800/40' : 'bg-slate-50/80'} opacity-80`
                        : `${borderClass} ${bgClass} ${hoverClass}`
                  }`}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={tag.completed}
                    onChange={() => toggleTag(tag.id)}
                    className="w-5 h-5 rounded cursor-pointer accent-green-500"
                  />

                  {/* Tag Text */}
                  <span
                    className={`flex-1 ${tag.completed ? 'line-through ' + secondaryTextClass : textClass}`}
                  >
                    {tag.tag}
                  </span>

                  {/* Category Badge */}
                  {tag.category && (
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                      {tag.category}
                    </span>
                  )}

                  {/* Copy Button */}
                  <button
                    onClick={() => copyTag(tag.id, tag.tag)}
                    className={`p-2 rounded-lg transition-all ${
                      copiedTagId === tag.id
                        ? 'bg-green-500/20 opacity-100'
                        : darkMode
                          ? 'hover:bg-slate-700 opacity-0 group-hover:opacity-100'
                          : 'hover:bg-slate-100 opacity-0 group-hover:opacity-100'
                    }`}
                    title="Copy to clipboard"
                  >
                    {copiedTagId === tag.id ? (
                      <Check size={18} className="text-green-500" />
                    ) : (
                      <Copy size={18} className="text-slate-500" />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Tags</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset all completed tags? This action cannot be undone. All your progress will be cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll} className="bg-red-600 hover:bg-red-700">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toast Notifications */}
      <ConfettiBurst trigger={confettiTrigger} intensity={confettiIntensity} />
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </div>
  );
}
