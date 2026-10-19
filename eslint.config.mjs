import js from "@eslint/js"
import next from "eslint-config-next"
import path from "node:path"
import { fileURLToPath } from "node:url"

void path
void fileURLToPath

const semanticName = /^[a-z][a-zA-Z0-9]*$/
const utilityPrefix =
  /^(sm|md|lg|xl|2xl|dark|hover|focus|active|group|peer|aria-|data-)?-?(flex|grid|block|inline|hidden|static|fixed|absolute|relative|sticky|container|prose|table|contents|flow|isolate|object|box|clear|float|columns|break|truncate|text|font|leading|tracking|decoration|underline|overline|indent|uppercase|lowercase|capitalize|align|order|list|items|justify|content|place|gap|space|divide|border|outline|ring|shadow|opacity|mix|inset|top|right|bottom|left|z|overflow|overscroll|scroll|scrollbar|translate|rotate|scale|skew|transform|origin|transition|animate|duration|ease|delay|resize|appearance|cursor|pointer-events|select|fill|stroke|sr|not|first|last|odd|even|backdrop|filter|blur|brightness|contrast|drop|grayscale|invert|saturate|sepia|aspect|size|w|h|min|max|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|grid|place|basis|order|col|row|span|rounded|transition|will|contain|caret|accent|antialiased|subpixel|tabular|slashed|indent|uppercase|lowercase|capitalize|normal|underline|line-through|no-underline|truncate|text-ellipsis|text-clip|whitespace|break|resize|appearance|caret|scroll-smooth|underline-offset|ring-offset|placeholder|file|marker|selection)/

const looksLikeTailwind = (value) => {
  const tokens = value.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return false
  if (tokens.length === 1) return utilityPrefix.test(tokens[0])
  return true
}

const isSemantic = (value) => {
  const tokens = value.trim().split(/\s+/).filter(Boolean)
  return tokens.length > 0 && tokens.every((token) => semanticName.test(token))
}

const ruleSet = () => ({
  meta: {
    type: "problem",
    docs: { description: "Market Engineering repository rules" },
    schema: [],
    messages: {
      comment: "R5: no comments in application code. Use a self-documenting name instead.",
      inlineTailwind:
        "R7: no raw Tailwind in JSX. Reference a semantic entry from a .ts class map instead.",
      templateClassName: "R7: compose classes with cn(), not a template literal.",
      cnTailwind: "R7: no raw Tailwind passed to cn(). Reference a semantic entry from a .ts class map instead.",
      cnDynamic: "R7: class values must be static string literals.",
    },
  },
  create(context) {
    const report = (node, value) => {
      if (looksLikeTailwind(value) && !isSemantic(value)) {
        context.report({ node, messageId: "inlineTailwind" })
      }
    }

    return {
      Program(node) {
        for (const comment of context.sourceCode.getAllComments()) {
          context.report({ node: comment, messageId: "comment" })
        }
        void node
      },
      JSXAttribute(node) {
        if (node.name.name !== "className") return
        const value = node.value
        if (value?.type === "Literal") {
          report(node, String(value.value ?? ""))
          return
        }
        if (value?.type !== "JSXExpressionContainer") return
        const expression = value.expression
        if (expression.type === "Literal") {
          report(node, String(expression.value ?? ""))
          return
        }
        if (expression.type === "TemplateLiteral") {
          context.report({ node, messageId: "templateClassName" })
        }
      },
      CallExpression(node) {
        const callee = node.callee
        if (callee.type !== "Identifier" || callee.name !== "cn") return
        for (const argument of node.arguments) {
          if (argument.type === "Literal") report(argument, String(argument.value ?? ""))
          if (argument.type === "TemplateLiteral") {
            context.report({ node: argument, messageId: "cnDynamic" })
          }
        }
      },
    }
  },
})

const resumeApplicationEdge = {
  files: ["src/application/resume/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "@application/portfolio/compile-script",
              "@application/portfolio/portfolio-copy",
              "@application/portfolio/portfolio-queries",
              "@application/portfolio/slugify",
              "@application/portfolio/ports/**",
            ],
            message:
              "R18: resume reads the document and nothing else. Anything it needs beyond the schema belongs in the resume domain.",
          },
        ],
      },
    ],
  },
}

const documentEdge = {
  files: ["src/application/resume/sample/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "@application/portfolio/compile-script",
              "@application/portfolio/portfolio-copy",
              "@application/portfolio/portfolio-queries",
              "@application/portfolio/slugify",
              "@application/portfolio/ports/**",
            ],
            message: "R18: the sample reads the document and nothing else.",
          },
        ],
      },
    ],
  },
}

const domains = [
  {
    files: ["src/**/portfolio/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@infrastructure/resume/**", "@application/resume/**", "@presentation/resume/**"],
              message: "R18: portfolio and resume never import each other.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/resume/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@infrastructure/portfolio/**",
                "@presentation/portfolio/**",
                "@infrastructure/mock/portfolio/**",
              ],
              message: "R18: resume and portfolio never import each other.",
            },
            {
              group: ["@application/portfolio/**"],
              message:
                "R18: the only edge between the domains is the Portfolio type, imported from the schema.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/core/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@application/portfolio/**", "@application/resume/**"],
              message: "R18: core is the bottom of the graph and imports no domain upward.",
            },
            {
              group: ["@presentation/portfolio/**", "@presentation/resume/**"],
              message: "R18: core is the bottom of the graph and imports no domain upward.",
            },
            {
              group: ["@infrastructure/portfolio/**", "@infrastructure/resume/**"],
              message: "R18: core is the bottom of the graph and imports no domain upward.",
            },
          ],
        },
      ],
    },
  },
  ]

const layers = [
  {
    files: ["src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/infrastructure/*"],
              message: "R13: app/ is a contract layer. Call an application-layer use case.",
            },
            {
              group: ["**/presentation/core/design/*"],
              message: "R13: app/ carries no styling decisions.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/presentation/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/infrastructure/*"],
              message: "R13: presentation uses application-layer ports, never infrastructure.",
            },
            { group: ["@app/*"], message: "R13: nothing imports app/." },
          ],
        },
      ],
    },
  },
  {
    files: ["src/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/infrastructure/*"],
              message: "R13: application defines ports. Infrastructure implements them.",
            },
            { group: ["@app/*"], message: "R13: nothing imports app/." },
          ],
        },
      ],
    },
  },
  {
    files: ["src/infrastructure/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["@app/*"], message: "R13: nothing imports app/." },
            {
              group: ["**/presentation/*"],
              message: "R13: infrastructure never imports presentation.",
            },
          ],
        },
      ],
    },
  },
]

const anchorTags = new Set(["a", "Link"])

const opensAnchor = (node) => node.type === "JSXElement" && anchorTags.has(node.openingElement.name.name)

const containsAnchor = (node) => {
  let found = false

  const walk = (child) => {
    if (found || child === null || typeof child !== "object") return
    if (Array.isArray(child)) {
      for (const inner of child) walk(inner)
      return
    }
    if (child.type === "JSXElement" && child !== node && opensAnchor(child)) {
      found = true
      return
    }
    if (Array.isArray(child.children)) walk(child.children)
  }

  walk(node.children)
  return found
}

const nestingRule = () => ({
  meta: {
    type: "problem",
    docs: { description: "R24: a link inside a link" },
    schema: [],
    messages: {
      nested:
        "R24: a link may not contain another link. Render the contents inert in preview mode instead.",
    },
  },
  create(context) {
    let depth = 0

    return {
      JSXElement(node) {
        if (!opensAnchor(node)) return
        if (depth === 0 && containsAnchor(node)) context.report({ node, messageId: "nested" })
        depth += 1
      },
      "JSXElement:exit"(node) {
        if (opensAnchor(node)) depth -= 1
      },
    }
  },
})

const config = [
  { ignores: [".next/**", "node_modules/**", ".taste-skill/**", "next-env.d.ts"] },
  js.configs.recommended,
  ...next,
  ...layers,
  ...domains,
  resumeApplicationEdge,
  documentEdge,
  {
    plugins: {
      market: { rules: { "market-rules": ruleSet(), "no-nested-interactive": nestingRule() } },
    },
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "market/market-rules": "error",
      "market/no-nested-interactive": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-eval": "error",
      eqeqeq: ["error", "smart"],
      "prefer-const": "error",
      "no-unused-vars": "off",
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: ["scripts/**/*.{ts,tsx}", "*.ts", "*.mjs", "next.config.ts"],
    rules: { "market/market-rules": "off", "no-console": "off" },
  },
]

export default config
