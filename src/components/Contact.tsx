import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Phone, MapPin, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { sendContactEmail, type ContactFormData } from '../utils/emailjs'

interface FormState {
  from_name: string
  from_email: string
  message: string
}

type Status = 'idle' | 'sending' | 'success' | 'error'

const CONTACT_INFO = [
  { icon: Mail,  label: 'Email',    value: 'nadeerangadilshan03@gmail.com', href: 'mailto:nadeerangadilshan03@gmail.com' },
  { icon: Phone, label: 'Phone',    value: '+94 764 645 900',               href: 'tel:+94764645900' },
  { icon: MapPin, label: 'Location', value: 'Gampaha, Sri Lanka',            href: '#' },
]

export default function Contact() {
  const [form, setForm]     = useState<FormState>({ from_name: '', from_email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const formRef             = useRef<HTMLFormElement>(null)

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.from_name.trim()) e.from_name = 'Name is required'
    if (!form.from_email.trim()) e.from_email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.from_email)) e.from_email = 'Please enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    try {
      await sendContactEmail(form as ContactFormData)
      setStatus('success')
      setForm({ from_name: '', from_email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name as keyof FormState]) setErrors(p => ({ ...p, [name]: undefined }))
  }

  const inputClass = (field: keyof FormState) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2
    bg-white dark:bg-gray-800/60
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
    focus:ring-primary-500/40 ${
      errors[field]
        ? 'border-red-400 dark:border-red-500/60'
        : 'border-gray-200 dark:border-white/10 focus:border-primary-400 dark:focus:border-primary-500/50'
    }`

  return (
    <section id="contact" className="py-24 relative">
      <div
        className="absolute inset-0 opacity-10 dark:opacity-20"
        style={{ background: 'radial-gradient(ellipse at bottom right, rgba(99,102,241,0.4) 0%, transparent 60%)' }}
      />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
            Get in Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you.
            I typically respond within 24 hours.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Let&apos;s build something amazing together
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Whether you&apos;re looking for a full-stack engineer, DevOps specialist, or AI integration expert,
                I&apos;m open to exciting opportunities. Drop me a message!
              </p>
            </div>

            <div className="space-y-4">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-4 glass-card rounded-xl p-4 hover:border-primary-500/30 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">
                      {label}
                    </div>
                    <div className="text-gray-700 dark:text-gray-200 text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Availability */}
            <div className="glass-card rounded-xl p-4 border-l-4 border-emerald-400 dark:border-emerald-500/60">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium text-sm">
                  Available for freelance &amp; full-time
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 ml-6">
                Open to remote and on-site positions
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="glass-card rounded-2xl p-6 md:p-8 space-y-5"
              noValidate
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="from_name">
                  Your Name
                </label>
                <input
                  id="from_name"
                  name="from_name"
                  type="text"
                  value={form.from_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputClass('from_name')}
                  disabled={status === 'sending'}
                />
                {errors.from_name && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.from_name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="from_email">
                  Email Address
                </label>
                <input
                  id="from_email"
                  name="from_email"
                  type="email"
                  value={form.from_email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={inputClass('from_email')}
                  disabled={status === 'sending'}
                />
                {errors.from_email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.from_email}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or opportunity..."
                  rows={5}
                  className={`${inputClass('message')} resize-none`}
                  disabled={status === 'sending'}
                />
                {errors.message && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.message}</p>}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
                whileTap={{ scale: status === 'sending' ? 1 : 0.98 }}
                disabled={status === 'sending'}
                className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <><Loader2 size={18} className="animate-spin" /> Sending...</>
                ) : (
                  <><Send size={18} /> Send Message</>
                )}
              </motion.button>

              {/* Status feedback */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl
                    bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30
                    text-emerald-700 dark:text-emerald-400 text-sm"
                >
                  <CheckCircle size={16} className="shrink-0" />
                  Message sent successfully! I&apos;ll get back to you soon.
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl
                    bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30
                    text-red-600 dark:text-red-400 text-sm"
                >
                  <XCircle size={16} className="shrink-0" />
                  Failed to send. Email me at nadeerangadilshan03@gmail.com
                </motion.div>
              )}

              <p className="text-center text-gray-400 dark:text-gray-600 text-xs">
                Powered by EmailJS · No backend required
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
