# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| 1.x | Yes |
| Upstream 2.x | Maintained by its upstream owner |

## Reporting A Vulnerability

Use GitHub private vulnerability reporting for this repository. If that channel
is unavailable, contact the security address on the Stackline organization
profile.

Include the affected version, runtime and parser, a minimal reproduction,
impact, and known workarounds. Do not open a public issue before a coordinated
fix is available. A complete report will be acknowledged within five business
days.

## Historical Artifact Note

Upstream issue #22 concerns an old jQuery URL in an example shipped with
`redeyed@2.1.1`. The example is not executed by the library. Stackline excludes
that example from npm artifacts, but does not misrepresent the scanner finding
as a CVE in redeyed's runtime.

## Dependency Chain

Version 1.0.2 preserves the dependency key `esprima` through the exact npm
alias `npm:@stackline/esprima@1.0.0`. That maintained parser has no production,
optional, or peer dependencies. Release gates require a warning-free packed
install, a valid npm tree, and zero production and full-lockfile audit findings.
