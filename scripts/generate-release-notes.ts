import { Configuration, OpenAIApi } from 'openai';
import simpleGit from 'simple-git';
import fs from 'fs';

async function generateReleaseNotes() {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable.');
  }

  const configuration = new Configuration({
    apiKey: openaiApiKey,
  });
  const openai = new OpenAIApi(configuration);
  const git = simpleGit();

  console.log('Fetching recent commits...');
  const log = await git.log({ maxCount: 10 }); // Last 10 commits
  const commitMessages = log.all.map(commit => `- ${commit.message}`).join('\n');

  const prompt = `
You are a professional open-source release manager.

Using the following list of Git commit messages, create high-quality, human-readable release notes suitable for a GitHub release page.

Requirements:
- Group related changes together under appropriate sections (e.g., "Features", "Bug Fixes", "Internal Improvements").
- Summarize where possible. Avoid listing every tiny commit individually unless important.
- Omit trivial internal updates like dependency bumps unless relevant to users.
- Maintain a positive and semi-formal tone.
- Format the output using clean Markdown (## sections, bullet points where helpful).
- Keep the overall notes concise but informative.
- Title the release appropriately based on the version bump (e.g., "v0.2.0 - Minor Improvements 🚀").
- Highlight user-facing features first.

Here are the recent commits:
${commitMessages}
`;

  console.log('Calling ChatGPT to generate release notes...');
  const response = await openai.createChatCompletion({
    model: 'gpt-4', // fallback to gpt-3.5-turbo manually if needed
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 800,
  });

  const releaseNotes = response.data.choices[0].message?.content?.trim();
  if (!releaseNotes) {
    throw new Error('Failed to generate release notes from ChatGPT.');
  }

  fs.writeFileSync('RELEASE_NOTES.md', releaseNotes, 'utf8');
  console.log('✅ Release notes written to RELEASE_NOTES.md');
}

generateReleaseNotes().catch(err => {
  console.error('❌ Failed to generate release notes:', err);
  process.exit(1);
});
