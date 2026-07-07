import DownloadClient from "./DownloadClient";

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
}

interface ReleaseData {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  assets: GitHubAsset[];
}

const FALLBACK_RELEASE: ReleaseData = {
  tag_name: "v3.0.0",
  name: "IPTV Player v3.0.0",
  published_at: "2026-07-07T12:00:00Z",
  html_url: "https://github.com/SHAJON-404/iptv/releases/tag/v3.0.0",
  assets: [
    {
      name: "IPTV Player Setup 3.0.0.exe",
      browser_download_url: "https://github.com/SHAJON-404/iptv/releases/download/v3.0.0/IPTV.Player.Setup.3.0.0.exe",
      size: 82837504,
      download_count: 4531,
    },
    {
      name: "IPTV Player 3.0.0.exe",
      browser_download_url: "https://github.com/SHAJON-404/iptv/releases/download/v3.0.0/IPTV.Player.3.0.0.exe",
      size: 81788928,
      download_count: 983,
    },
    {
      name: "IPTV Player-3.0.0-win.zip",
      browser_download_url: "https://github.com/SHAJON-404/iptv/releases/download/v3.0.0/IPTV.Player-3.0.0-win.zip",
      size: 83886080,
      download_count: 1205,
    },
    {
      name: "iptv_3.0.0_amd64.deb",
      browser_download_url: "https://github.com/SHAJON-404/iptv/releases/download/v3.0.0/iptv_3.0.0_amd64.deb",
      size: 65011712,
      download_count: 1253,
    },
    {
      name: "IPTV Player-3.0.0.AppImage",
      browser_download_url: "https://github.com/SHAJON-404/iptv/releases/download/v3.0.0/IPTV.Player-3.0.0.AppImage",
      size: 72351744,
      download_count: 671,
    },
    {
      name: "iptv-3.0.0.x86_64.rpm",
      browser_download_url: "https://github.com/SHAJON-404/iptv/releases/download/v3.0.0/iptv-3.0.0.x86_64.rpm",
      size: 68157440,
      download_count: 342,
    },
    {
      name: "iptv-3.0.0.zip",
      browser_download_url: "https://github.com/SHAJON-404/iptv/releases/download/v3.0.0/iptv-3.0.0.zip",
      size: 78643200,
      download_count: 512,
    }
  ]
};

async function getLatestRelease(): Promise<ReleaseData> {
  const secret = process.env.GITHUB_SECRETS || process.env.GITHUB_SECREST;
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'IPTV-Docs-Web',
  };
  
  if (secret) {
    headers['Authorization'] = `Bearer ${secret}`;
  }

  try {
    // Revalidate once every hour
    const res = await fetch('https://api.github.com/repos/SHAJON-404/iptv/releases/latest', {
      headers,
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      console.warn(`GitHub API release fetch failed: ${res.status} ${res.statusText}. Using fallback data.`);
      return FALLBACK_RELEASE;
    }

    const data = await res.json();
    if (!data.assets || data.assets.length === 0) {
      return FALLBACK_RELEASE;
    }

    return {
      tag_name: data.tag_name,
      name: data.name || `IPTV Player ${data.tag_name}`,
      published_at: data.published_at,
      html_url: data.html_url,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      assets: data.assets.map((asset: any) => ({
        name: asset.name,
        browser_download_url: asset.browser_download_url,
        size: asset.size,
        download_count: asset.download_count,
      }))
    };
  } catch (error) {
    console.error("Error fetching release from GitHub API:", error);
    return FALLBACK_RELEASE;
  }
}

export default async function DownloadPage() {
  const release = await getLatestRelease();
  const publishDate = new Date(release.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <DownloadClient 
      release={release} 
      publishDate={publishDate} 
    />
  );
}
