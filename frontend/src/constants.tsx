
export const SYSTEM_INSTRUCTION = `You are the CommSage 2.0, an expert Communication Skills Coach based strictly on the "Communicate With Confidence" methodology by Aleena Rais. Your mission is to help the user speak with clarity, power, and impact.

### CORE PHILOSOPHY & MINDSET:
1. **The Power to Change:** Reject innate skills. View every conversation as a practice ground.
2. **Words Forge Reality:** NEVER allow the user to label themselves "stressed," "nervous," or "overwhelmed." Correct them immediately: shift from "I am stressed" to "I am juggling many priorities."
3. **Purpose-Driven:** In conflicts, enforce a "problem-solving" approach over "blaming."

### STRICT COMMUNICATION RULES:
- **BAN "How are you?":** This question is prohibited. It elicits robotic responses. If the user asks it, or asks for small talk advice, prompt them to use specific inquiries like, "What are you looking forward to this weekend?".
- **BAN "Why" in Conflicts:** Replace "Why" (which implies judgment) with "What" (which is objective).
  - *Incorrect:* "Why did you do this?"
  - *Correct:* "What were your reasons for choosing this approach?"
- **BE A WELL, NOT A WATERFALL:** Share information precisely when asked. Do not overwhelm with unrequested details.
- **VALIDATE BEFORE CONCERN:** Do not say "No, this won't work." Enforce the rule: Acknowledge the point ("I understand your point about speed...") before introducing a counter-perspective.
- **SEPARATE PERSON FROM PROBLEM:** Ban character labels and frequency adverbs like "always" (e.g., "You are always late"). Use observations: "I noticed the report was late twice this week."
- **STRATEGIC PAUSES:** Instruct the user to use 1-2 second pauses to add gravity and "mystery" to their points.
- **GRACEFUL FEEDBACK:** Teach the user to respond to criticism with: "That is an insightful point, thank you. I will consider what you said."

### ASSESSMENT & DRILL PROTOCOLS:
Analyze user responses against these 18 strategies. If a user fails to acknowledge before responding or uses a "Why" question, provide immediate corrective feedback.

[METRICS_START]
{
  "session_id": "{{sessionId}}",
  "timestamp": "{{timestamp}}",
  "data": {
    "metrics": {
      "clarity": 0-100,
      "methodology_adherence": 0-100,
      "tone": "Confident|Well-like|Empathetic|Assertive",
      "valence": -1.0 to 1.0,
      "strategy_used": "string (e.g., 'Acknowledge Before Response')",
      "hesitation_index": 0-10
    },
    "feedback": {
      "strength": "string",
      "methodology_gap": "string",
      "drill_result": "pass|fail|needs_review"
    }
  }
}
[METRICS_END]

### PERSONA:
Direct, high-standard, and focused on behavioral linguistics. You are a coach, not a friend. Correct linguistic flaws the moment they appear.`;

export const ASSESSMENT_QUESTIONS = [
  // WEEK 1: THE FOUNDATION (Days 1–7)
  "Day 1, Protocol 1: Do you believe communication is a talent you're born with, or a skill you can fix? Let's identify one specific flaw to work on.",
  "Day 1, Protocol 2: 'Words Forge Reality'. Instead of saying you are 'nervous' about a situation, how else can you describe your state using objective language?",
  "Day 2, Protocol 3: Purpose-Driven: What is the single most important goal you want to achieve in your next conversation?",
  "Day 2, Protocol 4: Rejection of Labels: Think of a time you labeled yourself 'shy'. How would you describe that behavior without using a character trait?",

  "Day 3, Protocol 5: Small Talk Ban: Give me an alternative to 'How are you?' that focuses on a specific forward-looking event.",
  "Day 3, Protocol 6: Intentional Curiosity: Practice asking a 'What' question about my morning that doesn't feel like an interrogation.",
  "Day 4, Protocol 7: The Rule of Three: Describe your current professional role in exactly three concise sentences.",
  "Day 4, Protocol 8: Information Diet: You are explaining a complex idea. How do you decide when to stop sharing and start listening?",
  "Day 5, Protocol 9: Mental Rehearsal: Visualize a high-stakes meeting. What is the first sentence you will say to establish presence?",
  "Day 5, Protocol 10: Energy Mapping: Rate your current energy level (1-10). How will you adjust your vocal pitch to match or raise the vibe of the room?",
  "Day 6, Protocol 11: The Power of Pause: Tell me a fact about yourself, but insert a 2-second 'Mystery Pause' right before the key word.",
  "Day 6, Protocol 12: Eliminating Fillers: Speak for 30 seconds about your passion without using 'um', 'uh', or 'like'.",
  "Day 7, Protocol 13: Milestone Review: Looking back at Week 1, which 'Word Forge' (banned word) was the hardest to eliminate?",
  "Day 7, Protocol 14: Week 1 Integration: Describe how your perception of 'difficult conversations' has shifted this week.",

  // WEEK 2: COMMAND & INFLUENCE (Days 8-14)
  "Day 8, Protocol 15: Being a Well, Not a Waterfall: If someone asks 'What do you do?', practice giving a 10-word answer that invites a follow-up.",
  "Day 8, Protocol 16: Strategic Brevity: Explain why clarity matters more than complexity using only one sentence.",
  "Day 9, Protocol 17: Establishing Authority: Use a 'Descending Inflection' (lowering pitch at the end of a sentence) to state your name and role.",
  "Day 9, Protocol 18: Body Language Mirroring: How do you adjust your posture in a video call to convey both authority and warmth?",
  "Day 10, Protocol 19: The 'What' Initiative: I'm going to act as a confused teammate. Ask me a 'What' question to clarify my confusion without sounding blaming.",
  "Day 10, Protocol 20: Objective Observation: Describe a mistake you saw recently using only facts, zero adjectives.",
  "Day 11, Protocol 21: Vocal Range Exploration: Say 'I am ready for this' in three different pitches (Low, Medium, High). Which feels most natural?",
  "Day 11, Protocol 22: Pacing for Impact: Speak about your favorite hobby, slowing down to 100 words per minute. Start now.",
  "Day 12, Protocol 23: The Art of Validation: I'm going to disagree with you. Practice validating my intent before you offer your perspective.",
  "Day 12, Protocol 24: Acknowledgment Drills: Respond to this: 'I think we are moving too fast.' (Start with 'I understand...')",
  "Day 13, Protocol 25: Handling Interruptions: How do you gracefully reclaim the floor when someone cuts you off mid-sentence?",
  "Day 13, Protocol 26: Navigating Silence: If a meeting goes silent, what is your 'Bridge Question' to restart the flow?",
  "Day 14, Protocol 27: Week 2 Reflection: Which strategy from this week made you feel most empowered?",
  "Day 14, Protocol 28: Influence Check: Give an example of a time this week you influenced someone by listening more than talking.",

  // WEEK 3: NAVIGATING CHALLENGES (Days 15-21)
  "Day 15, Protocol 29: Separating Person from Problem: Address a 'late report' issue without using the word 'You'.",
  "Day 15, Protocol 30: Positive Intent Assignment: Think of someone you dislike. What is one positive motivation for their behavior?",
  "Day 16, Protocol 31: The 'Graceful Response' to Criticism: Practice: 'That is an insightful point, thank you. I will consider what you said.'",
  "Day 16, Protocol 32: De-escalation Phrases: Give me a phrase you can use to cool down a heated debate.",
  "Day 17, Protocol 33: Unraveling vs. Battling: In a conflict, how do you signal that you are on the same side as the other person?",
  "Day 17, Protocol 34: Strategic Vulnerability: Share a small mistake you made recently. How did it help you build trust?",
  "Day 18, Protocol 35: Asking for Help (Power vs. Weakness): Practice asking for support in a way that sounds like a strategic request, not a plea.",
  "Day 18, Protocol 36: No as a Complete Sentence: Practice saying 'No' to a request firmly but without over-explaining your reasons.",
  "Day 19, Protocol 37: Managing High-Status Individuals: How do you maintain your 'Internal Status' when speaking to an executive?",
  "Day 19, Protocol 38: Eye Contact in Digital Space: Describe your technique for maintaining 'virtual' eye contact while reading notes.",
  "Day 20, Protocol 39: The 'Bridge of Empathy': Use the phrase 'I can see how that would lead you to...' in a mock response to me.",
  "Day 20, Protocol 40: Tone Matching: I'll speak in an 'Analytical' tone. Respond to me by matching that tone for 1 minute.",
  "Day 21, Protocol 41: Week 3 Synthesis: How did you handle a mini-conflict this week using a 30-day strategy?",
  "Day 21, Protocol 42: Resilience Check: On a scale of 1-10, how well did you manage your linguistic stressors this week?",

  // WEEK 4: MASTERY PROTOCOL (Days 22-30)
  "Day 22, Protocol 43: Advanced Storytelling: Use the 'Problem-Action-Result' framework to describe a recent win in 45 seconds.",
  "Day 22, Protocol 44: Painting with Words: Describe your vision for the future of your career using vivid, sensory language.",
  "Day 23, Protocol 45: The Persuasion Formula: Tell me why I should hire you for a project using 'Benefit -> Evidence -> Call to Action'.",
  "Day 23, Protocol 46: High-Stakes Presence: You have 10 seconds to impress a board group. What is your 'Hook'?",
  "Day 24, Protocol 47: Strategic Silence Mastery: Ask me a difficult question and then DO NOT speak until I answer. Ready?",
  "Day 24, Protocol 48: Active Listening (Levels 1-3): I will tell you a story. You must summarize the 'unspoken emotion' behind it.",
  "Day 25, Protocol 49: The 'Elegant Exit': Practice ending a 1:1 conversation in a way that leaves the other person feeling valued.",
  "Day 25, Protocol 50: Influence without Authority: How do you lead a peer group session using only questions?",
  "Day 26, Protocol 51: Mental Agility Drill: I'll give you a random word. Speak about its connection to communication for 30 seconds.",
  "Day 26, Protocol 52: Humor and Gravitas: How do you use a light joke to break the ice without losing your professional authority?",
  "Day 27, Protocol 53: Charisma Mapping: Which archetypal trait (Clarity, Power, or Warmth) is your natural superpower?",
  "Day 27, Protocol 54: Shadow Profiling: Which trait do you hide when you are under pressure? How can we flip it into a strength?",
  "Day 28, Protocol 55: The 30-Day Transformation Pitch: Explain to a stranger how your communication has improved since Day 1.",
  "Day 28, Protocol 56: Legacy Language: What is the one phrase you want people to associate with your leadership?",
  "Day 29, Protocol 57: Final Drill - Conflict De-escalation: I'm furious about a delay. Use everything you've learned to calm me down.",
  "Day 29, Protocol 58: Final Drill - The Power Speech: Give a 60-second 'Manifesto' of your communication philosophy.",
  "Day 30, Protocol 59: Ultimate DNA Lock: Looking back at 60 steps, which specific protocol changed your behavior the most?",
  "Day 30, Protocol 60: Mastery Graduation: Your Communication DNA is now mapped. Are you ready to lead with impact?"
];
