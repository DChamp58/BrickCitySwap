interface TermsViewProps {
  onNavigate?: (view: 'privacy') => void;
}

export function TermsView({ onNavigate }: TermsViewProps) {
  const headingStyle = { fontSize: '24px', color: '#402E32', marginTop: '32px', marginBottom: '12px', fontWeight: 700 };
  const paragraphStyle = { fontSize: '15px', color: '#402E32', lineHeight: '1.7', marginBottom: '12px' };
  const listStyle = { fontSize: '15px', color: '#402E32', lineHeight: '1.7', marginBottom: '12px', paddingLeft: '24px' };

  return (
    <div className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="w-full" style={{ backgroundColor: '#FFF6EE', borderBottom: '1px solid #E8D5C4' }}>
        <div className="max-w-[900px] mx-auto" style={{ padding: '48px 48px 32px 48px' }}>
          <h1 className="font-bold" style={{ fontSize: '56px', color: '#402E32', marginBottom: '16px', lineHeight: '1.1' }}>
            Terms of Service
          </h1>
          <p className="font-normal" style={{ fontSize: '16px', color: '#B5866E', lineHeight: '1.6' }}>
            Last updated: May 1, 2026
          </p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto" style={{ padding: '48px' }}>
        <p style={paragraphStyle}>
          Welcome to BrickCitySwap. These Terms of Service ("Terms") govern your access to and use of the
          BrickCitySwap website, applications, and services (collectively, the "Service"). By creating an account or
          using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
        </p>

        <h2 style={headingStyle}>1. Eligibility</h2>
        <p style={paragraphStyle}>
          The Service is intended for current students, faculty, and staff of the Rochester Institute of Technology
          ("RIT") who are at least 18 years old. By using the Service, you represent that you meet these requirements
          and that you are using a valid RIT-affiliated email address (or another approved campus address).
        </p>

        <h2 style={headingStyle}>2. Accounts</h2>
        <ul style={listStyle}>
          <li>You are responsible for the accuracy of the information you provide and for keeping it up to date.</li>
          <li>You are responsible for maintaining the confidentiality of your password and for all activity under your account.</li>
          <li>You must notify us promptly if you suspect unauthorized use of your account.</li>
          <li>One person may not maintain more than one account without our written permission.</li>
        </ul>

        <h2 style={headingStyle}>3. Listings & User Content</h2>
        <p style={paragraphStyle}>
          BrickCitySwap is a platform that lets users post listings and communicate with other users. We do not own,
          inspect, or endorse listings or user-generated content ("User Content"). You are solely responsible for the
          User Content you post, including its accuracy, legality, and the right to share it.
        </p>
        <p style={paragraphStyle}>You agree not to post User Content that:</p>
        <ul style={listStyle}>
          <li>Is unlawful, fraudulent, deceptive, defamatory, harassing, threatening, or invasive of privacy.</li>
          <li>Discriminates on the basis of race, color, religion, sex, national origin, disability, or any other protected class.</li>
          <li>Infringes any patent, trademark, trade secret, copyright, or other intellectual property right.</li>
          <li>Promotes weapons, illegal drugs, counterfeit goods, stolen property, or any items prohibited by law or by RIT policy.</li>
          <li>Contains malicious software or attempts to interfere with the Service.</li>
          <li>Misrepresents the condition, location, price, or availability of an item or sublease.</li>
        </ul>
        <p style={paragraphStyle}>
          You grant BrickCitySwap a non-exclusive, worldwide, royalty-free license to host, store, display,
          reproduce, and distribute your User Content for the purpose of operating and promoting the Service. You
          retain ownership of your User Content.
        </p>

        <h2 style={headingStyle}>4. Transactions Between Users</h2>
        <p style={paragraphStyle}>
          BrickCitySwap is not a party to any agreement, sale, lease, or sublease between users. We do not verify
          listings, screen users, or guarantee the truthfulness of any information provided. You are responsible for
          conducting your own diligence, including:
        </p>
        <ul style={listStyle}>
          <li>Inspecting items, units, or property in person before exchanging money.</li>
          <li>Reviewing and complying with any applicable lease, landlord rules, RIT housing policies, and local laws.</li>
          <li>Choosing safe meeting locations and payment methods.</li>
        </ul>
        <p style={paragraphStyle}>
          Any dispute arising from a transaction is solely between the users involved. BrickCitySwap is not
          responsible for any loss, damage, or injury caused by interactions or transactions between users.
        </p>

        <h2 style={headingStyle}>5. Subscriptions & Payments</h2>
        <ul style={listStyle}>
          <li>Some features (such as posting listings) require a paid subscription. Pricing is shown on the Pricing page and may change with notice.</li>
          <li>Subscriptions automatically renew at the end of each billing period until canceled.</li>
          <li>You can cancel at any time; cancellation takes effect at the end of the current billing period.</li>
          <li>Except where required by law, fees are non-refundable.</li>
          <li>Payments are processed by a third-party provider; you agree to that provider's terms.</li>
        </ul>

        <h2 style={headingStyle}>6. Acceptable Use</h2>
        <p style={paragraphStyle}>You agree not to:</p>
        <ul style={listStyle}>
          <li>Use the Service for any unlawful purpose or in violation of these Terms or RIT policies.</li>
          <li>Scrape, copy, or republish listings or other content without permission.</li>
          <li>Send spam, chain messages, or unsolicited advertising.</li>
          <li>Impersonate any person or misrepresent your affiliation with any entity.</li>
          <li>Interfere with the security or operation of the Service, or attempt to access accounts you do not own.</li>
          <li>Use the Service to harass, threaten, or harm any user.</li>
        </ul>

        <h2 style={headingStyle}>7. Reporting & Enforcement</h2>
        <p style={paragraphStyle}>
          If you believe a listing or user violates these Terms, please report it to{' '}
          <a href="mailto:support@brickcityswap.com" style={{ color: '#F76902', textDecoration: 'underline' }}>
            support@brickcityswap.com
          </a>. We may, at our discretion, remove content, suspend or terminate accounts, and cooperate with law
          enforcement when we believe a violation has occurred.
        </p>

        <h2 style={headingStyle}>8. Intellectual Property</h2>
        <p style={paragraphStyle}>
          The Service, including its design, logos, and software, is owned by BrickCitySwap or its licensors and is
          protected by intellectual property laws. We grant you a limited, revocable, non-exclusive license to use
          the Service for its intended purpose. All other rights are reserved.
        </p>

        <h2 style={headingStyle}>9. Disclaimers</h2>
        <p style={paragraphStyle}>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED,
          INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT
          WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT ANY USER OR LISTING IS LEGITIMATE.
          BRICKCITYSWAP IS NOT AFFILIATED WITH RIT.
        </p>

        <h2 style={headingStyle}>10. Limitation of Liability</h2>
        <p style={paragraphStyle}>
          TO THE FULLEST EXTENT PERMITTED BY LAW, BRICKCITYSWAP AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AND AGENTS
          WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS
          OF PROFITS, REVENUE, OR DATA, ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM
          RELATED TO THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE MONTHS
          PRECEDING THE CLAIM OR (B) ONE HUNDRED U.S. DOLLARS ($100).
        </p>

        <h2 style={headingStyle}>11. Indemnification</h2>
        <p style={paragraphStyle}>
          You agree to indemnify and hold harmless BrickCitySwap and its affiliates from any claim, demand, loss, or
          expense (including reasonable attorneys' fees) arising out of your use of the Service, your User Content,
          your transactions with other users, or your violation of these Terms or any law.
        </p>

        <h2 style={headingStyle}>12. Termination</h2>
        <p style={paragraphStyle}>
          We may suspend or terminate your access to the Service at any time, with or without notice, if we believe
          you have violated these Terms or for any other reason. You may stop using the Service at any time. Sections
          that by their nature should survive termination (including ownership, disclaimers, and limitation of
          liability) will survive.
        </p>

        <h2 style={headingStyle}>13. Governing Law & Disputes</h2>
        <p style={paragraphStyle}>
          These Terms are governed by the laws of the State of New York, without regard to its conflict-of-laws
          rules. Any dispute arising from these Terms or the Service will be resolved exclusively in the state or
          federal courts located in Monroe County, New York, and you consent to personal jurisdiction there.
        </p>

        <h2 style={headingStyle}>14. Changes to These Terms</h2>
        <p style={paragraphStyle}>
          We may update these Terms from time to time. When we do, we will revise the "Last updated" date and may
          notify you by email or in-app notice for material changes. Continued use of the Service after changes take
          effect constitutes your acceptance of the revised Terms.
        </p>

        <h2 style={headingStyle}>15. Contact Us</h2>
        <p style={paragraphStyle}>
          Questions about these Terms can be sent to{' '}
          <a href="mailto:support@brickcityswap.com" style={{ color: '#F76902', textDecoration: 'underline' }}>
            support@brickcityswap.com
          </a>.
        </p>

        {onNavigate && (
          <p style={{ ...paragraphStyle, marginTop: '32px' }}>
            See also our{' '}
            <button
              onClick={() => onNavigate('privacy')}
              style={{ color: '#F76902', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
            >
              Privacy Policy
            </button>.
          </p>
        )}
      </div>
    </div>
  );
}
