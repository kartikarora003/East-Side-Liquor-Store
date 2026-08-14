Packing House–style flyer setup
================================

1. Drop the flyer image here using this name pattern:
   2026-08-august.jpg
   (must include YYYY-MM so the site can read the month)

2. In html/config.js:
   - set flyerComingSoon: false
   - add the path at the top of monthlyFlyers (newest first):

   monthlyFlyers: [
     "images/flyers/2026-08-august.jpg",
     "images/flyers/2026-07-july.jpg",
   ],

3. Keep old lines in monthlyFlyers — past months stay in the archive.

While flyerComingSoon is true (or the image is missing), the Flyers page shows Coming Soon.
