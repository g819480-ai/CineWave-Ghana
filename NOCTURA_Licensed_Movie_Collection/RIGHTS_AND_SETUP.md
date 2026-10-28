# RIGHTS AND SETUP

This package is intended for review, testing, and legal due diligence. It is not a substitute for a signed rights clearance for public commercial streaming.

## Scope

This catalogue contains:
- real public-domain or archive-hosted film entries that are explicitly labelled with a source and a licence reference
- intentionally disabled entries for Ghanaian/African titles labelled `PENDING RIGHTS CHECK`

## Verified list

| Title | Category | Year | Source | Licence / status | Commercial use | Enabled |
| --- | --- | ---: | --- | --- | --- | --- |
| The General | Hollywood Action | 1926 | Internet Archive | Public domain | Yes | Yes |
| Safety Last! | Hollywood Action | 1923 | Internet Archive | Public domain | Yes | Yes |
| The Gold Rush | Hollywood Action | 1925 | Internet Archive | Public domain | Yes | Yes |
| Metropolis | International | 1927 | Internet Archive | Public domain | Yes | Yes |
| Nosferatu | International | 1922 | Internet Archive | Public domain | Yes | Yes |
| The Adventures of Prince Achmed | International | 1926 | Internet Archive | Public domain | Yes | Yes |
| The Kid | International | 1921 | Internet Archive | Public domain | Yes | Yes |
| The Passion of Joan of Arc | International | 1928 | Internet Archive | Public domain | Yes | Yes |
| Pundalik | Bollywood | 1927 | Internet Archive | Public domain | Yes | Yes |
| Chunhyangjeon | K-Drama | 1935 | Internet Archive | Public domain | Yes | Yes |

## Pending-rights titles

These are included only to show the exact legal review state. They are disabled and must not be enabled in a public streaming player until written permission is received.

| Title | Category | Status | Reason |
| --- | --- | --- | --- |
| Ghanaian Feature — PENDING RIGHTS CHECK | Ghanaian / African | Disabled | No verified rights document or written permission |
| African Cinema Feature — PENDING RIGHTS CHECK | Ghanaian / African | Disabled | No verified rights document or written permission |
| West African Feature — PENDING RIGHTS CHECK | Ghanaian / African | Disabled | No verified rights document or written permission |

## Important legal note

- The fact that a title is available on an archive site or appears in a public-domain catalogue does not, by itself, prove it is safe for commercial streaming in Ghana.
- For any Ghanaian, African, or contemporary film, written rights confirmation from the owner, distributor, or licensing agent is required before public streaming or redistribution.
- This package is a rights-review starter set, not a commercial clearance file.

## Setup for your NOCTURA site

1. Add `movies.js` to your site assets.
2. Load it before your app script.
3. Filter with `item.enabled === true` before rendering in the public catalogue.
4. Keep all `PENDING RIGHTS CHECK` items excluded from the public player.
5. Store written rights confirmations for every enabled title in a separate internal legal folder.

## Recommended review checklist

- Confirm the archive source is the named rights holder or an authorized public-domain source.
- Verify the direct file URL works before publishing.
- Check hotlinking and hosting rules of the source before embedding.
- Keep a local rights record for each item.
