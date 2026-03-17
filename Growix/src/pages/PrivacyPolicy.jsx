import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-warm1 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dusk mb-4 font-poppins">Privacy Policy – Growix</h1>
          <p className="text-cocoa">Updated: 2026-03-17</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-cozy border border-gray-200 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-cocoa mb-6">
              Your privacy is important to us. This Privacy Policy explains what personal data we collect, how we use and store it, and what rights you have under the GDPR.
            </p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">1. Who We Are</h2>
            <p className="text-cocoa mb-6">
              Growix is an officially operating online platform designed to connect the dance community. The platform is responsibly managed to ensure reliability, security, and accessibility for all users.
              Growix provides dancers and organizers the opportunity to find, share, and participate in workshops and events in one place — fostering personal and professional growth as well as community collaboration.
            </p>
            <p className="text-cocoa mb-6">
              Website address: https://www.growix.lt/<br />
              Contact email: <a href="mailto:info@growix.lt" className="text-[#df1f66] hover:underline">info@growix.lt</a>
            </p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">2. What Data We Collect</h2>
            <p className="text-cocoa mb-4">We may collect and process the following data:</p>
            <p className="text-cocoa mb-2"><strong>Registration data:</strong> email address, username, password, name</p>
            <p className="text-cocoa mb-2">
              <strong>Account information:</strong> profile picture, biography, social media links, created content (e.g., workshops, events)
            </p>
            <p className="text-cocoa mb-2"><strong>Organizer financial data:</strong> IBAN and payout-related information (only for organizers)</p>
            <p className="text-cocoa mb-6"><strong>Technical data:</strong> cookies (used for website functionality)</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">3. How We Use Your Data</h2>
            <p className="text-cocoa mb-4">Your data is used for:</p>
            <p className="text-cocoa mb-2">• Account management and access control</p>
            <p className="text-cocoa mb-2">• Platform functionality and improvement</p>
            <p className="text-cocoa mb-2">• Workshop registration and payment processing</p>
            <p className="text-cocoa mb-2">• Processing payouts to organizers</p>
            <p className="text-cocoa mb-6">
              For payments, we use <strong>Stripe</strong>. When purchasing a workshop, basic billing data (name, email, payment reference) is shared with Stripe. Full card details are never stored on Growix servers.
              <br />
              Stripe Privacy Policy:{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#df1f66] hover:underline">
                https://stripe.com/privacy
              </a>
            </p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">4. Legal Basis for Processing</h2>
            <p className="text-cocoa mb-4">We process your data based on:</p>
            <p className="text-cocoa mb-2">• Your consent</p>
            <p className="text-cocoa mb-2">• Legitimate interest (platform operation and improvement)</p>
            <p className="text-cocoa mb-6">• Legal obligations (e.g., financial transactions)</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">5. Data Storage and Security</h2>
            <p className="text-cocoa mb-2">• Data is stored on secure MongoDB servers</p>
            <p className="text-cocoa mb-2">• Passwords are encrypted using bcrypt</p>
            <p className="text-cocoa mb-2">• Financial data (e.g., IBAN) is used strictly for payouts</p>
            <p className="text-cocoa mb-2">• We do not sell or rent your data</p>
            <p className="text-cocoa mb-6">We apply industry-standard security measures to protect your information.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">6. Your Rights under GDPR</h2>
            <p className="text-cocoa mb-4">You have the right to:</p>
            <p className="text-cocoa mb-2">• Access your personal data</p>
            <p className="text-cocoa mb-2">• Correct any inaccurate data</p>
            <p className="text-cocoa mb-2">• Request deletion</p>
            <p className="text-cocoa mb-2">• Object to processing</p>
            <p className="text-cocoa mb-2">• File a complaint with authorities</p>
            <p className="text-cocoa mb-6">Contact: <a href="mailto:info@growix.lt" className="text-[#df1f66] hover:underline">info@growix.lt</a></p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">7. Consent</h2>
            <p className="text-cocoa mb-6">By using Growix, you agree to this Privacy Policy.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">8. Changes to the Privacy Policy</h2>
            <p className="text-cocoa mb-6">We may update this policy. Significant changes will be announced on the website.</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-[#df1f66] text-white rounded-lg hover:bg-[#c01a5a] transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
