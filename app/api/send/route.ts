import { EmailTemplate } from "@/components/email-template";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const emailBody = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Welcome, Himangshu!</h1>
        <p>We're excited to have you on board. If you have any questions, feel free to reply to this email.</p>
        <p>Best regards,</p>
        <p><strong>The Himublog Team</strong></p>
      </div>
    `;
    const data = await resend.emails.send({
      from: "Himublog <onboarding@resend.dev>",
      to: ["himangshu73@gmail.com"],
      subject: "hello Moto",
      html: emailBody,
    });

    console.log("Email sent successfully", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
