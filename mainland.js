(function() {
    if (window.__MAINLAND_INITIALIZED) return;
    window.__MAINLAND_INITIALIZED = true;

    const MAINLAND_URL = window.location.href;
    
    // Automatically grab whatever <base> tag is already in the HTML
    const baseTag = document.querySelector('base');
    const SHARD_URL = baseTag ? baseTag.href : MAINLAND_URL;

    // The Mainland Border Enforcer
    window.syncMainland = function() {
        const mainlandElements = document.querySelectorAll('ml [href]:not([data-mainland-fixed]), ml [src]:not([data-mainland-fixed])');

        mainlandElements.forEach(el => {
            ['href', 'src'].forEach(attr => {
                const rawPath = el.getAttribute(attr);
                
                if (!rawPath || rawPath.startsWith('#') || /^[a-zA-Z]+:/.test(rawPath)) {
                    return;
                }

                // Drag relative paths inside <ml> back to the real mainland
                const trueUrl = new URL(rawPath, MAINLAND_URL).href;
                el.setAttribute(attr, trueUrl);
                el.setAttribute('data-mainland-fixed', 'true');
            });
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.syncMainland);
    } else {
        window.syncMainland();
    }
})();
