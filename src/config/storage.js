
import { Storage } from '@google-cloud/storage';

// Google Cloud Storage configuration
const GCP_PROJECT_ID = ''; // Add your GCP project ID here
const GCP_KEY_FILE = ''; // Add path to your service account key file
const BUCKET_NAME = ''; // Add your GCS bucket name here

let storage = null;

export const initializeStorage = () => {
  if (storage) {
    return storage;
  }

  if (!GCP_PROJECT_ID || !GCP_KEY_FILE || !BUCKET_NAME) {
    console.warn('Google Cloud Storage not configured');
    // Return mock storage for development
    return {};
  }

  storage = new Storage({
    projectId: GCP_PROJECT_ID,
    keyFilename: GCP_KEY_FILE,
  });

  return storage;
};

export const uploadVideoToGCS = async (videoBlob, fileName) => {
  try {
    const storage = initializeStorage();
    
    if (!BUCKET_NAME) {
      console.warn('GCS bucket not configured, returning mock URL');
      return `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
    }

    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(`videos/${fileName}`);

    const stream = file.createWriteStream({
      metadata: {
        contentType: videoBlob.type,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/videos/${fileName}`;
        resolve(publicUrl);
      });

      const arrayBuffer = videoBlob.arrayBuffer();
      arrayBuffer.then(buffer => {
        stream.end(Buffer.from(buffer));
      });
    });
  } catch (error) {
    console.error('Error uploading video to GCS:', error);
    throw error;
  }
};
