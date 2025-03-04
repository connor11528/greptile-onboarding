import Image from "next/image";
import {SignedIn, SignedOut, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";

export default function Home() {
  return (
      <div className="min-h-screen flex flex-col items-center justify-between py-12 px-4">
        <main className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto gap-10">
          <Image
              className="dark:invert"
              src="/logo-balanced.webp"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
          />
          <div className="my-8">
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl mb-6">
              Greptile Onboarding
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Welcome to Greptile. Get started with your account below.
            </p>
          </div>

          <div className="flex gap-6 items-center">
            <SignedOut>
              <SignInButton className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 cursor-pointer" />
              <SignUpButton forceRedirectUrl="/onboarding" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors duration-200 cursor-pointer" />
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </main>

        <footer className="mt-auto pt-12 flex gap-8 flex-wrap items-center justify-center">
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              href="https://www.greptile.com/docs/introduction"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                aria-hidden
                src="/file.svg"
                alt="File icon"
                width={16}
                height={16}
            />
            Learn
          </a>
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              href="https://www.greptile.com/customers"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                aria-hidden
                src="/window.svg"
                alt="Window icon"
                width={16}
                height={16}
            />
            Case Studies
          </a>
          <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              href="https://www.greptile.com/"
              target="_blank"
              rel="noopener noreferrer"
          >
            <Image
                aria-hidden
                src="/globe.svg"
                alt="Globe icon"
                width={16}
                height={16}
            />
            Go to greptile.com →
          </a>
        </footer>
      </div>
  );
}