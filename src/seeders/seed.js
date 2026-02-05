/**
 * TalentX seed script.
 * Seeds: Employers, Talents (User profiles), and Job posts.
 *
 * Login: Auth is via Firebase. To use seeded users for login:
 * - Option A: In Firebase Console (or Emulator), create users with the same UIDs
 *   as below (employer1Uid, employer2Uid, talent1Uid, talent2Uid).
 * - Option B: Sign up normally in the app, then run POST /users/onboard with
 *   the role; jobs seeded here will still show for any employer who creates jobs.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TalentX';

/** If SRV lookup fails (e.g. ECONNREFUSED on querySrv), try standard format with port 27017. */
function toStandardUri(srvUri) {
  try {
    const u = new URL(srvUri.replace('mongodb+srv://', 'https://'));
    const auth = u.username ? `${encodeURIComponent(u.username)}:${encodeURIComponent(u.password || '')}@` : '';
    const host = u.hostname || u.host;
    return `mongodb://${auth}${host}:27017${u.pathname || '/TalentX'}${u.search || ''}`;
  } catch {
    return srvUri;
  }
}

async function connectMongo(uri) {
  try {
    await mongoose.connect(uri);
    return true;
  } catch (err) {
    if ((err.code === 'ECONNREFUSED' || err.message?.includes('querySrv')) && uri.startsWith('mongodb+srv://')) {
      const standardUri = toStandardUri(uri);
      if (standardUri !== uri) {
        console.log('SRV lookup failed, retrying with standard connection string...');
        await mongoose.connect(standardUri);
        return true;
      }
    }
    throw err;
  }
}

const SEED_EMPLOYER_UIDS = [
  'seed_employer_001',
  'seed_employer_002',
];
const SEED_TALENT_UIDS = [
  'seed_talent_001',
  'seed_talent_002',
  'seed_talent_003',
];

const employers = [
  { uid: SEED_EMPLOYER_UIDS[0], name: 'Acme Corp', email: 'hr@acme.io', role: 'EMPLOYER' },
  { uid: SEED_EMPLOYER_UIDS[1], name: 'DataDrive Inc', email: 'hiring@datadrive.com', role: 'EMPLOYER' },
];

const talents = [
  { uid: SEED_TALENT_UIDS[0], name: 'Alex Chen', email: 'alex@example.com', role: 'TALENT', skills: ['Python', 'ML', 'TensorFlow'] },
  { uid: SEED_TALENT_UIDS[1], name: 'Sam Rivera', email: 'sam@example.com', role: 'TALENT', skills: ['Node.js', 'React', 'MongoDB'] },
  { uid: SEED_TALENT_UIDS[2], name: 'Jordan Lee', email: 'jordan@example.com', role: 'TALENT', skills: ['Data Engineering', 'Spark', 'SQL'] },
];

const jobPosts = [
  {
    title: 'Senior Data Scientist',
    companyName: 'Acme Corp',
    techStack: ['Python', 'TensorFlow', 'SQL', 'AWS'],
    description: 'Build ML models and work with large-scale data pipelines. Experience with A/B testing and product analytics required.',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdBy: SEED_EMPLOYER_UIDS[0],
  },
  {
    title: 'Full Stack Developer',
    companyName: 'Acme Corp',
    techStack: ['Node.js', 'React', 'PostgreSQL'],
    description: 'Own features end-to-end. Strong React and Node experience. Remote-friendly.',
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    createdBy: SEED_EMPLOYER_UIDS[0],
  },
  {
    title: 'Data Engineer',
    companyName: 'DataDrive Inc',
    techStack: ['Spark', 'Airflow', 'Python', 'GCP'],
    description: 'Design and maintain data pipelines. Experience with dbt and modern warehouse tooling preferred.',
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    createdBy: SEED_EMPLOYER_UIDS[1],
  },
  {
    title: 'AI Research Intern',
    companyName: 'DataDrive Inc',
    techStack: ['PyTorch', 'Python', 'NLP'],
    description: 'Summer internship on NLP and LLM evaluation. Must be currently enrolled in a relevant program.',
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    createdBy: SEED_EMPLOYER_UIDS[1],
  },
];

async function seed() {
  await connectMongo(MONGODB_URI);
  console.log('Connected to MongoDB');

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await User.deleteMany({ uid: { $in: [...SEED_EMPLOYER_UIDS, ...SEED_TALENT_UIDS] } }).session(session);
    await Job.deleteMany({ createdBy: { $in: SEED_EMPLOYER_UIDS } }).session(session);

    await User.insertMany(employers, { session });
    await User.insertMany(talents, { session });
    await Job.insertMany(jobPosts, { session });

    await session.commitTransaction();
    console.log('Seeded:', employers.length, 'employers,', talents.length, 'talents,', jobPosts.length, 'jobs.');
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
    await mongoose.disconnect();
  }
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
