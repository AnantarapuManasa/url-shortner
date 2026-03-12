
const API_URL = 'http://127.0.0.1:3000/api/shorten';

const elements = {
  urlInput: document.getElementById('urlInput'),
  shortenBtn: document.getElementById('shortenBtn'),
  btnText: document.querySelector('.btn-text'),
  loadingSpinner: document.getElementById('loadingSpinner'),
  errorMsg: document.getElementById('errorMsg'),
  result: document.getElementById('result'),
  shortLink: document.getElementById('shortLink'),
  copyBtn: document.getElementById('copyBtn'),
  copyFeedback: document.getElementById('copyFeedback'),
  navLinks: document.querySelectorAll('.nav-link'),
};

// State
let copied = false;
let currentShortLink = '';

// Initialize
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Event listeners
  elements.shortenBtn.addEventListener('click', shortenUrl);
  elements.urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') shortenUrl();
  });
  elements.urlInput.addEventListener('input', validateInput);
  elements.copyBtn.addEventListener('click', copyLink);
  
  // Navbar scroll effect
  window.addEventListener('scroll', handleScroll);
  
  // Smooth scrolling for nav links
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      updateActiveNav(link);
    });
  });
  
  validateInput();
  elements.urlInput.focus();
}

function validateInput() {
  const url = elements.urlInput.value.trim();
  const valid = isValidUrl(url);
  
  elements.urlInput.style.borderColor = valid ? 'var(--border)' : '#FECACA';
  elements.shortenBtn.disabled = !valid;
}

function isValidUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

async function shortenUrl() {
  const url = elements.urlInput.value.trim();
  
  if (!isValidUrl(url)) {
    showError('Please enter a valid URL (http:// or https://)');
    return;
  }
  
  // Loading state
  setLoading(true);
  hideError();
  hideResult();
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Server error');
    }
    
    const data = await response.json();
    currentShortLink = data.shortUrl || data.shortCode;
    elements.shortLink.value = currentShortLink;
    showResult();
    
  } catch (error) {
    console.error('API Error:', error);
    showError(error.message || 'Failed to shorten URL');
  } finally {
    setLoading(false);
  }
}

function setLoading(loading) {
  elements.shortenBtn.disabled = loading;
  elements.loadingSpinner.classList.toggle('hidden', !loading);
  elements.btnText.style.opacity = loading ? '0' : '1';
}

function showError(message) {
  elements.errorMsg.textContent = message;
  elements.errorMsg.classList.remove('hidden');
}

function hideError() {
  elements.errorMsg.classList.add('hidden');
}

function showResult() {
  elements.result.classList.remove('hidden');
  elements.shortLink.focus();
  elements.shortLink.select();
}

function hideResult() {
  elements.result.classList.add('hidden');
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(currentShortLink);
  } catch {
    // Fallback
    elements.shortLink.select();
    document.execCommand('copy');
  }
  
  showCopyFeedback();
}

function showCopyFeedback() {
  elements.copyFeedback.classList.remove('hidden');
  setTimeout(() => elements.copyFeedback.classList.add('hidden'), 2000);
}

function handleScroll() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function updateActiveNav(activeLink) {
  elements.navLinks.forEach(link => link.classList.remove('active'));
  activeLink.classList.add('active');
}

