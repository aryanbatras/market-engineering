# Portfolio data format

The same schema our editor validates against. Paste this into any AI along with your
resume, or fill in the form and we generate it for you.

- Validated against `data/portfolio.schema.json`
- Only `portfolioVersion` and `identity.name` are required
- Dates are `YYYY-MM` or `YYYY`
- Set `current: true` instead of writing "Present" into a date

## Root

- **portfolioVersion** · any · required
- **identity** · object · required
- **links** · array · required
- **education** · array · required
- **experience** · array · required
- **projects** · array · required
- **skills** · array · required
- **highlights** · array · required
- **github** · object · optional
- **meta** · object · optional

## identity

- **name** · string · required
- **headline** · string · optional
- **photo** · any · optional
- **location** · string · optional
- **email** · any · optional
- **phone** · string · optional
- **availability** · string · optional

## education

- **institution** · string · required
- **degree** · string · optional
- **field** · string · optional
- **start** · string · optional
- **end** · string · optional
- **current** · boolean · required
- **grade** · string · optional
- **board** · string · optional
- **score** · string · optional
- **details** · string · optional

## experience

- **current** · boolean · required
- **start** · string · required
- **end** · string · optional
- **summary** · string · optional
- **highlights** · array · required
- **organisation** · string · required
- **role** · string · optional
- **location** · string · optional
- **kind** · string · required

## projects

- **id** · string · optional
- **name** · string · required
- **description** · string · optional
- **url** · any · optional
- **repo** · any · optional
- **tech** · array · required
- **image** · any · optional
- **role** · string · optional
- **timeline** · string · optional
- **featured** · boolean · required

## links

- **platform** · string · required
- **label** · string · optional
- **url** · string · required

## skills

- **name** · string · required
- **group** · string · optional

## Example

```yaml
portfolioVersion: 1
identity:
  name: Ananya Krishnan
  headline: Computer science final year. Builds things that mostly work.
  location: Coimbatore, India
  email: ananya@example.com
  availability: Available from June 2027
links:
  - platform: github
    url: https://github.com/ananyak
education:
  - institution: Karpagam College of Engineering
    degree: B.Tech
    field: Computer Science
    start: "2023"
    end: "2027"
    current: true
    grade: CGPA 8.7
experience:
  - organisation: Zoho
    role: Software engineering intern
    start: 2026-05
    end: 2026-08
    summary: Built a reporting tool that replaced a spreadsheet.
    highlights:
      - Cut weekly report preparation from four hours to twenty minutes
projects:
  - name: Attendance without the queue
    description: A lab attendance register that stops the line at the door.
    tech: [Next.js, Postgres]
    timeline: "2026"
    featured: true
skills:
  - name: TypeScript
    group: Languages
```
