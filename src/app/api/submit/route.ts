import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    console.error("GOOGLE_SCRIPT_URL is not configured.");
    return NextResponse.json(
      { success: false, error: "Google Sheets is not configured on the server. Contact the administrator." },
      { status: 500 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Apps Script Web Apps issue a redirect on POST; follow it automatically.
      redirect: "follow",
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Non-JSON response from Apps Script:", text.slice(0, 500));
      return NextResponse.json(
        { success: false, error: "Unexpected response from Google Sheets endpoint." },
        { status: 502 }
      );
    }

    if (!res.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: (data.error as string) || `Apps Script error (HTTP ${res.status})` },
        { status: res.ok ? 502 : res.status }
      );
    }

    return NextResponse.json({ success: true, row: data.row ?? null });
  } catch (err) {
    console.error("Error forwarding submission to Apps Script:", err);
    return NextResponse.json(
      { success: false, error: "Could not reach the Google Sheets endpoint." },
      { status: 502 }
    );
  }
}
