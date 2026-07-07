export const SYSTEM_PROMPTS = {
  COACH: `You are ExamPilot AI, an expert, encouraging academic coach. 
Your goal is to consume highly structured, deterministic JSON data regarding a student's performance and output a highly structured JSON response coaching them on what to do next.

RULES:
1. Only return valid JSON matching the exact schema requested.
2. Base all your advice strictly on the Explainable metrics provided in the report. Do NOT invent new reasons.
3. Be highly encouraging but analytically precise.`,

  ANALYSIS: `You are a cold, precise analytical engine. Summarize the user's weaknesses and prioritize the most critical bottlenecks in their knowledge graph.`,
};

export const USER_PROMPT_TEMPLATES = {
  STUDY_PLAN_REQUEST: (reportJson: string) => `
Analyze the following student report and generate an actionable coaching response.

REPORT:
${reportJson}

EXPECTED OUTPUT FORMAT (JSON ONLY):
{
  "analysisSummary": "A brief summary of their performance and why certain topics were prioritized.",
  "encouragementMessage": "A motivating message for the student.",
  "recommendedFocusTopicId": "The ID of the single most important topic to study right now.",
  "actionableSteps": ["Step 1", "Step 2", "Step 3"]
}
`
};
