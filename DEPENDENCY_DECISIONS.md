# Dependency Decisions

Audit date: 2026-08-26

| Dependency | Type | Upstream | Current | Decision | Rationale |
| --- | --- | --- | --- | --- | --- |
| `esprima` | runtime | `~4.0.0` | `4.0.1` | Pin current compatible release | Preserve default tokens/AST and browser behavior; zero known production advisories |
| `cardinal` | development | `~1.0.0` | `2.1.1` | Remove | Unused in the upstream suite; creates an unnecessary reverse edge to Project 07 |
| `readdirp` | development | `~2.1.0` | newer major available | Remove | Replace the smoke walk with built-in filesystem APIs |
| `standart` | development | `^6.1.0` | obsolete | Remove | Source of the baseline audit findings; use current ESLint |
| `tape` | development | `~4.9.0` | `5.10.2` | Upgrade | Keep all 187 upstream assertions executable |
| `espree` | development | none | `11.2.0` | Add for regression only | Prove modern array-tokenizer support; not a consumer runtime dependency |

Lint, coverage, build, type, and package-audit tools are development-only and
pinned in the lockfile. Consumer runtime remains one dependency (`esprima`),
which itself has no runtime dependencies.

Vendoring Esprima was rejected: it is a signed, extremely high-distribution
package with a stable API, and bundling it into the Node entry would obscure
license/update boundaries. Self-contained browser artifacts may bundle it with
its BSD-2-Clause notice preserved by the build.
