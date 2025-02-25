import { EmailVerifyBanner } from "./email-verify-banner"

interface EmailVerificationBannerProps {
  show: boolean
}

export const EmailVerificationBanner = ({ show }: EmailVerificationBannerProps) => {
  if (!show) return null

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-yellow-600" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
          <h1 className="font-semibold text-yellow-800">
            Email Verification Required
          </h1>
        </div>
        <p className="text-sm text-yellow-700">
          To access all features, please verify your email address.
        </p>
      </div>
      <EmailVerifyBanner />
    </div>
  )
} 