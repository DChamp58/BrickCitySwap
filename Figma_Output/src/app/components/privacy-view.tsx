interface PrivacyViewProps {
  onNavigate?: (view: 'terms') => void;
}

export function PrivacyView({ onNavigate }: PrivacyViewProps) {
  const headingStyle = { fontSize: '24px', color: '#402E32', marginTop: '32px', marginBottom: '12px', fontWeight: 700 };
  const subheadingStyle = { fontSize: '18px', color: '#402E32', marginTop: '20px', marginBottom: '8px', fontWeight: 600 };
  const paragraphStyle = { fontSize: '15px', color: '#402E32', lineHeight: '1.7', marginBottom: '12px' };
  const listStyle = { fontSize: '15px', color: '#402E32', lineHeight: '1.7', marginBottom: '12px', paddingLeft: '24px' };

  return (
    <div className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="w-full" style={{ backgroundColor: '#FFF6EE', borderBottom: '1px solid #E8D5C4' }}>
        <div className="max-w-[900px] mx-auto" style={{ padding: '48px 48px 32px 48px' }}>
          <h1 className="font-bold" style={{ fontSize: '56px', color: '#402E32', marginBottom: '16px', lineHeight: '1.1' }}>
            Privacy Policy
          </h1>
          <p className="font-normal" style={{ fontSize: '16px', color: '#B5866E', lineHeight: '1.6' }}>
            Last updated: May 1, 2026
          </p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto" style={{ padding: '48px' }}>
        <p style={paragraphStyle}>
          BrickCitySwap ("we," "us," or "our") operates a student housing and marketplace platform for members of the
          Rochester Institute of Technology ("RIT") community. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you use our website and services (collectively, the
          "Service"). By using the Service, you agree to the practices described below.
        </p>

        <h2 style={headingStyle}>1. Information We Collect</h2>

        <h3 style={subheadingStyle}>1.1 Information You Provide</h3>
        <ul style={listStyle}>
          <li><strong>Account information:</strong> Name, email address, password, and (optionally) profile photo.</li>
          <li><strong>Listing content:</strong> Photos, descriptions, prices, locations, and any other details you submit when creating a listing.</li>
          <li><strong>Messages:</strong> Conversations you exchange with other users through our in-app messaging.</li>
          <li><strong>Payment information:</strong> If you subscribe to a paid plan, payment details are processed by our third-party payment provider; we do not store full card numbers on our servers.</li>
          <li><strong>Support requests:</strong> Information you share when you contact us for help or to report issues.</li>
        </ul>

        <h3 style={subheadingStyle}>1.2 Information Collected Automatically</h3>
        <ul style={listStyle}>
          <li><strong>Usage data:</strong> Pages visited, listings viewed, search terms, and interactions with features.</li>
          <li><strong>Device data:</strong> Browser type, operating system, IP address, and approximate location derived from your IP.</li>
          <li><strong>Cookies & similar technologies:</strong> Used to keep you signed in, remember preferences, and measure performance.</li>
        </ul>

        <h2 style={headingStyle}>2. How We Use Your Information</h2>
        <ul style={listStyle}>
          <li>Operate, maintain, and improve the Service.</li>
          <li>Verify your eligibility (e.g., RIT email domain) and create your profile.</li>
          <li>Display your listings, profile, and messages to other users as appropriate.</li>
          <li>Process subscription payments and prevent fraudulent activity.</li>
          <li>Send service-related emails (account updates, security notices, message notifications).</li>
          <li>Respond to support requests and enforce our Terms of Service.</li>
          <li>Analyze usage to inform new features and design decisions.</li>
        </ul>

        <h2 style={headingStyle}>3. How We Share Your Information</h2>
        <p style={paragraphStyle}>
          We do not sell your personal information. We share information only in the following circumstances:
        </p>
        <ul style={listStyle}>
          <li><strong>With other users:</strong> Your name, profile photo, and listings are visible to other signed-in users. Messages you send are shared with the recipient.</li>
          <li><strong>With service providers:</strong> Hosting (Supabase), payment processing, email delivery, and analytics partners that help us operate the Service. These providers are contractually limited in how they may use your data.</li>
          <li><strong>For legal reasons:</strong> When required by law, subpoena, or to protect the safety, rights, or property of BrickCitySwap, our users, or the public.</li>
          <li><strong>In a business transfer:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred subject to this Policy.</li>
        </ul>

        <h2 style={headingStyle}>4. Data Retention</h2>
        <p style={paragraphStyle}>
          We retain your account and listing information for as long as your account is active. You may delete your
          listings or account at any time. We may retain certain information for legitimate business purposes such as
          fraud prevention, tax, accounting, or legal compliance.
        </p>

        <h2 style={headingStyle}>5. Your Rights & Choices</h2>
        <ul style={listStyle}>
          <li><strong>Access & update:</strong> You can view and update your profile information from the Profile page.</li>
          <li><strong>Delete:</strong> You may delete your listings at any time and request account deletion by contacting us.</li>
          <li><strong>Email preferences:</strong> You can manage notification settings in your account or unsubscribe from marketing emails via the link in those emails.</li>
          <li><strong>Cookies:</strong> You can disable cookies in your browser, though parts of the Service may not function correctly.</li>
        </ul>

        <h2 style={headingStyle}>6. Security</h2>
        <p style={paragraphStyle}>
          We use industry-standard safeguards including encryption in transit, hashed passwords, and Row Level
          Security on our database. No system is perfectly secure; we cannot guarantee absolute security of your
          information. Please use a strong, unique password and notify us immediately if you suspect unauthorized
          access to your account.
        </p>

        <h2 style={headingStyle}>7. Children's Privacy</h2>
        <p style={paragraphStyle}>
          The Service is intended for college students aged 18 and older. We do not knowingly collect personal
          information from children under 13. If you believe a child has provided us information, please contact us
          and we will take steps to delete it.
        </p>

        <h2 style={headingStyle}>8. Third-Party Links</h2>
        <p style={paragraphStyle}>
          Listings or messages may contain links to third-party websites. We are not responsible for the privacy
          practices of those sites and encourage you to review their policies.
        </p>

        <h2 style={headingStyle}>9. Changes to This Policy</h2>
        <p style={paragraphStyle}>
          We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date and
          may notify you by email or in-app notice for material changes. Continued use of the Service after changes
          take effect constitutes your acceptance of the revised Policy.
        </p>

        <h2 style={headingStyle}>10. Contact Us</h2>
        <p style={paragraphStyle}>
          Questions or requests about this Privacy Policy can be sent to{' '}
          <a href="mailto:privacy@brickcityswap.com" style={{ color: '#F76902', textDecoration: 'underline' }}>
            privacy@brickcityswap.com
          </a>.
        </p>

        {onNavigate && (
          <p style={{ ...paragraphStyle, marginTop: '32px' }}>
            See also our{' '}
            <button
              onClick={() => onNavigate('terms')}
              style={{ color: '#F76902', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
            >
              Terms of Service
            </button>.
          </p>
        )}
      </div>
    </div>
  );
}
