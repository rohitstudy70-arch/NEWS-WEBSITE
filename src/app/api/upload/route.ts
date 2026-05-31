import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Try writing locally first (preferred for local development)
    try {
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const safeName = file.name ? file.name.replace(/[^a-zA-Z0-9.]/g, '_') : 'image.jpg';
      const filename = `${Date.now()}-${safeName}`;
      const filePath = join(uploadDir, filename);

      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
      });
    } catch (fsError: any) {
      console.warn('Local filesystem write failed (likely read-only on Vercel). Falling back to Base64 data URL:', fsError.message);

      // 2. Fallback: Base64 encoding (guarantees success on serverless hosts like Vercel)
      const mimeType = file.type || 'image/jpeg';
      const base64String = buffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64String}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
      });
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
