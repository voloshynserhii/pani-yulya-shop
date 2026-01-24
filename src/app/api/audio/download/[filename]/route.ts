import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest, context: { params: Promise<{ filename: string }> }) {
  const { filename } = await context.params;

  // Basic security to prevent directory traversal and ensure only mp3s are served
  if (!filename || filename.includes('..') || !filename.endsWith('.mp3')) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'private/audio', filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const stats = fs.statSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stats.size.toString(),
    },
  });
}