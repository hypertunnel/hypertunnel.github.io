// Google Analytics (GA4). Kept in a real file (not inline) so the page can keep a
// strict Content-Security-Policy. The gtag loader itself is the async <script> in the
// page <head>; this just initialises it. Funnel events are fired from script.js
// (begin_checkout) and setup.js (purchase).
window.dataLayer = window.dataLayer || [];
function gtag(){ dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-0D77H5BBD6');
