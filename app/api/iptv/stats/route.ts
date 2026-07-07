import { NextResponse } from "next/server";

interface ChannelData {
  name: string;
  logo?: string;
  url: string;
  group?: string;
  useProxy?: boolean;
  referer?: string;
  origin?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ViewerSession {
  lastHeartbeat: number;
  playingNow?: ChannelData;
}

// Global in-memory map for tracking active viewer sessions
const activeSessions = new Map<string, ViewerSession>();
const HEARTBEAT_TIMEOUT = 45 * 1000; // 45 seconds session timeout limit

/**
 * Cleans up expired sessions that have missed heartbeats.
 */
function cleanExpiredSessions() {
  const now = Date.now();
  for (const [sessionId, session] of activeSessions.entries()) {
    if (now - session.lastHeartbeat > HEARTBEAT_TIMEOUT) {
      activeSessions.delete(sessionId);
    }
  }
}

/**
 * Aggregates session details to return the total count and top channels list.
 */
function getStatsData() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statsMap = new Map<string, any>();

  for (const session of activeSessions.values()) {
    if (session.playingNow && session.playingNow.name) {
      const name = session.playingNow.name;
      const nameLower = name.toLowerCase().trim();

      if (statsMap.has(nameLower)) {
        const existing = statsMap.get(nameLower);
        existing.viewers += 1;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entry: any = {
          logo: "",
          url: "",
          group: "Uncategorized",
          useProxy: false,
          referer: "",
          origin: "",
          viewers: 1,
        };
        Object.assign(entry, session.playingNow);
        entry.name = name.trim();
        statsMap.set(nameLower, entry);
      }
    }
  }

  // Sort by viewers descending and take top 10
  const topChannels = Array.from(statsMap.values())
    .sort((a, b) => b.viewers - a.viewers)
    .slice(0, 10);

  return {
    count: activeSessions.size,
    topChannels,
  };
}

/**
 * GET handler to retrieve current streaming stats.
 */
export async function GET() {
  cleanExpiredSessions();
  const data = getStatsData();

  return NextResponse.json(
    data,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

/**
 * POST handler to receive heartbeats from clients.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, playingNow } = body;

    if (!sessionId || typeof sessionId !== "string" || sessionId.length > 50) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    // Limit tracking size to protect memory
    if (activeSessions.size > 10000) {
      cleanExpiredSessions();
      if (activeSessions.size > 10000 && !activeSessions.has(sessionId)) {
        return NextResponse.json(
          { error: "Viewer session limit reached" },
          { status: 503 }
        );
      }
    }

    // Register session state
    activeSessions.set(sessionId, {
      lastHeartbeat: Date.now(),
      playingNow: playingNow && typeof playingNow === "object" ? playingNow : undefined,
    });

    cleanExpiredSessions();
    const data = getStatsData();

    return NextResponse.json(
      { success: true, ...data },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (e) {
    console.error("Error logging viewer statistics:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS preflight handler for CORS.
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
