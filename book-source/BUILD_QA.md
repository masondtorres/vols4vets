# Vols4Vets.com Website Rebuild QA v0.1

Source: v1.2 formatted book interior DOCX.

## Counts

- Sections parsed: 11
- Chapters parsed: 70
- Resource cards parsed: 171
- Unique chapter slugs: 70
- Unique resource IDs: 171
- Missing chapter slugs: 0
- Resource cards with missing labels: 0

## Route decisions

- Homepage: `/`
- Start page: `/start-here`
- Sections: `/sections/[section-slug]`
- Chapter update pages: direct slugs from the book, such as `/if-someone-may-be-in-crisis`
- Resources index: `/resources`
- Resource detail pages: `/resources/[resource-id]`

## Status

PASS for source-map generation. This is not a live deployment. It is the first rebuild package.
