// pwa.js
// PWA installation and service worker management

let deferredPrompt;
let isInstalled = false;

// Check if app is already installed
window.addEventListener('DOMContentLoaded', () => {
  // Check if running as installed PWA
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    isInstalled = true;
    console.log('PWA: Running as installed app');
  }
  
  // Register service worker
  registerServiceWorker();
  
  // Setup install prompt
  setupInstallPrompt();
  
  // Add update check
  checkForUpdates();
});

// Register service worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/TaskFlow/service-worker.js')
      .then(registration => {
        console.log('PWA: Service Worker registered successfully:', registration.scope);
        
        // Check for updates every hour
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('PWA: New service worker found, installing...');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              showUpdateNotification();
            }
          });
        });
      })
      .catch(error => {
        console.error('PWA: Service Worker registration failed:', error);
      });
  } else {
    console.log('PWA: Service Workers not supported in this browser');
  }
}

// Setup install prompt
function setupInstallPrompt() {
  // Capture the install prompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA: Install prompt available');
    e.preventDefault();
    deferredPrompt = e;
    
    // Show custom install button
    showInstallButton();
  });
  
  // Track installation
  window.addEventListener('appinstalled', () => {
    console.log('PWA: App installed successfully');
    isInstalled = true;
    hideInstallButton();
    deferredPrompt = null;
    
    // Optional: Track analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'app_installed', {
        event_category: 'PWA',
        event_label: 'TaskFlow'
      });
    }
  });
}

// Show install button
function showInstallButton() {
  if (isInstalled) return;
  
  // Create install button if not exists
  let installBtn = document.getElementById('pwa-install-btn');
  
  if (!installBtn) {
    installBtn = document.createElement('button');
    installBtn.id = 'pwa-install-btn';
    installBtn.className = 'btn btn-primary';
    installBtn.innerHTML = '<i class="bi bi-download"></i> Install App';
    installBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      padding: 12px 24px;
      border-radius: 25px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideInUp 0.5s ease;
    `;
    
    installBtn.onclick = installApp;
    
    document.body.appendChild(installBtn);
    console.log('PWA: Install button shown');
  }
}

// Hide install button
function hideInstallButton() {
  const installBtn = document.getElementById('pwa-install-btn');
  if (installBtn) {
    installBtn.remove();
    console.log('PWA: Install button hidden');
  }
}

// Install the app
async function installApp() {
  if (!deferredPrompt) {
    console.log('PWA: No install prompt available');
    return;
  }
  
  console.log('PWA: Showing install prompt');
  
  // Show the install prompt
  deferredPrompt.prompt();
  
  // Wait for user response
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`PWA: User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);
  
  if (outcome === 'accepted') {
    hideInstallButton();
  }
  
  deferredPrompt = null;
}

// Show update notification
function showUpdateNotification() {
  const updateNotification = document.createElement('div');
  updateNotification.id = 'pwa-update-notification';
  updateNotification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--accent);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideInDown 0.5s ease;
  `;
  
  updateNotification.innerHTML = `
    <i class="bi bi-arrow-clockwise"></i>
    <span>New version available!</span>
    <button id="pwa-update-btn" class="btn btn-sm btn-light" style="margin-left: 12px;">Update Now</button>
    <button id="pwa-update-dismiss" class="btn btn-sm btn-outline-light">Later</button>
  `;
  
  document.body.appendChild(updateNotification);
  
  // Update button
  document.getElementById('pwa-update-btn').onclick = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };
  
  // Dismiss button
  document.getElementById('pwa-update-dismiss').onclick = () => {
    updateNotification.remove();
  };
  
  console.log('PWA: Update notification shown');
}

// Check for updates
function checkForUpdates() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
  }
}

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('PWA: Back online');
  showConnectionStatus('online');
});

window.addEventListener('offline', () => {
  console.log('PWA: Offline');
  showConnectionStatus('offline');
});

// Show connection status
function showConnectionStatus(status) {
  const statusEl = document.getElementById('connection-status');
  
  if (!statusEl) {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'connection-status';
    statusDiv.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      z-index: 9999;
      animation: slideInDown 0.3s ease;
    `;
    
    if (status === 'offline') {
      statusDiv.style.background = '#dc3545';
      statusDiv.style.color = 'white';
      statusDiv.innerHTML = '<i class="bi bi-wifi-off"></i> Working Offline';
    } else {
      statusDiv.style.background = '#28a745';
      statusDiv.style.color = 'white';
      statusDiv.innerHTML = '<i class="bi bi-wifi"></i> Back Online';
    }
    
    document.body.appendChild(statusDiv);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      statusDiv.remove();
    }, 3000);
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideInDown {
    from {
      transform: translate(-50%, -100px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

console.log('PWA: Scripts loaded');