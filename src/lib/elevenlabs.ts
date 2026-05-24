import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.ELEVEN_LABS_API_KEY;
const BASE_URL = "https://api.elevenlabs.io/v1";

// Default voice IDs from ElevenLabs
const VOICES: Record<string, string> = {
  "Deep Male": "pNInz6obpgDQGcFmaJgB",     // Adam
  "Warm Female": "21m00Tcm4TlvDq8ikWAM",    // Rachel
  "Neutral": "ErXwobaYiN019PkySvjV",        // Antoni
  "Regional East": "VR6AewLTigWG4xSOukaG",  // Arnold
  "The Analyst": "pNInz6obpgDQGcFmaJgB",    // Adam (fast)
  "Cyber Voice": "21m00Tcm4TlvDq8ikWAM",    // Rachel (stylized)
};

// Multilingual voice for non-English
const MULTILINGUAL_VOICE = "21m00Tcm4TlvDq8ikWAM"; // Rachel - supports multilingual

export function getVoiceId(voiceName: string): string {
  return VOICES[voiceName] || VOICES["Deep Male"];
}

/**
 * Generate TTS audio using ElevenLabs API
 * Returns audio as an ArrayBuffer
 */
export async function textToSpeech(
  text: string,
  voiceName: string = "Deep Male",
  language?: string
): Promise<ArrayBuffer> {
  const voiceId = language && language !== "en" ? MULTILINGUAL_VOICE : getVoiceId(voiceName);
  
  const url = `${BASE_URL}/text-to-speech/${voiceId}`;

  const body: Record<string, unknown> = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.5,
      use_speaker_boost: true,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY || "",
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs TTS error: ${res.status} — ${err}`);
  }

  return res.arrayBuffer();
}

/**
 * Stream TTS audio — returns a ReadableStream for chunked delivery
 */
export async function textToSpeechStream(
  text: string,
  voiceName: string = "Deep Male",
  language?: string
): Promise<ReadableStream<Uint8Array> | null> {
  const voiceId = language && language !== "en" ? MULTILINGUAL_VOICE : getVoiceId(voiceName);
  
  const url = `${BASE_URL}/text-to-speech/${voiceId}/stream`;

  const body: Record<string, unknown> = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.5,
      use_speaker_boost: true,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY || "",
      "Content-Type": "application/json",
      "Accept": "audio/mpeg",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs TTS stream error: ${res.status} — ${err}`);
  }

  return res.body;
}

/**
 * Get available voices from ElevenLabs
 */
export async function getVoices() {
  const res = await fetch(`${BASE_URL}/voices`, {
    headers: { "xi-api-key": API_KEY || "" },
  });

  if (!res.ok) throw new Error("Failed to fetch ElevenLabs voices");
  return res.json();
}
