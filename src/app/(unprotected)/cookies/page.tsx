import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Cookie Policy | TravelKaya",
  description: "Learn about how TravelKaya uses cookies and similar technologies to enhance your browsing experience.",
}

export default function CookiePolicyPage() {
  return (
    <div className="container max-w-4xl py-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-muted p-6 md:sticky top-12 rounded-lg">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <nav className="space-y-2">
              <a href="#what-are-cookies" className="block text-sm hover:text-primary">What Are Cookies</a>
              <a href="#how-we-use" className="block text-sm hover:text-primary">How We Use Cookies</a>
              <a href="#types" className="block text-sm hover:text-primary">Types of Cookies</a>
              <a href="#third-party" className="block text-sm hover:text-primary">Third-Party Cookies</a>
              <a href="#control" className="block text-sm hover:text-primary">Cookie Control</a>
              <a href="#essential" className="block text-sm hover:text-primary">Essential Cookies</a>
              <a href="#preferences" className="block text-sm hover:text-primary">Cookie Preferences</a>
            </nav>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Related Policies</h3>
            <div className="space-y-2">
              <Link 
                href="/privacy"
                className="block text-sm text-primary hover:underline"
              >
                Privacy Policy →
              </Link>
              <Link 
                href="/terms"
                className="block text-sm text-primary hover:underline"
              >
                Terms of Service →
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
              <section id="what-are-cookies">
                <h2 className="text-2xl font-semibold">What Are Cookies</h2>
                <p>
                  Cookies are small text files that are placed on your device when you visit our website. 
                  They help us provide you with a better experience by:
                </p>
                <ul>
                  <li>Remembering your preferences and settings</li>
                  <li>Understanding how you use our website</li>
                  <li>Improving our services based on your behavior</li>
                  <li>Providing personalized content and recommendations</li>
                </ul>
              </section>

              <section id="how-we-use">
                <h2 className="text-2xl font-semibold">How We Use Cookies</h2>
                <p>We use cookies for various purposes, including:</p>
                <ul>
                  <li>Authentication and security</li>
                  <li>Preferences and functionality</li>
                  <li>Analytics and performance</li>
                  <li>Advertising and targeting</li>
                  <li>Social media integration</li>
                </ul>
              </section>

              <section id="types">
                <h2 className="text-2xl font-semibold">Types of Cookies We Use</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium">Essential Cookies</h3>
                    <p>Required for basic website functionality. Cannot be disabled.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium">Functional Cookies</h3>
                    <p>Remember your preferences and personalize your experience.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium">Analytics Cookies</h3>
                    <p>Help us understand how visitors interact with our website.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium">Marketing Cookies</h3>
                    <p>Track your browsing habits to deliver targeted advertising.</p>
                  </div>
                </div>
              </section>

              <section id="third-party">
                <h2 className="text-2xl font-semibold">Third-Party Cookies</h2>
                <p>
                  Some cookies are placed by third-party services that appear on our pages. We use these services to:
                </p>
                <ul>
                  <li>Analyze site traffic (Google Analytics)</li>
                  <li>Enable social sharing (Facebook, Twitter)</li>
                  <li>Provide media playback (YouTube, Vimeo)</li>
                  <li>Display advertisements</li>
                </ul>
              </section>

              <section id="control">
                <h2 className="text-2xl font-semibold">Cookie Control</h2>
                <p>
                  You can control and/or delete cookies as you wish. You can delete all cookies that are already 
                  on your computer and you can set most browsers to prevent them from being placed.
                </p>
                <p className="mt-4">
                  To modify your cookie settings, you can:
                </p>
                <ul>
                  <li>Use our cookie preferences center</li>
                  <li>Adjust your browser settings</li>
                  <li>Use private/incognito browsing mode</li>
                </ul>
              </section>

              <section id="essential">
                <h2 className="text-2xl font-semibold">Essential Cookies We Use</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Cookie Name</th>
                        <th className="text-left">Purpose</th>
                        <th className="text-left">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>session_id</td>
                        <td>Authentication</td>
                        <td>Session</td>
                      </tr>
                      <tr>
                        <td>csrf_token</td>
                        <td>Security</td>
                        <td>Session</td>
                      </tr>
                      <tr>
                        <td>theme_preference</td>
                        <td>User Interface</td>
                        <td>1 Year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="preferences">
                <h2 className="text-2xl font-semibold">Managing Cookie Preferences</h2>
                <p>
                  You can manage your cookie preferences at any time through our cookie settings panel:
                </p>
                <div className="mt-4">
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                    Cookie Settings
                  </button>
                </div>
              </section>

              <footer className="text-sm text-muted-foreground border-t pt-6 mt-8">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Effective date: January 1, 2024</p>
                <p className="mt-2">
                  This Cookie Policy is part of our{" "}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  {" "}and{" "}
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>.
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 