import HeaderManager from './global/header.js';
import LockManager from './global/locker.js';
import NavManager from './global/main-nav.js';
import ExpandOne from './components/expand-one.js';
import SearchOverlayManager from './components/search-overlay.js';
import BodyScrollTracker from './components/body-scroll-tracker.js';

// components
new LockManager();
new NavManager();
new SearchOverlayManager();
new BodyScrollTracker();
const HM = new HeaderManager();
HM.trackHeaderHeight();
HM.trackViewportHeight();
HM.toggleHide(400);
HM.toggleBackground(60);

new ExpandOne('gov-bar-expand');
const alertExpand = new ExpandOne('site-alert');
window.setTimeout(alertExpand.toggle, 1000);