# Splash Screen - Swargufan Music Institute

## 🎵 Marathi Musical Notes Animation

The splash screen now displays the classical Indian musical scale in **Marathi (Devanagari script)**:

### Musical Notes Sequence
```
सा - रे - ग - म - प - ध - नि - सा
```

## ✨ Features

### 1. **Sequential Animation**
- Each note appears one by one (400ms interval)
- Beautiful ripple effect when each note activates
- Smooth color transitions from white to gold gradient

### 2. **Visual Elements**
- **Logo Circle**: Animated gold gradient circle with music symbol (♪)
- **Brand Name**: "Swargufan" in gradient gold text
- **Musical Scale Line**: Horizontal gold line connecting all notes
- **Note Bubbles**: Individual circles for each note that light up
- **Progress Bar**: Animated loading bar with gold gradient
- **Loading Text**: "तुमचा संगीत प्रवास सुरू होत आहे" (Your musical journey is beginning)
- **Floating Notes**: Background musical symbols floating upward

### 3. **Timing**
- **Animation Duration**: ~4 seconds total
  - Each note: 400ms apart
  - Total notes animation: 3.2 seconds (8 notes × 400ms)
  - Display after last note: 800ms
  - Fade out: 800ms
- **Home Page Load**: After the last सा completes

### 4. **Responsive Design**
- **Desktop**: Full-size notes (60px bubbles, 1.5rem text)
- **Tablet**: Medium notes (45px bubbles, 1rem text)
- **Mobile**: Optimized notes (38px bubbles, 0.85rem text)

## 🎨 Styling

### Colors
- **Active Note**: Gold gradient (#d4af37 to #b8941f)
- **Inactive Note**: White background with gold border
- **Text**: Gold-dark (#b8941f)
- **Background**: Light gold and white gradient

### Fonts
- **Devanagari Font**: Google Fonts - Noto Sans Devanagari
- **Weights**: 400, 500, 600, 700, 800
- **Fallback**: Arial Unicode MS, sans-serif

## 📱 How It Works

1. **Page Load**: Splash screen appears instantly
2. **Logo Animation**: Logo circle pulses and fades in
3. **Notes Sequence**: Musical notes activate sequentially
   - सा (1st) → रे → ग → म → प → ध → नि → सा (8th)
4. **Progress Bar**: Fills from left to right
5. **Final Note**: After the last सा appears and holds
6. **Transition**: Smooth fade out
7. **Home Page**: Main website content appears

## 🔧 Technical Implementation

### Component Files
- `app/components/SplashScreenEnhanced.tsx` - Main component
- `app/components/SplashScreenEnhanced.module.css` - Styles
- `app/layout.tsx` - Integration with layout

### Key Features
```typescript
// Musical notes in Marathi
const notes = ['सा', 'रे', 'ग', 'म', 'प', 'ध', 'नि', 'सा']

// Sequential animation timing
notes.forEach((_, index) => {
  setTimeout(() => {
    setCurrentNoteIndex(index)
  }, index * 400)
})

// Hide after last note + 800ms
setTimeout(() => {
  setIsVisible(false)
}, (notes.length * 400) + 800)
```

## 🎯 User Experience

The splash screen provides:
- ✅ Professional first impression
- ✅ Cultural authenticity with Marathi script
- ✅ Smooth, non-intrusive animation
- ✅ Clear loading indication
- ✅ Musical theme reinforcement
- ✅ Optimal loading time (not too long)

## 🌐 Browser Support

Works on all modern browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Font Support**: Devanagari script is widely supported. Google Fonts ensures proper rendering across all platforms.

---

**Total Duration**: ~4 seconds
**First Interaction**: Home page appears automatically after splash animation
**Music Scale**: Classical Indian सा रे ग म प ध नि सा (Octave)


