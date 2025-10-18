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
          <p className="text-cocoa">Updated: 2025-10-18</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-cozy border border-gray-200 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-cocoa mb-6">
              Your privacy is important to us. This Privacy Policy explains what personal data we collect, how we use and store it, and what rights you have under the GDPR.
            </p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">1. Who We Are</h2>
            <p className="text-cocoa mb-6">
              Growix is an officially operating online platform designed to connect the dance community. The platform is responsibly managed to ensure reliability, security, and accessibility for all users. Growix provides dancers and organizers the opportunity to find, share, and participate in workshops and open sessions in one place — fostering personal and professional growth as well as community collaboration.
            </p>
            <p className="text-cocoa mb-6">
              Website address: [insert website address]<br />
              Contact email: <a href="mailto:info@growix.lt" className="text-[#df1f66] hover:underline">info@growix.lt</a>
            </p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">2. What Data We Collect</h2>
            <p className="text-cocoa mb-4">We may collect and process the following types of data:</p>
            <p className="text-cocoa mb-2"><strong>Registration data:</strong> email address, username, password</p>
            <p className="text-cocoa mb-2"><strong>Account information:</strong> profile picture, biography, social media links, and content created on the platform (e.g., workshops)</p>
            <p className="text-cocoa mb-6"><strong>Technical data:</strong> cookies (used for website functionality)</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">3. How We Use Your Data</h2>
            <p className="text-cocoa mb-4">Your data is used for the following purposes:</p>
            <p className="text-cocoa mb-2">• Account administration and content access management</p>
            <p className="text-cocoa mb-6">• System improvement and error identification</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">4. Legal Basis for Processing</h2>
            <p className="text-cocoa mb-4">We process your data based on:</p>
            <p className="text-cocoa mb-2">• Your consent (e.g., when registering or using the platform)</p>
            <p className="text-cocoa mb-6">• Our legitimate interest to maintain and improve the service</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">5. Data Storage and Security</h2>
            <p className="text-cocoa mb-2">Your data is stored on a secure MongoDB database located on protected servers.</p>
            <p className="text-cocoa mb-2">Passwords are encrypted and hashed using bcrypt and are not visible to administrators or any unauthorized parties.</p>
            <p className="text-cocoa mb-2">Your data is not sold, rented, or shared with third parties, except with trusted service providers who assist in operating and maintaining the website.</p>
            <p className="text-cocoa mb-6">We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">6. Your Rights under GDPR</h2>
            <p className="text-cocoa mb-4">Under the GDPR, you have the right to:</p>
            <p className="text-cocoa mb-2">• Access your personal data</p>
            <p className="text-cocoa mb-2">• Correct any inaccurate data</p>
            <p className="text-cocoa mb-2">• Request deletion of your data</p>
            <p className="text-cocoa mb-2">• Object to the use of your data</p>
            <p className="text-cocoa mb-2">• File a complaint with the State Data Protection Inspectorate</p>
            <p className="text-cocoa mb-6">To exercise your rights, please contact us at: <a href="mailto:info@growix.lt" className="text-[#df1f66] hover:underline">info@growix.lt</a></p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">7. Consent</h2>
            <p className="text-cocoa mb-6">By using this website, you agree to this Privacy Policy and the processing of your personal data as described above.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">8. Changes to the Privacy Policy</h2>
            <p className="text-cocoa mb-6">This Privacy Policy may be updated from time to time. We will notify users of significant changes via the website.</p>
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
