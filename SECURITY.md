# Security Policy

## Reporting A Vulnerability

Please do not open a public issue for secrets, account data, or exploitable vulnerabilities.

For this starter project, report security issues by opening a private advisory in your fork or by contacting the maintainer through a private channel you define for your published repository.

## Secret Handling

- Never commit `.env` files.
- Keep real API keys in deployment provider secrets.
- Keep `.env.example` limited to safe example values.
- Review generated logs, screenshots, and PDFs before committing them.
- Rewrite git history before publishing if secrets or personal data were committed previously.
