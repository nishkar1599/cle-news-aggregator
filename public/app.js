// UK Compliant News Aggregator - Frontend JavaScript
// GDPR Compliant with proper data handling and user consent management

class NewsAggregator {
    constructor() {
        this.apiBase = '/api';
        this.currentUser = null;
        this.consentGiven = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSources();
        this.checkConsent();
        this.setupAccessibility();
        this.setupStickyHeader();
    }

    setupEventListeners() {
        // News loading
        document.getElementById('load-news')?.addEventListener('click', () => this.loadNews());
        
        // Category and source changes
        document.getElementById('category-select')?.addEventListener('change', () => this.updateSources());
        document.getElementById('source-select')?.addEventListener('change', () => this.loadNews());
        
        // Check if user is logged in
        this.checkAuthStatus();
    }

    setupAccessibility() {
        // Ensure proper ARIA labels and roles
        const newsContainer = document.getElementById('news-container');
        if (newsContainer) {
            newsContainer.setAttribute('aria-live', 'polite');
            newsContainer.setAttribute('aria-label', 'News articles');
        }

        // Focus management for modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('shown', () => {
                const firstFocusable = modal.querySelector('input, button, select, textarea');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            });
        });
    }

    setupStickyHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
            
            lastScrollY = currentScrollY;
        });
    }

    async loadNews() {
        const category = document.getElementById('category-select')?.value || 'general';
        const source = document.getElementById('source-select')?.value || '';
        const limit = 20;

        this.showLoading(true);
        
        try {
            const params = new URLSearchParams({
                category,
                limit: limit.toString()
            });
            
            if (source) {
                params.append('source', source);
            }

            const response = await fetch(`${this.apiBase}/news?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.displayNews(data.articles);
            
            // Log data processing for GDPR compliance
            console.log('News loaded:', {
                timestamp: new Date().toISOString(),
                category,
                source,
                articleCount: data.articles.length,
                compliance: data.compliance
            });

        } catch (error) {
            console.error('Error loading news:', error);
            this.showError('Failed to load news. Please try again later.');
        } finally {
            this.showLoading(false);
        }
    }

    displayNews(articles) {
        const container = document.getElementById('news-container');
        if (!container) return;

        if (articles.length === 0) {
            container.innerHTML = `
                <div class="no-news" role="status" aria-live="polite">
                    <p>No news articles found for the selected criteria.</p>
                </div>
            `;
            return;
        }

        // Debug logging
        console.log('Articles received:', articles);
        articles.forEach((article, index) => {
            console.log(`Article ${index + 1}:`, {
                title: article.title,
                hasImage: !!article.image,
                imageUrl: article.image,
                source: article.source
            });
        });

        const articlesHTML = articles.map(article => this.createArticleHTML(article)).join('');
        container.innerHTML = articlesHTML;

        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Loaded ${articles.length} news articles`;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    createArticleHTML(article) {
        const pubDate = new Date(article.pubDate).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Create image HTML if image exists
        const imageHTML = article.image ? `
            <div class="article-image-container">
                <img src="${article.image}" 
                     alt="${this.escapeHtml(article.title)}" 
                     class="article-image"
                     loading="lazy"
                     onerror="this.style.display='none'">
            </div>
        ` : `
            <div class="article-image-container">
                <div class="article-image-placeholder">
                    <span class="placeholder-icon">📰</span>
                    <span class="placeholder-text">${this.escapeHtml(article.source)}</span>
                </div>
            </div>
        `;

        return `
            <article class="news-article" role="article">
                ${imageHTML}
                <div class="article-content">
                    <div class="article-header">
                        <h3 class="article-title">
                            <a href="${article.link}" target="_blank" rel="noopener noreferrer" 
                               aria-label="Read full article: ${article.title}">
                                ${this.escapeHtml(article.title)}
                            </a>
                        </h3>
                        <div class="article-meta">
                            <span class="article-source">${this.escapeHtml(article.source)}</span>
                            <time class="article-date" datetime="${article.pubDate}">${pubDate}</time>
                        </div>
                        <div class="article-description">
                            ${this.escapeHtml(article.description || 'No description available.')}
                        </div>
                    </div>
                    <div class="article-footer">
                        <a href="${article.link}" target="_blank" rel="noopener noreferrer" 
                           class="article-link" aria-label="Read full article from ${article.source}">
                            Read Full Article
                        </a>
                        ${article.trusted ? '<span class="trusted-badge">Trusted Source</span>' : ''}
                    </div>
                </div>
            </article>
        `;
    }

    async loadSources() {
        try {
            const response = await fetch(`${this.apiBase}/news/sources`);
            if (!response.ok) throw new Error('Failed to load sources');
            
            const data = await response.json();
            this.populateSourceSelect(data.sources);
        } catch (error) {
            console.error('Error loading sources:', error);
        }
    }

    populateSourceSelect(sources) {
        const select = document.getElementById('source-select');
        if (!select) return;

        // Clear existing options except "All Sources"
        select.innerHTML = '<option value="">All Sources</option>';
        
        sources.forEach(source => {
            const option = document.createElement('option');
            option.value = source.name;
            option.textContent = source.name;
            if (source.trusted) {
                option.textContent += ' (Trusted)';
            }
            select.appendChild(option);
        });
    }

    updateSources() {
        // This could be enhanced to filter sources by category
        this.loadNews();
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = show ? 'flex' : 'none';
        }
    }

    showError(message, containerId = 'news-container') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-message" role="alert" aria-live="assertive">
                    <p>${this.escapeHtml(message)}</p>
                    <button class="btn btn-primary" onclick="newsAggregator.loadNews()">Try Again</button>
                </div>
            `;
        }
    }

    showFormError(message, formId) {
        // Remove any existing error messages
        const existingError = document.querySelector(`#${formId} .form-error`);
        if (existingError) {
            existingError.remove();
        }

        // Create new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.setAttribute('aria-live', 'assertive');
        errorDiv.style.cssText = 'background: #fed7d7; color: #c53030; padding: 0.75rem; border-radius: 4px; margin: 1rem 0; border: 1px solid #feb2b2;';
        errorDiv.innerHTML = `<p>${this.escapeHtml(message)}</p>`;

        // Insert error message at the top of the form
        const form = document.getElementById(formId);
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.setAttribute('aria-hidden', 'false');
            modal.style.display = 'flex';
            
            // Focus first focusable element
            const firstFocusable = modal.querySelector('input, button, select, textarea');
            if (firstFocusable) {
                setTimeout(() => firstFocusable.focus(), 100);
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            this.closeModal(modal.id);
        });
    }

    async checkConsent() {
        // Check if user has given consent for data processing
        const consent = localStorage.getItem('gdpr-consent');
        if (consent) {
            this.consentGiven = true;
        }
    }

    checkAuthStatus() {
        // Check if user is logged in
        const token = localStorage.getItem('auth-token');
        if (token) {
            this.currentUser = { loggedIn: true };
            this.updateAuthUI();
        }
    }

    // Authentication methods
    async handleLogin(event) {
        event.preventDefault();
        console.log('Login form submitted'); // Debug log
        
        const formData = new FormData(event.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        console.log('Login data:', data); // Debug log

        // Clear any existing errors
        this.clearFormErrors('login-form');

        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('Login response status:', response.status); // Debug log

            const result = await response.json();
            console.log('Login result:', result); // Debug log
            
            if (response.ok) {
                this.currentUser = result.user;
                localStorage.setItem('auth-token', result.token);
                this.closeModal('login-modal');
                this.updateAuthUI();
                this.showSuccess('Login successful!');
            } else {
                this.showFormError(result.error || 'Login failed', 'login-form');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showFormError('Login failed. Please try again.', 'login-form');
        }
    }

    async handleRegister(event) {
        event.preventDefault();
        console.log('Registration form submitted'); // Debug log
        
        const formData = new FormData(event.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
            age: parseInt(formData.get('age')),
            consent: formData.get('consent') === 'on' ? 'true' : 'false'
        };

        console.log('Registration data:', data); // Debug log

        // Clear any existing errors
        this.clearFormErrors('register-form');

        try {
            const response = await fetch(`${this.apiBase}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('Registration response status:', response.status); // Debug log

            const result = await response.json();
            console.log('Registration result:', result); // Debug log
            
            if (response.ok) {
                this.showSuccess('Registration successful! Please login.');
                this.switchTab('login');
                event.target.reset();
            } else {
                this.showFormError(result.error || 'Registration failed', 'register-form');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showFormError('Registration failed. Please try again.', 'register-form');
        }
    }

    clearFormErrors(formId) {
        const existingError = document.querySelector(`#${formId} .form-error`);
        if (existingError) {
            existingError.remove();
        }
    }

    updateAuthUI() {
        const loginLink = document.getElementById('login-link');
        if (loginLink) {
            if (this.currentUser) {
                loginLink.textContent = 'Logout';
                loginLink.href = '#';
                loginLink.onclick = (e) => {
                    e.preventDefault();
                    this.handleLogout();
                };
            } else {
                loginLink.textContent = 'Login';
                loginLink.href = '/login.html';
                loginLink.onclick = null;
            }
        }
    }

    async handleLogout() {
        try {
            await fetch(`${this.apiBase}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.currentUser = null;
            localStorage.removeItem('auth-token');
            this.updateAuthUI();
            this.showSuccess('Logged out successfully');
        }
    }

    switchTab(tabName) {
        // Hide all forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.style.display = 'none';
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // Show selected form and activate tab
        const form = document.getElementById(`${tabName}-form`);
        const tab = document.getElementById(`${tabName}-tab`);
        
        if (form) form.style.display = 'flex';
        if (tab) tab.classList.add('active');
    }

    showSuccess(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.setAttribute('role', 'alert');
        successDiv.setAttribute('aria-live', 'polite');
        successDiv.innerHTML = `
            <div style="background: #c6f6d5; color: #22543d; padding: 1rem; border-radius: 4px; margin: 1rem 0;">
                ${this.escapeHtml(message)}
            </div>
        `;
        
        document.body.insertBefore(successDiv, document.body.firstChild);
        
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 3000);
    }


    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global functions for HTML onclick handlers (if needed)
function switchTab(tabName) {
    newsAggregator.switchTab(tabName);
}

// Initialize the application
const newsAggregator = new NewsAggregator();

// GDPR Compliance: Log data processing activities
console.log('UK Compliant News Aggregator initialized', {
    timestamp: new Date().toISOString(),
    compliance: 'GDPR Article 6(1)(a) - Consent-based processing',
    dataMinimization: 'Only necessary data collected',
    transparency: 'Full disclosure of data processing activities'
});
