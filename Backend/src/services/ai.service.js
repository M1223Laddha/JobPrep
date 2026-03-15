// const { GoogleGenAI } = require("@google/genai");
// const z = require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema");
// const puppeteer = require("puppeteer");

// // creating the instance of GoogleGenAI
// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_GENAI_API_KEY,
// });

// // this is what we want ai to return us based on the resume || selfDescription , jobDescription
// const interviewReportSchema = z.object({
//   matchScore: z
//     .number()
//     .describe(
//       "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
//     ),
//   technicalQuestions: z
//     .array(
//       z.object({
//         question: z
//           .string()
//           .describe("The technical question can be asked in the interview"),
//         intention: z
//           .string()
//           .describe("The intention of interviewer behind asking this question"),
//         answer: z
//           .string()
//           .describe(
//             "How to answer this question, what points to cover, what approach to take etc.",
//           ),
//       }),
//     )
//     .describe(
//       "Technical questions that can be asked in the interview along with their intention and how to answer them",
//     ),
//   behavioralQuestions: z
//     .array(
//       z.object({
//         question: z
//           .string()
//           .describe("The technical question can be asked in the interview"),
//         intention: z
//           .string()
//           .describe("The intention of interviewer behind asking this question"),
//         answer: z
//           .string()
//           .describe(
//             "How to answer this question, what points to cover, what approach to take etc.",
//           ),
//       }),
//     )
//     .describe(
//       "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
//     ),
//   skillGaps: z
//     .array(
//       z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z
//           .enum(["low", "medium", "high"])
//           .describe(
//             "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
//           ),
//       }),
//     )
//     .describe(
//       "List of skill gaps in the candidate's profile along with their severity",
//     ),
//   preparationPlan: z
//     .array(
//       z.object({
//         day: z
//           .number()
//           .describe("The day number in the preparation plan, starting from 1"),
//         focus: z
//           .string()
//           .describe(
//             "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
//           ),
//         tasks: z
//           .array(z.string())
//           .describe(
//             "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
//           ),
//       }),
//     )
//     .describe(
//       "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
//     ),
//   title: z
//     .string()
//     .describe(
//       "The title of the job for which the interview report is generated",
//     ),
// });

// async function generateInterviewReport({
//   resume, // inputs
//   selfDescription,
//   jobDescription,
// }) {
//   const prompt = `Generate an interview report for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}
// `;

//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//       responseSchema: zodToJsonSchema(interviewReportSchema),
//     },
//   });

//   return JSON.parse(response.text);
// }

// async function generatePdfFromHtml(htmlContent) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//   const pdfBuffer = await page.pdf({
//     format: "A4",
//     margin: {
//       top: "20mm",
//       bottom: "20mm",
//       left: "15mm",
//       right: "15mm",
//     },
//   });

//   await browser.close();

//   return pdfBuffer;
// }

// async function generateResumePdf({ resume, selfDescription, jobDescription }) {
//   const resumePdfSchema = z.object({
//     html: z
//       .string()
//       .describe(
//         "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
//       ),
//   });

//   const prompt = `Generate resume for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}

//                         the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
//                         The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
//                         The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
//                         you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
//                         The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
//                         The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
//                     `;

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//       responseSchema: zodToJsonSchema(resumePdfSchema),
//     },
//   });

//   const jsonContent = JSON.parse(response.text);

//   // generating the pdf from the puppeteer
//   const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

//   return pdfBuffer;
// }

// module.exports = { generateInterviewReport, generateResumePdf };

// old
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const z = require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema");
// const puppeteer = require("puppeteer");

// // Initialize Google Generative AI with your API Key
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

// /**
//  * HELPER: Strips metadata that causes Gemini to reject the schema.
//  * Required for compatibility with the v1beta endpoint.
//  */
// const getCleanSchema = (zodSchema) => {
//   const schema = zodToJsonSchema(zodSchema);
//   delete schema.$schema;
//   return schema;
// };

// // --- ZOD SCHEMAS ---
// // These match your Mongoose Model exactly to ensure validation passes.

// const interviewReportSchema = z.object({
//   matchScore: z.number(),
//   title: z.string(),
//   technicalQuestions: z.array(
//     z.object({
//       question: z.string(),
//       intention: z.string(),
//       answer: z.string(),
//     }),
//   ),
//   behavioralQuestions: z.array(
//     z.object({
//       question: z.string(),
//       intention: z.string(),
//       answer: z.string(),
//     }),
//   ),
//   skillGaps: z.array(
//     z.object({
//       skill: z.string(),
//       severity: z.enum(["low", "medium", "high"]),
//     }),
//   ),
//   preparationPlan: z.array(
//     z.object({
//       day: z.number(),
//       focus: z.string(),
//       tasks: z.array(z.string()),
//     }),
//   ),
// });

// const resumePdfSchema = z.object({
//   html: z.string(),
// });

// // --- CORE FUNCTIONS ---

// /**
//  * Generates a structured Interview Report with Deep Parsing logic
//  * to fix stringified JSON objects in arrays.
//  */
// async function generateInterviewReport({
//   resume,
//   selfDescription,
//   jobDescription,
// }) {
//   // Using gemini-1.5-flash-002 for better structured output support.
//   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//   const prompt = `
//     Act as a Senior Technical Recruiter. Based on the provided Resume, Bio, and Job Description, generate a highly structured Interview Report.

//     RESUME: ${resume}
//     BIO: ${selfDescription}
//     JOB: ${jobDescription}

//     STRICT REQUIREMENT: You must return a JSON object where every array item is an OBJECT, not a string.
//     Follow this exact structure:
//     {
//       "matchScore": 85,
//       "title": "Job Title",
//       "technicalQuestions": [
//         { "question": "The question text", "intention": "Why ask this?", "answer": "The ideal answer" }
//       ],
//       "behavioralQuestions": [
//         { "question": "The question text", "intention": "Soft skill tested", "answer": "STAR method guide" }
//       ],
//       "skillGaps": [
//         { "skill": "Name of skill", "severity": "high" }
//       ],
//       "preparationPlan": [
//         { "day": 1, "focus": "Topic", "tasks": ["Task 1", "Task 2"] }
//       ]
//     }

//     Do not return plain strings in any array.
//   `;

//   const result = await model.generateContent({
//     contents: [{ role: "user", parts: [{ text: prompt }] }],
//     generationConfig: {
//       responseMimeType: "application/json",
//       responseSchema: getCleanSchema(interviewReportSchema),
//     },
//   });

//   let responseText = result.response.text();
//   // Clean potential markdown artifacts.
//   responseText = responseText
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//   try {
//     const rawData = JSON.parse(responseText);

//     /**
//      * DEEP PARSE HELPER:
//      * If the AI returns a stringified object inside an array,
//      * this extracts the real data to prevent UI/Mongoose crashes.
//      */
//     const safeExtract = (item, field, fallback = "") => {
//       if (typeof item === "object" && item !== null && item[field])
//         return item[field];
//       try {
//         if (typeof item === "string" && item.trim().startsWith("{")) {
//           const parsed = JSON.parse(item);
//           return parsed[field] || fallback;
//         }
//       } catch (e) {
//         /* silent catch */
//       }
//       return typeof item === "string" ? item : fallback;
//     };

//     // Construct the final object for Mongoose.
//     return {
//       matchScore: rawData.matchScore || 0,
//       title: rawData.title || "Interview Report",
//       technicalQuestions: (rawData.technicalQuestions || []).map((q) => ({
//         question: safeExtract(q, "question"),
//         intention: safeExtract(q, "intention", "Assess technical depth"),
//         answer: safeExtract(q, "answer", "Consult documentation"),
//       })),
//       behavioralQuestions: (rawData.behavioralQuestions || []).map((q) => ({
//         question: safeExtract(q, "question"),
//         intention: safeExtract(q, "intention", "Assess soft skills"),
//         answer: safeExtract(q, "answer", "Use STAR method"),
//       })),
//       skillGaps: (rawData.skillGaps || []).map((s) => ({
//         skill: safeExtract(s, "skill"),
//         severity: (safeExtract(s, "severity") || "medium").toLowerCase(),
//       })),
//       preparationPlan: (rawData.preparationPlan || []).map((p) => ({
//         day: p.day || 1,
//         focus: safeExtract(p, "focus", "General Prep"),
//         tasks: Array.isArray(p.tasks) ? p.tasks : [String(p)],
//       })),
//     };
//   } catch (error) {
//     console.error("Critical Parse Error:", responseText);
//     throw new Error("AI returned invalid data structure.");
//   }
// }

// /**
//  * Internal helper to convert HTML to PDF using Puppeteer.
//  */
// async function generatePdfFromHtml(htmlContent) {
//   const browser = await puppeteer.launch({
//     headless: "new",
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });
//   const page = await browser.newPage();
//   await page.setContent(htmlContent, { waitUntil: "networkidle0" });
//   const pdfBuffer = await page.pdf({
//     format: "A4",
//     printBackground: true,
//     margin: { top: "15mm", bottom: "15mm", left: "10mm", right: "10mm" },
//   });
//   await browser.close();
//   return pdfBuffer;
// }

// /**
//  * Generates a tailored Resume PDF.
//  */
// async function generateResumePdf({ resume, selfDescription, jobDescription }) {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });

//   const prompt = `Generate a modern, professional resume in HTML format tailored to the job.
//   Resume: ${resume}, Bio: ${selfDescription}, Job: ${jobDescription}.
//   Return only JSON with the "html" key.`;

//   const result = await model.generateContent({
//     contents: [{ role: "user", parts: [{ text: prompt }] }],
//     generationConfig: {
//       responseMimeType: "application/json",
//       responseSchema: getCleanSchema(resumePdfSchema),
//     },
//   });

//   const jsonContent = JSON.parse(
//     result.response
//       .text()
//       .replace(/```json/g, "")
//       .replace(/```/g, ""),
//   );
//   return await generatePdfFromHtml(jsonContent.html);
// }

// module.exports = { generateInterviewReport, generateResumePdf };

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const z = require("zod");
// const { zodToJsonSchema } = require("zod-to-json-schema");
// const puppeteer = require("puppeteer");

// // Initialize Google Generative AI
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

// /**
//  * HELPER: Strips metadata that causes Gemini to reject the schema.
//  */
// const getCleanSchema = (zodSchema) => {
//   const schema = zodToJsonSchema(zodSchema);
//   delete schema.$schema;
//   return schema;
// };

// /**
//  * HELPER: Safely converts a value to an array.
//  * Handles: actual arrays, objects with numeric keys, null/undefined.
//  */
// const toArray = (value) => {
//   if (!value) return [];
//   if (Array.isArray(value)) return value;
//   if (typeof value === "object") return Object.values(value);
//   return [];
// };

// // --- ZOD SCHEMAS ---
// const interviewReportSchema = z.object({
//   matchScore: z.number(),
//   title: z.string(),
//   technicalQuestions: z.array(
//     z.object({
//       question: z.string(),
//       intention: z.string(),
//       answer: z.string(),
//     }),
//   ),
//   behavioralQuestions: z.array(
//     z.object({
//       question: z.string(),
//       intention: z.string(),
//       answer: z.string(),
//     }),
//   ),
//   skillGaps: z.array(
//     z.object({
//       skill: z.string(),
//       severity: z.enum(["low", "medium", "high"]),
//     }),
//   ),
//   preparationPlan: z.array(
//     z.object({
//       day: z.number(),
//       focus: z.string(),
//       tasks: z.array(z.string()),
//     }),
//   ),
// });

// const resumePdfSchema = z.object({
//   html: z.string(),
// });

// // --- CORE FUNCTIONS ---

// /**
//  * Generates an Interview Report with high reliability parsing.
//  */
// async function generateInterviewReport({
//   resume,
//   selfDescription,
//   jobDescription,
// }) {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash",
//     systemInstruction:
//       "You are a Senior Technical Recruiter. You only communicate in valid JSON. Never include markdown backticks (```json) or conversational filler.",
//   });

//   const prompt = `
// ### ROLE
// Elite Technical Hiring Manager

// ### TASK
// Perform a deep analysis between the Candidate and the Job Description.

// ### INPUT DATA
// - Resume: ${resume}
// - Bio: ${selfDescription}
// - Job Description: ${jobDescription}

// ### RULES
// 1. Calculate matchScore (0-100).
// 2. Create technical/behavioral questions.
// 3. Identify skillGaps. CRITICAL: severity must be exactly "low", "medium", or "high" (lowercase).
// 4. Create a 5-day preparationPlan.
// 5. IMPORTANT: All arrays (technicalQuestions, behavioralQuestions, skillGaps, preparationPlan, tasks) must be valid JSON arrays using square brackets [], NOT objects.

// ### OUTPUT JSON SCHEMA
// ${JSON.stringify(getCleanSchema(interviewReportSchema), null, 2)}
// `;

//   try {
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const rawText = response.text().trim();

//     // Extract everything between the first '{' and the last '}'
//     const jsonMatch = rawText.match(/\{[\s\S]*\}/);
//     if (!jsonMatch) {
//       console.error("No JSON block found in AI response:", rawText);
//       throw new Error("AI response did not contain valid JSON");
//     }

//     const cleanJson = jsonMatch[0];
//     const data = JSON.parse(cleanJson);

//     // --- DATA NORMALIZATION ---
//     return {
//       title: data.title || "Technical Role",
//       matchScore: Number(data.matchScore) || 0,

//       technicalQuestions: toArray(data.technicalQuestions).map((q) => ({
//         question: q.question || "Technical inquiry",
//         intention: q.intention || "Assess skill depth",
//         answer: q.answer || "Consult official documentation",
//       })),

//       behavioralQuestions: toArray(data.behavioralQuestions).map((q) => ({
//         question: q.question || "Behavioral inquiry",
//         intention: q.intention || "Assess cultural fit",
//         answer: q.answer || "Use the STAR method",
//       })),

//       skillGaps: toArray(data.skillGaps).map((s) => ({
//         skill: s.skill || "Skill",
//         severity: String(s.severity || "medium").toLowerCase(),
//       })),

//       preparationPlan: toArray(data.preparationPlan).map((p) => ({
//         day: Number(p.day) || 1,
//         focus: p.focus || "General Preparation",
//         tasks: Array.isArray(p.tasks) ? p.tasks : toArray(p.tasks),
//       })),
//     };
//   } catch (error) {
//     console.error("Critical AI Parsing Error:", error.message);
//     throw new Error("AI failed to return structured data.");
//   }
// }

// /**
//  * Internal helper to convert HTML to PDF using Puppeteer.
//  */
// async function generatePdfFromHtml(htmlContent) {
//   const browser = await puppeteer.launch({
//     headless: "new",
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });
//   try {
//     const page = await browser.newPage();
//     const styledHtml = `
//       <html>
//         <head>
//           <style>
//             body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; }
//             h1 { color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 10px; }
//             h2 { color: #5f6368; margin-top: 20px; text-transform: uppercase; font-size: 14px; border-bottom: 1px solid #eee; }
//             p, li { font-size: 12px; line-height: 1.6; }
//             .contact { text-align: center; margin-bottom: 20px; font-style: italic; }
//           </style>
//         </head>
//         <body>${htmlContent}</body>
//       </html>
//     `;
//     await page.setContent(styledHtml, { waitUntil: "networkidle0" });
//     return await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
//     });
//   } finally {
//     await browser.close();
//   }
// }

// /**
//  * Generates a tailored Resume PDF.
//  */
// async function generateResumePdf({ resume, selfDescription, jobDescription }) {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const prompt = `
//     Create a professional, modern resume in HTML format.
//     Tailor it specifically for: ${jobDescription}.
//     Base it on: ${resume} and ${selfDescription}.
//     Return ONLY a JSON object: { "html": "Full HTML string here" }.
//   `;

//   try {
//     const result = await model.generateContent({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//       generationConfig: {
//         responseMimeType: "application/json",
//         responseSchema: getCleanSchema(resumePdfSchema),
//       },
//     });

//     const text = result.response.text();
//     const jsonMatch = text.match(/\{[\s\S]*\}/);
//     const jsonContent = JSON.parse(jsonMatch[0]);

//     return await generatePdfFromHtml(jsonContent.html);
//   } catch (error) {
//     console.error("Resume Generation Error:", error);
//     throw new Error("Failed to generate Resume PDF.");
//   }
// }

// module.exports = { generateInterviewReport, generateResumePdf };

// working
const { GoogleGenerativeAI } = require("@google/generative-ai");
const z = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

/**
 * HELPER: Strips metadata that causes Gemini to reject the schema.
 */
const getCleanSchema = (zodSchema) => {
  const schema = zodToJsonSchema(zodSchema);
  delete schema.$schema;
  return schema;
};

/**
 * HELPER: Safely converts a value to an array.
 * Handles: actual arrays, objects with numeric keys, null/undefined.
 */
const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return Object.values(value);
  return [];
};

// --- ZOD SCHEMAS ---
const interviewReportSchema = z.object({
  matchScore: z.number(),
  title: z.string(),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    }),
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    }),
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    }),
  ),
});

const resumePdfSchema = z.object({
  html: z.string(),
});

// --- CORE FUNCTIONS ---

/**
 * Generates an Interview Report with high reliability parsing.
 */
async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      "You are a Senior Technical Recruiter. You only communicate in valid JSON. Never include markdown backticks (```json) or conversational filler. Always use exact field names: question, intention, answer, skill, severity, day, focus, tasks.",
  });

  const prompt = `
### ROLE
Elite Technical Hiring Manager

### TASK
Perform a deep analysis between the Candidate and the Job Description.

### INPUT DATA
- Resume: ${resume}
- Bio: ${selfDescription}
- Job Description: ${jobDescription}

### RULES
1. Calculate matchScore (0-100).
2. Create technical/behavioral questions. Each must have: "question", "intention", "answer" fields.
3. Identify skillGaps. CRITICAL: severity must be exactly "low", "medium", or "high" (lowercase).
4. Create a 5-day preparationPlan. Each day must have: "day", "focus", "tasks" fields.
5. IMPORTANT: All arrays (technicalQuestions, behavioralQuestions, skillGaps, preparationPlan, tasks) must be valid JSON arrays using square brackets [], NOT objects.
6. CRITICAL: Use exact lowercase field names — never use modelAnswer, suggestedAnswer, or any variation. Only use "answer".

### OUTPUT JSON SCHEMA
${JSON.stringify(getCleanSchema(interviewReportSchema), null, 2)}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();

    // Extract everything between the first '{' and the last '}'
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON block found in AI response:", rawText);
      throw new Error("AI response did not contain valid JSON");
    }

    const cleanJson = jsonMatch[0];
    const data = JSON.parse(cleanJson);

    // DEBUG: Log first question to verify field names (remove after confirming)
    console.log(
      "DEBUG first technicalQuestion:",
      JSON.stringify(data.technicalQuestions?.[0], null, 2),
    );

    // --- DATA NORMALIZATION ---
    return {
      title: data.title || "Technical Role",
      matchScore: Number(data.matchScore) || 0,

      technicalQuestions: toArray(data.technicalQuestions).map((q) => ({
        question: q.question || q.Question || "",
        intention: q.intention || q.Intention || q.purpose || "",
        answer:
          q.answer ||
          q.Answer ||
          q.modelAnswer ||
          q.model_answer ||
          q.suggestedAnswer ||
          "",
      })),

      behavioralQuestions: toArray(data.behavioralQuestions).map((q) => ({
        question: q.question || q.Question || "",
        intention: q.intention || q.Intention || q.purpose || "",
        answer:
          q.answer ||
          q.Answer ||
          q.modelAnswer ||
          q.model_answer ||
          q.suggestedAnswer ||
          "",
      })),

      skillGaps: toArray(data.skillGaps).map((s) => ({
        skill: s.skill || s.Skill || "",
        severity: String(s.severity || s.Severity || "medium").toLowerCase(),
      })),

      preparationPlan: toArray(data.preparationPlan).map((p) => ({
        day: Number(p.day || p.Day) || 1,
        focus: p.focus || p.Focus || p.topic || "",
        tasks: Array.isArray(p.tasks)
          ? p.tasks
          : toArray(p.tasks || p.Tasks || p.activities),
      })),
    };
  } catch (error) {
    console.error("Critical AI Parsing Error:", error.message);
    throw new Error("AI failed to return structured data.");
  }
}

/**
 * Internal helper to convert HTML to PDF using Puppeteer.
 */
// async function generatePdfFromHtml(htmlContent) {
//   const browser = await puppeteer.launch({
//     headless: "new",
//     args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   });
//   try {
//     const page = await browser.newPage();
//     const styledHtml = `
//       <html>
//         <head>
//           <style>
//             body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; }
//             h1 { color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 10px; }
//             h2 { color: #5f6368; margin-top: 20px; text-transform: uppercase; font-size: 14px; border-bottom: 1px solid #eee; }
//             p, li { font-size: 12px; line-height: 1.6; }
//             .contact { text-align: center; margin-bottom: 20px; font-style: italic; }
//           </style>
//         </head>
//         <body>${htmlContent}</body>
//       </html>
//     `;
//     await page.setContent(styledHtml, { waitUntil: "networkidle0" });
//     return await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
//     });
//   } finally {
//     await browser.close();
//   }
// }

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    const styledHtml = `
      <html>
        <head>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: 'Arial', sans-serif;
              font-size: 11px;
              line-height: 1.3;
              color: #000;
              margin: 0;
              padding: 12px 16px;
              width: 794px;
            }
            h1 { font-size: 16px; margin: 0 0 2px; }
            h2 { font-size: 13px; margin: 6px 0 2px; border-bottom: 1px solid #000; }
            p, li { font-size: 11px; margin: 1px 0; }
            ul { margin: 2px 0 2px 16px; padding: 0; }
            hr { margin: 4px 0; border: none; border-top: 1px solid #ccc; }
          </style>
        </head>
        <body>${htmlContent}</body>
      </html>
    `;
    await page.setContent(styledHtml, { waitUntil: "networkidle0" });
    return await page.pdf({
      format: "A4",
      printBackground: false,
      margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
    });
  } finally {
    await browser.close();
  }
}

/**
 * Generates a tailored Resume PDF.
 */
// async function generateResumePdf({ resume, selfDescription, jobDescription }) {
//   const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//   const prompt = `
//     Create a professional, modern resume in HTML format.
//     Tailor it specifically for: ${jobDescription}.
//     Base it on: ${resume} and ${selfDescription}.
//     Return ONLY a JSON object: { "html": "Full HTML string here" }.
//   `;

//   try {
//     const result = await model.generateContent({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//       generationConfig: {
//         responseMimeType: "application/json",
//         responseSchema: getCleanSchema(resumePdfSchema),
//       },
//     });

//     const text = result.response.text();
//     const jsonMatch = text.match(/\{[\s\S]*\}/);
//     const jsonContent = JSON.parse(jsonMatch[0]);

//     return await generatePdfFromHtml(jsonContent.html);
//   } catch (error) {
//     console.error("Resume Generation Error:", error);
//     throw new Error("Failed to generate Resume PDF.");
//   }
// }

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      "You only output raw valid JSON. No markdown, no backticks, no explanation.",
  });

  const prompt = `
Create a professional, ATS-friendly, SINGLE PAGE resume in HTML format tailored for this job.

Job Description: ${jobDescription}
Candidate Resume: ${resume}
Candidate Bio: ${selfDescription}

Return ONLY a JSON object with exactly this structure:
{ "html": "<your full HTML resume string here>" }

CRITICAL LAYOUT RULES — the resume MUST fit on exactly one A4 page:
- Use inline styles only. No external CSS. No scripts.
- Do NOT include <html>, <head>, or <body> tags.
- Font size: 11px for body text, 13px for section headings, 16px for name.
- Line height: 1.3
- Margins/padding: keep tight — max 4px vertical padding per element.
- Sections to include (in this order): Name + Contact, Summary (2 lines max), Skills (comma separated on one line), Experience (max 2 bullets per role), Projects (max 2 bullets per project), Education.
- DO NOT include photos, icons, colors, tables, columns, borders, or decorative elements.
- Keep all bullet points to one line — no wrapping sentences.
- Summarize aggressively if content is too long. Single page is non-negotiable.

Example structure:
<div style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.3; color: #000; max-width: 750px; margin: 0 auto;">
  <h1 style="font-size:16px; margin:0 0 2px;">John Doe</h1>
  <p style="margin:0 0 6px;">john@email.com | +1-234-567 | LinkedIn | GitHub</p>
  <hr style="margin:4px 0;"/>
  ...sections...
</div>
`;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text().trim();

    // Strip markdown code fences if present
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    // Extract JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch)
      throw new Error("No JSON found in resume generation response");

    const jsonContent = JSON.parse(jsonMatch[0]);

    if (!jsonContent.html)
      throw new Error("No HTML found in resume generation response");

    console.log("Resume HTML length:", jsonContent.html.length);

    return await generatePdfFromHtml(jsonContent.html);
  } catch (error) {
    console.error("Resume Generation Error:", error);
    console.error("Resume Generation Error FULL:", error);
    console.error("Resume Generation Error MESSAGE:", error.message);
    console.error("Resume Generation Error STACK:", error.stack);
    throw new Error("Failed to generate Resume PDF.");
  }
}

module.exports = { generateInterviewReport, generateResumePdf };
