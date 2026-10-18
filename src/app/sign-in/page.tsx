import type { Metadata } from "next"
import { signInStyles } from "@presentation/marketing/sign-in.styles"
import { Button } from "@presentation/design/button"

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
}

const SignInPage = () => (
  <div className={signInStyles.root}>
    <div className={signInStyles.inner}>
      <h1 className={signInStyles.title}>Sign in</h1>
      <p className={signInStyles.body}>
        Use the account you already have. We do not make you create a new identity here.
      </p>
      <div className={signInStyles.row}>
        <Button block intent="primary">
          Continue with Google
        </Button>
        <Button block intent="secondary">
          Continue with GitHub
        </Button>
      </div>
      <p className={signInStyles.note}>
        Email and password sign-in is also available. Google sign-in is one tap for most people.
      </p>
    </div>
  </div>
)

export default SignInPage
