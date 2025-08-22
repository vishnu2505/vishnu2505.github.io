// GitHub API Configuration
const GITHUB_USERNAME = 'vishnu2505';
const GITHUB_API_BASE = 'https://api.github.com';

// Featured repositories (add your main project names here)
const FEATURED_REPOS = ['fraud-detect-x'];

// Load GitHub Projects
async function loadGitHubProjects() {
  const projectsContainer = document.getElementById('github-projects');
  
  if (!projectsContainer) return;
  
  try {
    // Fetch user repositories
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    const repos = await response.json();
    
    // Filter and sort repositories
    const featuredRepos = repos
      .filter(repo => !repo.fork && !repo.private)
      .sort((a, b) => {
        // Prioritize featured repos
        const aFeatured = FEATURED_REPOS.includes(repo.name.toLowerCase());
        const bFeatured = FEATURED_REPOS.includes(repo.name.toLowerCase());
        if (aFeatured && !bFeatured) return -1;
        if (!aFeatured && bFeatured) return 1;
        
        // Then sort by stars
        return b.stargazers_count - a.stargazers_count;
      })
      .slice(0, 6); // Show top 6 projects
    
    // Clear loading message
    projectsContainer.innerHTML = '';
    
    // Create project cards
    featuredRepos.forEach(repo => {
      const projectCard = createProjectCard(repo);
      projectsContainer.appendChild(projectCard);
    });
    
  } catch (error) {
    console.error('Error loading GitHub projects:', error);
    projectsContainer.innerHTML = '<p>Error loading projects. Please try again later.</p>';
  }
}

// Create Project Card
function createProjectCard(repo) {
  const card = document.createElement('div');
  card.className = 'project-card';
  
  // Format topics
  const topics = repo.topics && repo.topics.length > 0 
    ? repo.topics.map(topic => `<span>${topic}</span>`).join('') 
    : '';
  
  card.innerHTML = `
    <h3>
      <a href="${repo.html_url}" target="_blank" style="color: inherit; text-decoration: none;">
        ${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </a>
    </h3>
    <p>${repo.description || 'No description available'}</p>
    <div class="project-stats">
      <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
      <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
      ${repo.language ? `<span><i class="fas fa-circle" style="color: ${getLanguageColor(repo.language)}"></i> ${repo.language}</span>` : ''}
    </div>
    ${topics ? `<div class="project-topics">${topics}</div>` : ''}
  `;
  
  return card;
}

// Get Language Color
function getLanguageColor(language) {
  const colors = {
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    TypeScript: '#2b7489',
    HTML: '#e34c26',
    CSS: '#563d7c',
    // Add more languages as needed
  };
  return colors[language] || '#888';
}

// Load GitHub Stats
async function loadGitHubStats() {
  try {
    // Fetch user data
    const userResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
    const userData = await userResponse.json();
    
    // Update stats
    updateStat('repo-count', userData.public_repos);
    updateStat('follower-count', userData.followers);
    
    // Calculate total stars
    const reposResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100`);
    const repos = await reposResponse.json();
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    updateStat('star-count', totalStars);
    
    // Fetch contribution data (this would need GitHub GraphQL API for accurate data)
    // For now, we'll use a placeholder
    updateStat('commit-count', '500+');
    
  } catch (error) {
    console.error('Error loading GitHub stats:', error);
  }
}

// Update Stat Element
function updateStat(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }
  
  // Load GitHub data
  loadGitHubProjects();
  loadGitHubStats();
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});