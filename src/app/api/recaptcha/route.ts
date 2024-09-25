import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  // Retrieve the secret key from environment variables for the ReCaptcha verification.
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey) {
    // If the secret key is not found, log an error and return an appropriate response.
    return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 })
  }

  const { gRecaptchaToken } = await req.json()

  if (!gRecaptchaToken)
    return NextResponse.json({ success: false, error: "Please provide a valid token" }, { status: 404 })

  // Define the form data for the POST request to the ReCaptcha API.
  const formData = `secret=${secretKey}&response=${gRecaptchaToken}`

  try {
    // Make a POST request to the Google ReCaptcha verify API.
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
  
    if (!response.ok)
      return NextResponse.json({ success: false, error: "ReCaptcha verification failed" }, { status: 400 })

    const responseData = await response.json()

    // Check the ReCaptcha response for success and a score above a certain threshold.
    if (responseData.success && responseData.score > 0.5) {
      console.log("ReCaptcha score:", responseData.score)
      // Return a success response if the verification passes.
      return NextResponse.json(
        {
          success: true,
          score: responseData.score,
        },
        { status: 200 }
      )
    } else {
      // Log the failure and return a response indicating the verification did not pass.
      return NextResponse.json({ success: false, error: "ReCaptcha verification failed" }, { status: 403 })
    }
  } catch (error) {
    // Handle any errors that occur during the API request.
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}