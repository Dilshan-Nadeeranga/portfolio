# Dilshan Nadeeranga – Portfolio

A modern, single-page portfolio website built with React + Vite + TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📦 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework + build tool |
| TypeScript | Type safety |
| Tailwind CSS | Styling (dark/light mode) |
| Framer Motion | Animations |
| EmailJS | Contact form (no backend) |
| GitHub REST API | Live repository display |
| marked + highlight.js | Blog post rendering |

## ⚙️ Configuration

### 1. EmailJS Setup (required for contact form)

1. Sign up free at [emailjs.com](https://www.emailjs.com/)
2. **Add Email Service**: Settings → Email Services → Add New Service (Gmail)
3. **Create Email Template**: Email Templates → Create New Template
   - Use these template variables: `{{from_name}}`, `{{from_email}}`, `{{message}}`, `{{to_name}}`
4. **Copy credentials** and create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 2. Resume PDF

Place your CV file at:
```
public/Dilshan_Nadeeranga_CV.pdf
```

### 3. Profile Image (optional)

Add a profile photo at `public/images/profile.jpg` for social sharing.

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add environment variables in Vercel dashboard:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`  
   - `VITE_EMAILJS_PUBLIC_KEY`
4. Deploy!

### Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → New Site → Connect repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Site Settings → Environment Variables

## 📂 Content Files

Update content by editing JSON files in `public/data/`:

| File | Content |
|---|---|
| `projects.json` | Portfolio projects |
| `experience.json` | Work history & education |
| `skills.json` | Technical skills |
| `certifications.json` | Certifications |

Add blog posts as `.md` files in `public/blog/` and update `public/blog/blog-manifest.json`.

## 🎨 Customization

- **Colors**: Edit `tailwind.config.js` → `theme.extend.colors`
- **Content**: Edit JSON files in `public/data/`
- **Blog**: Add `.md` files with frontmatter in `public/blog/`
- **Resume**: Replace `public/Dilshan_Nadeeranga_CV.pdf`

## 📊 Performance

- Lazy-loaded images
- Code splitting (vendor + utils chunks)
- SessionStorage caching for GitHub API responses
- Optimistic skeleton loaders

## 🛡️ No Backend Required

Everything runs client-side:
- **Data**: Local JSON files served as static assets
- **Contact form**: EmailJS SDK sends emails directly from the browser
- **GitHub data**: Public GitHub REST API (client-side fetch)
- **Blog**: Markdown files parsed in the browser with `marked`
