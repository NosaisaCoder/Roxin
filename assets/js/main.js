// assets/js/main.js

import { loadProxyWorker } from './utils.js';

window.addEventListener('load', async () => {
    await loadProxyWorker();
});

const form = document.getElementById('wpf');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('query').value.trim();
        let url = input;

        if (!url.includes('.') || url.includes(' ')) {
            url = 'https://google.com' + encodeURIComponent(url);
        } else if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        if (typeof __uv$config !== 'undefined') {
            const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(url);
            window.location.href = encodedUrl;
        } else {
            console.error('Ultraviolet proxy data configurations are missing.');
        }
    });
}
