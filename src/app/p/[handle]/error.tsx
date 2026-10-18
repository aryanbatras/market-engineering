"use client"

import { Button } from "@presentation/core/design/button"
import { builderStyles as styles } from "@presentation/portfolio/builder/builder.styles"

const PortfolioError = ({ reset }: { error: Error; reset: () => void }) => (
  <div className={styles.errorRoot}>
    <div className={styles.errorInner}>
      <h1 className={styles.errorTitle}>This template could not be rendered</h1>
      <p className={styles.errorBody}>
        Your data is safe. Try again, and if it keeps failing the template is probably the problem.
      </p>
      <div className={styles.errorAction}>
        <Button intent="primary" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  </div>
)

export default PortfolioError
