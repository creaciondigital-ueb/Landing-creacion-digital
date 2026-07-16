// Script one-shot para configurar CORS en el bucket de DO Spaces.
// Credenciales leídas del .env (NUNCA hardcoded). Si vas a correr este
// script localmente, copia primero las keys actuales a un .env local
// o ejecuta desde el droplet donde el .env ya existe.
require('dotenv').config();
const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');

if (!process.env.SPACES_KEY || !process.env.SPACES_SECRET) {
  console.error('FAIL — SPACES_KEY/SPACES_SECRET no están en .env');
  process.exit(1);
}

const s3 = new S3Client({
  region: process.env.SPACES_REGION || 'nyc3',
  endpoint: process.env.SPACES_ENDPOINT || 'https://nyc3.digitaloceanspaces.com',
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
  forcePathStyle: false,
});

(async () => {
  await s3.send(new PutBucketCorsCommand({
    Bucket: process.env.SPACES_BUCKET || 'galeria-3d-files',
    CORSConfiguration: {
      CORSRules: [{
        AllowedOrigins: ['*'],
        AllowedMethods: ['GET', 'HEAD'],
        AllowedHeaders: ['*'],
        MaxAgeSeconds: 86400,
      }],
    },
  }));
  console.log('CORS configured on galeria-3d-files');
})();
