import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-wrap">
        <div className="footer-grid">
          {/* Logo / Brand */}
          <div className="footer-brand">
            <Image 
              src="/assets/logo.svg" 
              alt="Wyntre Studios" 
              className="footer-logo"
              width={200}
              height={200}
            />
          </div>

          {/* Explore */}
          <nav className="footer-col" aria-labelledby="f-explore">
            <h3 id="f-explore" className="footer-head">Explore</h3>
            <ul>
              <li><Link href="/work">Work</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/studio">Studio</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>

          {/* Visit */}
          <div className="footer-col" aria-labelledby="f-visit">
            <h3 id="f-visit" className="footer-head">Visit</h3>
            <address className="footer-address">
              447 Broadway<br />
              2nd Floor Suite #3012<br />
              New York, New York<br />
              10013<br />
              United States
            </address>
          </div>

          {/* Follow */}
          <nav className="footer-col" aria-labelledby="f-follow">
            <h3 id="f-follow" className="footer-head">Follow</h3>
            <ul>
              <li><a href="#" rel="noopener">Facebook</a></li>
              <li><a href="#" rel="noopener">Twitter</a></li>
              <li><a href="#" rel="noopener">Youtube</a></li>
              <li><a href="#" rel="noopener">Instagram</a></li>
            </ul>
          </nav>

          {/* Legal */}
          <nav className="footer-col" aria-labelledby="f-legal">
            <h3 id="f-legal" className="footer-head">Legal</h3>
            <ul>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Privacy</a></li>
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <div className="footer-meta">
          © {currentYear} Wyntre Studios LLC. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}

