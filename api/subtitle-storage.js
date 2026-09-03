const { uploadText, deleteFile, deletePrefix, getR2PublicUrl } = require('../lib/r2');

function cleanEmailKey(email) {
  return (email || 'anonymous')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '_');
}

module.exports = async function handler(req, res) {
  // Set CORS headers for web and mobile clients
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { action, docId, userEmail, fileName, srtContent } = body;

    const emailKey = cleanEmailKey(userEmail);

    if (action === 'upload') {
      if (!docId || !srtContent) {
        return res.status(400).json({ error: 'Missing docId or srtContent' });
      }

      const key = `subtitles/${emailKey}/${docId}.srt`;
      const url = await uploadText(key, srtContent, 'text/plain; charset=utf-8');

      return res.status(200).json({
        success: true,
        key: key,
        url: url
      });
    }

    if (action === 'delete') {
      if (!docId) {
        return res.status(400).json({ error: 'Missing docId' });
      }

      const key = `subtitles/${emailKey}/${docId}.srt`;
      await deleteFile(key);

      return res.status(200).json({
        success: true,
        deletedKey: key
      });
    }

    if (action === 'clearAll') {
      if (!userEmail) {
        return res.status(400).json({ error: 'Missing userEmail' });
      }

      const prefix = `subtitles/${emailKey}/`;
      await deletePrefix(prefix);

      return res.status(200).json({
        success: true,
        clearedPrefix: prefix
      });
    }

    return res.status(400).json({ error: `Invalid action: ${action}` });
  } catch (err) {
    console.error('[API subtitle-storage error]:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
