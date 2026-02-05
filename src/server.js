require('dotenv').config();

// Use Google DNS to avoid SRV/host resolution issues on some networks
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const { initializeFirebase } = require('./config/firebase');
const app = require('./app');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TalentX';
const PORT = process.env.PORT || 3000;

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
    return;
  } catch (err) {
    if ((err.code === 'ECONNREFUSED' || err.message?.includes('querySrv')) && uri.startsWith('mongodb+srv://')) {
      const standardUri = toStandardUri(uri);
      if (standardUri !== uri) {
        console.log('SRV lookup failed, retrying with standard connection string...');
        await mongoose.connect(standardUri);
        return;
      }
    }
    throw err;
  }
}

async function start() {
  try {
    await connectMongo(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (e) {
    console.error('MongoDB connection failed:', e.message);
    process.exit(1);
  }

  try {
    initializeFirebase();
    console.log('Firebase initialized');
  } catch (e) {
    console.error('Firebase init failed:', e.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start();
