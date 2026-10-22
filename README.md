# Smart Office Attendance — Static Dashboard

This is a separate static website for deployment as a Render **Static Site**. It does not replace or delete the existing C# Windows Forms application or Python files.

## Deploy on Render
1. Extract this ZIP.
2. Create a new GitHub repository, for example `smart-office-attendance-web`.
3. Upload the contents of this folder to the repository root. `index.html`, `styles.css`, and `app.js` should be at the root, not inside an extra nested folder.
4. In Render choose **New + → Static Site** and connect that repository.
5. Build command: leave blank.
6. Publish directory: `.`
7. Deploy.

## Connect to the existing API
On the deployed site, enter your Render backend URL, such as `https://YOUR-BACKEND.onrender.com`, then choose **Test connection**. This dashboard checks `/health` and falls back to `/`.

## Important current limitations
- The dashboard is a static frontend; it does not run C# or Python code in the browser.
- The camera preview uses the browser's camera permission but does not upload video or perform recognition.
- Registration, live attendance statistics, and CSV export require real backend endpoints; these controls are intentionally not faked.
- The existing C# Windows Forms app can continue to run locally on Windows.
- If browser requests fail across domains, configure Flask CORS for the exact deployed frontend origin.
- `localStorage` is used only to remember the API URL in this browser. It is not used as an attendance database.

## Current backend endpoints expected
- `GET /health`
- `GET /`

Additional endpoints will be needed for people registration, recognition, attendance history, statistics, and export.
