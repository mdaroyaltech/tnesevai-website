const fs = require('fs');

const pages = [
    '/',
    '/about',
    '/services',
    '/contact'
];

const domain = 'https://spt-royal-computers.vercel.app';

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(url => `
  <url>
    <loc>${domain}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`).join('')}
</urlset>`;

fs.writeFileSync('./public/sitemap.xml', sitemap);

console.log('✅ Sitemap generated successfully!');