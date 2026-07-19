// static/assets/js/effects.js

/** 
 * Creates a premium 3D tilt effect based on mouse position over an element
 * @param {Object} settings 
 * @param {HTMLElement} element 
 */
const hoverTilt = (settings, element) => {
    const defaultsettings = {
        max: 8,
        perspective: 1000,
        scale: 1.05,
        speed: 800,
        easing: 'cubic-bezier(.03,.98,.52,.99)'
    };
    
    settings = { ...defaultsettings, ...settings };

    const setTransition = (e) => {
        const currentTarget = e.currentTarget;
        clearTimeout(currentTarget.transitionTimeoutId);
        currentTarget.style.transition = `transform ${settings.speed}ms ${settings.easing}`;
        currentTarget.transitionTimeoutId = setTimeout(() => currentTarget.style.transition = '', settings.speed);
    };

    const listeners = [];
    let stopped = false;

    const eventHandlers = {
        mouseEnter: (e) => {
            if (!stopped) setTransition(e);
        },
        mouseMove: (e) => {
            if (!stopped) {
                const item = e.currentTarget;
                const width = item.offsetWidth;
                const height = item.offsetHeight;
                
                // Calculate center relative to viewport bounds safely
                const rect = item.getBoundingClientRect();
                const mouseX = e.clientX - (rect.left + width / 2);
                const mouseY = e.clientY - (rect.top + height / 2);

                const rotateXUncapped = (+1) * settings.max * mouseY / (height / 2);
                const rotateYUncapped = (-1) * settings.max * mouseX / (width / 2);

                const rotateX = rotateXUncapped < -settings.max ? -settings.max : (rotateXUncapped > settings.max ? settings.max : rotateXUncapped);
                const rotateY = rotateYUncapped < -settings.max ? -settings.max : (rotateYUncapped > settings.max ? settings.max : rotateYUncapped);

                item.style.transform = `perspective(${settings.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${settings.scale}, ${settings.scale}, ${settings.scale})`;
            }
        },
        mouseLeave: (e) => {
            if (!stopped) {
                e.currentTarget.style.transform = `perspective(${settings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                setTransition(e);
            }
        }
    };

    if (element) {
        element.addEventListener('mouseenter', eventHandlers.mouseEnter);
        element.addEventListener('mousemove', eventHandlers.mouseMove);
        element.addEventListener('mouseleave', eventHandlers.mouseLeave);
        
        // Track the added listeners so they can be disposed cleanly later
        listeners.push({ el: element, type: 'mouseenter', fn: eventHandlers.mouseEnter });
        listeners.push({ el: element, type: 'mousemove', fn: eventHandlers.mouseMove });
        listeners.push({ el: element, type: 'mouseleave', fn: eventHandlers.mouseLeave });
    }

    return {
        events: eventHandlers,
        remove: () => {
            stopped = true;
            listeners.forEach(listener => {
                if (listener.el) {
                    listener.el.removeEventListener(listener.type, listener.fn);
                }
            });
        }
    };
};

export { hoverTilt };
export default { hoverTilt };
