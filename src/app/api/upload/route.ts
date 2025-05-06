import { NextRequest } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});
const BUCKET = process.env.R2_BUCKET!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext = file.name.split('.').pop() || 'jpg';
  const key = `pfp/${uuidv4()}.${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    ACL: 'public-read',
  }));

  const url = `${PUBLIC_URL}/${key}`;
  return new Response(JSON.stringify({ url }), { status: 200 });
} 