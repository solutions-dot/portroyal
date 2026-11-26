/* Search engine and link preview tags for the published site (tools/dist.mjs calls this for public builds).
   Everything comes from the menu cards in menu/index.html, so a new game card is enough: its title, line of story, year,
   age and picture become the game page's title, description, canonical link, Open Graph and Twitter preview,
   schema.org VideoGame data, and its line in sitemap.xml. robots.txt keeps /admin/ and /api/ out of search.
   The site's address: PASTPORT_SITE_URL (for a custom domain), else Vercel's production domain. */
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';

const BRAND = 'PastPort - Jamaica';
const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plain = (html) => html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export function siteUrl() {
  const given = process.env.PASTPORT_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : '');
  return given.replace(/\/+$/, '');
}

/* The game cards on the menu, in menu order. */
export function readCards(menuHtml, menuDir) {
  const css = menuHtml.match(/<style>([\s\S]*?)<\/style>/)?.[1] || '';
  return [...menuHtml.matchAll(/<a\b([^>]*\bdata-game="([a-z0-9-]+)"[^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs, id, inner]) => {
    const attr = (name) => attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] || '';
    const classes = attr('class').split(/\s+/).filter((c) => c && c !== 'game');
    let image = '';
    for (const cls of classes) {
      const rule = css.match(new RegExp(`\\.game\\.${cls}(?:::before)?\\s*\\{[^}]*url\\(([^)]+)\\)`));
      if (rule) { image = rule[1].replace(/['"]/g, ''); break; }
    }
    if (!image && existsSync(`${menuDir}/${id}.jpg`)) image = `${id}.jpg`;
    return {
      id, classes, year: attr('data-year'), age: Number(attr('data-age')) || 6, warn: attr('data-warn'),
      genres: attr('data-genres').split(/\s+/).filter(Boolean), tags: attr('data-tags').split(/\s+/).filter(Boolean),
      title: plain(inner.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1] || id),
      period: plain(inner.match(/<span class="year">([\s\S]*?)<\/span>/)?.[1] || attr('data-year')),
      story: plain(inner.match(/<\/h2>\s*<p>([\s\S]*?)<\/p>/)?.[1] || ''),
      image: image || 'pastport-logo.webp'
    };
  });
}

function head({ title, description, url, image, type = 'website', extra = '' }) {
  const verify = process.env.GOOGLE_SITE_VERIFICATION ? `<meta name="google-site-verification" content="${escape(process.env.GOOGLE_SITE_VERIFICATION)}">` : '';
  return [
    `<meta name="description" content="${escape(description)}">`,
    url ? `<link rel="canonical" href="${escape(url)}">` : '',
    `<meta name="robots" content="index,follow,max-image-preview:large">`,
    `<meta property="og:site_name" content="${BRAND}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:title" content="${escape(title)}">`,
    `<meta property="og:description" content="${escape(description)}">`,
    url ? `<meta property="og:url" content="${escape(url)}">` : '',
    image ? `<meta property="og:image" content="${escape(image)}">` : '',
    `<meta property="og:locale" content="en_JM">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escape(title)}">`,
    `<meta name="twitter:description" content="${escape(description)}">`,
    image ? `<meta name="twitter:image" content="${escape(image)}">` : '',
    verify, extra
  ].filter(Boolean).join('');
}

/* Put the tags into one page: replace its <title>, drop any old description and robots tags, add ours before </head>. */
function apply(path, { title, ...rest }) {
  if (!existsSync(path)) return false;
  let html = readFileSync(path, 'utf8');
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/<meta\s+name="(?:description|robots)"[^>]*>\s*/g, '')
    .replace('</head>', head({ title, ...rest }) + '</head>');
  writeFileSync(path, html);
  return true;
}

export function writeSeo(out) {
  const origin = siteUrl();
  const abs = (path) => origin ? origin + path : '';
  const menuHtml = readFileSync(`${out}/index.html`, 'utf8');
  const cards = readCards(menuHtml, out);
  const today = new Date().toISOString().slice(0, 10);
  const organization = { '@type': 'Organization', name: BRAND, url: abs('/') || undefined, logo: abs('/pastport-icon.png') || undefined };

  const gameData = (card) => ({
    '@type': 'VideoGame',
    name: card.title,
    description: card.story,
    url: abs(`/games/${card.id}/site/`) || undefined,
    image: abs('/' + card.image) || undefined,
    genre: ['Educational', 'Adventure', 'History'],
    gamePlatform: ['Web browser', 'Mobile phone', 'Tablet', 'Computer'],
    applicationCategory: 'Game',
    operatingSystem: 'Any (runs in a web browser)',
    playMode: 'SinglePlayer',
    inLanguage: 'en',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    typicalAgeRange: card.age >= 13 ? '13-' : '6-',
    ...(card.age >= 13 ? { contentRating: 'Mature 13+' } : {}),
    temporalCoverage: card.year || undefined,
    about: { '@type': 'Place', name: 'Jamaica' },
    keywords: ['Jamaica', 'Jamaican history', 'history game', ...card.tags.filter((t) => t !== 'hard-history').map((t) => t.replace(/-/g, ' '))].join(', '),
    publisher: organization
  });

  /* Each game page */
  for (const card of cards) {
    const ageText = card.age >= 13 ? 'Mature 13+.' : 'For ages 6 and up.';
    const description = `${card.story} A free 3D story game of Jamaican history (${card.period}) that plays in your browser on a phone, tablet or computer. ${ageText}`.replace(/\s+/g, ' ');
    const path = `${out}/games/${card.id}/site/index.html`;
    const done = apply(path, {
      title: `${card.title} | Free Jamaican history game | ${BRAND}`,
      description, url: abs(`/games/${card.id}/site/`), image: abs('/' + card.image), type: 'website',
      extra: jsonLd({ '@context': 'https://schema.org', ...gameData(card) }) + jsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'All games', item: abs('/') || undefined },
        { '@type': 'ListItem', position: 2, name: card.title, item: abs(`/games/${card.id}/site/`) || undefined }] })
    });
    if (done) {
      /* A short text a crawler (or a browser without JavaScript) can read: the game draws everything else in 3D. */
      let html = readFileSync(path, 'utf8');
      html = html.replace(/<body([^>]*)>/, `<body$1><noscript><div style="padding:1rem;max-width:40rem;font:16px/1.5 system-ui,sans-serif"><h1>${escape(card.title)}</h1><p>${escape(card.story)}</p><p>This free 3D history game needs JavaScript to play. <a href="/">See all PastPort games</a>.</p></div></noscript>`);
      writeFileSync(path, html);
    }
  }

  /* The menu, at / and /menu/ (both point search engines at /) */
  const siteDescription = 'Free 3D story games that take you into Jamaica\'s past, from the Taino and Port Royal to Marcus Garvey, the Windrush and Air Jamaica. Play in your browser on a phone, tablet or computer. For ages 6 and up, with some Mature 13+ stories.';
  const menuExtra = jsonLd({ '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebSite', name: BRAND, alternateName: 'PastPort', url: abs('/') || undefined, description: siteDescription, inLanguage: 'en', publisher: organization },
    organization,
    { '@type': 'ItemList', name: 'Jamaican history games', itemListElement: cards.map((card, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/games/${card.id}/site/`) || undefined, name: card.title })) }
  ] });
  for (const path of [`${out}/index.html`, `${out}/menu/index.html`]) apply(path, {
    title: `${BRAND} | Free 3D Jamaican history games for kids and adults`,
    description: siteDescription, url: abs('/'), image: abs('/' + (cards[0]?.image || 'pastport-logo.webp')), extra: menuExtra
  });
  const aboutDescription = 'How PastPort - Jamaica is made, where the history in each game comes from, and which people and places are fictional. A guide for students, teachers and parents.';
  for (const path of [`${out}/about.html`, `${out}/menu/about.html`]) apply(path, {
    title: `About | ${BRAND}`, description: aboutDescription, url: abs('/about'), image: abs('/pastport-logo.webp')
  });

  /* robots.txt and sitemap.xml */
  writeFileSync(`${out}/robots.txt`, ['User-agent: *', 'Allow: /', 'Disallow: /admin/', 'Disallow: /api/', ...(origin ? ['', `Sitemap: ${origin}/sitemap.xml`] : []), ''].join('\n'));
  if (origin) {
    const urls = [['/', '1.0'], ['/about', '0.5'], ...cards.map((card) => [`/games/${card.id}/site/`, '0.8'])];
    writeFileSync(`${out}/sitemap.xml`, '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
      urls.map(([path, priority]) => {
        const card = cards.find((c) => path === `/games/${c.id}/site/`);
        const image = card ? `<image:image><image:loc>${escape(origin + '/' + card.image)}</image:loc></image:image>` : '';
        return `  <url><loc>${escape(origin + path)}</loc><lastmod>${today}</lastmod><priority>${priority}</priority>${image}</url>`;
      }).join('\n') + '\n</urlset>\n');
  }
  const missing = readdirSync(`${out}/games`).filter((g) => !cards.some((c) => c.id === g));
  console.log(`seo: ${cards.length} games tagged${origin ? ', sitemap for ' + origin : ' (no site address: set PASTPORT_SITE_URL for canonical links and the sitemap)'}${missing.length ? '; not on the menu, left unindexed: ' + missing.join(', ') : ''}`);
  for (const g of missing) {
    const path = `${out}/games/${g}/site/index.html`;
    if (existsSync(path)) writeFileSync(path, readFileSync(path, 'utf8').replace('</head>', '<meta name="robots" content="noindex"></head>'));
  }
}
