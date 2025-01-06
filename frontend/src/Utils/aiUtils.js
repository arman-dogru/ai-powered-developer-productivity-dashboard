// aiUtils.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiModel = () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  // Use whichever Gemini model version you need, e.g. 'gemini-1.5-flash'
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

/**
 * DECIDE: 
 * We ask Gemini, "What do you want to do with the user's prompt?" 
 * 
 * We want a simplified text format like:
 *  - "NONE"
 *  - "NEED_REPO_OVERVIEW"
 *  - "NEED_A_FILE|path/to/file|in|owner/repo"
 *
 * so we can parse it easily.
 */
export const decide = async (conversationContext, userMessage) => {
  try {
    const model = getGeminiModel();

    // Example prompt that tells Gemini to decide
    const prompt = `
      You are a helpful assistant. The user has asked something. Decide what action you need:
      
      1) "NEED_REPO_OVERVIEW" if you want the entire repository's raw API JSON. 
         Format: NEED_REPO_OVERVIEW|owner/repo  (i.e. the full name).
      
      2) "NEED_A_FILE" if you want the content of a specific file. 
         Format: NEED_A_FILE|path/to/file|in|owner/repo
      
      3) "NONE" if you have enough info and can answer directly.

      Return EXACTLY one line with your decision (no JSON, no extra words).
      
      EXAMPLES:
      - "NONE"
      - "NEED_REPO_OVERVIEW|octocat/Hello-World"
      - "NEED_A_FILE|src/index.js|in|octocat/Hello-World"
      
      DO NOT write any additional text.

      CONVERSATION CONTEXT:
      ${conversationContext}

      USER MESSAGE:
      "${userMessage}"
    `;

    const result = await model.generateContent(prompt);
    const line = result.response.text().trim();

    // e.g. "NONE" or "NEED_REPO_OVERVIEW|owner/repo" or "NEED_A_FILE|someFile.js|in|owner/repo"
    return line;
  } catch (error) {
    console.error('Error in decide():', error);
    return 'NONE'; // fallback
  }
};

/**
 * ACTION:
 * Given the result of DECIDE (which may say NEED_REPO_OVERVIEW or NEED_A_FILE or NONE),
 * we either:
 *   - fetch repo overview from GitHub
 *   - fetch a file from GitHub
 *   - or do nothing special
 * Then we pass everything (context + user prompt + fetched data) to generateAIResponse for the final answer.
 */
// aiUtils.js (excerpt)

export const action = async ({
  decisionString,
  conversationContext,
  userMessage,
  fetchRepoRawData,
  fetchFileContent,
  selectedRepo,
}) => {
  let finalAssistantText = '';
  let updatedContext = conversationContext;

  let actionType = '';
  let repoFullName = '';
  let filePath = '';

  if (decisionString.startsWith('NONE')) {
    actionType = 'NONE';
  } else if (decisionString.startsWith('NEED_REPO_OVERVIEW')) {
    actionType = 'NEED_REPO_OVERVIEW';
    const parts = decisionString.split('|');
    repoFullName = parts[1] || '';
  } else if (decisionString.startsWith('NEED_A_FILE')) {
    actionType = 'NEED_A_FILE';
    const parts = decisionString.split('|');
    filePath = parts[1] || '';
    // parts[2] should be "in"
    repoFullName = parts[3] || '';
  }

  // *** If the LLM gave us a placeholder or no name, fallback to selectedRepo
  if (
    (actionType === 'NEED_REPO_OVERVIEW' || actionType === 'NEED_A_FILE') &&
    (!repoFullName || repoFullName === 'owner/repo')
  ) {
    if (selectedRepo) {
      console.log('LLM gave a placeholder, using the user’s selectedRepo:', selectedRepo);
      repoFullName = selectedRepo;
    } else {
      finalAssistantText = 'No valid repository found. Please select a real repo from the dropdown.';
      return { finalAssistantText, updatedContext };
    }
  }

  try {
    if (actionType === 'NEED_REPO_OVERVIEW') {
      const rawData = await fetchRepoRawData(repoFullName);
      updatedContext += `\n[System: Raw GitHub JSON for ${repoFullName} below]\n\`\`\`json\n${JSON.stringify(rawData, null, 2)}\n\`\`\``;
      finalAssistantText = await generateAIResponse(updatedContext, userMessage);
    } else if (actionType === 'NEED_A_FILE') {
      const content = await fetchFileContent(repoFullName, filePath);
      updatedContext += `\n[System: Content of ${filePath} below]\n\`\`\`\n${content}\n\`\`\``;
      finalAssistantText = await generateAIResponse(updatedContext, userMessage);
    } else {
      // NONE
      finalAssistantText = await generateAIResponse(updatedContext, userMessage);
    }
  } catch (err) {
    console.error('Error in action():', err);
    finalAssistantText = `An error occurred: ${err.message}`;
  }

  updatedContext += `\nAssistant: ${finalAssistantText}`;
  return { finalAssistantText, updatedContext };
};


/**
 * generateAIResponse:
 * A simple function that calls Gemini to produce the final answer in Markdown.
 * 
 * We don't return JSON; we just return a string that is the final
 * user-facing text. 
 * 
 * The user wants: "Your response should be formatted in markdown..."
 */
export const generateAIResponse = async (conversationContext, userMessage) => {
  try {
    const model = getGeminiModel();

    const prompt = `
      You are a helpful assistant. Use the conversation context, plus any provided GitHub data, 
      to answer the user's question in Markdown. 
      You do NOT need to request new data now; you have it or not.

      Please return your full answer in Markdown format (with headings, code blocks, etc. if needed).

      CONVERSATION CONTEXT:
      ${conversationContext}

      USER MESSAGE:
      "${userMessage}"

      Provide a concise, helpful answer in valid Markdown.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text(); // final string (Markdown)
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'Sorry, something went wrong generating the response.';
  }
};
