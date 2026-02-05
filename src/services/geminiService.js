const { model, hasGemini } = require('../config/gemini');

async function generateJobDescription(title, techStack) {
  if (!hasGemini || !model) {
    const err = new Error('AI service unavailable');
    err.status = 503;
    throw err;
  }
  const stack = Array.isArray(techStack) ? techStack.join(', ') : String(techStack || '');
  const prompt = `Generate a concise job description for the following role. Keep it to 2-4 short paragraphs.\n\nRole: ${title}\nTech stack: ${stack}`;
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response?.text?.() ?? '';
    return text.trim() || 'No description generated.';
  } catch (e) {
    const err = new Error(e.message || 'AI request failed');
    err.status = 502;
    throw err;
  }
}

async function scoreTalentsForJob(job, talents) {
  if (!hasGemini || !model) {
    const err = new Error('AI service unavailable');
    err.status = 503;
    throw err;
  }
  if (!talents.length) return [];
  const jobSummary = `Title: ${job.title}. Company: ${job.companyName}. Tech: ${(job.techStack || []).join(', ')}. Description: ${(job.description || '').slice(0, 300)}.`;
  const talentList = talents
    .map(
      (t) =>
        `talentId: ${t.uid}, name: ${t.name || 'N/A'}, email: ${t.email || 'N/A'}, skills: ${(t.skills || []).join(', ') || 'none'}`
    )
    .join('\n');
  const prompt = `You are a recruiter. Rate how well each talent matches the job (0-100). Reply with a JSON array only, no markdown. Each item: {"talentId":"<uid>","score":<0-100>,"reason":"<one short sentence>"}\n\nJob:\n${jobSummary}\n\nTalents:\n${talentList}`;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response?.text?.() ?? '[]';
    const cleaned = text.replace(/```json?\s*|\s*```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    const err = new Error(e.message || 'AI request failed');
    err.status = 502;
    throw err;
  }
}

async function scoreJobsForTalent(talent, jobs) {
  if (!hasGemini || !model) {
    const err = new Error('AI service unavailable');
    err.status = 503;
    throw err;
  }
  if (!jobs.length) return [];
  const talentSummary = `name: ${talent.name || 'N/A'}, email: ${talent.email || 'N/A'}, skills: ${(talent.skills || []).join(', ') || 'none'}`;
  const jobList = jobs
    .map(
      (j) =>
        `jobId: ${j._id}, title: ${j.title}, company: ${j.companyName}, tech: ${(j.techStack || []).join(', ')}, description: ${(j.description || '').slice(0, 200)}`
    )
    .join('\n');
  const prompt = `You are a career advisor. Rate how relevant each job is for this talent (0-100). Reply with a JSON array only, no markdown. Each item: {"jobId":"<id>","score":<0-100>,"reason":"<one short sentence>"}\n\nTalent:\n${talentSummary}\n\nJobs:\n${jobList}`;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response?.text?.() ?? '[]';
    const cleaned = text.replace(/```json?\s*|\s*```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    const err = new Error(e.message || 'AI request failed');
    err.status = 502;
    throw err;
  }
}

module.exports = { generateJobDescription, scoreTalentsForJob, scoreJobsForTalent };
