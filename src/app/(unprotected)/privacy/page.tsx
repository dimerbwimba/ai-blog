import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | TravelKaya",
  description: "Our comprehensive privacy policy explains how we collect, use, and protect your personal information while using our travel blog services.",
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-muted p-6 md:sticky top-12 rounded-lg">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <a href="#introduction" className="block text-sm hover:text-primary">Introduction</a>
              <a href="#information" className="block text-sm hover:text-primary">Information We Collect</a>
              <a href="#usage" className="block text-sm hover:text-primary">How We Use Information</a>
              <a href="#cookies" className="block text-sm hover:text-primary">Cookies & Tracking</a>
              <a href="#security" className="block text-sm hover:text-primary">Data Security</a>
              <a href="#third-party" className="block text-sm hover:text-primary">Third-Party Services</a>
              <a href="#rights" className="block text-sm hover:text-primary">Your Rights</a>
              <a href="#changes" className="block text-sm hover:text-primary">Policy Changes</a>
              <a href="#contact" className="block text-sm hover:text-primary">Contact Us</a>
            </nav>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you have questions about our privacy policy or data practices, our support team is here to help.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Contact Support →
            </Link>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Related Policies</h3>
            <Link 
              href="/terms"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Terms of Service →
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-8 bg-white">
          <div className="p-8 rounded-lg shadow-sm">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section id="introduction">
                <h2 className="text-2xl font-semibold">Introduction</h2>
                <p>
                  Welcome to TravelKaya's Privacy Policy. Your privacy is critically important to us. This Privacy Policy document contains types of information that is collected and recorded by our Travel Blog and how we use it. By using our services, you agree to the collection and use of information in accordance with this policy.
                </p>
                <p className="text-muted-foreground">
                  This policy applies to all services offered by TravelKaya, including our website, mobile applications, and related services.
                </p>
              </section>

              <section id="information">
                <h2 className="text-2xl font-semibold">Information We Collect</h2>
                <ul>
                  <li>
                    <strong>View Tracking:</strong> We collect anonymous view counts on articles to understand which content is most valuable to our readers. This helps us improve our <Link href="/blog" className="text-primary hover:underline">blog content</Link>.
                  </li>
                  <li>
                    <strong>Newsletter Subscriptions:</strong> If you subscribe to our newsletter through our subscription page, we collect your email address and name (optional).
                  </li>
                  <li>
                    <strong>Comments:</strong> When you comment on our articles, we collect your name and comment content. You can manage your comments in your user dashboard.
                  </li>
                  <li>
                    <strong>Log Data:</strong> We collect information that your browser sends whenever you visit our website, including your IP address, browser type, browser version, pages visited, time and date of visits, and other statistics.
                  </li>
                  <li>
                    <strong>User Preferences:</strong> We store your theme preferences (light/dark mode) and language settings to enhance your browsing experience.
                  </li>
                  <li>
                    <strong>Location Data:</strong> With your consent, we may collect and process information about your location to provide location-specific content and recommendations.
                  </li>
                  <li>
                    <strong>Device Information:</strong> We collect information about the device you use to access our services, including device type, operating system, and unique device identifiers.
                  </li>
                </ul>
              </section>

              <section id="usage">
                <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
                <p>We use the collected information for various purposes:</p>
                <ul>
                  <li>To provide and maintain our service</li>
                  <li>To notify you about changes to our service</li>
                  <li>To provide customer support through our help center</li>
                  <li>To gather analysis or valuable information to improve our service</li>
                  <li>To monitor the usage of our service</li>
                  <li>To detect, prevent and address technical issues</li>
                  <li>To personalize your experience and deliver content tailored to your interests</li>
                  <li>To process and manage your subscription preferences</li>
                </ul>
              </section>

              <section id="cookies">
                <h2 className="text-2xl font-semibold">Cookies and Tracking</h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can learn more about how we use cookies on our <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link> page.
                </p>
              </section>

              <section id="security">
                <h2 className="text-2xl font-semibold">Data Security</h2>
                <p>
                  The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. We implement industry-standard security measures to protect your personal information. Learn more about our security practices on our <Link href="/security" className="text-primary hover:underline">Security Information</Link> page.
                </p>
              </section>

              <section id="third-party">
                <h2 className="text-2xl font-semibold">Third-Party Services</h2>
                <p>
                  We may employ third-party companies and individuals for the following reasons:
                </p>
                <ul>
                  <li>To facilitate our service</li>
                  <li>To provide the service on our behalf</li>
                  <li>To perform service-related services</li>
                  <li>To assist us in analyzing how our service is used</li>
                  <li>To process payments securely through trusted payment processors</li>
                  <li>To send newsletters through verified email service providers</li>
                </ul>
              </section>

              <section id="rights">
                <h2 className="text-2xl font-semibold">Your Rights</h2>
                <p>
                  Under applicable data protection laws, you have the following rights:
                </p>
                <ul>
                  <li>Access your personal data through our data portal</li>
                  <li>Correct any inaccurate personal data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing your personal data</li>
                  <li>Request transfer of your personal data</li>
                  <li>Withdraw consent at any time through our preference center</li>
                </ul>
              </section>

              <section id="changes">
                <h2 className="text-2xl font-semibold">Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;effective date&quot; at the top of this Privacy Policy. You&apos;re advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section id="contact">
                <h2 className="text-2xl font-semibold">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul>
                  <li>By email: <a href="mailto:privacy@travalkaya.com" className="text-primary hover:underline">privacy@travalkaya.com</a></li>
                  <li>By visiting our <Link href="/contact" className="text-primary hover:underline">contact page</Link></li>
                  <li>Through our <Link href="/support/tickets" className="text-primary hover:underline">support ticket system</Link></li>
                </ul>
              </section>

              <footer className="text-sm text-muted-foreground border-t pt-6 mt-8">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Effective date: January 1, 2024</p>
                <p className="mt-2">Please also review our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}