const tabButtons = document.querySelectorAll('.tab-button');
const panels = document.querySelectorAll('.tab-panel');
const choicePills = document.querySelectorAll('.choice-pill');
const loginTriggers = document.querySelectorAll('.login-trigger');
const postProjectTriggers = document.querySelectorAll('.post-project-trigger');
const contactEngineerTriggers = document.querySelectorAll('.contact-engineer-trigger');
const projectForm = document.getElementById('projectForm');
const projectList = document.getElementById('projectList');
const projectStatus = document.getElementById('projectStatus');
const finishedProjectForm = document.getElementById('finishedProjectForm');
const finishedProjectList = document.getElementById('finishedProjectList');
const finishedProjectStatus = document.getElementById('finishedProjectStatus');
const finishedFormToggle = document.querySelector('.finished-form-toggle');
const engineerForm = document.getElementById('engineerForm');
const expertGrid = document.getElementById('expertGrid');
const engineerStatus = document.getElementById('engineerStatus');
const engineerFormToggle = document.querySelector('.engineer-form-toggle');
const requestCards = document.querySelectorAll('.request-card');

const storageKey = 'projectExpertPosts';
const finishedStorageKey = 'projectExpertFinished';
const engineerStorageKey = 'projectExpertEngineers';
const ownerStorageKey = 'projectExpertOwnerId';
const userSessionKey = 'projectExpertUser';
const finishedLikesStorageKey = 'projectExpertFinishedLikes';
const engineerClicksStorageKey = 'projectExpertEngineerClicks';

const FALLBACK_IMAGE =
  'https://unsplash.com';

const getCurrentOwnerId = () => {
  let ownerId = localStorage.getItem(ownerStorageKey);
  if (!ownerId) {
    ownerId = `owner_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(ownerStorageKey, ownerId);
  }
  return ownerId;
};

const isOwnedByCurrentUser = (item) =>
  Boolean(item && item.ownerId && item.ownerId === getCurrentOwnerId());

const API_BASE_URL = window.API_BASE_URL || '';
const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) return normalizedPath;
  return `${API_BASE_URL.replace(/\/+$/, '')}${normalizedPath}`;
};

const engineerApiUrl = buildApiUrl('/api/engineers');
const projectsApiUrl = buildApiUrl('/api/projects');
const finishedApiUrl = buildApiUrl('/api/finished-projects');
const loginApiUrl = buildApiUrl('/api/login');
const usersApiUrl = buildApiUrl('/api/users');

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const defaultFinishedProjects = [
  {
    name: 'Solar irrigation controller',
    description:
      'A smart water-saving control system built for remote farmland with automated pump timing and sensor-based alerts.',
    timeline: 'Completed in 6 weeks',
    type: 'Product design',
    engineer: 'Amina Okafor',
    image:
      'https://unsplash.com',
    likes: 0,
  },
  {
    name: 'Portable lab analyzer',
    description:
      'A compact diagnostic device for field testing and rapid measurements in science and engineering labs.',
    timeline: 'Completed in 8 weeks',
    type: 'Prototype',
    engineer: 'Chinedu Adebayo',
    image:
      'https://unsplash.com',
    likes: 0,
  },
  {
    name: 'Battery health monitor',
    description:
      'A lightweight monitoring system for industrial battery packs used in research and prototype validation.',
    timeline: 'Completed in 4 weeks',
    type: 'Tech build',
    engineer: 'Tosin Adeyemi',
    image:
      'https://unsplash.com',
    likes: 0,
  },
];
const defaultEngineers = [
  {
    name: 'Amina Okafor',
    specialty: 'Electronics design specialist',
    bio: 'Electronics design specialist',
    school: 'University of Lagos',
    skills: ['PCB', 'Testing', 'Circuit design'],
    whatsapp: '+2348030001111',
    skype: 'live:aminaokafor',
    phone: '+2348030001111',
    image: 'images/fewfwefwefwefe.jpg',
  },
  {
    name: 'Chinedu Adebayo',
    specialty: 'Embedded systems engineer',
    bio: 'Embedded systems engineer',
    school: 'Federal University of Technology, Akure',
    skills: ['Firmware', 'IoT', 'Microcontrollers'],
    whatsapp: '+2348100102222',
    skype: 'live:chineduadebayo',
    phone: '+2348100102222',
    image: 'images/fwefwefefwefewf.jpg',
  },
  {
    name: 'Tosin Adeyemi',
    specialty: 'Research and prototyping lead',
    bio: 'Research and prototyping lead',
    school: 'Obafemi Awolowo University',
    skills: ['Research', 'Prototyping', 'Testing'],
    whatsapp: '+2348120203333',
    skype: 'live:tosinadeyemi',
    phone: '+2348120203333',
    image: 'images/imagesgrehhtrhthtrhrt.jpg',
  },
  {
    name: 'Zainab Musa',
    specialty: 'Hardware product engineer',
    bio: 'Hardware product engineer',
    school: 'Ahmadu Bello University',
    skills: ['Design', 'Automation', 'Product validation'],
    whatsapp: '+2348140304444',
    skype: 'live:zainabmusa',
    phone: '+2348140304444',
    image: 'images/invent7.jpg',
  },
  {
    name: 'Kehinde Bello',
    specialty: 'Mechatronics engineer',
    bio: 'Mechatronics engineer',
    school: 'University of Ibadan',
    skills: ['Robotics', 'Sensors', 'Automation'],
    whatsapp: '+2348160405555',
    skype: 'live:kehindebello',
    phone: '+2348160405555',
    image: 'images/wefwefwefwefewfe.jpg',
  },
  {
    name: 'Ifeoma Nwosu',
    specialty: 'AI and automation specialist',
    bio: 'AI and automation specialist',
    school: 'University of Benin',
    skills: ['Machine learning', 'Data analysis', 'Automation'],
    whatsapp: '+2348180506666',
    skype: 'live:ifeomanwosu',
    phone: '+2348180506666',
    image: 'images/invent 1.jpg',
  },
];

const activateTab = (selectedTab) => {
  tabButtons.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === selectedTab));
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === selectedTab));
};

const getSelectedProjectType = () => {
  const activePill = document.querySelector('.choice-pill.active');
  return activePill ? activePill.textContent.trim() : 'Prototype';
};

const getEngineerCount = (project) => {
  const count = Number(project?.engineerCount ?? project?.engineersTaken ?? 0);
  return Number.isFinite(count) && count > 0 ? count : 0;
};

/* --- Open Project Requests (API + Local Fallback) --- */

const readProjects = async () => {
  try {
    const response = await fetch(projectsApiUrl, { headers: { Accept: 'application/json' } });
    if (response.ok) {
      const remote = await response.json();
      if (Array.isArray(remote)) {
        localStorage.setItem(storageKey, JSON.stringify(remote));
        return remote;
      }
    }
  } catch {
    // Fallback to localStorage below
  }

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};
const createProjectRecord = async (project) => {
  try {
    const response = await fetch(projectsApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (response.ok) {
      const result = await response.json();
      project.id = result.id;
    }
  } catch {
    // Offline fallback
  }

  const local = JSON.parse(localStorage.getItem(storageKey) || '[]');
  local.push(project);
  localStorage.setItem(storageKey, JSON.stringify(local));
};

const deleteProject = async (projectName, projectId) => {
  if (projectId) {
    try {
      await fetch(`${projectsApiUrl}/${encodeURIComponent(projectId)}`, { method: 'DELETE' });
    } catch {
      // Ignore if offline
    }
  }

  const local = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const updated = local.filter(
    (item) => !(item.name === projectName && isOwnedByCurrentUser(item))
  );
  localStorage.setItem(storageKey, JSON.stringify(updated));
  await renderProjects();
  await renderHomeFeed();
};

const attachProjectDeleteHandlers = (root) => {
  if (!root) return;
  root.querySelectorAll('.delete-project-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await deleteProject(btn.dataset.name, btn.dataset.id);
    });
  });
};

const buildRequestCard = (project) => {
  const engineerCount = getEngineerCount(project);
  const engineerLabel = `${engineerCount} engineer${engineerCount === 1 ? '' : 's'} taken`;
  const deleteBtn = isOwnedByCurrentUser(project)
    ? `<button type="button" class="delete-project-btn" data-id="${escapeHtml(project.id || '')}" data-name="${escapeHtml(project.name || '')}">Delete</button>`
    : '';
  const whatsappDigits = (project.whatsapp || '').replace(/\D/g, '');
  const whatsappHref = whatsappDigits ? `https://wa.me{whatsappDigits}` : 'https://wa.me';

  return `
    <article class="request-card posted-project-card ${project.expanded ? 'expanded' : ''}" data-whatsapp="${escapeHtml(project.whatsapp || '')}" data-skype="${escapeHtml(project.skype || '')}">
      <div class="posted-project-top">
        <strong>${escapeHtml(project.name)}</strong>
        <span>${escapeHtml(project.type || 'Project')}</span>
      </div>
      <p>${escapeHtml(project.description)}</p>
      <div class="project-meta">
        <span>${escapeHtml(project.timeline || 'Flexible')}</span>
        <span>${escapeHtml(project.budget || 'Budget available')}</span>
        <span class="project-taken-count">${engineerLabel}</span>
      </div>
      <div class="request-contact">
        <a href="${whatsappHref}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href="skype:${encodeURIComponent(project.skype || 'live:projectexpert')}?call" target="_blank" rel="noopener noreferrer">Skype video call</a>
      </div>
      ${deleteBtn}
    </article>
  `;
};

const renderProjects = async () => {
  if (!projectList) return;
  const projects = await readProjects();

  if (!projects.length) {
    projectList.innerHTML =
      '<div class="empty-projects">No projects posted yet. Submit your first engineering challenge above.</div>';
    return;
  }

  projectList.innerHTML = projects
    .slice()
    .reverse()
    .map((project) => {
      const engineerCount = getEngineerCount(project);
      const engineerLabel = `${engineerCount} engineer${engineerCount === 1 ? '' : 's'} taken`;
      const deleteBtn = isOwnedByCurrentUser(project)
        ? `<button type="button" class="delete-project-btn" data-id="${escapeHtml(project.id || '')}" data-name="${escapeHtml(project.name || '')}">Delete</button>`
        : '';

      return `
        <article class="posted-project-card">
          <div class="posted-project-top">
            <strong>${escapeHtml(project.name)}</strong>
            <span>${escapeHtml(project.type)}</span>
          </div>
          <p>${escapeHtml(project.description)}</p>
          <div class="project-meta">
            <span>${escapeHtml(project.timeline)}</span>
            <span>${escapeHtml(project.budget || 'Budget available')}</span>
            <span class="project-taken-count">${engineerLabel}</span>
          </div>
          ${deleteBtn}
        </article>
      `;
    })
    .join('');

  attachProjectDeleteHandlers(projectList);
};

/* --- Finished Projects (API + Local Fallback) --- */

const readFinishedProjects = async () => {
  try {
    const response = await fetch(finishedApiUrl, { headers: { Accept: 'application/json' } });
    if (response.ok) {
      const remote = await response.json();
      if (Array.isArray(remote) && remote.length) {
        localStorage.setItem(finishedStorageKey, JSON.stringify(remote));
        return remote;
      }
    }
  } catch {
    // Fallback to localStorage below
  }

  try {
    const saved = JSON.parse(localStorage.getItem(finishedStorageKey) || 'null');
    if (Array.isArray(saved) && saved.length) {
      return saved;
    }
  } catch {
    // fallback to default projects below
  }

  return defaultFinishedProjects;
};

const saveFinishedProjectsLocal = (projects) => {
  localStorage.setItem(finishedStorageKey, JSON.stringify(projects));
};

const readFinishedLikes = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(finishedLikesStorageKey) || '{}');
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
};
const saveFinishedLikes = (likes) => {
  localStorage.setItem(finishedLikesStorageKey, JSON.stringify(likes));
};

const getFinishedLikes = (project) => {
  const remoteLikes = Number(project.likes) || 0;
  const localLikes = Number(readFinishedLikes()[project.name]) || 0;
  return Math.max(remoteLikes, localLikes);
};

const toggleFinishedLike = async (project) => {
  const likes = readFinishedLikes();
  likes[project.name] = getFinishedLikes(project) + 1;
  saveFinishedLikes(likes);

  if (project.id) {
    try {
      await fetch(`${finishedApiUrl}/${encodeURIComponent(project.id)}/like`, { method: 'POST' });
    } catch {
      // Offline fallback
    }
  }
};

const buildFinishedProjectLikeButton = (project) => {
  const likes = getFinishedLikes(project);
  const liked = likes > 0;
  return `
    <button type="button" class="finished-project-like${liked ? ' liked' : ''}" data-project-name="${escapeHtml(project.name || '')}">
      <span class="like-heart">❤️</span>
      <span class="like-label">${liked ? likes : 'Like'}</span>
    </button>
  `;
};

const deleteFinishedProject = async (projectName, projectId) => {
  if (projectId) {
    try {
      await fetch(`${finishedApiUrl}/${encodeURIComponent(projectId)}`, { method: 'DELETE' });
    } catch {
      // Offline fallback
    }
  }

  const current = await readFinishedProjects();
  const updated = current.filter(
    (item) => !(item.name === projectName && isOwnedByCurrentUser(item))
  );
  saveFinishedProjectsLocal(updated);
  await renderFinishedProjects();
  await renderHomeFeed();
};
const attachFinishedDeleteHandlers = (root) => {
  if (!root) return;
  root.querySelectorAll('.delete-finished-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await deleteFinishedProject(btn.dataset.name, btn.dataset.id);
    });
  });
};

const attachFinishedProjectLikeHandlers = (root) => {
  if (!root) return;
  root.querySelectorAll('.finished-project-like').forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.stopPropagation();
      const projectName = button.dataset.projectName;
      const projects = await readFinishedProjects();
      const project = projects.find((item) => (item.name || '') === (projectName || ''));
      if (!project) return;
      await toggleFinishedLike(project);
      await renderFinishedProjects();
      await renderHomeFeed();
    });
  });
};

const buildFinishedProjectRemovePhotoButton = (project) =>
  `<button type="button" class="finished-project-remove-photo delete-project-btn" data-project-name="${escapeHtml(project.name || '')}">Remove photo</button>`;

const attachFinishedProjectRemovePhotoHandlers = (root) => {
  if (!root) return;
  root.querySelectorAll('.finished-project-remove-photo').forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.stopPropagation();
      const projectName = button.dataset.projectName;
      const current = await readFinishedProjects();
      const projects = current.map((project) =>
        (project.name || '') === (projectName || '') ? { ...project, image: FALLBACK_IMAGE } : project
      );
      saveFinishedProjectsLocal(projects);
      await renderFinishedProjects();
      await renderHomeFeed();
    });
  });
};

const buildFinishedProjectCard = (project) => `
  <article class="posted-project-card finished-project-card">
    <div class="finished-project-visual">
      <img src="${escapeHtml(project.image || FALLBACK_IMAGE)}" alt="${escapeHtml(project.name)}" loading="lazy" decoding="async" />
    </div>
    <div class="posted-project-top">
      <strong>${escapeHtml(project.name)}</strong>
      <span>${escapeHtml(project.type)}</span>
    </div>
    <p>${escapeHtml(project.description)}</p>
    <div class="project-meta">
      <span>${escapeHtml(project.timeline)}</span>
      <span>Engineer: ${escapeHtml(project.engineer || 'ProjectExpert team')}</span>
    </div>
    ${project.image && project.image.startsWith('data:') ? buildFinishedProjectRemovePhotoButton(project) : ''}
    ${buildFinishedProjectLikeButton(project)}
    ${isOwnedByCurrentUser(project) ? `<button type="button" class="delete-finished-btn" data-id="${escapeHtml(project.id || '')}" data-name="${escapeHtml(project.name || '')}">Delete</button>` : ''}
  </article>
`;

const renderHomeFeed = async () => {
  const homeProjectFeed = document.getElementById('homeProjectFeed');
  const homeFinishedFeed = document.getElementById('homeFinishedFeed');

  if (homeProjectFeed) {
    const projects = await readProjects();
    homeProjectFeed.innerHTML = projects.length
      ? projects
          .slice()
          .reverse()
          .slice(0, 3)
          .map((project) => buildRequestCard(project))
          .join('')
      : '<div class="empty-projects">No request has been posted yet.</div>';
  }

  if (homeFinishedFeed) {
    const finishedProjects = await readFinishedProjects();
    homeFinishedFeed.innerHTML = finishedProjects.length
      ? finishedProjects
          .slice()
          .reverse()
          .slice(0, 3)
          .map((project) => buildFinishedProjectCard(project))
          .join('')
      : '<div class="empty-projects">No finished work has been posted yet.</div>';
  }

  document.querySelectorAll('#homeProjectFeed .request-card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
  });

  attachProjectDeleteHandlers(homeProjectFeed);
  attachFinishedProjectLikeHandlers(homeFinishedFeed);
  attachFinishedProjectRemovePhotoHandlers(homeFinishedFeed);
  attachFinishedDeleteHandlers(homeFinishedFeed);
};

const renderFinishedProjects = async () => {
  if (!finishedProjectList) return;
  const projects = await readFinishedProjects();

  finishedProjectList.innerHTML = projects
    .slice()
    .reverse()
    .map((project) => buildFinishedProjectCard(project))
    .join('');

  attachFinishedProjectLikeHandlers(finishedProjectList);
  attachFinishedProjectRemovePhotoHandlers(finishedProjectList);
  attachFinishedDeleteHandlers(finishedProjectList);
};

/* --- Engineers (API + Local Fallback) --- */

const readEngineerClicks = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(engineerClicksStorageKey) || '{}');
    return saved && typeof saved === 'object' ? saved : {};
  } catch {
    return {};
  }
};

const saveEngineerClicks = (clicks) => {
  localStorage.setItem(engineerClicksStorageKey, JSON.stringify(clicks));
};

const getEngineerClicks = (engineer) => {
  const clicks = Number(readEngineerClicks()[engineer.name]);
  return Number.isFinite(clicks) && clicks > 0 ? clicks : 0;
};

const recordEngineerClick = (name) => {
  const clicks = readEngineerClicks();
  const count = (Number(clicks[name]) || 0) + 1;
  clicks[name] = count;
  saveEngineerClicks(clicks);
  return count;
};

const buildEngineerRemovePhotoButton = (engineer) =>
  `<button type="button" class="engineer-remove-photo delete-project-btn" data-engineer-name="${escapeHtml(engineer.name || '')}">Remove photo</button>`;
const attachEngineerRemovePhotoHandlers = (root) => {
  if (!root) return;
  root.querySelectorAll('.engineer-remove-photo').forEach((button) => {
    button.addEventListener('click', async (event) => {
      event.stopPropagation();
      const engineerName = button.dataset.engineerName;
      const engineers = await readEngineers();
      const updated = engineers.map((engineer) =>
        (engineer.name || '') === (engineerName || '') ? { ...engineer, image: FALLBACK_IMAGE } : engineer
      );
      await saveEngineers(updated);
      await renderEngineers();
    });
  });
};

const deleteEngineer = async (engineerName) => {
  const saved = JSON.parse(localStorage.getItem(engineerStorageKey) || '[]');
  const updatedLocal = saved.filter(
    (item) => !(item.name === engineerName && isOwnedByCurrentUser(item))
  );
  localStorage.setItem(engineerStorageKey, JSON.stringify(updatedLocal));

  try {
    await fetch(`${engineerApiUrl}/${encodeURIComponent(engineerName)}`, {
      method: 'DELETE',
    });
  } catch {
    // Ignore if offline
  }

  await renderEngineers();
  renderHomeEngineers();
};

const attachEngineerDeleteHandlers = (root) => {
  if (!root) return;
  root.querySelectorAll('.delete-engineer-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await deleteEngineer(btn.dataset.name);
    });
  });
};

const readEngineers = async () => {
  try {
    const response = await fetch(engineerApiUrl, { headers: { Accept: 'application/json' } });
    if (response.ok) {
      const remoteEngineers = await response.json();
      if (Array.isArray(remoteEngineers) && remoteEngineers.length) {
        const unique = [];
        const seen = new Set();
        const localSaved = JSON.parse(localStorage.getItem(engineerStorageKey) || '[]');

        for (const engineer of [...defaultEngineers, ...remoteEngineers]) {
          const key = `${engineer.name || 'unknown'}|${engineer.specialty || engineer.bio || ''}`.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            const localMatch = Array.isArray(localSaved)
              ? localSaved.find((item) => item.name === engineer.name && item.specialty === engineer.specialty)
              : null;
            unique.push(localMatch?.ownerId ? { ...engineer, ownerId: localMatch.ownerId } : engineer);
          }
        }
        return unique;
      }
    }
  } catch {
    // Fall through to localStorage
  }

  try {
    const saved = JSON.parse(localStorage.getItem(engineerStorageKey) || 'null');
    const customEngineers = Array.isArray(saved) ? saved : [];
    const merged = [...defaultEngineers, ...customEngineers];
    const unique = [];
    const seen = new Set();

    for (const engineer of merged) {
      const key = `${engineer.name || 'unknown'}|${engineer.specialty || engineer.bio || ''}`.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(engineer);
      }
    }
    return unique;
  } catch {
    return defaultEngineers;
  }
};

const saveEngineers = async (engineers) => {
  const customOnly = (engineers || []).filter(
    (engineer) =>
      !defaultEngineers.some((sample) => sample.name === engineer.name && sample.specialty === engineer.specialty)
  );

  try {
    if (customOnly.length) {
      await fetch(engineerApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customOnly[customOnly.length - 1]),
      });
    }
  } catch {
    // Fall back to local browser storage
  }

  localStorage.setItem(engineerStorageKey, JSON.stringify(customOnly));
};

const syncEngineerTypeButtons = (selectedType = 'all') => {
  const typeButtons = document.querySelectorAll('.type-option');
  const normalizedSelection = selectedType || 'all';
  const buttonLabel = document.getElementById('engineerTypeButtonLabel');
  const menu = document.getElementById('engineerTypeMenu');
  const toggleButton = document.getElementById('engineerTypeToggle');

  typeButtons.forEach((button) => {
    const isActive = button.dataset.type === normalizedSelection;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (buttonLabel) {
    buttonLabel.textContent = normalizedSelection === 'all' ? 'All types' : normalizedSelection;
  }

  if (toggleButton && menu) {
    toggleButton.setAttribute('aria-expanded', String(menu.classList.contains('open')));
  }
};

const populateEngineerTypeOptions = async () => {
  const filter = document.getElementById('engineerTypeFilter');
  const typeMenu = document.getElementById('engineerTypeMenu');
  const toggleButton = document.getElementById('engineerTypeToggle');
  if (!filter || !typeMenu || !toggleButton) return;

  const fallbackTypes = [
    'Electronics design specialist',
    'Embedded systems engineer',
    'Research and prototyping lead',
    'Hardware product engineer',
    'Mechatronics engineer',
    'AI and automation specialist',
  ];

  const engineers = await readEngineers();
  const types = [
    ...new Set([...(engineers.map((engineer) => engineer.specialty).filter(Boolean) || []), ...fallbackTypes]),
  ].sort();
  const currentValue = filter.value || 'all';
  const allOptions = ['all', ...types];

  filter.innerHTML = allOptions
    .map((type) => `<option value="${escapeHtml(type)}">${type === 'all' ? 'All types' : escapeHtml(type)}</option>`)
    .join('');

  typeMenu.innerHTML = allOptions
    .map((type) => {
      const label = type === 'all' ? 'All types' : escapeHtml(type);
      const isActive = type === (allOptions.includes(currentValue) ? currentValue : 'all');
      return `<button type="button" class="type-option ${isActive ? 'active' : ''}" data-type="${escapeHtml(type)}" aria-pressed="${isActive}">${label}</button>`;
    })
    .join('');

  filter.value = allOptions.includes(currentValue) ? currentValue : 'all';
  syncEngineerTypeButtons(filter.value);

  const closeEngineerTypeMenu = () => {
    typeMenu.classList.remove('open');
    typeMenu.setAttribute('hidden', 'hidden');
    toggleButton.setAttribute('aria-expanded', 'false');
  };

  const openEngineerTypeMenu = () => {
    typeMenu.classList.add('open');
    typeMenu.removeAttribute('hidden');
    toggleButton.setAttribute('aria-expanded', 'true');
  };

  toggleButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (typeMenu.classList.contains('open')) {
      closeEngineerTypeMenu();
    } else {
      openEngineerTypeMenu();
    }
  });

  typeMenu.querySelectorAll('.type-option').forEach((button) => {
    button.addEventListener('click', () => {
      filter.value = button.dataset.type || 'all';
      syncEngineerTypeButtons(filter.value);
      closeEngineerTypeMenu();
      renderEngineers(engineerSearchInput?.value || '', filter.value);
    });
  });
  document.addEventListener('click', (event) => {
    if (!typeMenu.contains(event.target) && !toggleButton.contains(event.target)) {
      closeEngineerTypeMenu();
    }
  });

  closeEngineerTypeMenu();
};

const buildExpertCard = (engineer) => {
  const whatsappDigits = (engineer.whatsapp || '').replace(/\D/g, '');
  const whatsappHref = whatsappDigits ? `https://wa.me{whatsappDigits}` : 'https://wa.me';

  return `
    <article class="expert-card" data-engineer-name="${escapeHtml(engineer.name)}" data-whatsapp="${escapeHtml(engineer.whatsapp || '')}" data-skype="${escapeHtml(engineer.skype || '')}" data-phone="${escapeHtml(engineer.phone || '')}">
      <img src="${escapeHtml(engineer.image || FALLBACK_IMAGE)}" alt="${escapeHtml(engineer.name)}" width="800" height="900" loading="lazy" decoding="async" />
      <div class="expert-body">
        <div class="expert-topline">
          <h3>${escapeHtml(engineer.name)}</h3>
        </div>
        <p>${escapeHtml(engineer.specialty || engineer.bio || 'Engineering specialist')}</p>
        <p class="engineer-clicks">Clicks: ${getEngineerClicks(engineer)}</p>
        ${engineer.image && engineer.image.startsWith('data:') ? buildEngineerRemovePhotoButton(engineer) : ''}
        ${isOwnedByCurrentUser(engineer) ? `<button type="button" class="delete-engineer-btn" data-name="${escapeHtml(engineer.name || '')}">Delete</button>` : ''}
        <div class="skill-tags">
          ${(engineer.skills || []).map((skill) => `<span>${escapeHtml(skill)}</span>`).join('')}
        </div>
        ${engineer.school ? `<p class="engineer-school">School: ${escapeHtml(engineer.school)}</p>` : ''}
        <div class="expert-contact">
          <span>Contact ${escapeHtml(engineer.name)}</span>
          <div class="expert-contact-actions">
            <a href="${whatsappHref}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="skype:${encodeURIComponent(engineer.skype || 'live:projectexpert')}?call" target="_blank" rel="noopener noreferrer">Skype</a>
            <a href="tel:${escapeHtml((engineer.phone || engineer.whatsapp || '').replace(/\s+/g, ''))}" target="_blank" rel="noopener noreferrer">Call</a>
          </div>
        </div>
      </div>
    </article>
  `;
};

const renderEngineers = async (query = '', selectedType = 'all') => {
  if (!expertGrid) return;

  const engineers = await readEngineers();
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedType = String(selectedType || 'all').trim().toLowerCase();

  const filteredEngineers = engineers.filter((engineer) => {
    const specialty = (engineer.specialty || '').toLowerCase();
    const matchesType = normalizedType === 'all' || specialty === normalizedType;
    const matchesQuery = !normalizedQuery
      ? true
      : `${engineer.name || ''} ${engineer.specialty || ''} ${engineer.bio || ''} ${(engineer.skills || []).join(' ')}`
          .toLowerCase()
          .includes(normalizedQuery);

    return matchesType && matchesQuery;
  });

  if (!filteredEngineers.length) {
    expertGrid.innerHTML = '<div class="empty-projects">No engineers match your search.</div>';
    return;
  }

  expertGrid.innerHTML = filteredEngineers.slice().reverse().map((engineer) => buildExpertCard(engineer)).join('');

  document.querySelectorAll('.expert-card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('expanded');
      const engineerName = card.dataset.engineerName;
      if (engineerName) {
        const count = recordEngineerClick(engineerName);
        const countEl = card.querySelector('.engineer-clicks');
        if (countEl) countEl.textContent = `Clicks: ${count}`;
      }
    });
  });

  attachEngineerRemovePhotoHandlers(expertGrid);
  attachEngineerDeleteHandlers(expertGrid);
};

/* --- Form Handlers & File Readers --- */

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read the selected image file.'));
    reader.readAsDataURL(file);
  });

const finishedImageInput = document.getElementById('finishedProjectImage');
const finishedRemoveImageBtn = document.getElementById('finishedProjectRemoveImage');

if (finishedRemoveImageBtn && finishedImageInput) {
  finishedRemoveImageBtn.addEventListener('click', () => {
    finishedImageInput.value = '';
    if (finishedProjectStatus) finishedProjectStatus.textContent = '';
  });
}
if (finishedFormToggle && finishedProjectForm) {
  finishedFormToggle.addEventListener('click', () => {
    const isHidden = finishedProjectForm.classList.toggle('hidden');
    finishedFormToggle.setAttribute('aria-expanded', String(!isHidden));
    finishedFormToggle.textContent = isHidden ? 'Add finished project' : 'Close form';
  });
}

if (finishedProjectForm) {
  finishedProjectForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('finishedProjectName')?.value?.trim();
    const engineer = document.getElementById('finishedEngineerName')?.value?.trim();
    const description = document.getElementById('finishedProjectDescription')?.value?.trim();
    const timeline = document.getElementById('finishedProjectTimeline')?.value?.trim();
    const type = document.getElementById('finishedProjectType')?.value || 'Prototype';
    const finishedImageFile = finishedImageInput?.files?.[0];
    const image = finishedImageFile
      ? await readFileAsDataUrl(finishedImageFile)
      : finishedImageInput?.value?.trim() || FALLBACK_IMAGE;

    if (!name || !engineer || !description || !timeline) {
      if (finishedProjectStatus) {
        finishedProjectStatus.textContent = 'Please complete every finished-project field.';
        finishedProjectStatus.classList.add('error');
      }
      return;
    }

    const newFinished = {
      name,
      engineer,
      description,
      timeline,
      type,
      image,
      likes: 0,
      ownerId: getCurrentOwnerId(),
    };

    try {
      const response = await fetch(finishedApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFinished),
      });
      if (response.ok) {
        const resData = await response.json();
        newFinished.id = resData.id;
      }
    } catch {
      // Offline fallback
    }
    const projects = await readFinishedProjects();
    projects.push(newFinished);
    saveFinishedProjectsLocal(projects);
    await renderFinishedProjects();
    await renderHomeFeed();

    if (finishedProjectStatus) {
      finishedProjectStatus.textContent = 'Finished project saved successfully.';
      finishedProjectStatus.classList.remove('error');
    }

    finishedProjectForm.reset();
    document.getElementById('finishedProjectTimeline').value = 'Completed in 6 weeks';
    document.getElementById('finishedProjectType').value = 'Prototype';
    finishedProjectForm.classList.add('hidden');
    finishedFormToggle.setAttribute('aria-expanded', 'false');
    finishedFormToggle.textContent = 'Add finished project';
  });
}

if (engineerFormToggle && engineerForm) {
  engineerFormToggle.addEventListener('click', () => {
    const isHidden = engineerForm.classList.toggle('hidden');
    engineerFormToggle.setAttribute('aria-expanded', String(!isHidden));
    engineerFormToggle.textContent = isHidden ? 'Add profile' : 'Close form';
  });
}

const engineerImageInput = document.getElementById('engineerImage');
const engineerRemoveImageBtn = document.getElementById('engineerRemoveImage');

if (engineerRemoveImageBtn && engineerImageInput) {
  engineerRemoveImageBtn.addEventListener('click', () => {
    engineerImageInput.value = '';
    if (engineerStatus) engineerStatus.textContent = '';
  });
}

if (engineerForm) {
  engineerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('engineerName')?.value?.trim();
    const specialty = document.getElementById('engineerSpecialty')?.value?.trim();
    const school = document.getElementById('engineerSchool')?.value?.trim();
    const bio = document.getElementById('engineerBio')?.value?.trim();
    const skillsInput = document.getElementById('engineerSkills')?.value?.trim();
    const whatsapp = document.getElementById('engineerWhatsapp')?.value?.trim();
    const skype = document.getElementById('engineerSkype')?.value?.trim();
    const phone = document.getElementById('engineerPhone')?.value?.trim();
    const engineerImageFile = engineerImageInput?.files?.[0];
    const image = engineerImageFile
      ? await readFileAsDataUrl(engineerImageFile)
      : engineerImageInput?.value?.trim() || FALLBACK_IMAGE;

    if (!name || !specialty || !school || !bio || !skillsInput || !whatsapp || !skype || !phone) {
      if (engineerStatus) {
        engineerStatus.textContent = 'Please complete every engineer field, including contact details.';
        engineerStatus.classList.add('error');
      }
      return;
    }

    const skills = skillsInput
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    const engineers = await readEngineers();
    engineers.push({
      name,
      specialty,
      school,
      bio,
      skills,
      whatsapp,
      skype,
      phone,
      image,
      ownerId: getCurrentOwnerId(),
    });
    await saveEngineers(engineers);
    await renderEngineers();
    renderHomeEngineers();

    if (engineerStatus) {
      engineerStatus.textContent = 'Engineer saved successfully.';
      engineerStatus.classList.remove('error');
    }

    engineerForm.reset();
    engineerForm.classList.add('hidden');
    engineerFormToggle.setAttribute('aria-expanded', 'false');
    engineerFormToggle.textContent = 'Add profile';
  });
}

const engineerSearchInput = document.getElementById('engineerSearch');
const engineerTypeFilter = document.getElementById('engineerTypeFilter');
const searchEngineerButton = document.querySelector('.search-engineers-btn');
if (engineerSearchInput && searchEngineerButton && engineerTypeFilter) {
  const applyEngineerSearch = () => {
    renderEngineers(engineerSearchInput.value, engineerTypeFilter.value);
  };

  searchEngineerButton.addEventListener('click', applyEngineerSearch);
  engineerSearchInput.addEventListener('input', applyEngineerSearch);
  engineerTypeFilter.addEventListener('change', applyEngineerSearch);
}

for (const button of tabButtons) {
  button.addEventListener('click', () => {
    const selectedTab = button?.dataset?.tab;
    if (!selectedTab) return;
    activateTab(selectedTab);
  });
}

for (const trigger of loginTriggers) {
  trigger.addEventListener('click', () => {
    activateTab(trigger.dataset.tab || 'login');
  });
}

for (const trigger of postProjectTriggers) {
  trigger.addEventListener('click', () => {
    activateTab('requests');
    const requestsTab = document.querySelector('[data-tab="requests"]');
    if (requestsTab) requestsTab.classList.add('active');
  });
}

for (const trigger of contactEngineerTriggers) {
  trigger.addEventListener('click', () => {
    activateTab('experts');
    const expertsTab = document.querySelector('[data-tab="experts"]');
    if (expertsTab) expertsTab.classList.add('active');
  });
}

for (const pill of choicePills) {
  pill.addEventListener('click', () => {
    if (!pill.parentElement) return;
    pill.parentElement.querySelectorAll('.choice-pill').forEach((item) => {
      item.classList.toggle('active', item === pill);
    });
  });
}

if (projectForm) {
  projectForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const projectName = document.getElementById('projectName')?.value?.trim();
    const description = document.getElementById('projectDescription')?.value?.trim();
    const timeline = document.getElementById('projectTimeline')?.value || '2 weeks';
    const budget = document.getElementById('projectBudget')?.value?.trim();

    if (!projectName || !description || !budget) {
      if (projectStatus) {
        projectStatus.textContent = 'Please complete the project name, description, and budget.';
        projectStatus.classList.add('error');
      }
      return;
    }

    const newProject = {
      name: projectName,
      description,
      timeline,
      budget,
      type: getSelectedProjectType(),
      engineerCount: 0,
      ownerId: getCurrentOwnerId(),
    };

    await createProjectRecord(newProject);
    await renderProjects();
    await renderHomeFeed();

    if (projectStatus) {
      projectStatus.textContent = 'Project posted successfully. Experts can now review it.';
      projectStatus.classList.remove('error');
    }

    activateTab('requests');
    projectForm.reset();
    const firstPill = document.querySelector('.choice-pill');
    if (firstPill) {
      document.querySelectorAll('.choice-pill').forEach((item) => {
        item.classList.toggle('active', item === firstPill);
      });
    }
  });
}

/* --- Login & Signup Handler --- */

const loginForm = document.querySelector('.login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const inputs = loginForm.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');
    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');
    const email = emailInput?.value?.trim();
    const password = passwordInput?.value || '';

    if (!email || !password) return;

    try {
      const response = await fetch(loginApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(userSessionKey, JSON.stringify(data));
        localStorage.setItem(ownerStorageKey, `user_${data.id}`);
        alert(`Welcome back, ${data.full_name}!`);
        activateTab('home');
        await renderProjects();
        await renderFinishedProjects();
        await renderEngineers();
        await renderHomeFeed();
        renderHomeEngineers();
      } else {
        alert(data.error || 'Sign in failed. Please check your credentials.');
      }
    } catch {
      alert('Unable to reach authentication server right now.');
    }
  });
}

for (const card of requestCards) {
  card.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });
}

const homeExpertsGrid = document.getElementById('homeExpertsGrid');

const renderHomeEngineers = () => {
  if (!homeExpertsGrid) return;

  readEngineers().then((engineers) => {
    homeExpertsGrid.innerHTML = engineers
      .slice()
      .reverse()
      .map((engineer) => buildExpertCard(engineer))
      .join('');

    homeExpertsGrid.querySelectorAll('.expert-card').forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.toggle('expanded');
        const engineerName = card.dataset.engineerName;
        if (engineerName) {
          const count = recordEngineerClick(engineerName);
          const countEl = card.querySelector('.engineer-clicks');
          if (countEl) countEl.textContent = `Clicks: ${count}`;
        }
      });
    });

    attachEngineerRemovePhotoHandlers(homeExpertsGrid);
    attachEngineerDeleteHandlers(homeExpertsGrid);
  });
};

renderProjects();
renderFinishedProjects();
populateEngineerTypeOptions();
renderEngineers();
renderHomeFeed();
renderHomeEngineers();
