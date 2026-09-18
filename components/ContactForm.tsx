'use client'

import { useRef, useState, type FormEvent } from 'react'
import OutlineButton from './OutlineButton'
import styles from './ContactFormFields.module.css'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjawljk'

type Status = 'idle' | 'sending' | 'success' | 'error'

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Formspree's upload limit for a whole submission
const MAX_UPLOAD_MB = 25

type Props = {
  /** Unique per page: the brief panel renders a second copy alongside the contact section's */
  id?: string
}

export default function ContactForm({ id = 'contact-form' }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const fail = (message: string) => {
    setStatus('error')
    setErrorMessage(message)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    const name = formData.get('name')?.toString().trim() || ''
    const email = formData.get('email')?.toString().trim() || ''
    const message = formData.get('message')?.toString().trim() || ''

    // Honeypot filled in: likely a bot, so pretend it worked
    if (formData.get('_gotcha')) {
      setStatus('success')
      return
    }

    if (!name) return fail('Name is required.')
    if (!email) return fail('Email is required.')
    if (!isValidEmail(email)) return fail('Please enter a valid email address.')
    if (!message) return fail('Tell us a little about the project.')
    if (message.length < 10) return fail('Message must be at least 10 characters long.')
    const uploadBytes = files.reduce((total, file) => total + file.size, 0)
    if (uploadBytes > MAX_UPLOAD_MB * 1024 * 1024) return fail(`Attachments can be up to ${MAX_UPLOAD_MB}MB in total. Send a link instead?`)

    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })

      if (response.ok) {
        setStatus('success')
        formRef.current?.reset()
        setFiles([])
        return
      }

      const data = await response.json().catch(() => ({}))
      if (Array.isArray(data.errors)) {
        fail(
          data.errors
            .map((err: { message?: string } | string) => (typeof err === 'string' ? err : err.message || 'Validation error'))
            .join(', ')
        )
      } else {
        fail(data.error || 'Something went wrong. Try again.')
      }
    } catch {
      fail('Something went wrong. Try again.')
    }
  }

  const busy = status === 'sending' || status === 'success'

  return (
    <form
      ref={formRef}
      id={id}
      className={styles.form}
      onSubmit={handleSubmit}
      action={FORMSPREE_ENDPOINT}
      method="POST"
      encType="multipart/form-data"
      noValidate
    >
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className={styles.honeypot} aria-hidden="true" />

      <label className={styles.field}>
        <span className={styles.label}>Your name</span>
        <input className={styles.input} type="text" name="name" autoComplete="name" placeholder="Full name" required disabled={busy} />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Email</span>
        <input className={styles.input} type="email" name="email" autoComplete="email" placeholder="you@company.com" required disabled={busy} />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Company / brand</span>
        <input className={styles.input} type="text" name="company" autoComplete="organization" disabled={busy} />
      </label>

      <label className={styles.messageField}>
        <span className={styles.label}>What are we making?</span>
        <textarea
          className={styles.textarea}
          name="message"
          rows={4}
          minLength={10}
          placeholder="Share a few details..."
          required
          disabled={busy}
        />
      </label>

      {/* Optional files: decks, scripts, references. The native input covers the whole zone, so a click opens the picker
          and a file dragged anywhere onto it drops straight in */}
      <div className={styles.attach}>
        <span className={styles.label}>Attachments</span>
        <label
          className={styles.attachRow}
          data-filled={files.length > 0 || undefined}
          data-dragging={dragging || undefined}
          onDragEnter={() => setDragging(true)}
          onDragLeave={(e) => {
            // Leaving for a child of the zone isn't leaving the zone
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
          }}
          onDrop={() => setDragging(false)}
        >
          <input
            className={styles.fileInput}
            type="file"
            name="attachment"
            multiple
            disabled={busy}
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
          <span className={styles.attachAction} aria-hidden="true">
            <svg viewBox="0 0 10 10" focusable="false">
              <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <span className={styles.attachText}>
            {dragging
              ? 'Drop to attach'
              : files.length > 0
                ? files.map((file) => file.name).join(', ')
                : 'Drop a deck, script or references, or browse'}
          </span>
          <span className={styles.attachHint}>
            {files.length > 1 ? `${files.length} files` : `Up to ${MAX_UPLOAD_MB}MB`}
          </span>
        </label>
      </div>

      <div className={styles.actions}>
        <OutlineButton type="submit" disabled={busy} variant="white">
          {status === 'sending' ? 'Sending…' : status === 'success' ? 'Sent' : 'Send the brief'}
        </OutlineButton>

        <div role="status" aria-live="polite" aria-atomic="true">
          {status === 'success' && <p className={styles.status}>Thanks. We&apos;ll reply soon.</p>}
          {status === 'error' && errorMessage && <p className={`${styles.status} ${styles.error}`}>{errorMessage}</p>}
        </div>
      </div>
    </form>
  )
}
