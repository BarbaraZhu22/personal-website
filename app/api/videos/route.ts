import { head } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const TOKEN = process.env.VIDEO_READ_WRITE_TOKEN;

const normalizeBlobKey = (fileParam: string) =>
  fileParam.trim().replace(/^\/+/, "");

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileParam = searchParams.get("file");

  if (!fileParam) {
    return new NextResponse("Missing file parameter", { status: 400 });
  }

  if (!TOKEN) {
    return new NextResponse("Blob token not configured", { status: 500 });
  }

  const blobKey = normalizeBlobKey(fileParam);

  try {
    const blob = await head(blobKey, { token: TOKEN });

    if (!blob?.url) {
      return new NextResponse("Video not found", { status: 404 });
    }

    const redirectUrl = blob.downloadUrl ?? blob.url;
    return NextResponse.redirect(redirectUrl, 307);
  } catch (error) {
    return new NextResponse("Video not found", { status: 404 });
  }
}
