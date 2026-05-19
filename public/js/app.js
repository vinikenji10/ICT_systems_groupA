const clubs = [
  {
    id: 'baseball',
    name: 'SIT Baseball',
    sportType: 'Teams',
    activityLevel: 'Competitive',
    status: 'Active',
    recruiting: true,
    description: 'Join the SIT Baseball team and experience the thrill of America\'s pastime. Competitive games, training sessions, and team bonding events throughout the semester.',
    image: ''
  },
  {
    id: 'basketball',
    name: 'SIT Basketball',
    sportType: 'Teams',
    activityLevel: 'Competitive',
    status: 'Active',
    recruiting: true,
    description: 'Fast-paced basketball action with regular tournaments and friendly matches. All skill levels welcome to try out and be part of the team.',
    image: ''
  },
  {
    id: 'esports',
    name: 'SIT Esports',
    sportType: 'Individual',
    activityLevel: 'Competitive',
    status: 'Active',
    recruiting: true,
    description: 'Compete in popular titles like League of Legends, Valorant, and Overwatch. Join our gaming community and represent SIT in inter-university tournaments.',
    image: ''
  },
  {
    id: 'tennis',
    name: 'SIT Tennis',
    sportType: 'Individual',
    activityLevel: 'Recreational',
    status: 'Active',
    recruiting: true,
    description: 'Enjoy tennis on our excellent courts with regular practice sessions and friendly tournaments. Great for players of all skill levels.',
    image: ''
  },
  {
    id: 'volleyball',
    name: 'SIT Volleyball',
    sportType: 'Teams',
    activityLevel: 'Recreational',
    status: 'Active',
    recruiting: false,
    description: 'Spike, set, and serve with SIT Volleyball. Join our recreational league for fun matches and great team camaraderie.',
    image: ''
  },
  {
    id: 'football',
    name: 'SIT Football',
    sportType: 'Teams',
    activityLevel: 'Competitive',
    status: 'Active',
    recruiting: true,
    description: 'Represent SIT in inter-university football competitions. Regular training, tactical sessions, and competitive matches throughout the season.',
    image: ''
  },
  {
    id: 'martial-arts',
    name: 'SIT Martial Arts',
    sportType: 'Martial Arts',
    activityLevel: 'Competitive',
    status: 'Active',
    recruiting: false,
    description: 'Train in various disciplines including karate, judo, and taekwondo. Self-defense skills, discipline, and physical fitness for all members.',
    image: ''
  },
  {
    id: 'swimming',
    name: 'SIT Swimming',
    sportType: 'Individual',
    activityLevel: 'Competitive',
    status: 'Active',
    recruiting: true,
    description: 'Dive into competitive swimming with coached sessions and regular meets. Join our aquatics community and improve your technique.',
    image: ''
  },
  {
    id: 'track-field',
    name: 'SIT Track & Field',
    sportType: 'Individual',
    activityLevel: 'Competitive',
    status: 'Active',
    recruiting: false,
    description: 'From sprints to distance running, jumps to throws — our track and field club offers professional coaching and competition opportunities.',
    image: ''
  },
  {
    id: 'badminton',
    name: 'SIT Badminton',
    sportType: 'Individual',
    activityLevel: 'Recreational',
    status: 'Active',
    recruiting: true,
    description: 'Fast rallies and friendly competition await at SIT Badminton. Casual play and organized tournaments for all skill levels.',
    image: ''
  }
];

const sportImages = {
  'baseball': 'linear-gradient(135deg, #1a3a5c, #2d5f8a)',
  'basketball': 'linear-gradient(135deg, #c45c2b, #e87a3e)',
  'esports': 'linear-gradient(135deg, #2a1a4e, #5c3d99)',
  'tennis': 'linear-gradient(135deg, #3a7a3a, #5caf5c)',
  'volleyball': 'linear-gradient(135deg, #c4a035, #e8c55a)',
  'football': 'linear-gradient(135deg, #2a4a3a, #3d7a5c)',
  'martial-arts': 'linear-gradient(135deg, #5a2a2a, #8a3d3d)',
  'swimming': 'linear-gradient(135deg, #1a5c7a, #2d8aaa)',
  'track-field': 'linear-gradient(135deg, #4a3a2a, #7a5c3d)',
  'badminton': 'linear-gradient(135deg, #3a5c3a, #5a8a5a)'
};

const sportIcons = {
  'baseball': '\u26BE',
  'basketball': '\uD83C\uDFC0',
  'esports': '\uD83C\uDFAE',
  'tennis': '\uD83C\uDFBE',
  'volleyball': '\uD83C\uDFD0',
  'football': '\u26BD',
  'martial-arts': '\uD83E\uDD4B',
  'swimming': '\uD83C\uDFCA',
  'track-field': '\uD83C\uDFC3',
  'badminton': '\uD83C\uDFF8'
};

let activeFilters = {
  sportType: [],
  activityLevel: [],
  status: []
};

function renderClubs(filteredClubs) {
  const grid = document.getElementById('clubGrid');

  if (filteredClubs.length === 0) {
    grid.innerHTML = '<div class="no-results">No clubs match your filters. Try adjusting your selections.</div>';
    return;
  }

  grid.innerHTML = filteredClubs.map(club => {
    const tags = [];
    tags.push({ text: club.sportType, class: 'tag-sport' });
    tags.push({ text: club.activityLevel, class: club.activityLevel === 'Competitive' ? 'tag-competitive' : 'tag-recreational' });
    tags.push({ text: club.status, class: 'tag-active' });
    if (club.recruiting) tags.push({ text: 'Recruiting', class: 'tag-recruiting' });

    const gradient = sportImages[club.id] || 'linear-gradient(135deg, #0C4A34, #1a6b4e)';
    const icon = sportIcons[club.id] || '';

    return `
      <div class="club-card" data-club-id="${club.id}">
        <div class="club-card-image" style="background: ${gradient}; display: flex; align-items: center; justify-content: center; font-size: 48px; color: rgba(255,255,255,0.6);">
          ${icon}
        </div>
        <div class="club-card-body">
          <h3 class="club-card-title">${club.name}</h3>
          <div class="club-card-tags">
            ${tags.map(t => `<span class="tag ${t.class}">${t.text}</span>`).join('')}
          </div>
          <p class="club-card-desc">${club.description}</p>
          <a href="#" class="club-card-btn">View Club Details</a>
        </div>
      </div>
    `;
  }).join('');
}

function filterClubs() {
  return clubs.filter(club => {
    if (activeFilters.sportType.length > 0 && !activeFilters.sportType.includes(club.sportType)) {
      return false;
    }
    if (activeFilters.activityLevel.length > 0 && !activeFilters.activityLevel.includes(club.activityLevel)) {
      return false;
    }
    if (activeFilters.status.length > 0) {
      const matchesStatus = activeFilters.status.some(s => {
        if (s === 'Recruiting') return club.recruiting;
        return club.status === s;
      });
      if (!matchesStatus) return false;
    }
    return true;
  });
}

function applyFilters() {
  const filtered = filterClubs();
  renderClubs(filtered);
}

function setupFilters() {
  document.querySelectorAll('.filter-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const group = cb.dataset.group;
      const value = cb.dataset.value;
      if (cb.checked) {
        activeFilters[group].push(value);
      } else {
        activeFilters[group] = activeFilters[group].filter(v => v !== value);
      }
      applyFilters();
    });
  });
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      applyFilters();
      return;
    }
    const filtered = filterClubs().filter(club =>
      club.name.toLowerCase().includes(query) ||
      club.description.toLowerCase().includes(query) ||
      club.sportType.toLowerCase().includes(query)
    );
    renderClubs(filtered);
  });
}

function setupMobileFilter() {
  const toggleBtn = document.getElementById('mobileFilterToggle');
  const overlay = document.getElementById('sidebarOverlay');
  if (toggleBtn && overlay) {
    const openSidebar = () => document.body.classList.add('sidebar-open');
    const closeSidebar = () => document.body.classList.remove('sidebar-open');
    toggleBtn.addEventListener('click', openSidebar);
    overlay.addEventListener('click', closeSidebar);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderClubs(clubs);
  setupFilters();
  setupSearch();
  setupMobileFilter();
});
