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
          <p className="text-cocoa">Effective Date: 2026-03-17</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-cozy border border-gray-200 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-cocoa mb-6">
              By using Growix, you agree to these Terms & Conditions and our Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">1. About Growix</h2>
            <p className="text-cocoa mb-2">Growix is an online platform designed to connect dancers and workshop organizers.</p>
            <p className="text-cocoa mb-2">Growix operates as an individual business registered in Lithuania.</p>
            <p className="text-cocoa mb-6">
              Website address: https://www.growix.lt/<br />
              Contact email: <a href="mailto:info@growix.lt" className="text-[#df1f66] hover:underline">info@growix.lt</a>
            </p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">2. User Roles</h2>
            
            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">2.1 Organizers</h3>
            <p className="text-cocoa mb-2">Organizers may:</p>
            <p className="text-cocoa mb-2">• Create workshops and events</p>
            <p className="text-cocoa mb-2">• Manage their content</p>
            <p className="text-cocoa mb-4">• View participant lists after payments</p>

            <p className="text-cocoa mb-2">Organizers must:</p>
            <p className="text-cocoa mb-2">• Provide accurate and truthful information</p>
            <p className="text-cocoa mb-2">• Provide valid IBAN for payouts</p>
            <p className="text-cocoa mb-4">• Be fully responsible for their events</p>

            <p className="text-cocoa mb-2">Organizers must NOT:</p>
            <p className="text-cocoa mb-2">• Post fake or misleading events</p>
            <p className="text-cocoa mb-2">• Duplicate workshops</p>
            <p className="text-cocoa mb-6">• Misrepresent ownership</p>

            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">2.2 Users</h3>
            <p className="text-cocoa mb-2">Users may:</p>
            <p className="text-cocoa mb-2">• Create accounts</p>
            <p className="text-cocoa mb-2">• Register for workshops</p>
            <p className="text-cocoa mb-2">• Save favorite events</p>
            <p className="text-cocoa mb-6">• Become organizers</p>

            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">2.3 Administrators</h3>
            <p className="text-cocoa mb-2">Administrators may:</p>
            <p className="text-cocoa mb-2">• Manage platform content</p>
            <p className="text-cocoa mb-2">• Remove or restrict users</p>
            <p className="text-cocoa mb-4">• Ensure platform security</p>

            <p className="text-cocoa mb-6">They may take action if content violates laws or these Terms.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">3. Content Responsibility</h2>
            
            <p className="text-cocoa mb-2">Users are fully responsible for any content they publish on Growix.</p>
            <p className="text-cocoa mb-2">Growix is not responsible for:</p>
            <p className="text-cocoa mb-2">• User-generated content</p>
            <p className="text-cocoa mb-4">• The quality, safety, or execution of events organized by third parties</p>
            <p className="text-cocoa mb-6">Growix may review or moderate content, but this does not constitute a guarantee of accuracy, quality, or reliability.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">4. Platform Availability</h2>
            <p className="text-cocoa mb-2">We strive to ensure continuous platform availability but cannot guarantee uninterrupted service.</p>
            <p className="text-cocoa mb-2">Growix is not liable for:</p>
            <p className="text-cocoa mb-2">• Downtime</p>
            <p className="text-cocoa mb-2">• Data loss</p>
            <p className="text-cocoa mb-6">• Technical issues</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">5. Payments and Payouts</h2>
            <p className="text-cocoa mb-2">• Growix collects payments on behalf of workshop organizers</p>
            <p className="text-cocoa mb-2">• After successful payment, organizers gain access to participant lists</p>
            <p className="text-cocoa mb-2">• Funds are transferred to organizers within 1–2 business days after the event</p>
            <p className="text-cocoa mb-2">Organizers must provide a valid IBAN to receive payouts.</p>
            <p className="text-cocoa mb-6">Once funds are transferred to the organizer, Growix does not issue refunds.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">6. Platform Role and Responsibility</h2>
            <p className="text-cocoa mb-2">Growix operates primarily as an intermediary platform connecting participants with independent workshop organizers.</p>
            <p className="text-cocoa mb-2">Workshops listed on the platform may be organized either by independent organizers or, in some cases, directly by Growix.</p>
            <p className="text-cocoa mb-2">For workshops organized by independent organizers:</p>
            <p className="text-cocoa mb-2">• Growix acts solely as a technical and payment intermediary</p>
            <p className="text-cocoa mb-4">• The organizer is fully responsible for the event, including its content, execution, and communication with participants</p>
            <p className="text-cocoa mb-2">Growix may review or moderate content; however, this does not constitute a guarantee of quality or execution.</p>
            <p className="text-cocoa mb-2">For workshops organized by Growix:</p>
            <p className="text-cocoa mb-2">• Growix assumes responsibility for the organization and execution of the event</p>
            <p className="text-cocoa mb-2">When a participant purchases a workshop, payment is:</p>
            <p className="text-cocoa mb-2">• Transferred to the organizer after the event (for third-party workshops), or</p>
            <p className="text-cocoa mb-6">• Retained by Growix (for Growix-organized workshops)</p>
            <p className="text-cocoa mb-6">Users acknowledge and agree to this distinction when using the platform.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">7. Cancellation & Refund Policy</h2>
            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">7.1 User Cancellation</h3>
            <p className="text-cocoa mb-6">• Refunds are issued within 1–2 business days to the original payment method</p>

            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">7.2 Organizer Cancellation</h3>
            <p className="text-cocoa mb-2">• The organizer must notify Growix via email: <a href="mailto:info@growix.lt" className="text-[#df1f66] hover:underline">info@growix.lt</a></p>
            <p className="text-cocoa mb-6">• Participants receive a full refund within 1–2 business days</p>

            <h3 className="text-xl font-semibold text-dusk mb-3 font-poppins">7.3 Deleted Workshops</h3>
            <p className="text-cocoa mb-2">• Refunds are issued automatically</p>
            <p className="text-cocoa mb-2">• Growix does NOT guarantee notification to participants</p>
            <p className="text-cocoa mb-6">• The organizer is fully responsible for informing participants about cancellations</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">8. Organizer Responsibility</h2>
            <p className="text-cocoa mb-2">Organizers are fully responsible for:</p>
            <p className="text-cocoa mb-2">• Event execution</p>
            <p className="text-cocoa mb-2">• Communication with participants</p>
            <p className="text-cocoa mb-2">• Accuracy of provided information</p>
            <p className="text-cocoa mb-6">Growix acts as an intermediary platform except in cases where it explicitly organizes the event.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">9. Workshop Types</h2>
            <p className="text-cocoa mb-2">Organizers may create:</p>
            <p className="text-cocoa mb-2">• Workshops</p>
            <p className="text-cocoa mb-2">• Events</p>
            <p className="text-cocoa mb-2">• Dance sessions</p>
            <p className="text-cocoa mb-2">All events must:</p>
            <p className="text-cocoa mb-2">• Be clearly defined</p>
            <p className="text-cocoa mb-2">• Have a fixed price (if paid)</p>
            <p className="text-cocoa mb-2">• Be standalone (one-time events)</p>
            <p className="text-cocoa mb-6">Recurring or subscription-based activities are not supported.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">10. Limitation of Liability</h2>
            <p className="text-cocoa mb-2">Growix is not responsible for:</p>
            <p className="text-cocoa mb-2">• Actions or behavior of organizers</p>
            <p className="text-cocoa mb-2">• Event cancellations or changes made by organizers</p>
            <p className="text-cocoa mb-2">• Disputes arising after funds have been transferred</p>
            <p className="text-cocoa mb-6">Any disputes must be resolved directly between the participant and the organizer.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">11. Privacy</h2>
            <p className="text-cocoa mb-6">Personal data is processed in accordance with GDPR and our Privacy Policy.</p>

            <h2 className="text-2xl font-semibold text-dusk mb-4 font-poppins">12. Changes to Terms</h2>
            <p className="text-cocoa mb-6">Growix reserves the right to update these Terms at any time. Changes take effect upon publication on the website.</p>
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
