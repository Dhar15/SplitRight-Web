const CONFIG = {
    apkUrl: "downloads/SplitRight.apk",
    qrCodeImageUrl: "images/download-qr-code.png"
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize website functionality
function initializeWebsite() {
    setupDownloadButton();
    setupQRModal();
    setupScrollAnimations();
    setupSmoothScrolling();
    trackPageViews();
}

// Download APK functionality with debouncing
let isDownloading = false;

function downloadAPK(event) {
    // Prevent multiple downloads
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Prevent rapid multiple clicks
    if (isDownloading) {
        console.log('Download already in progress...');
        return;
    }
    
    isDownloading = true;
    
    try {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = CONFIG.apkUrl;
        link.download = 'SplitRight.apk';
        link.target = '_blank';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show confirmation message
        showNotification('Download started! Please check your downloads folder.', 'success');
        
        // Track download event (optional analytics)
        trackDownload();
        
    } catch (error) {
        console.error('Download failed:', error);
        showNotification('Download failed. Please try again or contact support.', 'error');
    } finally {
        // Reset download flag after 2 seconds to prevent spam
        setTimeout(() => {
            isDownloading = false;
        }, 2000);
    }
}

// Setup download button event listener
function setupDownloadButton() {
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        // Remove any existing onclick attribute to prevent double execution
        downloadBtn.removeAttribute('onclick');
        
        // Add single event listener with once option for extra protection
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            downloadAPK(e);
        }, { passive: false });
        
        // Also prevent form submission if button is inside a form
        downloadBtn.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
}

// Setup QR Code Modal
function setupQRModal() {
    const modal = document.getElementById('qrModal');
    const qrImage = document.getElementById('qrCodeImage');
    
    if (qrImage && CONFIG.qrCodeImageUrl) {
        qrImage.src = CONFIG.qrCodeImageUrl;
    }
    
    // Close modal when clicking outside of it
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideQRModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideQRModal();
        }
    });
}

// Show QR Code Modal
function showQRModal() {
    const modal = document.getElementById('qrModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

// Hide QR Code Modal
function hideQRModal() {
    const modal = document.getElementById('qrModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

// Smooth scrolling for internal links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll animations using Intersection Observer
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.section, .feature').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Track download for analytics (optional)
function trackDownload() {
    // Google Analytics 4 event tracking (if you have GA4 set up)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'event_category': 'APK',
            'event_label': 'SplitRight APK Download'
        });
    }

    // You can also send to your own analytics endpoint
    // fetch('/api/track-download', { method: 'POST' }).catch(console.error);
}

// Track page views (optional)
function trackPageViews() {
    // Google Analytics 4 page view (if you have GA4 set up)
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'SplitRight - Download',
            page_location: window.location.href
        });
    }
}

// Device detection for better UX
function detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    return {
        isMobile,
        isAndroid,
        isDesktop: !isMobile
    };
}

// Show device-specific messages
function showDeviceSpecificContent() {
    const device = detectDevice();
    const downloadSection = document.querySelector('.download-section p');
    
    if (!device.isAndroid && device.isMobile) {
        // Show message for iOS users
        if (downloadSection) {
            downloadSection.innerHTML = 'Currently available for Android devices. iOS version coming soon!';
        }
    }
}

// Handle offline/online status
function handleConnectionStatus() {
    window.addEventListener('online', () => {
        showNotification('Connection restored!', 'success');
    });

    window.addEventListener('offline', () => {
        showNotification('You are offline. Some features may not work.', 'warning');
    });
}

// Error handling for failed resource loads
function handleResourceErrors() {
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            console.error('Image failed to load:', e.target.src);
            // Handle broken images gracefully
            e.target.style.display = 'none';
        }
    });
}

// Copy to clipboard functionality (for sharing)
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Fallback copy method for older browsers
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Link copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy link', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Add CSS for animations
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0 0.5rem;
        }
        
        .notification-close:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    showDeviceSpecificContent();
    handleConnectionStatus();
    handleResourceErrors();
    addAnimationStyles();
});

// Expose functions globally for HTML onclick handlers
window.copyToClipboard = copyToClipboard;
window.showQRModal = showQRModal;
window.hideQRModal = hideQRModal;