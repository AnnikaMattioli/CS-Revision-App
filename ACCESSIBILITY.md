# Accessibility review

Bytewise targets WCAG 2.2 AA. Phase 8 checked semantic landmarks and headings, labelled controls, keyboard navigation, visible focus, status/error announcements, responsive zoom, contrast-aware themes, reduced motion, text chart summaries and non-colour status labels.

Automated browser checks verify the skip link, off-canvas navigation, guarded dialog flow, reduced-motion preference, viewport overflow and public statement. Playwright covers desktop Chromium and an iPhone-sized viewport locally; CI adds Firefox, WebKit and an iPad-sized viewport.

Manual release checks should still include:

- complete core journeys using only Tab, Shift+Tab, Enter, Space, arrow keys and Escape;
- 200% browser zoom and forced-colour mode;
- VoiceOver or NVDA reading order, labels and live announcements;
- light and dark contrast review after any palette change;
- captions or transcripts before any future audio/video is published.

The public statement at `/accessibility` describes the target, current limitations and reporting route.
