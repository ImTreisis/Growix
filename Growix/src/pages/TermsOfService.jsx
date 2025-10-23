import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-warm1 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dusk mb-4 font-poppins">Terms & Conditions – Growix</h1>
          <p className="text-cocoa">Effective Date: 2025-10-18</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-cozy border border-gray-200 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-cocoa mb-6">
              Growix is a non-profit online platform designed to connect and strengthen the dance community. By using the Growix website, you agree to these Terms & Conditions and our Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">1. About Growix</h2>
            <p className="text-cocoa mb-2">Growix is an officially operating online platform created to connect dancers and organizers.</p>
            <p className="text-cocoa mb-2">Growix does not generate revenue or operate for commercial profit. Its purpose is to support and promote dance culture.</p>
            <p className="text-cocoa mb-6">
              Website address: https://www.growix.lt/<br />
              Contact email: <a href="mailto:info@growix.lt" className="text-[#df1f66] hover:underline">info@growix.lt</a>
            </p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">2. User Accounts and Access Levels</h2>
            
            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">2.1 Organizers</h3>
            <p className="text-cocoa mb-2">Organizers may:</p>
            <p className="text-cocoa mb-2">• Browse website content;</p>
            <p className="text-cocoa mb-2">• Create an account;</p>
            <p className="text-cocoa mb-2">• Organize workshops or open dance classes that ensure equal accessibility for all participants (e.g., open sessions must not be restricted only to studio members);</p>
            <p className="text-cocoa mb-2">• Create real and valid workshops that users can participate in;</p>
            <p className="text-cocoa mb-4">• Edit and delete their own content.</p>

            <p className="text-cocoa mb-2">Organizers are prohibited from:</p>
            <p className="text-cocoa mb-2">• Creating or advertising non-existent workshops;</p>
            <p className="text-cocoa mb-2">• Posting the same workshop multiple times;</p>
            <p className="text-cocoa mb-2">• Providing false or misleading information;</p>
            <p className="text-cocoa mb-6">• Creating workshops for which they are not responsible.</p>

            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">2.2 Users</h3>
            <p className="text-cocoa mb-2">Users may:</p>
            <p className="text-cocoa mb-2">• Create an account;</p>
            <p className="text-cocoa mb-2">• Save favorite workshops;</p>
            <p className="text-cocoa mb-2">• Edit their profile;</p>
            <p className="text-cocoa mb-6">• Become organizers by creating workshops (in which case, organizer rules also apply).</p>

            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">2.3 Administrators</h3>
            <p className="text-cocoa mb-2">Administrators have full access to all platform functionalities and are responsible for:</p>
            <p className="text-cocoa mb-2">• Managing user access;</p>
            <p className="text-cocoa mb-2">• Moderating content;</p>
            <p className="text-cocoa mb-4">• Ensuring technical maintenance and platform reliability.</p>

            <p className="text-cocoa mb-2">Administrators reserve the right to:</p>
            <p className="text-cocoa mb-2">• Temporarily hide or remove content if there are reasonable doubts about its legality or accuracy;</p>
            <p className="text-cocoa mb-2">• Restrict or remove user accounts that violate these Terms or legal requirements;</p>
            <p className="text-cocoa mb-2">• Inform relevant authorities if necessary.</p>
            <p className="text-cocoa mb-6">Upon lawful request from law enforcement or judicial authorities, administrators may provide user account information in accordance with the laws of the Republic of Lithuania.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">3. Content and Liability</h2>
            
            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">User Responsibility for Content</h3>
            <p className="text-cocoa mb-2">Each user is fully responsible for the content they upload or publish on Growix, including text, photos, videos, event descriptions, and any other materials. Users must ensure that their content:</p>
            <p className="text-cocoa mb-2">• Does not violate third-party rights (e.g., copyrights, trademarks, or privacy rights);</p>
            <p className="text-cocoa mb-2">• Is not offensive, discriminatory, or illegal;</p>
            <p className="text-cocoa mb-4">• Complies with applicable laws and these Terms & Conditions.</p>

            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">Growix Liability Disclaimer</h3>
            <p className="text-cocoa mb-2">Growix is not responsible for any user-generated content. All user-submitted information reflects the views and responsibility of its authors. Growix reserves the right to remove, hide, or restrict any content that violates these Terms, legal requirements, or may harm the platform's reputation, security, or other users.</p>

            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">Platform Reliability</h3>
            <p className="text-cocoa mb-6">Growix strives to ensure all information is accurate and up to date but cannot guarantee that content will always be error-free or uninterrupted. Growix is not liable for any losses or damages resulting from inaccurate information, temporary unavailability, or technical issues.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">4. Content Use and Availability</h2>
            
            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">User-Generated Content</h3>
            <p className="text-cocoa mb-2">Users may upload or share content such as profiles, workshops, and event information. By submitting content, you grant Growix a non-exclusive, worldwide, royalty-free license to display and distribute that content on the platform solely for the purpose of operating and promoting the service.</p>

            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">Ownership</h3>
            <p className="text-cocoa mb-2">Users retain full ownership of their content. Growix does not claim ownership over user-generated materials. However, Growix reserves the right to remove or restrict access to any content that violates these Terms or applicable laws.</p>

            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">Platform Content</h3>
            <p className="text-cocoa mb-2">All website design, text, graphics, logos, and materials created by Growix are owned by or licensed to Growix. You may not copy, distribute, or use any of this content without prior written permission.</p>

            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">Availability</h3>
            <p className="text-cocoa mb-6">Growix strives to keep the platform available and functional at all times. However, we cannot guarantee uninterrupted access. Temporary downtime may occur due to maintenance, updates, or technical issues. Growix is not liable for any unavailability or data loss caused by such interruptions.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">5. Privacy and Data Protection</h2>
            <p className="text-cocoa mb-6">User personal data is processed in accordance with the laws of the Republic of Lithuania and the General Data Protection Regulation (GDPR). Detailed information about data processing is provided in the Privacy Policy available on our website.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">6. Contact Information</h2>
            <p className="text-cocoa mb-6">If you have any questions about your account, content, or these Terms & Conditions, please contact us: <a href="mailto:info@growix.lt" className="text-[#df1f66] hover:underline">info@growix.lt</a></p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">7. Changes to Terms & Conditions</h2>
            <p className="text-cocoa mb-6">Growix administrators reserve the right to update these Terms & Conditions at any time. Revised versions take effect once published on the website.</p>
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
