import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const isJson = filename.endsWith('.json');
  const isM3u = filename.endsWith('.m3u');

  // Basic security check
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\') || (!isJson && !isM3u)) {
    return new NextResponse('Invalid filename or format. Only JSON and M3U are supported.', { status: 400 });
  }

  try {
    const githubToken = process.env.GITHUB_SECRETS;
    if (!githubToken) {
      console.error('GITHUB_SECRETS environment variable is not set');
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    const githubUrl = `https://raw.githubusercontent.com/SHAJON-404/iptv-web/refs/heads/main/app/data/${filename}`;
    
    const fetchResponse = await fetch(githubUrl, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store'
    });

    if (!fetchResponse.ok) {
      if (fetchResponse.status === 404) {
        return new NextResponse('Playlist not found', { status: 404 });
      }
      console.error(`Failed to fetch from GitHub: ${fetchResponse.status} ${fetchResponse.statusText}`);
      return new NextResponse('Error fetching playlist', { status: 500 });
    }

    const fileBuffer = await fetchResponse.arrayBuffer();

    const response = new NextResponse(fileBuffer);
    const contentType = isJson ? 'application/json' : 'application/x-mpegurl; charset=utf-8';
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Length', fileBuffer.byteLength.toString());
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Access-Control-Allow-Origin', '*');
    
    return response;
  } catch (error) {
    console.error('Error reading playlist from GitHub:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

