export const AI_CONFIG = {
  model: "gpt-4",
  temperature: 0.7,
  maxTokens: 500,
} as const;

export const VALIDATION_LIMITS = {
  additionalDetailsMaxLength: 1200,
  coverLetterMaxLength: 1000,
} as const;

export const ERROR_MESSAGES = {
  allFieldsRequired: "All fields are required",
  additionalDetailsTooLong:
    "Additional details must be 1200 characters or less",
  generationFailed: "Failed to generate cover letter content",
  internalServerError: "Internal server error",
  generationError: (message: string) =>
    `Failed to generate cover letter: ${message}`,
} as const;

export const AI_PROMPTS = {
  systemPrompt: `You are a professional cover letter writer. Create compelling, personal cover letters that start with "Dear [Company] team," and describe the person's qualifications for the specific role.

CRITICAL REQUIREMENTS:
- Start with "Dear [Company] team,"
- Write in first person as the applicant
- Use the EXACT job title provided
- Use the EXACT company name provided
- Reference the EXACT skills mentioned by the user
- Incorporate the EXACT additional details provided
- Keep it under 1000 characters (very concise)
- Be conversational but professional
- Focus on what the person is good at and their relevant experience
- Make it personal and specific to the user's input

Format: Start with greeting, then describe qualifications and passion for the role.`,

  getUserPrompt: (
    jobTitle: string,
    company: string,
    skills: string,
    additionalDetails: string
  ) =>
    `Write a personalized cover letter for applying to ${company} for the ${jobTitle} position.

My Information:
- Job Title I'm applying for: "${jobTitle}"
- Company: "${company}"
- What I'm good at: "${skills}"
- Additional details about me: "${additionalDetails}"

Format should be:
"Dear ${company} team,
I am a [description based on my skills and experience]..."

IMPORTANT: 
- Start with "Dear ${company} team,"
- Describe what I'm good at using "${skills}"
- Include relevant details from "${additionalDetails}"
- Write as if I'm personally introducing myself
- Maximum 1000 characters (keep it very concise)
- Make it specific to MY information and this ${jobTitle} role`,
} as const;
