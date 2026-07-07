import path from "path";
import fs from "fs/promises";
import HomeClient from "./HomeClient";

interface PlaylistInfo {
  filename: string;
  name: string;
  channelCount: number;
  sizeBytes: number;
}

const PLAYLIST_NAMES: Record<string, string> = {
  'fifa.json': 'FIFA Live Streams',
  'sports.json': 'Sports Live Streams',
  'channels.json': 'Universal Live Streams',
  'bangla.json': 'Bangla Live Streams',
};

function getPlaylistName(filename: string): string {
  if (PLAYLIST_NAMES[filename]) {
    return PLAYLIST_NAMES[filename];
  }
  const base = path.basename(filename, path.extname(filename));
  const capitalized = base.charAt(0).toUpperCase() + base.slice(1);
  return `${capitalized} Live Streams`;
}

export default async function Home() {
  const dataDir = path.join(process.cwd(), 'app', 'data');
  const dirEntries = await fs.readdir(dataDir);
  
  const playlistFiles = dirEntries
    .filter((file) => file.endsWith('.json'))
    .sort();

  const playlists: PlaylistInfo[] = await Promise.all(
    playlistFiles.map(async (file) => {
      const filePath = path.join(dataDir, file);
      const fileBuffer = await fs.readFile(filePath);
      const stat = await fs.stat(filePath);
      
      let channelCount = 0;
      try {
        const parsed = JSON.parse(fileBuffer.toString());
        channelCount = Array.isArray(parsed) ? parsed.length : 0;
      } catch (err) {
        console.error(`Failed to parse playlist file ${file}:`, err);
      }

      return {
        filename: file,
        name: getPlaylistName(file),
        channelCount,
        sizeBytes: stat.size,
      };
    })
  );

  return <HomeClient playlists={playlists} />;
}
