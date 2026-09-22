const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const { TASK_TYPES } = require('../models/Task');

const GEMINI_ENDPOINT = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const SYSTEM_INSTRUCTION = `
You are the Job Graph planner for SAHYOG FLOW, a cooperative home-services platform.
Given a customer's natural-language service request, decompose it into a structured,
executable set of tasks. Requests can span multiple trades (cleaning, electrical,
plumbing, carpentry, painting, appliance_repair) in a single job.

Rules:
- Break the request into the smallest sensible independently-assignable tasks.
- Each task must have a unique tempId like "t1", "t2", ...
- "type" must be one of: ${TASK_TYPES.join(', ')}. Use "general" if nothing fits.
- "requiredSkills" should be short lowercase tags (e.g. "electrical", "pipe-fitting").
- "estimatedDurationMinutes" should be a realistic integer estimate.
- "dependsOn" is an array of tempIds that must finish before this task can start.
  Leave empty if the task can start immediately. Do not create circular dependencies.
- Respond with ONLY valid JSON, no markdown fences, no commentary, matching this shape:

{
  "jobTitle": "short descriptive title",
  "tasks": [
    {
      "tempId": "t1",
      "type": "electrical",
      "title": "short task title",
      "description": "what the worker needs to do",
      "requiredSkills": ["electrical"],
      "estimatedDurationMinutes": 60,
      "dependsOn": []
    }
  ]
}
`;

function stripCodeFences(text) {
  return text.replace(/```json/gi, '').replace(/```/g, '').trim();
}

async function generateJobGraph(rawRequestText) {
  if (!env.geminiApiKey) {
    throw new ApiError(500, 'GEMINI_API_KEY is not configured on the server');
  }

  const url = `${GEMINI_ENDPOINT(env.geminiModel)}?key=${env.geminiApiKey}`;

  const body = {
    contents: [
      { role: 'user', parts: [{ text: `${SYSTEM_INSTRUCTION}\n\nCustomer request:\n"""${rawRequestText}"""` }] },
    ],
    generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
  };

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    logger.error(`Gemini network error: ${err.message}`);
    throw new ApiError(502, 'Failed to reach AI service');
  }

  if (!response.ok) {
    const errText = await response.text();
    logger.error(`Gemini API error [${response.status}]: ${errText}`);
    throw new ApiError(502, 'AI service returned an error');
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new ApiError(502, 'AI service returned an empty response');

  let parsed;
  try {
    parsed = JSON.parse(stripCodeFences(rawText));
  } catch (err) {
    logger.error(`Failed to parse Gemini JSON: ${rawText}`);
    throw new ApiError(502, 'AI service returned malformed data');
  }

  if (!parsed.tasks || !Array.isArray(parsed.tasks) || parsed.tasks.length === 0) {
    throw new ApiError(502, 'AI service did not return any tasks');
  }

  parsed.tasks = parsed.tasks.map((t) => ({
    ...t,
    type: TASK_TYPES.includes(t.type) ? t.type : 'general',
    dependsOn: Array.isArray(t.dependsOn) ? t.dependsOn : [],
    requiredSkills: Array.isArray(t.requiredSkills) ? t.requiredSkills : [],
  }));

  return parsed;
}

module.exports = { generateJobGraph };