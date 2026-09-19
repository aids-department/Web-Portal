const path = require('path');
const supabase = require('../config/supabaseClient');

/**
 * Uploads a buffer (from multer memoryStorage) to a Supabase Storage bucket
 * and returns its public URL + the object path (used later for deletion).
 * Mirrors the old ImageService/cloudinary.uploader.upload calls.
 */
async function uploadFile(bucket, buffer, originalName, { folder, contentType } = {}) {
  const cleanName = path.parse(originalName).name.replace(/\s+/g, '_');
  const ext = path.extname(originalName) || '';
  const objectPath = `${folder ? folder + '/' : ''}${Date.now()}-${cleanName}${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
    contentType: contentType || undefined,
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);

  return { url: data.publicUrl, path: objectPath };
}

/**
 * Deletes an object from a bucket. Mirrors cloudinary.uploader.destroy.
 * Safe to call with a null/undefined path (no-op), matching the old
 * "only delete if publicId exists" guards scattered across the routes.
 */
async function deleteFile(bucket, objectPath) {
  if (!objectPath) return;
  await supabase.storage.from(bucket).remove([objectPath]);
}

module.exports = { uploadFile, deleteFile };
