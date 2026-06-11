import emailjs from '@emailjs/browser'

// EmailJS configuration — set these in .env file
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'YOUR_SERVICE_ID'
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? 'YOUR_TEMPLATE_ID'
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? 'YOUR_PUBLIC_KEY'

export interface ContactFormData {
  from_name: string
  from_email: string
  message: string
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      from_name: data.from_name,
      from_email: data.from_email,
      message: data.message,
      to_name: 'Dilshan Nadeeranga',
      reply_to: data.from_email,
    },
    PUBLIC_KEY
  )
}
