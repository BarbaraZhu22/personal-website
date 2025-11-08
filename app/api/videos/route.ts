import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

export const runtime = "nodejs";

const PUBLIC_VIDEO_DIR = path.join(process.cwd(), "public", "videos");

const CACHE_CONTROL_HEADER = "public, max-age=31536000, immutable";

const resolveVideoPath = (fileParam: string) => {
  const sanitized = path.basename(fileParam);
  return path.join(PUBLIC_VIDEO_DIR, sanitized);
};

const toWebStream = (stream: NodeJS.ReadableStream) =>
  Readable.toWeb(stream as Readable) as unknown as ReadableStream<Uint8Array>;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileParam = searchParams.get("file");

  if (!fileParam) {
    return new NextResponse("Missing file parameter", { status: 400 });
  }

  const videoPath = resolveVideoPath(fileParam);

  try {
    await access(videoPath);
  } catch (error) {
    return new NextResponse("Video not found", { status: 404 });
  }

  const { size: fileSize } = await stat(videoPath);
  const rangeHeader = request.headers.get("range");

  if (rangeHeader) {
    const matches = rangeHeader.match(/bytes=(\d+)-(\d*)/);

    if (!matches) {
      return new NextResponse("Invalid Range header", { status: 416 });
    }

    const start = Number.parseInt(matches[1] ?? "0", 10);
    let end = matches[2] ? Number.parseInt(matches[2], 10) : fileSize - 1;

    if (Number.isNaN(start) || Number.isNaN(end)) {
      return new NextResponse("Invalid Range values", { status: 416 });
    }

    if (start >= fileSize) {
      return new NextResponse(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${fileSize}`,
        },
      });
    }

    end = Math.min(end, fileSize - 1);
    const chunkSize = end - start + 1;
    const stream = createReadStream(videoPath, { start, end });

    const headers = new Headers({
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize.toString(),
      "Content-Type": "video/mp4",
      "Cache-Control": CACHE_CONTROL_HEADER,
    });

    return new NextResponse(toWebStream(stream), {
      status: 206,
      headers,
    });
  }

  const stream = createReadStream(videoPath);

  const headers = new Headers({
    "Content-Length": fileSize.toString(),
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
    "Cache-Control": CACHE_CONTROL_HEADER,
  });

  return new NextResponse(toWebStream(stream), {
    status: 200,
    headers,
  });
}

