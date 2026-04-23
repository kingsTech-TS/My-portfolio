
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a transporter using SMTP
    // NOTE: In a real production app, these should be environment variables.
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASS
    // For this template, we'll assume the user will configure these.
    // If no env vars are present, we'll log to console for debugging purposes in dev.

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("----------------------------------------")
      console.log("📧 MOCK EMAIL SEND (Missing credentials)")
      console.log(`From: ${name} <${email}>`)
      console.log(`Message: ${message}`)
      console.log("----------------------------------------")
      
      // Simulate delay for effect
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      return NextResponse.json({ success: true, message: "Email simulation successful" })
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // easy default, can be configured
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self
      subject: `Portfolio Contact: ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
<h3>New Contact Message</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<br/>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, "<br>")}</p>
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Failed to send email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
