# prompts

System prompts for code-generation tools that do not read skill files.

- `antkit-system-prompt.md` — the general one. Paste into a system prompt or a
  project's custom instructions.

For agents that do read skills (Claude Code, Cursor), prefer the skill shipped
with the package — `npx antkit-skills` links it in. It is longer, more
specific, and it comes with the generated component catalogue. Source lives at
`packages/react/skills/antkit-react/`.
