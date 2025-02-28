import { Metadata } from "next"
import { Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us - Travel Blog & Guides",
  description: "Learn more about our mission to help travelers explore the world with detailed guides, tips, and authentic experiences.",
}

export default function AboutPage() {
  return (
    <main className="container max-w-4xl mx-auto px-4 py-20">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Helping travelers explore the world with authentic experiences, detailed guides, and local insights.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src="/about.jpg"
            alt="Travel experiences"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            We believe that travel has the power to transform lives, broaden perspectives, 
            and create lasting connections. Our mission is to make travel accessible and 
            enriching for everyone by providing comprehensive guides, authentic insights, 
            and practical information.
          </p>
          <p className="text-muted-foreground">
            Whether you&apos;re a budget backpacker or a luxury traveler, we&apos;re here 
            to help you discover the world on your own terms.
          </p>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-muted">
            <h3 className="text-xl font-semibold mb-3">Detailed Guides</h3>
            <p className="text-muted-foreground">
              Comprehensive travel guides with insider tips, itineraries, and local recommendations.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-muted">
            <h3 className="text-xl font-semibold mb-3">Budget Planning</h3>
            <p className="text-muted-foreground">
              Realistic cost breakdowns and money-saving tips for every destination.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-muted">
            <h3 className="text-xl font-semibold mb-3">Cultural Insights</h3>
            <p className="text-muted-foreground">
              Deep dives into local cultures, traditions, and authentic experiences.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center space-y-6 mb-16">
        <h2 className="text-3xl font-bold">Get in Touch</h2>
        <p className="text-muted-foreground">
          Have questions, suggestions, or want to collaborate? We&apos;d love to hear from you!
        </p>
        <div className="flex items-center justify-center gap-2">
          <Mail className="h-5 w-5" />
          <Link 
            href="mailto:next191996@gmail.com"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            next191996@gmail.com
          </Link>
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">Our Values</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="space-y-4 p-6 rounded-lg bg-muted hover:bg-muted/80 transition-all">
            <h3 className="text-xl font-semibold">Authenticity</h3>
            <p className="text-muted-foreground">
              We believe in sharing genuine experiences and honest advice. Our content 
              is based on real travel experiences and thorough research.
            </p>
          </div>
          <div className="space-y-4 p-6 rounded-lg bg-muted hover:bg-muted/80 transition-all">
            <h3 className="text-xl font-semibold">Sustainability</h3>
            <p className="text-muted-foreground">
              We promote responsible travel practices and support sustainable tourism 
              that benefits local communities and preserves destinations.
            </p>
          </div>
          <div className="space-y-4 p-6 rounded-lg bg-muted hover:bg-muted/80 transition-all">
            <h3 className="text-xl font-semibold">Inclusivity</h3>
            <p className="text-muted-foreground">
              Travel is for everyone. We create content that caters to diverse 
              travelers with different budgets, interests, and needs.
            </p>
          </div>
          <div className="space-y-4 p-6 rounded-lg bg-muted hover:bg-muted/80 transition-all">
            <h3 className="text-xl font-semibold">Quality</h3>
            <p className="text-muted-foreground">
              We maintain high standards in our content, ensuring accuracy, 
              usefulness, and attention to detail in every guide we publish.
            </p>
          </div>
        </div>
      </div>
      {/* FAQ Section */}
      <div className="mt-20 space-y-8">
        <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-muted hover:bg-muted/80 transition-all">
            <h3 className="text-xl font-semibold mb-3">How often do you publish new content?</h3>
            <p className="text-muted-foreground">
              We publish new travel guides, tips, and destination features multiple times per week. Our team works diligently to ensure a steady stream of fresh, high-quality content for our readers.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-muted hover:bg-muted/80 transition-all">
            <h3 className="text-xl font-semibold mb-3">Can I contribute to your blog?</h3>
            <p className="text-muted-foreground">
              Yes! We welcome guest contributions from experienced travelers and writers. Please reach out to us via email with your pitch and writing samples. We look for unique perspectives and authentic travel experiences.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-muted hover:bg-muted/80 transition-all">
            <h3 className="text-xl font-semibold mb-3">How do you select destinations to feature?</h3>
            <p className="text-muted-foreground">
              Our destinations are chosen based on a combination of personal travel experiences, reader requests, and emerging travel trends. We focus on providing comprehensive coverage of both popular and off-the-beaten-path locations.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-muted hover:bg-muted/80 transition-all">
            <h3 className="text-xl font-semibold mb-3">Do you accept sponsored content?</h3>
            <p className="text-muted-foreground">
              While we do consider sponsored partnerships, we maintain strict editorial standards. Any sponsored content must align with our values and provide genuine value to our readers. All sponsored posts are clearly disclosed.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-muted hover:bg-muted/80 transition-all">
            <h3 className="text-xl font-semibold mb-3">How can I stay updated with your latest content?</h3>
            <p className="text-muted-foreground">
              You can follow us on our social media channels or subscribe to our newsletter to receive updates about new articles, travel tips, and exclusive content. We also encourage joining our community discussions.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}