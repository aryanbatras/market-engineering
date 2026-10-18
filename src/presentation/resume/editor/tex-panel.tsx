import { editorStyles } from "./resume-editor.styles"

type TexPanelProps = {
  source: string
}

export const TexPanel = ({ source }: TexPanelProps) => (
  <div className={editorStyles.editorFill}>
    <div className={editorStyles.schema}>
      <pre className={editorStyles.texText}>{source}</pre>
    </div>
  </div>
)