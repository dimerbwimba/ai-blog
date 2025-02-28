import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | TravelKaya",
  description: "Read our terms of service to understand the rules, guidelines, and agreements for using TravelKaya's services.",
}

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-muted p-6 md:sticky top-12 rounded-lg">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <a href="#introduction" className="block text-sm hover:text-primary">Introduction</a>
              <a href="#acceptance" className="block text-sm hover:text-primary">Acceptance of Terms</a>
              <a href="#eligibility" className="block text-sm hover:text-primary">Eligibility</a>
              <a href="#account" className="block text-sm hover:text-primary">User Accounts</a>
              <a href="#content" className="block text-sm hover:text-primary">User Content</a>
              <a href="#intellectual" className="block text-sm hover:text-primary">Intellectual Property</a>
              <a href="#prohibited" className="block text-sm hover:text-primary">Prohibited Activities</a>
              <a href="#disclaimer" className="block text-sm hover:text-primary">Disclaimers</a>
              <a href="#termination" className="block text-sm hover:text-primary">Termination</a>
            </nav>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Have Questions?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you need clarification about our terms, our support team is ready to help.
            </p>
            <Link 
              href="/contact"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Contact Support →
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section id="introduction">
                <h2 className="text-2xl font-semibold">Introduction</h2>
                <p>
                  Welcome to TravelKaya. These Terms of Service govern your use of our website, services, and content. 
                  By accessing or using our services, you agree to be bound by these terms.
                </p>
              </section>

              <section id="acceptance">
                <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
                <p>
                  By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these terms. 
                  If you do not agree with any part of these terms, you must not use our services.
                </p>
              </section>

              <section id="eligibility">
                <h2 className="text-2xl font-semibold">Eligibility</h2>
                <p>
                  You must be at least 13 years old to use our services. If you are under 18, you must have parental consent. 
                  By using our services, you represent and warrant that you meet these eligibility requirements.
                </p>
              </section>

              <section id="account">
                <h2 className="text-2xl font-semibold">User Accounts</h2>
                <ul>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section id="content">
                <h2 className="text-2xl font-semibold">User Content</h2>
                <p>
                  When you submit content to our platform (including comments, reviews, and photos):
                </p>
                <ul>
                  <li>You retain ownership of your content</li>
                  <li>You grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content</li>
                  <li>You are responsible for ensuring your content does not violate any laws or rights</li>
                  <li>We reserve the right to remove any content at our discretion</li>
                </ul>
              </section>

              <section id="intellectual">
                <h2 className="text-2xl font-semibold">Intellectual Property</h2>
                <p>
                  All content, features, and functionality of our services are owned by TravelKaya and are protected by copyright, 
                  trademark, and other intellectual property laws.
                </p>
              </section>

              <section id="prohibited">
                <h2 className="text-2xl font-semibold">Prohibited Activities</h2>
                <p>You agree not to:</p>
                <ul>
                  <li>Use our services for any illegal purpose</li>
                  <li>Post unauthorized commercial communications</li>
                  <li>Harass, abuse, or harm others</li>
                  <li>Submit false or misleading information</li>
                  <li>Attempt to access unauthorized areas of our services</li>
                  <li>Interfere with or disrupt our services</li>
                </ul>
              </section>

              <section id="disclaimer">
                <h2 className="text-2xl font-semibold">Disclaimers</h2>
                <p>
                  Our services are provided &quot;as is&quot; without any warranties. We do not guarantee that our services will be 
                  uninterrupted, secure, or error-free.
                </p>
              </section>

              <section id="termination">
                <h2 className="text-2xl font-semibold">Termination</h2>
                <p>
                  We reserve the right to terminate or suspend your access to our services immediately, without prior notice or liability, 
                  for any reason, including breach of these Terms.
                </p>
              </section>

              <section id="changes">
                <h2 className="text-2xl font-semibold">Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. We will notify users of any material changes via email 
                  or through our services.
                </p>
              </section>

              <section id="contact">
                <h2 className="text-2xl font-semibold">Contact Information</h2>
                <p>
                  For questions about these Terms, please contact us:
                </p>
                <ul>
                  <li>Email: <a href="mailto:legal@travalkaya.com" className="text-primary hover:underline">legal@travalkaya.com</a></li>
                  <li>Through our <Link href="/contact" className="text-primary hover:underline">contact page</Link></li>
                </ul>
              </section>

              <footer className="text-sm text-muted-foreground border-t pt-6 mt-8">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Effective date: January 1, 2024</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 