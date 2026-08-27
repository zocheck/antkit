# @antkit/mcp

An [MCP](https://modelcontextprotocol.io) server for
[@antkit/react](https://github.com/zocheck/antkit). It answers out of the copy
of the library installed in your project, so an agent can never import a
component that version does not have.

```bash
pnpm add -D @antkit/mcp
```

Register it with your client. For Claude Code:

```bash
claude mcp add antkit -- npx -y @antkit/mcp
```

Or, in any client that reads `mcpServers` config:

```json
{
  "mcpServers": {
    "antkit": { "command": "npx", "args": ["-y", "@antkit/mcp"] }
  }
}
```

The server talks stdio, and finds `@antkit/react` by resolving it from the
working directory the client launches it in. Set `ANTKIT_REACT_PATH` to point
it somewhere else.

## Tools

| Tool                | What it answers                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| `list_components`   | Every component, grouped, one line each. Optional `group` filter.                                   |
| `get_component`     | One component's full contract: import line, runnable example, near-neighbour, trap, props, exports. |
| `search_components` | Which component does this job — searches names, exports, props and doc blocks.                      |
| `get_guide`         | Setup, the required Tailwind `@source` line, the providers, and the traps.                          |

`get_component` takes a name, a slug, or an exported value — `DatePicker`,
`date-picker` and `Toaster` all resolve.

Two resources carry the same material for clients that prefer them:
`antkit://catalogue` (JSON) and `antkit://guide` (Markdown).

## Where the answers come from

`@antkit/react` ships its TypeScript source, and every component carries a
doc block: one line on what it is, a runnable example, the near-neighbour to
prefer, and the trap. `pnpm gen:docs` in the antkit repo compiles those blocks
into `skills/antkit-react/catalogue.json`, which ships inside the package.
This server reads that file from `node_modules` and serves it.

That is the whole reason the answers stay correct: upgrade `@antkit/react` and
the server's answers change with it, with no version of its own to keep in
step.

## Versus the skill

`npx antkit-skills` drops the same library guide into
`.claude/skills/antkit-react` as a file. The skill is one document an agent
reads; this server is a set of queries it can run. Use either, or both — they
read the same source of truth.

MIT.
