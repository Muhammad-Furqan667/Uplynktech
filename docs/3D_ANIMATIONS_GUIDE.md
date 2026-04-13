# 3D Animations Implementation Guide

## Overview
This document outlines the 3D animation system implemented across the UplynkTech website using React Three Fiber and Three.js.

## Technology Stack

```
- React 18.2.0
- Three.js (r128)
- @react-three/fiber (8.16.0) - React renderer for Three.js
- @react-three/drei (9.110.0) - Useful helpers and abstractions
```

## Installation

The required dependencies have been added to `package.json`. To install them:

```bash
npm install
```

## Architecture

### 3D Components Location
All 3D components are located in `/src/components/3D/`

### Core Components

#### 1. **OptimizedCanvas.jsx**
- Wrapper component for all 3D scenes
- Handles performance optimization
- Configures lighting and camera
- Features:
  - Adaptive DPR (Device Pixel Ratio)
  - High-performance GL settings
  - Optimized antialiasing
  - Ambient and directional lighting

#### 2. **FloatingBox.jsx**
- Reusable 3D cube that floats and rotates
- Props:
  - `position` [x, y, z] - Position in 3D space
  - `scale` [x, y, z] - Size
  - `color` - Hex color
  - `speed` - Animation speed multiplier
  - `rotationMultiplier` - Rotation intensity

#### 3. **RotatingTorus.jsx**
- 3D ring/torus that rotates continuously
- Props:
  - `position`, `scale`, `color` - Same as FloatingBox
  - `speed` - Rotation speed
  - `args` - Torus geometry args [radius, tube, radialSegments, tubularSegments]

#### 4. **ParallaxPlane.jsx**
- Responsive plane that follows mouse movement
- Creates parallax depth effect
- Props:
  - Standard position/scale/color
  - `parallaxIntensity` - Mouse tracking intensity

### Scene Compositions

#### HeroScene3D.jsx
- Main landing page background animation
- Contains: 2 floating boxes + 1 rotating torus
- Dimensions: 400px height
- Location: Hero section

#### AboutScene3D.jsx
- About page section animation
- Contains: 3 floating boxes + 1 rotating torus
- Dimensions: 350px height
- Location: About section visual area

#### ServicesScene3D.jsx
- Services page animation
- Contains: 2 floating boxes + 2 rotating tori arranged in grid
- Dimensions: 320px height
- Location: Services header

#### TeamScene3D.jsx
- Team page animation
- Contains: 2 floating boxes + 1 rotating torus
- Dimensions: 300px height
- Location: Team section

#### ContactScene3D.jsx
- Contact page animation
- Contains: 2 rotating tori + 1 floating box (centered)
- Dimensions: 300px height
- Location: Contact section

## Performance Optimizations

### 1. **Lazy Loading**
All 3D scenes are lazy-loaded using React's `lazy()` and `Suspense`:

```jsx
const HeroScene3D = lazy(() => import('./3D/HeroScene3D'))

<Suspense fallback={<div style={{ width: '100%', height: '400px' }} />}>
  <HeroScene3D />
</Suspense>
```

### 2. **Adaptive Pixel Ratio**
```js
dpr={[1, window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio]}
```
- Uses native DPR on standard screens
- Caps at 2x on high-DPI screens (for performance)

### 3. **GPU Optimization**
- `powerPreference: 'high-performance'`
- Optimized geometry and material settings
- Efficient animation frame calculations

### 4. **Code Splitting**
- Separate files for each 3D component
- Lazy loading of scenes
- Minimal initial bundle impact

## Usage Examples

### Basic Integration
```jsx
import { lazy, Suspense } from 'react'
import { HeroScene3D } from './components/3D'

export function MyComponent() {
  return (
    <Suspense fallback={<div style={{ height: '400px' }} />}>
      <HeroScene3D />
    </Suspense>
  )
}
```

### Custom Scene
```jsx
import OptimizedCanvas from './components/3D/OptimizedCanvas'
import FloatingBox from './components/3D/FloatingBox'

export function CustomScene() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <OptimizedCanvas>
        <FloatingBox 
          position={[0, 0, 0]} 
          color="#b5ab8c"
          speed={2}
        />
      </OptimizedCanvas>
    </div>
  )
}
```

## Customization Guide

### Changing Colors
Update the color props in scene files:
```jsx
<FloatingBox color="#b5ab8c" /> // Gold
<RotatingTorus color="#d4af37" /> // Lighter gold
```

### Adjusting Animation Speed
```jsx
<FloatingBox speed={2} /> // Faster (default: 1)
<RotatingTorus speed={1.5} /> // Custom speed
```

### Modifying Scale
```jsx
<FloatingBox scale={[0.8, 0.8, 0.8]} /> // 80% size
<RotatingTorus scale={[0.5, 0.5, 0.5]} /> // 50% size
```

### Positioning Elements
```jsx
<FloatingBox position={[-2, 0, 0]} /> // X=-2, Y=0, Z=0
<RotatingTorus position={[0, 1, -2]} /> // Offset Y up, Z back
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

WebGL 2.0 required for optimal performance.

## Responsive Behavior

All 3D containers are fully responsive:

- **Desktop (>1024px)**: Full size scenes
- **Tablet (768px - 1024px)**: Reduced container height
- **Mobile (<768px)**: Minimal height, optimized rendering

Media queries are defined in each component's CSS file:
```css
@media (max-width: 768px) {
  .hero-3d-container {
    height: 280px; /* Reduced from 400px */
  }
}
```

## Hooks

### useMousePosition()
Located in `/src/components/hooks/useMousePosition.js`

Tracks mouse movement for parallax effects:
```jsx
import { useMousePosition } from './hooks/useMousePosition'

const mousePos = useMousePosition()
// Returns: { x: -1 to 1, y: -1 to 1 }
```

## Performance Metrics

Expected performance on modern hardware:
- Load time impact: ~200-300ms (with lazy loading)
- Frame rate: 60 FPS on desktop
- Mobile performance: 30-60 FPS depending on device
- Bundle size increase: ~250KB (Three.js) + ~50KB (React Three Fiber)

## Troubleshooting

### Canvas not rendering
- Check browser console for WebGL errors
- Ensure device supports WebGL 2.0
- Verify Three.js and React Three Fiber versions match

### Performance degradation
- Reduce number of 3D objects
- Lower animation speed
- Disable on mobile devices if needed
- Check GPU usage in DevTools

### Animations not smooth
- Verify 60 FPS frame rate
- Check for console errors
- Reduce scene complexity
- Profile with React DevTools

## Future Enhancements

Potential improvements:
- [ ] Add camera animation on scroll
- [ ] Implement shader-based particles
- [ ] Add collision detection
- [ ] Interactive 3D elements with click handlers
- [ ] Advanced lighting effects
- [ ] Post-processing effects (bloom, glow)
- [ ] Mobile-specific optimizations

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Drei Documentation](https://github.com/pmndrs/drei)

## Support

For issues or questions about 3D implementations, refer to:
- Component files in `/src/components/3D/`
- Individual component comments
- Example implementations in page components
