export const dynamic = "force-dynamic";

export function GET() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
  const match = clientId.match(/^ca-pub-(\d{16})$/);

  return new Response(
    match ? `google.com, pub-${match[1]}, DIRECT, f08c47fec0942fa0\n` : "",
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}