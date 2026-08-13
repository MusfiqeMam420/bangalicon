import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      _id: "1",
      name: "home",
      svg: '<svg viewBox="0 0 24 24"><path d="M3 10L12 3l9 7v10H3z"/></svg>',
      type: "free",
    },
    {
      _id: "2",
      name: "user",
      svg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/></svg>',
      type: "premium",
    },
  ]);
}