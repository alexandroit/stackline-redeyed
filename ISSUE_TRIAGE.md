# Issue And Pull Request Triage

Audit date: 2026-08-26

| Item | Decision | Reason |
| --- | --- | --- |
| Issue #3 keyword context | Preserve | Token labels belong to the selected parser; no AST semantic promise |
| Issue #8 / PR #9 tokenizer-first | Preserve | Core 2.x behavior and incomplete-source support |
| Issue #14 / PR #15 hashbang | Preserve and harden | Behavior is public; no-newline/large-line edges need bounded handling |
| PR #17 Esprima update | Preserve | Esprima 4 is the established default |
| Issue #21 package contents | Incorporate | Smaller intentional package surface |
| Issue #22 example jQuery scans | Resolve in artifact | Exclude examples; do not claim a redeyed runtime CVE |
| PR #23 jQuery URL | Retain in repository only | Example maintenance; example is not distributed |
| PR #24 files list | Incorporate and extend | Ship runtime, configs, types, docs, license, and built browser entries only |
| PR #7 default Espree | Reject as default | Parser token/AST semantics differ; support modern parsers opt-in instead |

No open behavior PR is waiting to be merged.
