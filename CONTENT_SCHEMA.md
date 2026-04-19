# Portfolio Content Schema

This file defines the exact content structure for the public portfolio and the future separate admin portal.

## Certificate card format

The certificate card should show:

- icon
- title
- issuer
- issued date
- short description
- skill tags
- button to view the certificate image

### Required certificate fields

```json
{
  "id": "html-css-edx",
  "title": "HTML & CSS Certificate",
  "issuer": "WSCX/EDX",
  "issuedAt": "April 2025",
  "description": "Comprehensive certification covering front-end principles including HTML and CSS.",
  "skills": ["HTML", "CSS"],
  "image": "images/HTML AND CSS CERTIFICATE EDX-1.png",
  "icon": "fa-code"
}
```

### Certificate field rules

- `id`: unique slug for database and editing
- `title`: certificate name shown on the card
- `issuer`: organization that issued it
- `issuedAt`: display date like `April 2025`
- `description`: short summary for the card
- `skills`: array of short tags
- `image`: full certificate image path or storage URL
- `icon`: Font Awesome icon used on the card

## Project card format

The project card should show:

- image
- title
- icon
- technology tags
- short description
- code link if available
- live demo link

### Required project fields

```json
{
  "id": "smart-irrigation-system",
  "title": "Smart Irrigation System",
  "description": "An IoT-based irrigation system that monitors soil moisture and weather conditions to optimize water usage in agriculture.",
  "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  "tags": ["Arduino", "IoT", "Python", "Sensors"],
  "demo": "https://demo-smart-irrigation.vercel.app",
  "icon": "fa-seedling",
  "github": "https://github.com/INEZA-24/smart-irrigation",
  "published": true
}
```

### Project field rules

- `id`: unique slug for database and editing
- `title`: project name shown on the card
- `description`: short project summary
- `image`: project cover image URL
- `tags`: array of tech tags
- `demo`: required live demo URL
- `icon`: Font Awesome icon shown near the title
- `github`: optional repository URL
- `published`: whether the item should appear publicly

## What the future admin portal must manage

For certificates:

- create certificate
- edit certificate
- delete certificate
- upload or paste certificate image URL
- edit title, issuer, date, description, skills, and icon

For projects:

- create project
- edit project
- delete project
- upload or paste project image URL
- edit title, description, tags, icon, live demo URL, and optional GitHub URL
- publish or unpublish item

## Database direction

When we connect Supabase later, the `projects` table and `certifications` table should follow this same shape.
