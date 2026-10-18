import { documentSchema } from "@application/resume/document-schema"
import { editorStyles } from "./resume-editor.styles"

export const SchemaPanel = () => (
  <div className={editorStyles.pane}>
    <div className={editorStyles.paneHead}>
      <span className={editorStyles.paneTitle}>Every field</span>
      <span className={editorStyles.paneNote}>Only name is required</span>
    </div>
    <div className={editorStyles.band}>
      <div className={editorStyles.schema}>
        {documentSchema.map((group) => (
          <div className={editorStyles.schemaGroup} key={group.title}>
            <p className={editorStyles.schemaKey}>{group.title}</p>
            {group.fields.map((field) => (
              <p className={field.list ? editorStyles.schemaList : editorStyles.schemaValue} key={field.key}>
                {field.key}: {field.example}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
)