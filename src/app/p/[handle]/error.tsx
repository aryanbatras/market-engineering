"use client"

import { Button } from "@presentation/design/button"
import { errorStyles } from "@presentation/builder/builder.styles"
import { cn } from "@presentation/design/cn"

const PortfolioError = ({ reset }: { error: Error; reset: () => void }) => (
  <div className={errorStyles.root}>
    <div className={errorStyles.inner}>
      <h1 className={errorStyles.title}>This template could not be rendered</h1>
      <p className={errorStyles.body}>
        Your data is safe. Try again, and if it keeps failing the template is probably the problem.
      </p>
      <div className={errorStyles.action}>
        <Button intent="primary" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </div>
  </div>
)

void cn

export default PortfolioError
