// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-moon';
            } else {
                themeIcon.className = 'fas fa-sun';
            }
        }
    }

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// GitHub API Configuration
const GITHUB_USERNAME = 'vishnu2505';
const GITHUB_API_BASE = 'https://api.github.com';
const FEATURED_REPOS = ['FraudDetectX-main']; // Add your featured repo names

// Load GitHub Projects
async function loadGitHubProjects() {
    const projectsContainer = document.getElementById('featured-projects');
    
    if (!projectsContainer) return;
    
    try {
        // Show loading state
        projectsContainer.innerHTML = '<div class="loading">Loading projects...</div>';
        
        // Fetch user repositories
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // Filter and sort repositories
        let featuredRepos = repos
            .filter(repo => !repo.fork && !repo.private)
            .sort((a, b) => {
                // Prioritize featured repos
                const aFeatured = FEATURED_REPOS.includes(a.name.toLowerCase());
                const bFeatured = FEATURED_REPOS.includes(b.name.toLowerCase());
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
        
        // Add view more button if there are more repos
        if (repos.filter(repo => !repo.fork && !repo.private).length > 6) {
            const viewMoreDiv = document.createElement('div');
            viewMoreDiv.style.gridColumn = '1 / -1';
            viewMoreDiv.style.textAlign = 'center';
            viewMoreDiv.style.marginTop = '2rem';
            viewMoreDiv.innerHTML = `
                <a href="https://github.com/${GITHUB_USERNAME}?tab=repositories" target="_blank" class="btn btn-secondary">
                    View All Projects →
                </a>
            `;
            projectsContainer.appendChild(viewMoreDiv);
        }
        
    } catch (error) {
        console.error('Error loading GitHub projects:', error);
        projectsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary);">
                <p>Unable to load projects at the moment.</p>
                <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" class="btn btn-secondary" style="margin-top: 1rem;">
                    View on GitHub →
                </a>
            </div>
        `;
    }
}

// Create Project Card
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Format the repository name
    const formattedName = repo.name
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    
    // Truncate description if too long
    const description = repo.description 
        ? (repo.description.length > 100 
            ? repo.description.substring(0, 100) + '...' 
            : repo.description)
        : 'No description available';
    
    card.innerHTML = `
        <h3>
            <a href="${repo.html_url}" target="_blank">
                ${formattedName}
            </a>
        </h3>
        <p>${description}</p>
        <div class="project-stats">
            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
            <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            ${repo.language ? `<span><i class="fas fa-circle" style="color: ${getLanguageColor(repo.language)}; font-size: 0.5rem;"></i> ${repo.language}</span>` : ''}
        </div>
    `;
    
    return card;
}

// Get Language Color
function getLanguageColor(language) {
    const colors = {
        JavaScript: '#f1e05a',
        Python: '#3572A5',
        Java: '#b07219',
        Kotlin: '#7F52FF',
        TypeScript: '#2b7489',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Ruby: '#701516',
        Go: '#00ADD8',
        Rust: '#dea584',
        C: '#555555',
        'C++': '#f34b7d',
        'C#': '#178600',
        PHP: '#4F5D95',
        Swift: '#FA7343',
        Dart: '#00B4AB',
        Shell: '#89e051',
        // Add more as needed
    };
    return colors[language] || '#888888';
}

// Load GitHub Stats
async function loadGitHubStats() {
    try {
        // Fetch user data
        const userResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
        
        if (!userResponse.ok) {
            throw new Error(`HTTP error! status: ${userResponse.status}`);
        }
        
        const userData = await userResponse.json();
        
        // Update stats
        updateStat('repo-count', userData.public_repos);
        updateStat('follower-count', userData.followers);
        
        // Calculate total stars
        const reposResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100`);
        const repos = await reposResponse.json();
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        updateStat('star-count', totalStars);
        
        // Update contributions (this would need GitHub GraphQL API for accurate data)
        // For now, we'll use a placeholder or calculate from recent activity
        updateStat('commit-count', '500+');
        
    } catch (error) {
        console.error('Error loading GitHub stats:', error);
        // Set fallback values
        updateStat('repo-count', '--');
        updateStat('star-count', '--');
        updateStat('follower-count', '--');
        updateStat('commit-count', '--');
    }
}

// Update Stat Element
function updateStat(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        // Animate the number
        element.style.opacity = '0';
        setTimeout(() => {
            element.textContent = value;
            element.style.opacity = '1';
        }, 200);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load GitHub data if on home page or projects page
    if (document.getElementById('featured-projects')) {
        loadGitHubProjects();
    }
    
    if (document.querySelector('.github-stats')) {
        loadGitHubStats();
    }
});

// Add scroll effect to navbar
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (navbar) {
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    }
});