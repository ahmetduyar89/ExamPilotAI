/**
 * Presentation-only mock data for the ExamPilot AI MVP UI.
 *
 * This module is intentionally decoupled from the persistence layer and the
 * feature repositories. It exists purely to make the screens feel alive for
 * App Store screenshots — no OCR, no AI, no network. Swap these out for real
 * data sources once the intelligence engine is wired up.
 */

export interface MockStudent {
  id: string
  name: string
  grade: string
  school: string
  target: string
  avatarColor: string
}

export const currentStudent: MockStudent = {
  id: 'stu_zeynep',
  name: 'Zeynep Kaya',
  grade: '8th Grade',
  school: 'Atatürk Ortaokulu',
  target: 'LGS 2026',
  avatarColor: 'from-indigo-500 to-violet-500',
}

export const students: MockStudent[] = [
  currentStudent,
  {
    id: 'stu_emir',
    name: 'Emir Demir',
    grade: '8th Grade',
    school: 'Cumhuriyet Ortaokulu',
    target: 'LGS 2026',
    avatarColor: 'from-sky-500 to-cyan-500',
  },
  {
    id: 'stu_elif',
    name: 'Elif Şahin',
    grade: '7th Grade',
    school: 'Gazi Ortaokulu',
    target: 'Bursluluk',
    avatarColor: 'from-rose-500 to-pink-500',
  },
]

export interface MockExam {
  id: string
  examName: string
  publisher: string
  subject: string
  studentName: string
  date: string
  net: number
  total: number
  scorePct: number
  status: 'analyzed' | 'processing'
  accent: string
}

export const recentExams: MockExam[] = [
  {
    id: 'exm_1',
    examName: 'Science Practice Test 4',
    publisher: 'Apotemi',
    subject: 'Science',
    studentName: 'Zeynep Kaya',
    date: 'Jul 6',
    net: 32,
    total: 45,
    scorePct: 78,
    status: 'analyzed',
    accent: 'text-emerald-500',
  },
  {
    id: 'exm_2',
    examName: 'Mathematics Trial 7',
    publisher: 'Karekök',
    subject: 'Mathematics',
    studentName: 'Emir Demir',
    date: 'Jul 4',
    net: 26,
    total: 40,
    scorePct: 65,
    status: 'analyzed',
    accent: 'text-amber-500',
  },
  {
    id: 'exm_3',
    examName: 'General Rehearsal 12',
    publisher: 'Bilfen',
    subject: 'Full Trial',
    studentName: 'Zeynep Kaya',
    date: 'Jul 1',
    net: 71,
    total: 90,
    scorePct: 79,
    status: 'analyzed',
    accent: 'text-emerald-500',
  },
]

export const homeStats = [
  { key: 'graded', label: 'Exams Graded', value: '12', delta: '+3 this week' },
  { key: 'avg', label: 'Average Score', value: '74%', delta: '+6% vs last' },
  { key: 'streak', label: 'Study Streak', value: '6 days', delta: 'Keep it up' },
  { key: 'students', label: 'Students', value: '3', delta: 'Active' },
]

export interface TopicScore {
  id: string
  name: string
  domain: string
  mastery: number
  correct: number
  wrong: number
  blank: number
  trend: number
}

export const analysis = {
  examName: 'Science Practice Test 4',
  publisher: 'Apotemi',
  student: currentStudent,
  date: 'July 6, 2026',
  net: 32,
  correct: 32,
  wrong: 8,
  blank: 5,
  total: 45,
  scorePct: 78,
  qualityScore: 96,
  predictedGain: 14,
  confidence: 0.86,
  topics: [
    { id: 't1', name: 'Ecosystems & Biodiversity', domain: 'Biology', mastery: 90, correct: 8, wrong: 1, blank: 0, trend: 6 },
    { id: 't2', name: 'Cell Division & Heredity', domain: 'Biology', mastery: 82, correct: 7, wrong: 1, blank: 1, trend: 4 },
    { id: 't3', name: 'Periodic System', domain: 'Chemistry', mastery: 71, correct: 5, wrong: 2, blank: 1, trend: 2 },
    { id: 't4', name: 'Electric Charges', domain: 'Physics', mastery: 63, correct: 5, wrong: 2, blank: 1, trend: -1 },
    { id: 't5', name: 'Force & Motion', domain: 'Physics', mastery: 45, correct: 4, wrong: 1, blank: 1, trend: -3 },
    { id: 't6', name: 'Chemical Reactions', domain: 'Chemistry', mastery: 38, correct: 3, wrong: 1, blank: 1, trend: -5 },
  ] as TopicScore[],
  coachNotes: [
    'Strong grasp of Biology — Ecosystems and Heredity are exam-ready.',
    'Chemical Reactions is the biggest opportunity: 3 of 5 missed were conceptual.',
    'Blanks cluster in Physics — timing pressure, not lack of knowledge.',
  ],
}

export interface PlanTask {
  id: string
  topic: string
  type: 'learn' | 'practice' | 'review'
  duration: number
  domain: string
}

export interface PlanDay {
  day: string
  date: string
  focus: string
  done: boolean
  today?: boolean
  tasks: PlanTask[]
}

export const weeklyPlan: { rangeLabel: string; expectedGain: number; totalMinutes: number; days: PlanDay[] } = {
  rangeLabel: 'Jul 8 – Jul 14',
  expectedGain: 14,
  totalMinutes: 300,
  days: [
    {
      day: 'Mon', date: '8', focus: 'Chemical Reactions', done: false, today: true,
      tasks: [
        { id: 'p1', topic: 'Chemical Reactions', type: 'learn', duration: 25, domain: 'Chemistry' },
        { id: 'p2', topic: 'Chemical Reactions', type: 'practice', duration: 20, domain: 'Chemistry' },
      ],
    },
    {
      day: 'Tue', date: '9', focus: 'Force & Motion', done: false,
      tasks: [
        { id: 'p3', topic: 'Force & Motion', type: 'learn', duration: 25, domain: 'Physics' },
        { id: 'p4', topic: 'Force & Motion', type: 'practice', duration: 20, domain: 'Physics' },
      ],
    },
    {
      day: 'Wed', date: '10', focus: 'Electric Charges', done: false,
      tasks: [
        { id: 'p5', topic: 'Electric Charges', type: 'review', duration: 15, domain: 'Physics' },
        { id: 'p6', topic: 'Electric Charges', type: 'practice', duration: 25, domain: 'Physics' },
      ],
    },
    {
      day: 'Thu', date: '11', focus: 'Periodic System', done: false,
      tasks: [
        { id: 'p7', topic: 'Periodic System', type: 'practice', duration: 30, domain: 'Chemistry' },
      ],
    },
    {
      day: 'Fri', date: '12', focus: 'Mixed Review', done: false,
      tasks: [
        { id: 'p8', topic: 'Chemical Reactions', type: 'review', duration: 20, domain: 'Chemistry' },
        { id: 'p9', topic: 'Force & Motion', type: 'review', duration: 20, domain: 'Physics' },
      ],
    },
    {
      day: 'Sat', date: '13', focus: 'Full Practice Set', done: false,
      tasks: [
        { id: 'p10', topic: 'Timed Science Set', type: 'practice', duration: 35, domain: 'Full Trial' },
      ],
    },
    {
      day: 'Sun', date: '14', focus: 'Rest & Reflect', done: false,
      tasks: [],
    },
  ],
}

export const userProfile = {
  name: 'Ahmet Duyar',
  email: 'ahmetduyar89@gmail.com',
  role: 'Educator',
  plan: 'Free',
  memberSince: '2026',
  stats: [
    { label: 'Exams', value: '128' },
    { label: 'Students', value: '3' },
    { label: 'Plans', value: '9' },
  ],
}

export const premiumFeatures = [
  { icon: 'ScanLine', title: 'Unlimited exam scans', desc: 'Digitize every optical form and answer sheet, instantly.' },
  { icon: 'Brain', title: 'AI-powered analysis', desc: 'Topic-level mastery, misconception detection, and trends.' },
  { icon: 'Calendar', title: 'Personalized weekly plans', desc: 'Adaptive study schedules built around each weakness.' },
  { icon: 'TrendingUp', title: 'Score predictions', desc: 'Forecast net gains before the next real exam.' },
  { icon: 'Sparkles', title: 'Priority support', desc: 'Fast, human help whenever you need it.' },
]

export const premiumPlans = {
  monthly: { id: 'monthly', label: 'Monthly', price: '$9.99', period: '/ month', note: 'Billed monthly', badge: '' },
  annual: { id: 'annual', label: 'Annual', price: '$79.99', period: '/ year', note: '$6.67 / month · Save 33%', badge: 'Best value' },
}
