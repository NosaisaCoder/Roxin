// assets/js/utils.js

/**
 * Installs and boots your client-side service worker instance
 * @returns {Promise<boolean>}
 */
export const loadProxyWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('static/uv/uv.sw.js', {
                scope: '/Roxin/static/uv/service/'
            });
            console.log('Proxy routing interface initialized.');
            return true;
        } catch (err) {
            console.error('Core proxy operational routine failed to link:', err);
            return false;
        }
    }
    return false;
};
