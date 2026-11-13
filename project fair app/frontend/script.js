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
const API_BASE_URL = window.API_BASE_URL || '';
const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) return normalizedPath;
  return `${API_BASE_URL.replace(/\/+$/, '')}${normalizedPath}`;
};
const engineerApiUrl = buildApiUrl('/api/engineers');

const defaultFinishedProjects = [
  {
    name: 'Solar irrigation controller',
    description: 'A smart water-saving control system built for remote farmland with automated pump timing and sensor-based alerts.',
    timeline: 'Completed in 6 weeks',
    type: 'Product design',
    engineer: 'Amina Okafor',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Portable lab analyzer',
    description: 'A compact diagnostic device for field testing and rapid measurements in science and engineering labs.',
    timeline: 'Completed in 8 weeks',
    type: 'Prototype',
    engineer: 'Chinedu Adebayo',
    image:
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Battery health monitor',
    description: 'A lightweight monitoring system for industrial battery packs used in research and prototype validation.',
    timeline: 'Completed in 4 weeks',
    type: 'Tech build',
    engineer: 'Tosin Adeyemi',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
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
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
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

const readProjects = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const saveProjects = (projects) => {
  localStorage.setItem(storageKey, JSON.stringify(projects));
};

const buildRequestCard = (project) => {
  const engineerCount = getEngineerCount(project);
  const engineerLabel = `${engineerCount} engineer${engineerCount === 1 ? '' : 's'} taken`;

  return `
    <article class="request-card posted-project-card ${project.expanded ? 'expanded' : ''}" data-whatsapp="${project.whatsapp || ''}" data-skype="${project.skype || ''}">
      <div class="posted-project-top">
        <strong>${project.name}</strong>
        <span>${project.type || 'Project'}</span>
      </div>
      <p>${project.description}</p>
      <div class="project-meta">
        <span>${project.timeline || 'Flexible'}</span>
        <span>${project.budget || 'Budget available'}</span>
        <span class="project-taken-count">${engineerLabel}</span>
      </div>
      <div class="request-contact">
        <a href="https://wa.me/${(project.whatsapp || '').replace(/\D/g, '')}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href="skype:${project.skype || 'live:projectexpert'}?call" target="_blank" rel="noopener noreferrer">Skype video call</a>
      </div>
    </article>
  `;
};

const readFinishedProjects = () => {
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

const saveFinishedProjects = (projects) => {
  localStorage.setItem(finishedStorageKey, JSON.stringify(projects));
};

const renderProjects = () => {
  if (!projectList) return;

  const projects = readProjects();

  if (!projects.length) {
    projectList.innerHTML = '<div class="empty-projects">No projects posted yet. Submit your first engineering challenge above.</div>';
    return;
  }

  projectList.innerHTML = projects
    .slice()
    .reverse()
    .map((project) => {
      const engineerCount = getEngineerCount(project);
      const engineerLabel = `${engineerCount} engineer${engineerCount === 1 ? '' : 's'} taken`;

      return `
        <article class="posted-project-card">
          <div class="posted-project-top">
            <strong>${project.name}</strong>
            <span>${project.type}</span>
          </div>
          <p>${project.description}</p>
          <div class="project-meta">
            <span>${project.timeline}</span>
            <span>${project.budget || 'Budget available'}</span>
            <span class="project-taken-count">${engineerLabel}</span>
          </div>
        </article>
      `;
    })
    .join('');
};

const renderHomeFeed = () => {
  const homeProjectFeed = document.getElementById('homeProjectFeed');
  const homeFinishedFeed = document.getElementById('homeFinishedFeed');

  if (homeProjectFeed) {
    const projects = readProjects();
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
    const finishedProjects = readFinishedProjects();
    homeFinishedFeed.innerHTML = finishedProjects.length
      ? finishedProjects
          .slice()
          .reverse()
          .slice(0, 3)
          .map(
            (project) => `
              <article class="posted-project-card finished-project-card">
                <div class="finished-project-visual">
                  <img src="${project.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80'}" alt="${project.name}" loading="lazy" decoding="async" />
                </div>
                <div class="posted-project-top">
                  <strong>${project.name}</strong>
                  <span>${project.type}</span>
                </div>
                <p>${project.description}</p>
                <div class="project-meta">
                  <span>${project.timeline}</span>
                  <span>Engineer: ${project.engineer || 'ProjectExpert team'}</span>
                </div>
              </article>
            `
          )
          .join('')
      : '<div class="empty-projects">No finished work has been posted yet.</div>';
  }

  const homeRequestCards = document.querySelectorAll('#homeProjectFeed .request-card');
  for (const card of homeRequestCards) {
    card.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
  }
};

const renderFinishedProjects = () => {
  if (!finishedProjectList) return;

  const projects = readFinishedProjects();

  finishedProjectList.innerHTML = projects
    .slice()
    .reverse()
    .map(
      (project) => `
        <article class="posted-project-card finished-project-card">
          <div class="finished-project-visual">
            <img src="${project.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80'}" alt="${project.name}" loading="lazy" decoding="async" />
          </div>
          <div class="posted-project-top">
            <strong>${project.name}</strong>
            <span>${project.type}</span>
          </div>
          <p>${project.description}</p>
          <div class="project-meta">
            <span>${project.timeline}</span>
            <span>Engineer: ${project.engineer || 'ProjectExpert team'}</span>
          </div>
        </article>
      `
    )
    .join('');
};

const readEngineers = async () => {
  try {
    const response = await fetch(engineerApiUrl, { headers: { Accept: 'application/json' } });
    if (response.ok) {
      const remoteEngineers = await response.json();
      if (Array.isArray(remoteEngineers) && remoteEngineers.length) {
        const unique = [];
        const seen = new Set();

        for (const engineer of [...defaultEngineers, ...remoteEngineers]) {
          const key = `${engineer.name || 'unknown'}|${engineer.specialty || engineer.bio || ''}`.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(engineer);
          }
        }

        return unique;
      }
    }
  } catch (error) {
    // Fall through to localStorage when the MySQL API is unavailable.
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
    (engineer) => !defaultEngineers.some((sample) => sample.name === engineer.name && sample.specialty === engineer.specialty)
  );

  try {
    if (customOnly.length) {
      await fetch(engineerApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customOnly[customOnly.length - 1]),
      });
    }
  } catch (error) {
    // Fall back to local browser storage if the MySQL API is not reachable.
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
  const types = [...new Set([...(engineers.map((engineer) => engineer.specialty).filter(Boolean) || []), ...fallbackTypes])].sort();
  const currentValue = filter.value || 'all';
  const allOptions = ['all', ...types];

  filter.innerHTML = allOptions
    .map((type) => `<option value="${type}">${type === 'all' ? 'All types' : type}</option>`)
    .join('');

  typeMenu.innerHTML = allOptions
    .map((type) => {
      const label = type === 'all' ? 'All types' : type;
      const isActive = type === (allOptions.includes(currentValue) ? currentValue : 'all');
      return `<button type="button" class="type-option ${isActive ? 'active' : ''}" data-type="${type}" aria-pressed="${isActive}">${label}</button>`;
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
    const isOpen = typeMenu.classList.contains('open');
    if (isOpen) {
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

  expertGrid.innerHTML = filteredEngineers
    .slice()
    .reverse()
    .map(
      (engineer) => `
        <article class="expert-card" data-whatsapp="${engineer.whatsapp || ''}" data-skype="${engineer.skype || ''}" data-phone="${engineer.phone || ''}">
          <img src="${engineer.image}" alt="${engineer.name}" width="800" height="900" loading="lazy" decoding="async" />
          <div class="expert-body">
            <div class="expert-topline">
              <h3>${engineer.name}</h3>
            </div>
            <p>${engineer.specialty || engineer.bio || 'Engineering specialist'}</p>
            <div class="skill-tags">
              ${(engineer.skills || []).map((skill) => `<span>${skill}</span>`).join('')}
            </div>
            ${engineer.school ? `<p class="engineer-school">School: ${engineer.school}</p>` : ''}
            <div class="expert-contact">
              <span>Contact ${engineer.name}</span>
              <div class="expert-contact-actions">
                <a href="https://wa.me/${(engineer.whatsapp || '').replace(/\D/g, '')}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <a href="skype:${engineer.skype || 'live:projectexpert'}?call" target="_blank" rel="noopener noreferrer">Skype</a>
                <a href="tel:${(engineer.phone || engineer.whatsapp || '').replace(/\s+/g, '')}" target="_blank" rel="noopener noreferrer">Call</a>
              </div>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  const expertCards = document.querySelectorAll('.expert-card');
  expertCards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
  });
};

if (finishedFormToggle && finishedProjectForm) {
  finishedFormToggle.addEventListener('click', () => {
    const isHidden = finishedProjectForm.classList.toggle('hidden');
    finishedFormToggle.setAttribute('aria-expanded', String(!isHidden));
    finishedFormToggle.textContent = isHidden ? 'Add finished project' : 'Close form';
  });
}

if (finishedProjectForm) {
  finishedProjectForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('finishedProjectName')?.value?.trim();
    const engineer = document.getElementById('finishedEngineerName')?.value?.trim();
    const description = document.getElementById('finishedProjectDescription')?.value?.trim();
    const timeline = document.getElementById('finishedProjectTimeline')?.value?.trim();
    const type = document.getElementById('finishedProjectType')?.value || 'Prototype';
    const image = document.getElementById('finishedProjectImage')?.value?.trim();

    if (!name || !engineer || !description || !timeline || !image) {
      if (finishedProjectStatus) {
        finishedProjectStatus.textContent = 'Please complete every finished-project field.';
        finishedProjectStatus.classList.add('error');
      }
      return;
    }

    const projects = readFinishedProjects();
    projects.push({
      name,
      engineer,
      description,
      timeline,
      type,
      image,
    });

    saveFinishedProjects(projects);
    renderFinishedProjects();
    renderHomeFeed();

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
    const image = document.getElementById('engineerImage')?.value?.trim();

    if (!name || !specialty || !school || !bio || !skillsInput || !whatsapp || !skype || !phone || !image) {
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
    });

    await saveEngineers(engineers);
    await renderEngineers();

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
    if (requestsTab) {
      requestsTab.classList.add('active');
    }
  });
}

for (const trigger of contactEngineerTriggers) {
  trigger.addEventListener('click', () => {
    activateTab('experts');
    const expertsTab = document.querySelector('[data-tab="experts"]');
    if (expertsTab) {
      expertsTab.classList.add('active');
    }
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
  projectForm.addEventListener('submit', (event) => {
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

    const projects = readProjects();
    projects.push({
      name: projectName,
      description,
      timeline,
      budget,
      type: getSelectedProjectType(),
      engineerCount: 0,
    });

    saveProjects(projects);
    renderProjects();
    renderHomeFeed();

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

for (const card of requestCards) {
  card.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });
}

renderProjects();
renderFinishedProjects();
populateEngineerTypeOptions();
renderEngineers();
renderHomeFeed();
