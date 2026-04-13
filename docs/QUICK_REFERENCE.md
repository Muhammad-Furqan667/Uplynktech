# Quick Reference Guide - SEO & Mobile Optimization

## 🚀 Quick Start

### Using SEO Hook on New Pages
```javascript
import { useSEO } from '../hooks/useSEO'

export default function NewPage() {
  useSEO({
    title: 'Page Title - UPLYNK Tech',
    description: 'Page description for search results...',
    canonical: 'https://uplynktech.com/page-path',
    keywords: 'keyword1, keyword2, keyword3'
  })

  return (
    // Your page content
  )
}
```

### Mobile Responsive Breakpoints to Use
```css
/* Desktop */
@media (max-width: 1024px) {
  /* Tablet optimizations */
}

@media (max-width: 768px) {
  /* Large mobile devices */
}

@media (max-width: 480px) {
  /* Small mobile devices */
}
```

---

## 📁 File Structure

```
uplynktech updated website/
├── public/
│   ├── robots.txt           (Search engine crawling)
│   └── sitemap.xml          (Website structure for SEO)
├── src/
│   ├── hooks/
│   │   ├── useSEO.js        (Dynamic meta tags)
│   │   └── useStructuredData.js (JSON-LD schemas)
│   ├── pages/
│   │   ├── Home.jsx         (✅ SEO optimized)
│   │   ├── Services.jsx     (✅ SEO optimized)
│   │   ├── Contact.jsx      (✅ SEO optimized)
│   │   ├── Courses.jsx      (✅ SEO optimized)
│   │   ├── Team.jsx         (✅ SEO optimized)
│   │   ├── Career.jsx       (✅ SEO optimized)
│   │   └── Gallery.jsx      (✅ SEO optimized)
│   ├── components/
│   │   ├── Navbar.css       (✅ Mobile responsive)
│   │   ├── Footer.css       (✅ Mobile responsive)
│   │   ├── About.css        (✅ Mobile responsive)
│   │   ├── Services.css     (✅ Carousel responsive)
│   │   ├── Courses.css      (✅ Carousel responsive)
│   │   └── OurWork.css      (✅ Carousel responsive)
│   ├── styles/
│   │   ├── Contact.css      (✅ Mobile responsive)
│   │   ├── Career.css       (✅ Mobile responsive)
│   │   ├── Team.css         (✅ Mobile responsive)
│   │   └── Gallery.css      (✅ Mobile responsive)
│   ├── App.jsx              (Structured data)
│   └── index.html           (SEO meta tags)
├── SEO_MOBILE_OPTIMIZATION.md     (Detailed guide)
└── IMPLEMENTATION_SUMMARY.md      (Complete overview)
```

---

## ✅ Optimization Checklist

### SEO Checklist
- [x] Meta descriptions on all pages
- [x] Keywords per page
- [x] Canonical URLs
- [x] Open Graph tags
- [x] Twitter cards
- [x] Structured data (JSON-LD)
- [x] robots.txt
- [x] sitemap.xml
- [x] Heading hierarchy (H1, H2, H3)
- [x] Mobile viewport meta tag

### Mobile Responsive Checklist
- [x] All pages responsive at 480px
- [x] All pages responsive at 768px
- [x] All pages responsive at 1024px
- [x] Touch-friendly buttons (44px+)
- [x] Proper font sizing (16px minimum)
- [x] Form inputs mobile-friendly
- [x] Navigation mobile-friendly
- [x] Carousels responsive
- [x] Modals/popups mobile-friendly
- [x] Images responsive

### Performance Recommendations
- [ ] Image optimization
- [ ] Code splitting
- [ ] Lazy loading images
- [ ] CSS minification
- [ ] JavaScript minification
- [ ] Gzip compression
- [ ] CDN for static assets
- [ ] Browser caching headers

---

## 🔧 Common Tasks

### Add a New Page with SEO
1. Create page component in `src/pages/`
2. Import `useSEO` hook
3. Call `useSEO()` with page-specific meta tags
4. Add to Routes in `App.jsx`
5. Update `sitemap.xml`

### Add Mobile Responsiveness to Component
```css
/* Default desktop styles */
.component {
  font-size: 16px;
  padding: 2rem;
}

/* Tablet optimization */
@media (max-width: 1024px) {
  .component {
    font-size: 15px;
    padding: 1.5rem;
  }
}

/* Mobile optimization */
@media (max-width: 768px) {
  .component {
    font-size: 14px;
    padding: 1rem;
  }
}

/* Small mobile optimization */
@media (max-width: 480px) {
  .component {
    font-size: 13px;
    padding: 0.75rem;
  }
}
```

### Test Mobile Responsiveness
1. Open browser DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select device or custom dimensions
4. Test interactions and layout

### Test SEO Meta Tags
1. Open browser inspector
2. Go to Elements tab
3. Expand `<head>` section
4. Check meta tags are present and correct

---

## 🌐 Useful URLs

- **Home:** https://uplynktech.com/
- **Services:** https://uplynktech.com/services
- **Contact:** https://uplynktech.com/contact
- **Courses:** https://uplynktech.com/courses
- **Team:** https://uplynktech.com/team
- **Career:** https://uplynktech.com/career
- **Gallery:** https://uplynktech.com/gallery
- **Sitemap:** https://uplynktech.com/sitemap.xml
- **Robots.txt:** https://uplynktech.com/robots.txt

---

## 📱 Responsive Design Font Sizes

| Element | Desktop | Tablet | Mobile | Small Mobile |
|---------|---------|--------|--------|--------------|
| **H1** | 3.5rem | 2.5rem | 2rem | 1.8rem |
| **H2** | 2.5rem | 2rem | 1.5rem | 1.3rem |
| **H3** | 1.8rem | 1.5rem | 1.2rem | 1rem |
| **Body** | 1rem | 0.95rem | 0.9rem | 0.85rem |
| **Small** | 0.85rem | 0.8rem | 0.75rem | 0.7rem |

---

## 🎯 SEO Keywords by Page

### Home
- Digital solutions, web development, app development, tech education

### Services
- Web development, app development, graphic design, AI automation, shopify, cloud

### Courses
- Online courses, coding bootcamp, web development course, app development course

### Contact
- Contact UPLYNK Tech, inquiry, support, get in touch

### Team
- Team, about us, leadership, CEO, professionals

### Career
- Jobs, careers, employment, developer jobs, designer jobs

### Gallery
- Events, workshops, bootcamp, webinars, training

---

## 📊 Performance Metrics

### Target Metrics (Google Lighthouse)
- **Performance:** 90+
- **Accessibility:** 90+
- **Best Practices:** 90+
- **SEO:** 95+

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

---

## 🚨 Common Issues & Solutions

### Issue: Meta tags not showing
**Solution:** Check useSEO hook is imported and called in component

### Issue: CSS not responsive at breakpoint
**Solution:** Check media query syntax and breakpoint value

### Issue: Carousel shows all items on mobile
**Solution:** Ensure itemsPerView is set correctly for carousel

### Issue: Form fields too small on mobile
**Solution:** Use minimum 16px font size to prevent auto-zoom

### Issue: SEO not working
**Solution:** 
1. Clear browser cache
2. Check meta tags in inspector
3. Submit to Google Search Console

---

## 📚 Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [MDN Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [Responsive Design Principles](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

**Last Updated:** April 4, 2026
**Version:** 1.0
