/*!
 * Scroll-js v2.0.1
 * https://github.com/mkay581/scroll-js
 *
 * Copyright (c) 2018 Mark Kennedy
 * Licensed under the MIT license
 */

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function scrollTo(el, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(el instanceof Element) && !(el instanceof Window)) {
            throw new Error(`element passed to scrollTo() must be either the window or a DOM element, you passed ${el}!`);
        }
        const document = utils.getDocument();
        options = sanitizeScrollOptions(options);
        const moveElement = (prop, value) => {
            el[prop] = value;
            // scroll the html element also for cross-browser compatibility
            // (ie. silly browsers like IE who need the html element to scroll too)
            document.documentElement[prop] = value;
        };
        const scroll = (from, to, prop, startTime, duration = 300, easeFunc, callback) => {
            window.requestAnimationFrame(() => {
                const currentTime = Date.now();
                const time = Math.min(1, (currentTime - startTime) / duration);
                if (from === to) {
                    return callback ? callback() : null;
                }
                moveElement(prop, easeFunc(time) * (to - from) + from);
                /* prevent scrolling, if already there, or at end */
                if (time < 1) {
                    scroll(el[prop], to, prop, startTime, duration, easeFunc, callback);
                }
                else if (callback) {
                    callback();
                }
            });
        };
        const currentScrollPosition = getScrollPosition(el, 'y');
        const scrollProperty = getScrollPropertyByElement(el, 'y');
        return new Promise(resolve => {
            scroll(currentScrollPosition, options.top, scrollProperty, Date.now(), options.duration, getEasing(options.easing), resolve);
        });
    });
}
function scrollIntoView(element, scroller, options) {
    validateElement(element);
    if (scroller && !(scroller instanceof Element)) {
        options = scroller;
        scroller = undefined;
    }
    const { top, duration, easing } = sanitizeScrollOptions(options);
    scroller = scroller || utils.getDocument().body;
    let currentContainerScrollYPos = 0;
    let elementScrollYPos = element ? element.offsetTop : 0;
    // if the container is the document body or document itself, we'll
    // need a different set of coordinates for accuracy
    if (scroller === utils.getDocument().body) {
        // using pageYOffset for cross-browser compatibility
        currentContainerScrollYPos = window.pageYOffset;
        // must add containers scroll y position to ensure an absolute value that does not change
        elementScrollYPos =
            element.getBoundingClientRect().top + currentContainerScrollYPos;
    }
    return scrollTo(scroller, {
        top: elementScrollYPos,
        left: 0,
        duration,
        easing
    });
}
function validateElement(element) {
    if (element === undefined) {
        const errorMsg = 'The element passed to scrollIntoView() was undefined.';
        throw new Error(errorMsg);
    }
    if (!(element instanceof HTMLElement)) {
        throw new Error(`The element passed to scrollIntoView() must be a valid element. You passed ${element}.`);
    }
}
function getScrollPropertyByElement(el, axis) {
    const props = {
        window: {
            y: 'scrollY',
            x: 'scrollX'
        },
        element: {
            y: 'scrollTop',
            x: 'scrollLeft'
        }
    };
    const document = utils.getDocument();
    if (el === document.body) {
        return props.element[axis];
    }
    else if (el instanceof Window) {
        return props.window[axis];
    }
    else {
        return props.element[axis];
    }
}
function sanitizeScrollOptions(options) {
    if (!options) {
        return {};
    }
    if (options.behavior === 'smooth') {
        options.easing = 'ease-in-out';
        options.duration = 300;
    }
    if (options.behavior === 'instant' || options.behavior === 'auto') {
        options.duration = 0;
    }
    return options;
}
function getScrollPosition(el, axis) {
    const document = utils.getDocument();
    const prop = getScrollPropertyByElement(el, axis);
    if (el === document.body) {
        return document.body[prop] || document.documentElement[prop];
    }
    else if (el instanceof Window) {
        return window[prop];
    }
    else {
        return el[prop];
    }
}
const utils = {
    // we're really just exporting this so that tests can mock the document.documentElement
    getDocument() {
        return document;
    }
};
const easingMap = {
    linear(t) {
        return t;
    },
    'ease-in'(t) {
        return t * t;
    },
    'ease-out'(t) {
        return t * (2 - t);
    },
    'ease-in-out'(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
};
const getEasing = (easing) => {
    const defaultEasing = 'linear';
    const easeFunc = easingMap[easing || defaultEasing];
    if (!easeFunc) {
        const options = Object.keys(easingMap).join(',');
        throw new Error(`Scroll error: scroller does not support an easing option of "${easing}". Supported options are ${options}`);
    }
    return easeFunc;
};

export { scrollTo, scrollIntoView, utils, easingMap };
