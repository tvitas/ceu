"use strict";
let dictionary = {};
const i18n = {
    lt: {
        ceutext: 'Informuojame, kad šioje svetainėje naudojami slapukai (angl. cookies). ' +
        'Sutikdami, paspauskite mygtuką „Sutinku“. Sutikimą bet kada galėsite atšaukti, ' +
        'pakeisdami interneto naršyklės nustatymus ir ištrindami slapukus.',
        ceubtna: 'Sutinku',
        ceubtnd: 'Tęsti be analitinių slapukų',
        ceuh3: 'Slapukai',
        ceuh4: 'Sutinku su šių slapukų įrašymu:',
        ceulink: 'https://lsmuni.lt/lt/apie-universiteta/slapuku-naudojimo-taisykles.html',
        ceumore: 'Slapukų naudojimo taisyklės.',
        gtag: '„Google analytics“',
        fbpixel: '„Facebook pixel“'
    },
    en: {
        ceutext: 'We inform that this website uses cookies. If you agree, click the "I Agree" button. ' +
        'You can revoke your consent at any time by changing your web browser settings and deleting ' +
        'your cookies. ',
        ceubtna: 'I agree',
        ceubtnd: 'Continue without analytic cookies',
        ceuh3: 'Cookies',
        ceuh4: 'I agree with this cookies:',
        ceulink: 'https://lsmuni.lt/en/about-university/cookie-policy.html',
        ceumore: 'Cookie policy',
        gtag: '\"Google analytics\"',
        fbpixel: '\"Facebook pixel\"'
    }
}

// Load CEU CSS
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

// Make CEU panel
const Panel = function() {
    this.lang = document.getElementsByTagName('html')[0].getAttribute('lang');
    this.labels = this.labels();
    this.panel = this.panel();
}
Panel.prototype.labels = function() {
    let labels = [];
    for (let label in dictionary['scripts']) {
        labels.push(label);
    }
    return labels;
}
Panel.prototype.run = function() {
    let container = document.getElementById('ceu');
    container.innerHTML = this.panel;
}
Panel.prototype.panel = function() {
    let html = '';//<div id=\"ceumodal\">';
    html += '<div id=\"ceupanel\">';
    // html += '<h3>' + i18n[this.lang].ceuh3 + '</h3>';
    // html += '<hr>';
    html += '<div id=\"ceutext\">';
    html += '<div class=\"ceutext\">'
    for (let i = 0; i < this.labels.length; i++) {
        html += '<input id=\"box-' + i + '\" type=\"hidden\" name=\"scripts\" value=\"' + this.labels[i] + '\">';
    }
    html += '<p>' + i18n[this.lang].ceutext;
    html += '<a href=\"' + i18n[this.lang].ceulink + '\">' + i18n[this.lang].ceumore + '</a></p>';
    html += '</div>';
    html += '<div class=\"ceubutton\">';
    html += '<p><button id=\"ceubtna\">' + i18n[this.lang].ceubtna + '</button></p>';
    html += '</div>';
    html += '<div class=\"clrf\"></div>';
    html += '</div>';
    html += '</div>';
    return html;
}

// Load (run)/Unload(clean) CEU script
const Script = function(name) {
    this.name = name;
    this.location = dictionary['scripts'][name].location;
    this.async = 'async';
    this.items = dictionary['scripts'][name];
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

// CEU scripts loader
const Loader = function() {}
Loader.load = function(name, location) {
    const script = new Script(name).run();
}

// CEU script cleaner
const Cleaner = function() {}
Cleaner.clean = function() {
    let ac = localStorage.getItem('allowCookies');
    if ((null === ac) || ('' === ac)) {
        return;
    }
    let dict = localStorage.getItem('allowCookies').split(',');
    if (Array.isArray(dict) && dict.length) {
        dict.forEach(function (name) {
            new Script(name).clean();
        });
    }
}

// CEU initializer/runner
const Ceu = function() {}
Ceu.load = function(config) {
    dictionary = config;
    new Css().run();
    new Panel().run();
}
Ceu.run = function() {
    //const cookiesModal = document.getElementById('ceumodal');
    const cookiesPanel = document.getElementById('ceupanel');
    if ((null === localStorage.getItem('cookieInfo')) || ('true' !== localStorage.getItem('cookieInfo'))) {
        cookiesPanel.style.display = 'block';
    } else {
        cookiesPanel.style.display = 'none';
        let dict = localStorage.getItem('allowCookies').split(',');
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
                //if (item.checked) {
                    Loader.load(item.value);
                    scripts.push(item.value);
                //}
            });
        }
        cookiesPanel.style.display = 'none';
        localStorage.setItem('cookieInfo', true);
        localStorage.setItem('allowCookies', scripts);
    }, false);
/*
    document.getElementById('ceubtnd').addEventListener('click', function() {
        Cleaner.clean();
        localStorage.setItem('cookieInfo', true);
        localStorage.setItem('allowCookies', []);
        cookiesModal.style.display = 'none';
    }, false);

*/
}
