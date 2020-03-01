"use strict";
let dictionary = {};

const Css = function() {
    this.css = dictionary['css'];
}
Css.prototype.run = function () {
    this.css.forEach(function (item) {
        let el = document.createElement('link');
        el.setAttribute('rel', 'stylesheet');
        el.setAttribute('type', 'text/css');
        el.setAttribute('href', item);
        document.head.appendChild(el);        
    });
}

const Script = function(name) {
    this.name = name;
    this.location = document.head;
    this.async = 'async';
    this.items = dictionary[name];
}
Script.prototype.run = function() {
    let url = this.items.url;
    if (url.length > 0) {
        for (let i = 0; i < url.length; i++) {
            let el = document.createElement('script');
            el.src = url[i];
            el.async = this.async;
            el.id = this.name + '-' + i;
            this.location.appendChild(el);
        }    
    }     
}
Script.prototype.clean = function() {
    let cookies = this.items.cookies;
    if (cookies.length > 0) {
        let domain = '.' + document.domain.split('.').splice(1).join('.');
        if ('.' === domain) {
            domain = document.domain;
        }
        cookies.forEach(function (item) {
            document.cookie = item + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;Domain=" + domain;
        });
    }
    let url = this.items.url;
    if (url.length > 0) {
        for (let i = 0; i < url.length; i++) {
            let el = document.getElementById(this.name + '-' + i);
            if (null !== el) {
                this.location.removeChild(el);
            }
        }
    }
}

const Loader = function() {}
Loader.load = function(name, location) {
    const script = new Script(name);
    script.run();
}

const Cleaner = function() {}
Cleaner.clean = function() {
    let ac = sessionStorage.getItem('allowCookies');
    if ((null === ac) || ('' === ac)) {
        return;
    }
    let dict = sessionStorage.getItem('allowCookies').split(',');
    if (Array.isArray(dict) && dict.length) {
        dict.forEach(function (name) {
            const script = new Script(name);
            script.clean();
        });
    }
}

const Positioner = function() {}
Positioner.vauto = function(element) {
    let vh = Math.max(document.documentElement.clientHeight, window.clientHeight || 0);
    let eh = element.clientHeight;
    let margin = vh / 2  - eh / 2;
    element.style.marginTop = margin + 'px';
}
Positioner.bottomFix = function(element) {
    let vh = Math.max(document.documentElement.clientHeight, window.clientHeight || 0);
    let eh = element.clientHeight;
    let margin = vh  - eh ;
    element.style.marginTop = margin + 'px';
}
Positioner.hauto = function(element) {
    let vw = Math.max(document.documentElement.clientWidth, window.clientWidth || 0);
    element.style.maxWidth = vw - 80 + 'px';
    element.style.marginLeft = 'auto';
    element.style.marginRight = 'auto';    
}

const Ceu = function() {}
Ceu.load = function(config) {
    dictionary = config;
    const css = new Css();
    css.run();
}
Ceu.run = function() {
    const cookiesModal = document.getElementById('ceumodal');
    const cookiesPanel = document.getElementById('ceupanel');
    if ((null === sessionStorage.getItem('cookieInfo')) || ('true' !== sessionStorage.getItem('cookieInfo'))) {
        cookiesModal.style.display = 'block';
        Positioner.vauto(cookiesPanel);
        Positioner.hauto(cookiesPanel);
    } else {
        cookiesModal.style.display = 'none';
        let dict = sessionStorage.getItem('allowCookies').split(',');
        if ((Array.isArray(dict)) && (dict.length) && ('' !== dict[0])) {
            dict.forEach (function(item) {
                Loader.load(item);
            });
        }
    }
    document.getElementById('ceubtna').addEventListener('click', function() {
        let inputs = document.getElementsByName('scripts');
        let scripts = [];
        if (inputs.length > 0) {
            inputs.forEach (function(item) {
                if (item.checked) {
                    Loader.load(item.value);
                    scripts.push(item.value);
                }
            });
        }
        cookiesModal.style.display = 'none';
        sessionStorage.setItem('cookieInfo', true);
        sessionStorage.setItem('allowCookies', scripts);
    }, false);
    document.getElementById('ceubtnd').addEventListener('click', function() {
        Cleaner.clean();
        sessionStorage.setItem('cookieInfo', true);
        sessionStorage.setItem('allowCookies', []);
        cookiesModal.style.display = 'none';
    }, false);
    window.addEventListener('resize', function() {
        Positioner.vauto(cookiesPanel);
        Positioner.hauto(cookiesPanel);
    }, false);
}
