import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface EmailTemplateProps {
  verificationUrl: string
  username?: string
}

export const VerificationEmail = ({
  verificationUrl,
  username = 'there',
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for TravelKaya</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>TravelKaya</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={heading}>Verify your email address</Heading>
            <Text style={paragraph}>Hi {username},</Text>
            <Text style={paragraph}>
              Thanks for signing up for TravelKaya! Please verify your email address by clicking the button below.
            </Text>
            
            <Button style={{
              ...button,
              padding: '12px 20px',
            }} href={verificationUrl}>
              Verify Email Address
            </Button>

            <Text style={paragraph}>
              If you didn&apos;t request this email, you can safely ignore it.
            </Text>

            <Text style={paragraph}>
              The verification link will expire in 24 hours.
            </Text>

            <Text style={paragraph}>
              If the button above doesn&apos;t work, you can also copy and paste this URL into your browser:
            </Text>
            <Link style={link} href={verificationUrl}>
              {verificationUrl}
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} TravelKaya. All rights reserved.
            </Text>
            <Text style={footerText}>
              Our mailing address: <br />
              123 Travel Street, Adventure City, TC 12345
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const header = {
  padding: '32px',
  borderBottom: '1px solid #eaeaea',
}

const logo = {
  color: '#000',
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0',
}

const content = {
  padding: '40px 32px',
}

const heading = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '24px',
}

const paragraph = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '16px',
}

const button = {
  backgroundColor: '#10B981',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  marginBottom: '32px',
}

const link = {
  color: '#10B981',
  textDecoration: 'underline',
  fontSize: '14px',
  marginBottom: '32px',
  display: 'block',
  wordBreak: 'break-all' as const,
}

const footer = {
  borderTop: '1px solid #eaeaea',
  padding: '32px',
}

const footerText = {
  color: '#666',
  fontSize: '12px',
  lineHeight: '20px',
  marginBottom: '12px',
  textAlign: 'center' as const,
} 