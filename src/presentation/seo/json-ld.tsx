type JsonLdProps = {
  data: Record<string, unknown>
}

const escapeForScript = (value: string): string =>
  value.replace(/&/g, "\\u0026").replace(/</g, "\\u003c").replace(/>/g, "\\u003e")

export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    dangerouslySetInnerHTML={{ __html: escapeForScript(JSON.stringify(data)) }}
    type="application/ld+json"
  />
)