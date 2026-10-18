import type { Metadata } from "next"
import { SignInView } from "@presentation/auth/sign-in-view"

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
}

const SignInPage = () => <SignInView />

export default SignInPage
