# Swargufan Music Institute Website

A beautiful, modern music institute website built with Next.js and TypeScript, featuring a light gold and white theme.

## Features

- 🎵 **Elegant Design**: Light gold and white color scheme with smooth animations
- 🪔 **Marathi Splash Screen**: Animated "सा रे ग म प ध नि सा" musical notes loading screen
- 📱 **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Fast Performance**: Built with Next.js 14 for optimal speed
- 🎨 **Modern UI**: Beautiful components with hover effects and transitions
- 🎓 **Course Categories**: Classical, Playback, Children's Music, Instrumental, and more
- 💬 **Student Testimonials**: Showcase real student experiences
- 🎭 **Performance Opportunities**: Highlight student performance events

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
swargufan/
├── app/
│   ├── components/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Hero.tsx            # Hero section with carousel
│   │   ├── Courses.tsx         # Course categories grid
│   │   ├── Features.tsx        # Features and performance section
│   │   ├── Testimonials.tsx    # Student testimonials
│   │   └── Footer.tsx          # Footer with links
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── package.json
├── tsconfig.json
└── next.config.js
```

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Runtime**: Node.js

## Color Scheme

- **Light Gold**: #f5e6d3
- **Gold**: #d4af37
- **Dark Gold**: #b8941f
- **White**: #ffffff
- **Off-White**: #fafafa

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Changing Colors

Edit the CSS variables in `app/globals.css`:

```css
:root {
  --gold-light: #f5e6d3;
  --gold: #d4af37;
  --gold-dark: #b8941f;
  --white: #ffffff;
  --off-white: #fafafa;
}
```

### Adding New Courses

Edit the `courseCategories` array in `app/components/Courses.tsx`

### Modifying Hero Slides

Edit the `slides` array in `app/components/Hero.tsx`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

Build the production version:
```bash
npm run build
npm start
```

## License

© 2025 Swargufan Music Institute. All rights reserved.

## Support

For questions or support, contact: admissions@swargufan.com

