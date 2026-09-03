const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

let r2Config = {};
try {
  const configPath = path.join(__dirname, '..', 'r2-config.json');
  if (fs.existsSync(configPath)) {
    r2Config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (e) {}

const BUCKET = process.env.R2_BUCKET || r2Config.bucket || 'submorph-storage';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || r2Config.publicUrl || 'https://pub-c6a1bbb2584a4465b9313ada21611240.r2.dev';
const ENDPOINT = process.env.R2_ENDPOINT || r2Config.endpoint || 'https://e1a8fc50350e7bc614cc71f6f7067454.r2.cloudflarestorage.com';
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || r2Config.accessKeyId || '';
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || r2Config.secretAccessKey || '';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY
  }
});

function getR2PublicUrl(key) {
  const cleanKey = (key || '').replace(/^\/+/, '');
  const cleanBase = PUBLIC_URL.replace(/\/+$/, '');
  return `${cleanBase}/${cleanKey}`;
}

async function uploadFile(key, fileBuffer, contentType = 'application/octet-stream', contentDisposition = '') {
  const params = {
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType
  };
  if (contentDisposition) {
    params.ContentDisposition = contentDisposition;
  }
  await s3Client.send(new PutObjectCommand(params));
  return getR2PublicUrl(key);
}

async function uploadText(key, textContent, contentType = 'text/plain; charset=utf-8') {
  return await uploadFile(key, Buffer.from(textContent, 'utf8'), contentType);
}

async function deleteFile(key) {
  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key
    }));
    return true;
  } catch (err) {
    console.error(`[R2] Failed to delete ${key}:`, err);
    return false;
  }
}

async function deletePrefix(prefix) {
  try {
    const listRes = await s3Client.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix
    }));
    if (!listRes.Contents || listRes.Contents.length === 0) return true;

    const deleteParams = {
      Bucket: BUCKET,
      Delete: {
        Objects: listRes.Contents.map(o => ({ Key: o.Key }))
      }
    };
    await s3Client.send(new DeleteObjectsCommand(deleteParams));
    return true;
  } catch (err) {
    console.error(`[R2] Failed to delete prefix ${prefix}:`, err);
    return false;
  }
}

module.exports = {
  s3Client,
  BUCKET,
  PUBLIC_URL,
  getR2PublicUrl,
  uploadFile,
  uploadText,
  deleteFile,
  deletePrefix
};
