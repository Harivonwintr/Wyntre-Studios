'use client'

import { useState, useRef, FormEvent } from 'react'
import OutlineButton from './OutlineButton'

const FORMPREE_ENDPOINT = 'https://formspree.io/f/mnjawljk'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!formRef.current) {
      console.error('Form ref is null')
      return
    }

    const formData = new FormData(formRef.current)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string
    const gotcha = formData.get('_gotcha') as string

    // Honeypot check - if filled, silently succeed
    if (gotcha) {
      setStatus('success')
      return
    }

    // Client-side validation
    if (!name || name.trim() === '') {
      setStatus('error')
      setErrorMessage('Name is required.')
      return
    }

    if (!email || email.trim() === '') {
      setStatus('error')
      setErrorMessage('Email is required.')
      return
    }

    if (!validateEmail(email)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!message || message.trim() === '') {
      setStatus('error')
      setErrorMessage('Message is required.')
      return
    }

    if (message.trim().length < 10) {
      setStatus('error')
      setErrorMessage('Message must be at least 10 characters long.')
      return
    }

    // Submit to Formspree
    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch(FORMPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })

      // Formspree returns 200 OK on success, or 400/422 on validation errors
      if (response.ok) {
        const data = await response.json().catch(() => ({}))
        // Formspree success response can be empty or { next: '...' }
        setStatus('success')
        if (formRef.current) {
          formRef.current.reset()
        }
      } else {
        // Handle error response
        try {
          const data = await response.json()
          setStatus('error')
          if (data.errors && Array.isArray(data.errors)) {
            const errorMessages = data.errors.map((err: any) => err.message || err).join(', ')
            setErrorMessage(errorMessages)
          } else if (data.error) {
            setErrorMessage(data.error)
          } else {
            setErrorMessage('Something went wrong. Try again.')
          }
        } catch (parseError) {
          setStatus('error')
          setErrorMessage('Something went wrong. Try again.')
        }
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setStatus('error')
      setErrorMessage('Something went wrong. Try again.')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent Enter from submitting unless in textarea
    if (e.key === 'Enter' && e.currentTarget.tagName !== 'TEXTAREA') {
      e.preventDefault()
    }
  }

  const getButtonText = () => {
    switch (status) {
      case 'sending':
        return 'SENDING…'
      case 'success':
        return 'SENT'
      default:
        return 'Send Message'
    }
  }

  return (
    <>
      <form 
        ref={formRef}
        onSubmit={handleSubmit}
        id="contact-form"
        action={FORMPREE_ENDPOINT}
        method="POST"
        noValidate
      >
        {/* Honeypot field */}
        <input
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
          aria-hidden="true"
        />

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={status === 'sending' || status === 'success'}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={status === 'sending' || status === 'success'}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            disabled={status === 'sending' || status === 'success'}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            minLength={10}
            disabled={status === 'sending' || status === 'success'}
          />
        </div>

        <div style={{ marginTop: '2rem' }}>
          {status === 'sending' || status === 'success' ? (
            <button
              type="button"
              disabled
              style={{
                background: '#0a0b0d',
                color: '#fff',
                border: '1px solid #0a0b0d',
                borderRadius: '4px',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'not-allowed',
                opacity: 0.7,
                fontFamily: 'inherit',
                transition: 'background 0.2s ease, color 0.2s ease'
              }}
            >
              {getButtonText()}
            </button>
          ) : (
            <OutlineButton type="submit">
              {getButtonText()}
            </OutlineButton>
          )}
        </div>
      </form>

      {/* Status messages */}
      <div 
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{ marginTop: '1rem', minHeight: '1.5rem' }}
      >
        {status === 'success' && (
          <p style={{ color: '#0a0b0d', fontSize: '0.875rem', margin: 0, fontStyle: 'italic' }}>
            Thanks. We'll reply soon.
          </p>
        )}
        {status === 'error' && errorMessage && (
          <p style={{ color: '#d32f2f', fontSize: '0.875rem', margin: 0 }}>
            {errorMessage}
          </p>
        )}
      </div>
    </>
  )
}

