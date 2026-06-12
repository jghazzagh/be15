/* =============================
   POFT 1301 Interactive Syllabus
   app.js
   ============================= */

// ===== SCHEDULE DATA =====
const scheduleData = [
  { week: 'Week 1',  start: '2026-01-12', due: '2026-01-18', label: 'January 18' },
  { week: 'Week 2',  start: '2026-01-19', due: '2026-01-25', label: 'January 25' },
  { week: 'Week 3',  start: '2026-01-26', due: '2026-02-01', label: 'February 1' },
  { week: 'Week 4',  start: '2026-02-02', due: '2026-02-08', label: 'February 8' },
  { week: 'Week 5',  start: '2026-02-09', due: '2026-02-15', label: 'February 15' },
  { week: 'Week 6',  start: '2026-02-16', due: '2026-02-22', label: 'February 22' },
  { week: 'Week 7',  start: '2026-02-23', due: '2026-03-01', label: 'March 1' },
  { week: 'Week 8',  start: '2026-03-02', due: '2026-03-08', label: 'March 8' },
  { week: 'Week 9',  start: '2026-03-09', due: null,         label: 'Spring Break (No Assignments)', isBreak: true },
  { week: 'Week 10', start: '2026-03-16', due: '2026-03-22', label: 'March 22' },
  { week: 'Week 11', start: '2026-03-23', due: '2026-03-29', label: 'March 29' },
  { week: 'Week 12', start: '2026-03-30', due: '2026-04-05', label: 'April 5' },
  { week: 'Week 13', start: '2026-04-06', due: '2026-04-12', label: 'April 12' },
  { week: 'Week 14', start: '2026-04-13', due: '2026-04-19', label: 'April 19' },
  { week: 'Week 15', start: '2026-04-20', due: '2026-04-26', label: 'April 26' },
  { week: 'Week 16', start: '2026-04-27', due: '2026-05-04', label: 'Monday, May 4 (Finals)', isFinals: true },
];

function getWeekStatus(row) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (row.isBreak) return 'break';
  if (row.isFinals) return 'finals';

  const start = new Date(row.start + 'T00:00:00');
  const end = row.due ? new Date(row.due + 'T23:59:59') : null;

  if (end && today > end) return 'past';
  if (today >= start && end && today <= end) return 'current';
  return 'upcoming';
}

function buildBadge(status) {
  const map = {
    past:     { cls: 'badge-past',     text: 'Closed' },
    current:  { cls: 'badge-current',  text: 'This Week' },
    upcoming: { cls: 'badge-upcoming', text: 'Upcoming' },
    break:    { cls: 'badge-break',    text: 'Spring Break' },
    finals:   { cls: 'badge-finals',   text: 'Finals' },
  };
  const b = map[status] || map.upcoming;
  return `<span class="badge ${b.cls}">${b.text}</span>`;
}

function renderSchedule(filter) {
  const tbody = document.getElementById('scheduleBody');
  tbody.innerHTML = '';

  scheduleData.forEach((row) => {
    const status = getWeekStatus(row);
    const hide =
      (filter === 'upcoming' && (status === 'past' || status === 'break')) ||
      (filter === 'break' && status !== 'break');

    const tr = document.createElement('tr');
    if (hide) tr.classList.add('hidden-row');

    // highlight current week
    if (status === 'current') {
      tr.style.background = '#f0fdf4';
    }

    tr.innerHTML = `
      <td>${row.week}</td>
      <td>${formatDate(row.start)}</td>
      <td>${row.label}</td>
      <td>${buildBadge(status)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ===== FILTER BUTTONS =====
function initScheduleFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSchedule(btn.dataset.filter);
    });
  });
  renderSchedule('all');
}

// ===== ACCORDION =====
function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      const panel = trigger.nextElementSibling;

      // Close all
      triggers.forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.hidden = true;
      });

      // If it wasn't open, open it
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });
}

// ===== GRADE BAR ANIMATION =====
function animateGradeBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.grade-bar').forEach((bar) => {
          bar.classList.add('animated');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const chart = document.querySelector('.grade-chart-container');
  if (chart) observer.observe(chart);
}

// ===== ACTIVE NAV ON SCROLL =====
function initScrollSpy() {
  const sections = document.querySelectorAll('.section');
  const links = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));
}

// ===== SMOOTH SCROLL NAV =====
function initNavLinks() {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close sidebar on mobile
          document.getElementById('sidebar').classList.remove('open');
        }
      }
    });
  });
}

// ===== HAMBURGER =====
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');

  btn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !btn.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initScheduleFilters();
  initAccordion();
  animateGradeBars();
  initScrollSpy();
  initNavLinks();
  initHamburger();
});
