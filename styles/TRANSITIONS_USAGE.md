# Common Transitions Usage Guide

This file contains reusable hover and click transition effects that can be used across the application.

## Usage in CSS Modules

Since these classes are in `styles/transitions.css` and imported into `globals.css`, they are globally available. You can use them in CSS Modules in two ways:

### Method 1: Using `composes` with `:global()`

```css
.myButton {
  /* Your custom styles */
  composes: transition-all hover-scale hover-border from global;
}
```

### Method 2: Combining with className (React)

```tsx
import styles from './MyComponent.module.css'
import '@/styles/transitions.css'

// In your component
<button className={`${styles.myButton} hover-scale transition-all`}>
  Click me
</button>
```

## Available Transition Classes

### Base Transitions
- `.transition-all` - Transitions all properties
- `.transition-colors` - Transitions background, color, and border-color
- `.transition-transform` - Transitions transform property

### Hover Effects
- `.hover-lift` - Lifts element up with shadow on hover
- `.hover-scale` - Scales to 1.05x on hover
- `.hover-scale-large` - Scales to 1.1x on hover
- `.hover-scale-small` - Scales to 1.02x on hover
- `.hover-opacity` - Reduces opacity to 0.8 on hover
- `.hover-bg` - Changes background to muted color on hover
- `.hover-border` - Changes border to primary color on hover
- `.hover-color` - Changes text color to primary on hover

### Click/Active Effects
- `.click-active` - Scales down to 0.98x on click
- `.click-press` - Scales down to 0.95x on click

### Combined Effects
- `.interactive` - Full interactive button effect (hover + active)
- `.btn-interactive` - Button-like interaction (hover + active)
- `.focus-ring` - Focus ring effect for inputs/buttons

## Example Usage

```css
/* In your CSS Module file */
.myButton {
  padding: 1rem;
  border-radius: 0.5rem;
  /* Use common transitions */
  composes: transition-all hover-scale hover-border from global;
}

.myButton:hover {
  background-color: var(--color-muted);
}
```

