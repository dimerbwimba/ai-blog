"use client"

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

export function ProgressBarProvider() {
  return (
    <>
      <ProgressBar
        height="4px"
        color="hsl(var(--primary))"
        options={{ 
          showSpinner: true,
          easing: 'ease',
          speed: 500,
        }}
        shallowRouting
      />
      <style jsx global>{`
        #nprogress {
          pointer-events: none;
        }

        #nprogress .bar {
          background: hsl(var(--primary));
          position: fixed;
          z-index: 9999;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
        }

        #nprogress .peg {
          display: block;
          position: absolute;
          right: 0px;
          width: 100px;
          height: 100%;
          box-shadow: 0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary));
          opacity: 1;
          transform: rotate(3deg) translate(0px, -4px);
        }

        #nprogress .spinner {
          display: block;
          position: fixed;
          z-index: 1031;
          top: 15px;
          right: 15px;
        }

        #nprogress .spinner-icon {
          width: 18px;
          height: 18px;
          box-sizing: border-box;
          border: solid 2px transparent;
          border-top-color: hsl(var(--primary));
          border-left-color: hsl(var(--primary));
          border-radius: 50%;
          animation: nprogress-spinner 400ms linear infinite;
        }

        @keyframes nprogress-spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
} 