import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  // Basic security check
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\') || !filename.endsWith('.json')) {
    return new NextResponse('Invalid filename or format. Only JSON is supported.', { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), 'app', 'data', filename);
    const fileBuffer = await fs.readFile(filePath);

    const response = new NextResponse(fileBuffer);
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Content-Length', fileBuffer.byteLength.toString());
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    return response;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return new NextResponse('Playlist not found', { status: 404 });
    }
    console.error('Error reading playlist file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


