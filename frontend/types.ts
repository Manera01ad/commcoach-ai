
export enum SessionPhase {
  WELCOME = 'WELCOME',
  ASSESSMENT = 'ASSESSMENT',
  PRACTICE = 'PRACTICE',
  RECAP = 'RECAP',
  CHAT = 'CHAT',
  MENTORS = 'MENTORS',
  AGENT = 'AGENT',
  PROFILE = 'PROFILE',
  VISION = 'VISION'
}

export interface AvatarCloneConfig {
  assertiveness: number;
  empathy: number;
  openness: number;
  stability: number;
  vocabularyComplexity: number;
  vocalPitch: 'high' | 'medium' | 'low';
  pacing: number;
  fillerTolerance: number;
  idealPersona: string;
  directness: number;
  riskAppetite: number;
  structurePreference: number;
  visualArchetype: 'Professional' | 'Academic' | 'Stoic' | 'Warm' | 'High-Energy';
  visualTheme: 'Indigo' | 'Crimson' | 'Emerald' | 'Amber' | 'Slate';
  humorLevel: number;
  analyticalDepth: number;
  formality: number;
  trainingContext?: string;
}

export interface UserProfile {
  name: string;
  avatarUrl?: string;
  level: number;
  streak: number;
  totalSessions: number;
  eloScore: number;
  skills: {
    clarity: number;
    persuasion: number;
    empathy: number;
    publicSpeaking: number;
  };
  cloneConfig: AvatarCloneConfig;
  growthGoals: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  videoUrl?: string;
  groundingUrls?: { title: string; uri: string }[];
  feedback?: {
    fillerWords?: string[];
    clarityTip?: string;
    toneAnalysis?: string;
    complexityScore?: number;
    pacingNote?: string;
  };
}

export interface PerformanceMetrics {
  clarityScore: number;
  confidenceLevel: number;
  fillerWordCount: number;
  fillersPer100: number;
  pacingScore: number;
  emotionalTone: string;
  emotionalValence: number;
  topicRelevance: number;
  engagementQuality: number;
  hesitationPatterns: number;
  complexityScore: number;
}

export interface MentorPlaylist {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface Mentor {
  id: string;
  name: string;
  handle: string;
  channelName: string;
  category: string;
  thumbnail: string;
  focus: string[];
  playlists: MentorPlaylist[];
}

export interface SessionState {
  sessionId: string;
  phase: SessionPhase;
  assessmentStep: number;
  data: any;
  messages: Message[];
  metrics: PerformanceMetrics;
  userProfile: UserProfile;
  historyTrends: any;
}

export interface MeetingSpeaker {
  id: string;
  name: string;
  color: string;
}
