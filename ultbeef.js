var ltbeef, chrome;
  ltbeef = {
    elements: {
      create(elem, daddy) {
        var x = document.createElement(elem.tag);
        var str_parent = ltbeef.strings[daddy?.id] || ltbeef.strings;
        for (var attr in elem)
          x[attr] = attr.startsWith("on")
            ? ltbeef.functions[elem[attr]]
            : elem[attr];
        if (!elem.kids && str_parent.hasOwnProperty(x.id))
          x.innerHTML = str_parent[x.id];
        (daddy || document.body).appendChild(x);
        ltbeef.elements[elem.id] = x;
        elem.kids?.forEach((baby) => {
          ltbeef.elements.create(baby, x);
        });
      },
    },
    /*
     */
    functions: {
      get_extensions() {
        chrome.management.getAll(function (extensions) {
          extensions.forEach(function (extension) {
            ltbeef.elements.create(
              {
                tag: "button",
                id: extension.id,
                textContent: extension.name,
                enabled: extension.enabled,
                admin: extension.installType === "admin",
                onclick: "toggle_extension",
              },
              ltbeef.elements.ltbeef_extensions
            );
            ltbeef.functions.strikethrough(
              ltbeef.elements[extension.id],
              extension.enabled
            );
            if (extension.id === chrome.runtime.id)
              ltbeef.elements[extension.id].className = "gg";
          });
        });
      },
      strikethrough(button, enabled) {
        button.style.textDecoration = enabled ? "none" : "line-through";
      },
      toggle_extension() {
        if (this.enabled && this.id === chrome.runtime.id)
          if (!confirm(ltbeef.strings.remove_gg_prompt)) return;
        this.enabled = !this.enabled;
        ltbeef.functions.strikethrough(this, this.enabled);
        chrome.management.setEnabled(this.id, this.enabled);
      },
      manage_all() {
        var admin_only = this.admin_only;
        var enabling = this.enabling;
        [...ltbeef.elements.ltbeef_extensions.children].forEach(function (
          button
        ) {
          if (
            (admin_only && !button.admin) ||
            !enabling === !button.enabled ||
            button.id === chrome.runtime.id
          )
            return;
          button.click();
        });
      },
    },
    strings: {
      style:
        "*{box-sizing:border-box}body{padding:10px;font-size:110%;color:#fff;background-color:#2e2e31}h2{text-align:left;font-size:175%}button{color:#000;font-size:15px}h2,button,p{font-family:Roboto,sans-serif}button{background-color:#fff;padding:10px 20px;margin:0 5px 5px 0;border:none;border-radius:10px;cursor:pointer;transition:filter 250ms}button[disabled]{pointer-events:none;filter:brightness(.5)}button:hover{filter:brightness(.8)}.gg{background-color:#99edc3}a{color:#99edc3;transition:color 250ms}a:hover{color:#1c8e40}",
      title: "LTBEEF",
      ltbeef: {
        title:
          'Disable other Chrome Extensions similarly to <a href="https://compactcow.com/ltbeef">LTBEEF</a>',
        manual_description:
          "LTBEEF was fixed by Chrome in v106, so this is a great alternative that works in the latest version. The buttons below will allow you to disable or enable all admin-enforced extensions.",
        broad_options_description:
          "Or you can try the more automatic broad options:",
        disable_all: "Disable all except GoGuardian",
        disable_all_admin: "Disable all admin-forced except GoGuardian",
        enable_all: "Re-enable all",
        soft_disable_recommendation:
          "Disabling GoGuardian with this process will close the [ltbeef] launcher. As an alternative, use the soft-disable button earlier on the page, which has the same functionality while allowing for the [ltbeef] editor to be used.",
      }
    }
  };
  /*
   */
  document.body.innerHTML = "";
  /*
   */
  [
    { tag: "title", id: "title" },
    {
      tag: "style",
      id: "style",
    },
    {
      tag: "div",
      id: "ltbeef",
      kids: [
        { tag: "h2", id: "title" },
        { tag: "p", id: "manual_description" },
        { tag: "div", id: "ltbeef_extensions" },
        { tag: "p", id: "broad_options_description" },
        { tag: "button", id: "disable_all", onclick: "manage_all" },
        {
          tag: "button",
          id: "disable_all_admin",
          admin_only: true,
          onclick: "manage_all",
        },
        {
          tag: "button",
          id: "enable_all",
          enabling: true,
          onclick: "manage_all",
        },
      ],
    },
  ].forEach((elem) => {
    ltbeef.elements.create(elem);
  });
  /*
   */
  history.replaceState({}, {}, "/ltbeef");
  ltbeef.functions.get_extensions();