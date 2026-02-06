window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});/**
 * Minimalist Toast System
 * Provides clean, non-intrusive feedback for user actions.
 */
const toast = {
    el: null,
    timer: null,

    show(message) {
        // Create element if it doesn't exist
        if (!this.el) {
            this.el = document.createElement('div');
            Object.assign(this.el.style, {
                position: 'fixed',
                top: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                zIndex: '2147483647',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: '0',
                visibility: 'hidden',
                letterSpacing: '0.3px'
            });
            document.body.appendChild(this.el);
        }

        // Reset timer and update content
        clearTimeout(this.timer);
        this.el.textContent = message;
        
        // Animate In
        this.el.style.visibility = 'visible';
        this.el.style.opacity = '1';
        this.el.style.top = '50px';

        // Auto-hide after 3 seconds
        this.timer = setTimeout(() => {
            this.el.style.opacity = '0';
            this.el.style.top = '40px';
            this.timer = setTimeout(() => {
                this.el.style.visibility = 'hidden';
            }, 300);
        }, 3000);
    }
};

/**
 * Enhanced Download Handler
 * Uses Fetch to track the "Completed" state.
 */
const performDownload = async (url, filename) => {
    toast.show('Download started');
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response failed');
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.download = filename || url.split('/').pop() || 'file';
        tempLink.click();
        
        URL.revokeObjectURL(blobUrl);
        toast.show('Download completed');
    } catch (error) {
        console.error('Download error:', error);
        toast.show('Download failed');
    }
};

/**
 * Global Interceptor
 */
const handleGlobalClick = (e) => {
    const link = e.target.closest('a');
    if (!link || !link.href) return;

    // 1. Check if it's a download
    const isDownload = link.hasAttribute('download') || 
                       /\.(zip|exe|rar|pdf|jpg|png|webp|mp4)$/i.test(link.href);

    if (isDownload) {
        e.preventDefault();
        performDownload(link.href, link.download);
        return;
    }

    // 2. Handle target="_blank" (Open in same window)
    const isTargetBlank = link.target === '_blank' || 
                          document.querySelector('head base[target="_blank"]');

    if (isTargetBlank) {
        e.preventDefault();
        window.location.href = link.href;
    }
};

// Override window.open for consistency
window.open = (url) => {
    if (url) window.location.href = url;
};

// Initialize Listener
document.addEventListener('click', handleGlobalClick, { capture: true });