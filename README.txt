Warren County Parks Report App

FILES:
- index.html: employee report form
- history.html: report history
- login.html: admin login
- admin.html: admin dashboard
- style.css: design
- supabase.js: add your Supabase URL and anon key here
- app.js/history.js/login.js/admin.js: app logic
- manifest.json/sw.js: installable app files
- supabase-setup.sql: database table and policies

SETUP:
1. Upload all files to your GitHub repo.
2. In Supabase, create a project.
3. Open SQL Editor and run supabase-setup.sql.
4. Create a public Storage bucket named report-photos.
5. In Supabase Project Settings > API, copy:
   - Project URL
   - anon public key
6. Paste those into supabase.js.
7. Deploy GitHub Pages from main branch / root.
8. Open the GitHub Pages link on your phone.
9. In Chrome, choose Add to Home Screen or Install App.

ADMIN LOGIN:
Use John, Reid, or Tiffany.
This is simple name-gate access for the first version.
For stronger security later, switch admin login to Supabase Auth.
