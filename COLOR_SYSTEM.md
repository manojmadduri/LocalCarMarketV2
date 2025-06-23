# Color System Documentation - The Integrity Auto and Body

## Overview
This website uses a centralized color system that makes it easy to change the entire website's appearance by modifying just a few CSS variables. All colors are consistently applied across every page and component.

## How to Change the Website Colors

### 1. Main Brand Color (Professional Navy Blue)
To change the main brand color (buttons, links, highlights), update this variable in `client/src/index.css`:

```css
--primary: hsl(218, 81%, 25%); /* Change this value */
--primary-hover: hsl(218, 81%, 20%); /* Darker shade for hover states */
```

**Examples:**
- Red theme: `hsl(0, 84%, 60%)`
- Green theme: `hsl(142, 71%, 45%)`
- Purple theme: `hsl(280, 70%, 55%)`
- Orange theme: `hsl(25, 95%, 53%)`

### 2. Background Colors
To change page backgrounds and card colors:

```css
--background: hsl(210, 20%, 98%); /* Main page background */
--card: hsl(0, 0%, 100%); /* Card backgrounds */
--muted: hsl(210, 15%, 95%); /* Subtle backgrounds */
```

### 3. Text Colors
To change text colors throughout the site:

```css
--foreground: hsl(215, 25%, 27%); /* Main text color */
--muted-foreground: hsl(215, 12%, 52%); /* Secondary text */
```

### 4. Status Colors
For car availability badges and alerts:

```css
--success: hsl(142, 71%, 45%); /* Available cars (green) */
--warning: hsl(38, 92%, 50%); /* Pending cars (yellow) */
--destructive: hsl(0, 84%, 60%); /* Sold cars (red) */
```

## Color Palette Reference

### Current Professional Clean Theme
- **Premium Slate**: `hsl(215, 28%, 17%)` - Primary brand color for buttons, links, highlights
- **Modern Gray**: `hsl(210, 11%, 15%)` - Main text color
- **Clean White**: `hsl(0, 0%, 99%)` - Page backgrounds
- **Emerald Green**: `hsl(158, 64%, 42%)` - Available status
- **Amber**: `hsl(43, 96%, 56%)` - Pending status
- **Refined Red**: `hsl(0, 72%, 51%)` - Sold status

### Popular Alternative Themes

#### Luxury Black & Gold
```css
--primary: hsl(45, 100%, 50%); /* Gold */
--background: hsl(0, 0%, 10%); /* Dark background */
--foreground: hsl(0, 0%, 95%); /* Light text */
```

#### Sports Car Red
```css
--primary: hsl(0, 84%, 60%); /* Red */
--background: hsl(0, 0%, 98%); /* White background */
--foreground: hsl(0, 0%, 15%); /* Dark text */
```

#### Electric Green
```css
--primary: hsl(142, 71%, 45%); /* Green */
--background: hsl(0, 0%, 98%); /* White background */
--foreground: hsl(0, 0%, 15%); /* Dark text */
```

## Quick Color Change Guide

1. Open `client/src/index.css`
2. Find the `:root` section (around line 10)
3. Change the `--primary` value to your desired color
4. Optionally adjust `--primary-hover` to be slightly darker
5. Save the file - changes apply instantly

## Technical Details

### CSS Variables Used
- All colors use CSS custom properties (variables)
- Colors are defined in HSL format for better control
- Dark mode is automatically supported
- Mobile-specific styling inherits from the main color system

### Files That Use This System
- `client/src/index.css` - Main color definitions
- `client/src/lib/colors.ts` - TypeScript color utilities
- All React components automatically inherit these colors
- All pages use the centralized system

### Benefits of This System
- **Global Changes**: Change one variable, update entire website
- **Consistency**: No random colors scattered throughout code
- **Maintainability**: Easy to update and modify
- **Dark Mode**: Automatically adapts to light/dark themes
- **Mobile Optimized**: Consistent across all devices

## Troubleshooting

### Colors Not Updating?
1. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
2. Check for typos in HSL values
3. Ensure you're editing the `:root` section, not `.dark`

### Want Custom Colors?
Use an HSL color picker online:
1. Pick your desired color
2. Copy the HSL values (e.g., `hsl(213, 85%, 58%)`)
3. Replace the existing value in the CSS

### Need Help?
The color system is designed to be simple and user-friendly. Most changes only require updating 1-2 CSS variables to transform the entire website's appearance.