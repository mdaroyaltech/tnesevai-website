// src/components/shared/SEO.js
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://spt-royal-computers.vercel.app';
const DEFAULT_DESC = 'Royal Computers — Authorized TNeSevai & Digital Seva center in Tamil Nadu. Apply for Ration Card, Community Certificate, Income Certificate, PAN Card, Passport, Voter ID, TNPSC, NEET and all government services.';
const DEFAULT_KW   = 'Royal Computers TNeSevai, Digital Seva Tamil Nadu, Ration Card apply Tamil Nadu, Community Certificate online, Income Certificate, PAN Card apply, Passport apply Tamil Nadu, TNPSC application, NEET 2026 application, Voter ID apply, Aadhar update, Government services Tamil Nadu, VLE 642198200013';
const DEFAULT_IMG  = `${SITE_URL}/logo512.svg`;

export default function SEO({ title, description = DEFAULT_DESC, keywords = '', url = '/', image = DEFAULT_IMG, noIndex = false }) {
  const fullTitle    = title
    ? `${title} | Royal Computers – TNeSevai & Digital Seva`
    : 'Royal Computers – Authorized TNeSevai & Digital Seva Center | Tamil Nadu';
  const canonicalUrl = `${SITE_URL}${url}`;
  const fullKw       = keywords ? `${keywords}, ${DEFAULT_KW}` : DEFAULT_KW;

  return (
    <Helmet prioritizeSeoTags>
      {/* ── Primary ── */}
      <title>{fullTitle}</title>
      <meta name="title"         content={fullTitle} />
      <meta name="description"   content={description} />
      <meta name="keywords"      content={fullKw} />
      <meta name="author"        content="Royal Computers, Tamil Nadu" />
      <meta name="robots"        content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="language"      content="English, Tamil" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical"      href={canonicalUrl} />

      {/* ── Open Graph (WhatsApp / Facebook preview) ── */}
      <meta property="og:type"         content="website" />
      <meta property="og:url"          content={canonicalUrl} />
      <meta property="og:title"        content={fullTitle} />
      <meta property="og:description"  content={description} />
      <meta property="og:image"        content={image} />
      <meta property="og:image:width"  content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:image:alt"    content="Royal Computers – TNeSevai & Digital Seva" />
      <meta property="og:site_name"    content="Royal Computers" />
      <meta property="og:locale"       content="en_IN" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />

      {/* ── Local SEO (Tamil Nadu shop — very important) ── */}
      <meta name="geo.region"          content="IN-TN" />
      <meta name="geo.country"         content="India" />
      <meta name="geo.placename"       content="Tamil Nadu, India" />

      {/* ── Mobile / PWA ── */}
      <meta name="theme-color"                            content="#15803d" />
      <meta name="mobile-web-app-capable"                 content="yes" />
      <meta name="apple-mobile-web-app-capable"           content="yes" />
      <meta name="apple-mobile-web-app-title"             content="Royal Computers" />
      <meta name="apple-mobile-web-app-status-bar-style"  content="default" />
    </Helmet>
  );
}
