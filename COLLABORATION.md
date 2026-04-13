# MatchPoint Collaboration Protocol (Vibe Coding Edition)

This document defines how multi-agent (LLM) and multi-developer teams work together on MatchPoint to prevent code entropy and regression.

## 1. The "Agent Check" Habit (Mandatory)
Before starting ANY work with an AI assistant (Claude, Gemini, ChatGPT):
1. **Paste/Upload** `AGENTS.md` and `COLLABORATION.md`.
2. **Command the AI**: *"Read these files and summarize our technical standards before we begin."*
3. **Check the Handoff**: Read the last entry in `HANDOFF.md` to see what the previous AI did.

## 2. Git Workflow & LLM Tagging
To track which "Vibe" generated which code, use tagged commit messages:

- **Format**: `type(scope): description [AI: Name]`
- **Example**: `feat(dashboard): add score distribution chart [AI: Claude 3.5 Sonnet]`
- **Why**: Different LLMs have different syntax preferences. If a file looks "weird," we need to know which model's logic we are following.

## 3. Conflict Resolution (AI vs AI)
If two different LLMs provide conflicting solutions:
1. **Refer to AGENTS.md**: The technical standards there override any AI suggestion.
2. **Force Consistency**: If AI-A uses `export default` and AI-B uses `export const`, default to the pattern already established in the file.
3. **Manual Override**: If the "vibes" clash too much, a human must decide the pattern and update `AGENTS.md` to prevent it from happening again.

## 4. Context Extraction
When switching from a terminal-based AI (like Antigravity) to a web-based AI (like Claude.ai):
1. Run `npx repomix` (if installed) or manually copy the relevant files.
2. Ensure you copy `src/app/HANDOFF.md` so the new AI knows the current state.

---

## 5. Domain Ownership (Work-Split)

| Domain | Owner | Main Path |
| :--- | :--- | :--- |
| **Intelligence & Analytics** | **Julia** | `/src/app/analytics`, `/src/app/history` |
| **JD Input & Scraping** | **Isis** | `src/components/JDInput.tsx` |
| **CV Upload & Storage** | **Chris** | `src/components/CVUpload.tsx` |

*Last Updated: 2026-04-13*
