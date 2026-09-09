# Flat editorial redesign — progress

Tracks conversion of every page/component to the new design system. Source of
truth is the Claude Design export at `department-ai-data-science-portal/project/`
(mockup anchors like `1a`/`2f` below refer to option ids in
`AI and DS Department.dc.html` / `AI and DS Department R2.dc.html`; see
`.claude/plans` for the full mockup-to-file mapping). Pages without a mockup
use the Phase 0 tokens/primitives directly. Check off a file in the same
commit that converts it.

## Phase 0 — Foundation
- [x] tailwind.config.js (tokens, radius/shadow override, type scale)
- [x] index.html (Archivo font link)
- [x] src/index.css (design tokens, base rules)
- [x] delete src/App.css (dead code)
- [x] delete src/style.css (dead code) + remove import from App.jsx
- [x] scaffold src/components/ui/ primitives (Button, Card, Tag, Table, Tabs, Field, StatBlock, NoticeStrip, PageHeader, Avatar)

## Step A — Unified top nav (supersedes Sidebar + Navbar)
- [x] src/components/SiteNav.jsx (new — mockup `SiteNav.dc.html`)
- [x] src/App.jsx — MainLayout now renders SiteNav
- [x] delete src/components/Sidebar.jsx, src/components/Navbar.jsx (no longer imported anywhere)
- [x] src/components/HeroCanvas.jsx (new — ported particle-animation canvas, shared by Dashboard + Sign in)

## Phase 1 — Sign-off pair (rebuilt to match mockups; STOP for approval)
- [x] src/App.jsx — DashboardPage → mockup `1a`
- [x] src/pages/LoginPage.jsx → mockup `2i`

## Phase 2 — Remaining chrome + auth pages
- [x] src/App.jsx — AdminLayout, ConnectPage, ProjectsPage (no mockup — tokens only)
- [x] src/components/ProfessionalAdminLayout.jsx (no mockup — tokens only)
- [x] src/pages/SignupPage.jsx → mockup `2j`
- [x] src/pages/AdminLogin.jsx (no mockup — reuse sign-in card pattern from `2i`, simplified)

## Phase 3 — Public directory pages + cards
- [x] src/pages/FacultyInfo.jsx + src/components/FacultyCard.jsx → mockup `2a`
- [x] src/pages/StaffInfo.jsx → flat card grid (kept cards, not table — real data has no duty/location/extension columns; src/components/StaffCard.jsx confirmed dead/unused, left as is)
- [x] src/pages/Syllabus.jsx → mockup `2c` styling (accordion/search/PDF-modal logic unchanged)
- [x] src/pages/Alumni.jsx + src/components/AlumniCard.jsx → mockup `1f` + `1g` profile modal
- [x] src/pages/AssociationMembers.jsx + src/components/MemberCard.jsx (no mockup — tokens/card patterns)
- [x] src/pages/TeamInfo.jsx (no mockup — tokens/card patterns)

## Phase 4 — Events cluster
- [x] src/pages/EventsPage.jsx → mockup `1b`
- [x] src/pages/Codenigma.jsx, src/pages/Genesys.jsx → correction: these are placeholder-data leaderboard pages (not event detail), restyled with mockup `2d`'s rank-table pattern instead
- [x] src/components/PastEventCard.jsx, src/components/UpcomingEventCard.jsx → card styling embedded in `1b`
- [x] src/components/Dashboard_Carousel.jsx (restyle chrome — used on Dashboard `1a`)
- [x] src/components/AchievementsCarousel.jsx (restyle chrome — used on Dashboard `1a`)
- [x] src/components/EventCalendar.jsx (restyle chrome around the Google Calendar embed; src/components/CalendarEmbed.jsx confirmed dead/unused, left as is)
- [x] src/components/EventDetails.jsx → `EventDetail.dc.html` pattern (used by EventsPage's inline detail view)

## Phase 5 — Leaderboards + achievements (public)
- [x] src/pages/UserLeaderboards.jsx + src/components/UserLeaderboardBox.jsx → mockups `2d` (coding contest) + `2e` (project expo)
- [x] src/pages/UserAchievements.jsx → mockup `1e` (card grid, no image field in real data)

## Phase 6 — Posts / Question Bank / Profile
- [x] src/pages/PostsPage.jsx → mockup `1h` styling (feed, sidebar, create/edit modals, inline post-detail view, comment cards, profile popover — all real, self-contained in this one file; real upvotes data confirmed, vote-arrow UI kept)
- [x] src/pages/PostDetailPage.jsx (separate route component, own inline CommentCard) → mockup `1i` styling
- [x] src/components/PostCard.jsx, src/components/PostModal.jsx, src/components/CommentCard.jsx, src/components/CommentForm.jsx, src/components/CommentSidebar.jsx — confirmed dead/unused (PostsPage and PostDetailPage each define their own local versions), left as is
- [x] src/pages/QuestionBank.jsx → mockup `2f` (browse) + `2g` (upload)
- [x] src/pages/Profile.jsx → mockup `2h`
- [x] src/pages/EditProfile.jsx → field/button styling from sign-in/upload forms

## Phase 7 — Admin surfaces (no mockups — flat tokens applied)
- [x] src/components/AdminDashboard.jsx
- [x] src/components/EventsAdminPage.jsx
- [x] src/components/ManageUploads.jsx
- [x] src/components/ManageContent.jsx
- [x] src/components/ManageContentupdates.jsx
- [x] src/pages/AdminLeaderboards.jsx
- [x] src/components/AdminLeaderboardBox.jsx
- [x] src/pages/AdminAchievements.jsx

## Phase 8 — Leftovers
- [x] src/components/BrickBreakerGame.jsx (chrome + status strips restyled; canvas gameplay drawing untouched)
- [x] src/pages/NotFound.jsx — confirmed unrouted (catch-all does `<Navigate to="/" />`), skipped

## Redesign complete
All phases 0–8 done. Every routed page/component now uses the flat editorial
design system.

## Excluded (no visual output)
- src/components/ProtectedRoute.jsx
- src/components/AdminProtectedRoute.jsx
