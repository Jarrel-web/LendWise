import { NextResponse } from "next/server"
import type { ApplicantInput } from "@/lib/prediction-engine"

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000"

export async function POST(request: Request) {
  try {
    const body = await request.json() as ApplicantInput

    // Validate required fields
    const requiredFields: (keyof ApplicantInput)[] = [
      "Age", "Sex", "Job", "Housing", "Saving_accounts",
      "Checking_account", "Credit_amount", "Duration", "Purpose", "max_acceptable_loss"
    ]

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate numeric fields
    if (typeof body.Age !== "number" || body.Age < 18 || body.Age > 100) {
      return NextResponse.json({ error: "Age must be between 18 and 100" }, { status: 400 })
    }
    if (typeof body.Credit_amount !== "number" || body.Credit_amount <= 0) {
      return NextResponse.json({ error: "Credit amount must be positive" }, { status: 400 })
    }
    if (typeof body.Duration !== "number" || body.Duration <= 0) {
      return NextResponse.json({ error: "Duration must be positive" }, { status: 400 })
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    if (!backendResponse.ok) {
      const backendError = await backendResponse.text()
      return NextResponse.json(
        { error: `Backend prediction failed (${backendResponse.status}): ${backendError}` },
        { status: 502 }
      )
    }

    const backendResult = await backendResponse.json()
    if (!backendResult?.predictions || !backendResult?.decision_policy) {
      return NextResponse.json(
        { error: "Backend returned an invalid prediction response" },
        { status: 502 }
      )
    }

    return NextResponse.json(backendResult)
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    )
  }
}
