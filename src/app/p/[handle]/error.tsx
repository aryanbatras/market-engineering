"use client"

import { Button } from "@presentation/core/design/button"
import { portfolioErrorStyles as styles } from "@presentation/portfolio/builder/portfolio-error.styles"

const PortfolioError = ({ reset }: { error: Error; reset: () => void }) => (
  <div className={styles.root}>
    <div className={styles.inner}>
      <h1 className={styles.title}>This template could not be rendered</h1>
      <p className={styles.body}>
        Your data is safe. Try again, and if it keeps failing the template is probably the problem.
      </p>
      <div className={styles.action}>
        <Button intent="primary" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  </div>
)

export default PortfolioError