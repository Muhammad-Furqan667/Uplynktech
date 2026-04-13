# 3D Animations - Quick Start Guide

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

This will install:
- `three` - 3D graphics library
- `@react-three/fiber` - React renderer for Three.js  
- `@react-three/drei` - Helper components and utilities

### 2. Dev Server
```bash
npm run dev
```

The 3D animations will automatically load with lazy loading enabled.

### 3. Build for Production
```bash
npm run build
```

Vite optimizes Three.js and code-splits the 3D components automatically.

## What's Changed

### New Directories
```
src/
├── components/
│   ├── 3D/                    # All 3D components
│   │   ├── OptimizedCanvas.jsx
│   │   ├── FloatingBox.jsx
│   │   ├── RotatingTorus.jsx
│   │   ├── ParallaxPlane.jsx
│   │   ├── HeroScene3D.jsx
│   │   ├── AboutScene3D.jsx
│   │   ├── ServicesScene3D.jsx
│   │   ├── TeamScene3D.jsx
│   │   ├── ContactScene3D.jsx
│   │   └── index.js           # Barrel export
│   └── hooks/
│       └── useMousePosition.js
```

### Updated Components
- ✅ Hero.jsx - Added HeroScene3D
- ✅ About.jsx - Added AboutScene3D
- ✅ Services.jsx - Added ServicesScene3D
- (Ready for: Team, Contact, Gallery pages)

### Updated CSS Files
- ✅ Hero.css - Added .hero-3d-container styles & responsive
- ✅ Services.css - Added .services-3d-container styles & responsive

## Features Implemented

### 3D Elements
- 🎲 **FloatingBox** - Animated rotating cubes
- 💫 **RotatingTorus** - Spinning rings/toruses
- 🔄 **ParallaxPlane** - Mouse-tracking planes
- 🎬 **OptimizedCanvas** - Performance-tuned renderer

### Scenes
- 🏠 **HeroScene3D** - Hero section background
- ℹ️ **AboutScene3D** - About section animation
- 🛠️ **ServicesScene3D** - Services header animation
- 👥 **TeamScene3D** - Team section (ready to integrate)
- 📧 **ContactScene3D** - Contact section (ready to integrate)

### Performance Optimizations
- ⚡ Lazy loading with Suspense
- 📱 Adaptive DPR for different screen densities
- 🎯 Lightweight material properties
- 🔧 Optimized animation frame calculations
- 📊 Code splitting for 3D assets

## Browser Support

✅ Chrome 60+
✅ Firefox 55+
✅ Safari 12+
✅ Edge 79+

## Mobile Performance

3D animations automatically:
- Reduce container heights on tablet/mobile
- Lazy load only when needed
- Use adaptive rendering quality

Desktop performance is fully maintained.

## Customization

### Change Animation Colors
Edit the color props in scene files:
```jsx
// In HeroScene3D.jsx
<FloatingBox color="#b5ab8c" /> // Change this
```

### Adjust Animation Speed
```jsx
<FloatingBox speed={2} /> // Faster
<RotatingTorus speed={1} /> // Slower
```

### Modify Positions
```jsx
<FloatingBox position={[x, y, z]} />
```

See `3D_ANIMATIONS_GUIDE.md` for detailed customization options.

## Test Pages

Visit these pages to see 3D animations in action:

1. **Home Page** - Hero & About sections
2. **Services** - Services header animation
3. Ready for: Team, Contact pages

## Next Steps

### Integrate Remaining Pages
To add 3D to other pages:

```jsx
// 1. Import lazy
import { lazy, Suspense } from 'react'
const TeamScene3D = lazy(() => import('./3D/TeamScene3D'))

// 2. Add to JSX
<Suspense fallback={<div style={{ height: '300px' }} />}>
  <TeamScene3D />
</Suspense>

// 3. Style with CSS
.team-3d-container {
  width: 100%;
  height: 300px;
  border-radius: 12px;
}
```

### Create Custom Scenes
Combine FloatingBox and RotatingTorus components to create unique animations for specific sections.

### Advanced Customization
- Add new 3D geometry types
- Implement scroll-based animations
- Add interactive elements
- Use shader materials

Refer to `3D_ANIMATIONS_GUIDE.md` for detailed examples.

## Performance Tips

For optimal performance:
1. Keep scene complexity low (max 5-8 3D objects)
2. Use lazy loading on all scenes
3. Test on target devices
4. Monitor frame rates in DevTools
5. Disable on very low-end devices if needed

## Troubleshooting

**3D not showing?**
- Ensure WebGL 2.0 is supported
- Check browser console for errors
- Verify Three.js installation: `npm list three`

**Slow performance?**
- Check GPU usage
- Reduce animation complexity
- Lower scene object count
- Profile with React DevTools

**Build errors?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm run build -- --reset-cache`

## Documentation

For comprehensive information:
- See `3D_ANIMATIONS_GUIDE.md` - Full API documentation
- Component files have detailed comments
- Each scene file shows usage examples

## Support

Questions? Check:
1. Component files - All have detailed comments
2. Scene files - Show real implementation examples
3. `3D_ANIMATIONS_GUIDE.md` - Comprehensive documentation
