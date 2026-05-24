import { useState, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// LOADING STATE STORE
// ═══════════════════════════════════════════════════════════════════════════
export interface LoadingState {
  news: boolean;
  debate: boolean;
  explain: boolean;
  fakeness: boolean;
  bias: boolean;
  briefing: boolean;
  translate: boolean;
  anchor: boolean;
  tts: boolean;
  search: boolean;
}

const initialLoading: LoadingState = {
  news: false,
  debate: false,
  explain: false,
  fakeness: false,
  bias: false,
  briefing: false,
  translate: false,
  anchor: false,
  tts: false,
  search: false,
};

let globalLoading = { ...initialLoading };
let listeners: Array<() => void> = [];

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function setLoading(key: keyof LoadingState, value: boolean) {
  globalLoading = { ...globalLoading, [key]: value };
  notifyListeners();
}

export function useLoadingState(): LoadingState {
  const [state, setState] = useState(globalLoading);

  const listener = useCallback(() => {
    setState({ ...globalLoading });
  }, []);

  // Register listener on mount
  if (!listeners.includes(listener)) {
    listeners.push(listener);
  }

  return state;
}

// ═══════════════════════════════════════════════════════════════════════════
// USER PREFERENCES (localStorage-backed)
// ═══════════════════════════════════════════════════════════════════════════
export type InterestCategory =
  | "technology" | "business" | "sports" | "science"
  | "entertainment" | "politics" | "world";

export type LanguageCode = "en" | "hi" | "ta" | "bn";

export interface UserPreferences {
  interests: InterestCategory[];
  language: LanguageCode;
  voicePersona: string;
  narrativeSpeed: number;
  autoTranslate: boolean;
  biasMitigationVoice: boolean;
  accentNuance: string;
  isMuted: boolean;
}

const DEFAULT_PREFS: UserPreferences = {
  interests: ["technology", "business", "science"],
  language: "en",
  voicePersona: "Deep Male",
  narrativeSpeed: 1.2,
  autoTranslate: true,
  biasMitigationVoice: false,
  accentNuance: "Standard British RP",
  isMuted: false,
};

export function loadPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem("newsanchor_prefs");
    if (stored) {
      return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
    }
  } catch {}
  return { ...DEFAULT_PREFS };
}

export function savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const current = loadPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem("newsanchor_prefs", JSON.stringify(updated));
  return updated;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUDIO PLAYER STATE
// ═══════════════════════════════════════════════════════════════════════════
export interface AudioQueueItem {
  id: string;
  title: string;
  source: string;
  text: string;
  category?: string;
}

export interface PlayerState {
  isPlaying: boolean;
  currentItem: AudioQueueItem | null;
  queue: AudioQueueItem[];
  speed: number;
  isMuted: boolean;
  progress: number;
}

let playerState: PlayerState = {
  isPlaying: false,
  currentItem: null,
  queue: [],
  speed: 1,
  isMuted: false,
  progress: 0,
};

let playerListeners: Array<() => void> = [];

function notifyPlayerListeners() {
  playerListeners.forEach((fn) => fn());
}

export function getPlayerState(): PlayerState {
  return { ...playerState };
}

export function addToQueue(item: AudioQueueItem) {
  playerState = {
    ...playerState,
    queue: [...playerState.queue, item],
  };
  if (!playerState.currentItem) {
    playerState.currentItem = item;
  }
  notifyPlayerListeners();
}

export function playNext() {
  const newQueue = [...playerState.queue];
  newQueue.shift();
  playerState = {
    ...playerState,
    currentItem: newQueue[0] || null,
    queue: newQueue,
    isPlaying: newQueue.length > 0,
    progress: 0,
  };
  notifyPlayerListeners();
}

export function setPlayerPlaying(playing: boolean) {
  playerState = { ...playerState, isPlaying: playing };
  notifyPlayerListeners();
}

export function setPlayerSpeed(speed: number) {
  playerState = { ...playerState, speed };
  notifyPlayerListeners();
}

export function setPlayerMuted(muted: boolean) {
  playerState = { ...playerState, isMuted: muted };
  notifyPlayerListeners();
}

export function setPlayerProgress(progress: number) {
  playerState = { ...playerState, progress };
  notifyPlayerListeners();
}

export function clearQueue() {
  playerState = {
    isPlaying: false,
    currentItem: null,
    queue: [],
    speed: 1,
    isMuted: playerState.isMuted,
    progress: 0,
  };
  notifyPlayerListeners();
}

export function usePlayerState(): PlayerState {
  const [state, setState] = useState(playerState);

  const listener = useCallback(() => {
    setState({ ...playerState });
  }, []);

  if (!playerListeners.includes(listener)) {
    playerListeners.push(listener);
  }

  return state;
}
