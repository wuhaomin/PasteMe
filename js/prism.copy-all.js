(function(){
    if (typeof self === 'undefined' || !self.Prism || !self.document) {
        return;
    }

    if (!Prism.plugins.toolbar) {
        console.warn('Copy to Clipboard plugin loaded before Toolbar plugin.');

        return;
    }

    let ClipboardJS = window.ClipboardJS || undefined;

    if (!ClipboardJS && typeof require === 'function') {
        ClipboardJS = require('clipboard');
    }

    let callbacks = [];

    if (!ClipboardJS) {
        let script = document.createElement('script');
        let head = document.querySelector('head');

        script.onload = function() {
            ClipboardJS = window.ClipboardJS;

            if (ClipboardJS) {
                while (callbacks.length) {
                    callbacks.pop()();
                }
            }
        };

        script.src = 'https://cdn.bootcss.com/clipboard.js/2.0.1/clipboard.min.js';
        head.appendChild(script);
    }

    Prism.plugins.toolbar.registerButton('copy-to-clipboard', function (env) {
        let linkCopy = document.createElement('a');
        linkCopy.textContent = '复制';

        if (!ClipboardJS) {
            callbacks.push(registerClipboard);
        } else {
            registerClipboard();
        }

        return linkCopy;

        function registerClipboard() {
            let clip = new ClipboardJS(linkCopy, {
                'text': function () {
                    return env.code;
                }
            });

            clip.on('success', function() {
                linkCopy.textContent = '复制成功';

                resetText();
            });
            clip.on('error', function () {
                linkCopy.textContent = '复制失败';

                resetText();
            });
        }

        function resetText() {
            setTimeout(function () {
                linkCopy.textContent = '复制';
            }, 2000);
        }
    });
})();