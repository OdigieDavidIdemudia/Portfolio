# Cybersecurity Portfolio Website

A premium, dark-themed portfolio website showcasing cybersecurity analysis and software development expertise.

## 🎨 Features

- **Dark Cyber Aesthetic**: Modern dark theme with cyan/teal accent colors
- **Glassmorphism Effects**: Frosted glass cards with backdrop blur
- **Animated Network Background**: Interactive particle network in hero section
- **Smooth Animations**: Fade-in effects, hover transitions, and card tilt interactions
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## 🚀 Quick Start

1. **Open the website**:
   - Simply open `index.html` in your web browser
   - Or use a local server for best experience:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve
     ```

2. **Customize the content**:
   - Edit `index.html` to update your personal information
   - Modify colors in `styles.css` (CSS variables in `:root`)
   - Adjust animations in `script.js`

## 📁 File Structure

```
cyber-portfolio/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # Interactive features and network animation
└── README.md       # This file
```

## 🎨 Color Palette

- **Background**: `#0B0F14` (Deep dark blue-black)
- **Surface**: `#121822` (Slightly lighter surface)
- **Primary**: `#00E5FF` (Bright cyan)
- **Secondary**: `#5EEAD4` (Teal)
- **Text Primary**: `#E5E7EB` (Light gray)
- **Text Secondary**: `#9CA3AF` (Medium gray)

## ✏️ Customization Guide

### Update Personal Information

1. **Contact Details** (in `index.html`):
   - Replace `your@email.com` with your email
   - Update GitHub and LinkedIn URLs
   - Change "Your Name" in meta tags

2. **Projects**:
   - Edit the project cards in the `#projects` section
   - Add/remove projects as needed
   - Update tech tags

3. **Skills & Stack**:
   - Modify the items in `#stack` section
   - Add/remove capability items

### Customize Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --bg-primary: #0B0F14;
    --color-primary: #00E5FF;
    /* ... other colors */
}
```

### Adjust Animations

In `script.js`, modify:
- `particleCount`: Number of network particles (default: 80)
- `connectionDistance`: Distance for particle connections (default: 150)
- Animation speeds and effects

## 🌐 Deployment

### GitHub Pages

1. Create a new repository
2. Push these files to the repository
3. Go to Settings → Pages
4. Select main branch as source
5. Your site will be live at `https://yourusername.github.io/repo-name`

### Cloudflare Pages

1. Connect your GitHub repository
2. Build settings:
   - Build command: (leave empty)
   - Build output directory: `/`
3. Deploy

### Custom Domain

Add a `CNAME` file with your domain name and configure DNS settings with your provider.

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern features (Grid, Flexbox, Custom Properties, Backdrop Filter)
- **Vanilla JavaScript**: No frameworks, pure JS
- **Google Fonts**: Space Grotesk & Inter

## 📄 License

Free to use and modify for your personal portfolio.

## 🎯 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Note**: Replace placeholder content (email, GitHub, LinkedIn, name) with your actual information before deploying.
