async function gs(app) {
  	app.search.input.placeholder = 'Search library'
  	app.main.div = document.getElementById("grab");
    app.main.library = 
      app.createElement('div', await compileGs(app), {
        class: 'gs-library',
        style: {},
    });
  app.main.div.appendChild(app.main.library);
  

   app.main.emptySearch = app.createElement('div', [
        app.createElement('p', 'No results found.'),
    ], {
        class: 'gs-empty',
        style: {
            display: 'none'
        }
    });
    app.main.player = app.createElement('div', [
        app.createElement('iframe', [], {
            class: 'gs-frame',
            events: {
                focus(event) {
                    event.target.contentWindow.focus();
                }
            },
            attrs: {
                tabindex: 1,
                src: 'about:blank'
            }
        }),        
    ], {
        class: 'gs-player',
        style: {
            display: 'none',
        } 
    });
    app.search.input.setAttribute(
        'oninput',
        '(' + (function() {
            let count = 0;

            app.main.library.querySelectorAll('.gs-entry').forEach(node => {
                if (node.getAttribute('data-title').toLowerCase().includes(app.search.input.value.toLowerCase())) {
                    node.style.display = 'block';
                    count++;
                } else {
                    node.style.display = 'none';
                };
            }); 

            if (!count) {
                app.main.library.style.display = 'none';
                app.main.emptySearch.style.display = 'block';
            } else {
                app.main.library.style.removeProperty('display');
                app.main.emptySearch.style.display = 'none';
            };
        }).toString() + ')()'
    )
};

async function compileGs(app) {
    const res = await fetch('./gs.json');
    const json = await res.json();
    const arr = [];

    for (const entry of json) {
        arr.push(
            app.createElement('input', [], {
                class: 'gs-entry',
                style: {
                    'background-size': 'cover'
                },
                attrs: {
                    'data-title': entry.title,
                    'title': entry.title,
                    'type':"image",
                    'src': entry.img,
                  },
                events: {
                    click(event) {
                        app.main.library.style.display = 'none';
                        app.main.player.style.display = 'block';                      
                        app.search.back.style.display = 'inline';
                        app.search.back.href = '';
                        app.search.input.style.display = 'none';
                        app.search.title.style.display = 'block';
                        app.search.title.textContent = entry.title;

                        app.nav.fullscreen = app.createElement('button', 'fullscreen', {
                            class: 'submit', 
                            style: {
                                'font-family': 'Material Icons',
                                'font-size': '30px',
                                color: 'var(--accent)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            },
                            events: {
                                click() {
                                    app.main.player.querySelector('iframe').requestFullscreen();
                                    app.main.player.querySelector('iframe').contentWindow.focus();
                                }
                            }
                        });
                      app.main.player.querySelector('iframe').src = entry.location;
                        
                    }
                }
            })
        )
    };

    return arr;
};

export { gs };