# Deployment Guide

This document provides instructions for deploying the 3D Bubble Shooter game to various hosting platforms.

## Deployment Options

The game is a static web application consisting of HTML, CSS, and JavaScript files. It can be deployed to any static hosting service.

### Option 1: GitHub Pages (Free)

GitHub Pages is the easiest and most popular option for hosting static websites directly from your GitHub repository.

**Steps:**

1. **Push your code to GitHub** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/bubble-shooter-3d.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on "Settings"
   - Scroll down to "Pages" section
   - Under "Source", select "main" branch
   - Click "Save"

3. **Access your game**
   - Your game will be available at: `https://yourusername.github.io/bubble-shooter-3d/`
   - It may take a few minutes for the site to go live

### Option 2: Vercel (Free)

Vercel offers excellent performance and automatic deployments.

**Steps:**

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI**
   ```bash
   cd bubble-shooter-3d
   vercel
   ```

3. **Or deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
   - Vercel will automatically detect it as a static site
   - Click "Deploy"

4. **Access your game**
   - Vercel will provide a URL like: `https://bubble-shooter-3d.vercel.app`

### Option 3: Netlify (Free)

Netlify is another excellent option with drag-and-drop deployment.

**Steps:**

1. **Deploy via Drag & Drop**
   - Go to [netlify.com](https://netlify.com)
   - Drag the entire project folder to the deployment area
   - Your site will be live immediately

2. **Or deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Or connect GitHub repository**
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Click "Deploy site"

4. **Access your game**
   - Netlify will provide a URL like: `https://bubble-shooter-3d.netlify.app`

### Option 4: Cloudflare Pages (Free)

Cloudflare Pages offers fast global CDN delivery.

**Steps:**

1. **Create a Cloudflare account** at [cloudflare.com](https://cloudflare.com)

2. **Go to Pages**
   - Navigate to "Pages" in the dashboard
   - Click "Create a project"

3. **Connect GitHub**
   - Authorize Cloudflare to access your GitHub
   - Select your repository

4. **Configure build settings**
   - Build command: (leave empty)
   - Build output directory: `/`
   - Click "Save and Deploy"

5. **Access your game**
   - Cloudflare will provide a URL like: `https://bubble-shooter-3d.pages.dev`

### Option 5: Custom Server

If you have your own server, you can deploy using any web server.

**Using Apache:**

1. Copy files to web directory:
   ```bash
   sudo cp -r bubble-shooter-3d /var/www/html/
   ```

2. Configure Apache virtual host (optional):
   ```apache
   <VirtualHost *:80>
       ServerName bubble-shooter.example.com
       DocumentRoot /var/www/html/bubble-shooter-3d
       <Directory /var/www/html/bubble-shooter-3d>
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```

**Using Nginx:**

1. Copy files to web directory:
   ```bash
   sudo cp -r bubble-shooter-3d /usr/share/nginx/html/
   ```

2. Configure Nginx server block (optional):
   ```nginx
   server {
       listen 80;
       server_name bubble-shooter.example.com;
       root /usr/share/nginx/html/bubble-shooter-3d;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## Custom Domain Setup

### For GitHub Pages:

1. Add a `CNAME` file to your repository with your domain:
   ```
   bubble-shooter.yourdomain.com
   ```

2. Configure DNS:
   - Add a CNAME record pointing to `yourusername.github.io`

### For Vercel/Netlify/Cloudflare:

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions provided

## Performance Optimization

### Enable Compression

Most hosting platforms automatically enable gzip compression. If using a custom server:

**Apache (.htaccess):**
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>
```

**Nginx:**
```nginx
gzip on;
gzip_types text/css application/javascript;
```

### Enable Caching

**Apache (.htaccess):**
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

**Nginx:**
```nginx
location ~* \.(css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### CDN Integration

For better global performance, consider using a CDN:

1. **Cloudflare** (Free)
   - Sign up at cloudflare.com
   - Add your domain
   - Update nameservers
   - Cloudflare will automatically cache and optimize your site

2. **AWS CloudFront**
   - Create a CloudFront distribution
   - Point it to your hosting origin
   - Update DNS to use CloudFront domain

## SSL/HTTPS

All recommended hosting platforms (GitHub Pages, Vercel, Netlify, Cloudflare) provide free SSL certificates automatically.

For custom servers, use Let's Encrypt:

```bash
sudo apt-get install certbot python3-certbot-apache
sudo certbot --apache -d bubble-shooter.example.com
```

## Monitoring

### Analytics

Add Google Analytics by inserting before `</head>` in index.html:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking

Consider adding Sentry for error tracking:

```html
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'YOUR_DSN' });
</script>
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## Troubleshooting

### Game not loading
- Check browser console for errors
- Ensure all files are in the correct locations
- Verify file permissions on server

### Leaderboard not saving
- Check if localStorage is enabled in browser
- Verify browser privacy settings allow localStorage
- Test in different browsers

### Performance issues
- Enable compression and caching
- Use a CDN for global distribution
- Optimize images if you add any

## Support

For deployment issues, please check:
- Hosting platform documentation
- Browser console for errors
- GitHub Issues for known problems

---

**Happy deploying! 🚀**
