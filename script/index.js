/* var modal = document.getElementById("myModal");
var grab = document.getElementById("grab");
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  sessionStorage.setItem("g","a");
  modal.remove();
}
window.onclick = function(event) {
  if (event.target == modal) {
    sessionStorage.setItem("g","a")
    modal.remove();
  }
}
  if(sessionStorage.getItem("g") == "a"){
    if(sessionStorage.getItem("a") == "g"){
	modal.remove()
    }
    else{
      sessionStorage.setItem("a","g")
    }
  }
if(localStorage.getItem("c")=="c")
  modal.remove()*/
import { App } from './app.js'
import { gs } from './gs.js';

window.app = new App();

app.on('init', () => {
    app.search.back = app.createElement('a', 'chevron_left', {
        class: 'submit',
        style: {
            'font-family': 'Material Icons',
            'font-size': '30px',
            'color': 'var(--accent)',
            'display': 'none',
          
        }
    });
    app.search.title = app.createElement('div', [], {
        class: 'title',
        style: {
            'font-size': '16px',
            'font-weight': '500',
            color: 'var(--accent)',
            display: 'none',
        }
    });
    app.search.input = app.createElement('input', [], {
        attrs: {
            placeholder: ''
        },
        class: 'interactive',
    });
});

app.on('exit', async () => {
    app.nav.clear();
    app.main.clear();

    app.main.target.classList.toggle('transition')
});


app.on('after', () => {
    app.main.target.classList.toggle('transition')
});

app.on('default', gs);
app.init();
