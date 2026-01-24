import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ trackId: string }> }) {
  const { trackId } = await context.params; // ✅ unwrap проміс

  /* =====================
     1. AUTH / PURCHASE CHECK
  ===================== */
/*   const userHasAccess = true; // твоя реальна логіка

  if (!userHasAccess) {
    return new Response("Forbidden", { status: 403 });
  }
 */
  /* =====================
     2. FILE PATH
  ===================== */
  const filePath = path.join(process.cwd(), "private/audio", trackId);

  if (!fs.existsSync(filePath)) {
    return new Response("Not found", { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const range = req.headers.get("range");

  // Автоматичний MIME-тип
  let mimeType: string;
  if (trackId.endsWith(".wav")) mimeType = "audio/wav";
  else if (trackId.endsWith(".mp3")) mimeType = "audio/mpeg";
  else return new Response("Unsupported file type", { status: 415 });

  /* =====================
     3. RANGE SUPPORT
  ===================== */
  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : stat.size - 1;

    if (isNaN(start) || isNaN(end) || start > end || end >= stat.size) {
      return new Response("Invalid Range", { status: 416 });
    }

    const stream = fs.createReadStream(filePath, { start, end });
    const chunkSize = end - start + 1;

    return new Response(stream as unknown as ReadableStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": mimeType,
        "Cache-Control": "no-store",
      },
    });
  }

  /* =====================
     4. FULL STREAM
  ===================== */
  const stream = fs.createReadStream(filePath);

  return new Response(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": mimeType,
      "Content-Length": stat.size.toString(),
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-store",
    },
  });
}
