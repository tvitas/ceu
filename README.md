## CEU – „Cookies EU“
Displays cookies select panel and loads analytic scripts by user selection.

## Usage

At the end of `<body>` tag:

```javascript
<script src="ceu.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    Ceu.load({
            scripts: {
                gtag: {
                    url: ['https://www.googletagmanager.com/gtag/js?id=UA-XXX','gtag.js'], 
                    cookies: ['_ga', '_gid', '_gat_gtag_UA_XXX'],
                    location: document.head
                },
                fbpixel: {
                    url: ['fbp.js'],
                    cookies: ['_fbp', 'fr'],
                    location: document.head
                }
            },
            css: ['ceu.min.css'],
        })
    Ceu.run();
}, false);    
</script>