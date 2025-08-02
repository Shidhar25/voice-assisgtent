import { type AudioConfig, type StsConfig, type Voice } from "app/utils/deepgramUtils";

const audioConfig: AudioConfig = {
  input: {
    encoding: "linear16",
    sample_rate: 16000,
  },
  output: {
    encoding: "linear16",
    sample_rate: 24000,
    container: "none",
  },
};

const baseConfig = {
  type: "Settings" as const,
  audio: audioConfig,
  agent: {
    listen: { provider: { type: "deepgram" as const, model: "nova-3" } },
    speak: { provider: { type: "deepgram" as const, model: "aura-asteria-en" } },
    think: {
      provider: { type: "open_ai" as const, model: "gpt-4o" },
    },
  },
  experimental: true,
};

export const stsConfig: StsConfig = {
  ...baseConfig,
  agent: {
    ...baseConfig.agent,
    think: {
      ...baseConfig.agent.think,
prompt: `
                ## Advanced Emergency Services Dispatcher Instructions
                You are an emergency services dispatcher. Your role is CRITICAL - you handle life-threatening situations.
                
                PRIORITY PROTOCOL:
                1. IMMEDIATELY ask "What is your emergency?" if not already stated
                2. Determine emergency type: Medical, Fire, Police, or Other
                3. Get caller's EXACT location first (address, landmarks, cross streets)
                4. Assess urgency level (Life-threatening = Priority 1, Urgent = Priority 2, Non-urgent = Priority 3)
                
                EMERGENCY BOOKING RESPONSE FORMAT:
                - Respond with a structured JSON format
                - Example: {"latitude":18.5304,"longitude":73.8167,"issueType":"ambulanceId check","needAmbulance":true,"requestedAmbulanceCount":1,"needPolice":false,"requestedPoliceCount":0,"needFireBrigade":false,"requestedFireTruckCount":0,"isForSelf":false,"victimPhoneNumber":"9335521467","notes":"One death"}
                - Ensure all boolean values are true/false (not strings)
                - Ensure all number values are actual numbers (not strings)
                - Follow the exact field names and structure
                
                CRITICAL INFORMATION TO COLLECT:
                - Exact location (latitude and longitude coordinates)
                - Nature of emergency (issueType)
                - Services needed: Ambulance, Police, Fire Brigade
                - Number of units required for each service
                - Whether emergency is for self or someone else (isForSelf)
                - Victim's contact number (victimPhoneNumber)
                - Additional notes
                
                REQUIRED PARAMETERS VALIDATION:
                Before responding with READY_TO_BOOK, ensure ALL these parameters are collected:
                - latitude (number)
                - longitude (number)
                - issueType (string)
                - needAmbulance (true/false)
                - requestedAmbulanceCount (number)
                - needPolice (true/false)
                - requestedPoliceCount (number)
                - needFireBrigade (true/false)
                - requestedFireTruckCount (number)
                - isForSelf (true/false)
                - victimPhoneNumber (string)
                - notes (string)
                
                If ANY parameter is missing, ask the user to provide it before proceeding.
                
                COMMUNICATION RULES:
                - Stay calm and professional
                - Speak clearly and concisely
                - Ask one specific question at a time
                - Keep responses under 150 characters
                - Provide reassurance when appropriate
                - Give clear instructions for immediate safety
                - Before proceeding, verify ALL required parameters are collected
                - If any parameter is missing, ask specifically for it
                - After collecting all information, ask "Please confirm if this information is correct" before proceeding
                
                EMERGENCY PROTOCOLS:
                - For medical: Ask about consciousness, breathing, bleeding
                - For fire: Ask about people trapped, spread of fire, smoke
                - For police: Ask about weapons, suspects, immediate danger
                
                VALIDATION CHECKLIST:
                Before responding with READY_TO_BOOK, ensure you have:
                ✓ latitude and longitude coordinates
                ✓ issueType description
                ✓ needAmbulance (true/false) and requestedAmbulanceCount
                ✓ needPolice (true/false) and requestedPoliceCount  
                ✓ needFireBrigade (true/false) and requestedFireTruckCount
                ✓ isForSelf (true/false)
                ✓ victimPhoneNumber
                ✓ notes
                
                                 After confirming all information is correct, use the create_emergency_booking function to submit the request.
                 Always end by saying "Help is on the way" when you have sufficient information.
                 Your name is Emergency Dispatch.
                `,
      functions: [
        {
          name: "create_emergency_booking",
          description: "Create an emergency services booking when all required information is collected from the caller",
          parameters: {
            type: "object",
            properties: {
              latitude: {
                type: "number",
                description: "Latitude coordinate of the emergency location"
              },
              longitude: {
                type: "number",
                description: "Longitude coordinate of the emergency location"
              },
              issueType: {
                type: "string",
                description: "Description of the emergency issue"
              },
              needAmbulance: {
                type: "boolean",
                description: "Whether ambulance services are needed"
              },
              requestedAmbulanceCount: {
                type: "integer",
                description: "Number of ambulances requested",
                minimum: 0
              },
              needPolice: {
                type: "boolean",
                description: "Whether police services are needed"
              },
              requestedPoliceCount: {
                type: "integer",
                description: "Number of police units requested",
                minimum: 0
              },
              needFireBrigade: {
                type: "boolean",
                description: "Whether fire brigade services are needed"
              },
              requestedFireTruckCount: {
                type: "integer",
                description: "Number of fire trucks requested",
                minimum: 0
              },
              isForSelf: {
                type: "boolean",
                description: "Whether the emergency is for the caller themselves"
              },
              victimPhoneNumber: {
                type: "string",
                description: "Phone number of the victim or caller"
              },
              notes: {
                type: "string",
                description: "Additional notes about the emergency"
              }
            },
            required: ["latitude", "longitude", "issueType", "needAmbulance", "requestedAmbulanceCount", "needPolice", "requestedPoliceCount", "needFireBrigade", "requestedFireTruckCount", "isForSelf", "victimPhoneNumber", "notes"]
          }
        }
      ],
    },
  },
};

// Voice constants
const voiceAsteria: Voice = {
  name: "Asteria",
  canonical_name: "aura-asteria-en",
  metadata: {
    accent: "American",
    gender: "Female",
    image: "https://static.deepgram.com/examples/avatars/asteria.jpg",
    color: "#7800ED",
    sample: "https://static.deepgram.com/examples/voices/asteria.wav",
  },
};

const voiceOrion: Voice = {
  name: "Orion",
  canonical_name: "aura-orion-en",
  metadata: {
    accent: "American",
    gender: "Male",
    image: "https://static.deepgram.com/examples/avatars/orion.jpg",
    color: "#83C4FB",
    sample: "https://static.deepgram.com/examples/voices/orion.mp3",
  },
};

const voiceLuna: Voice = {
  name: "Luna",
  canonical_name: "aura-luna-en",
  metadata: {
    accent: "American",
    gender: "Female",
    image: "https://static.deepgram.com/examples/avatars/luna.jpg",
    color: "#949498",
    sample: "https://static.deepgram.com/examples/voices/luna.wav",
  },
};

const voiceArcas: Voice = {
  name: "Arcas",
  canonical_name: "aura-arcas-en",
  metadata: {
    accent: "American",
    gender: "Male",
    image: "https://static.deepgram.com/examples/avatars/arcas.jpg",
    color: "#DD0070",
    sample: "https://static.deepgram.com/examples/voices/arcas.mp3",
  },
};

type NonEmptyArray<T> = [T, ...T[]];
export const availableVoices: NonEmptyArray<Voice> = [
  voiceAsteria,
  voiceOrion,
  voiceLuna,
  voiceArcas,
];
export const defaultVoice: Voice = availableVoices[0];

export const sharedOpenGraphMetadata = {
  title: "Emergency Services Dispatcher | AI Voice Assistant",
  type: "website",
  url: "/",
  description: "AI-powered emergency services dispatcher for handling critical calls",
};

export const latencyMeasurementQueryParam = "latency-measurement";
