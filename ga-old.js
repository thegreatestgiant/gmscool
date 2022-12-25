// this code is mad unclean
(function () {
  var chrome = window.chrome;
  if (location.href.startsWith("chrome")) {
    document.title = "Swamp Launcher";
    add("style").innerHTML = `
body {
  padding: 10px;
  font-size: 110%;
}
h1,
h2,
p,
label,
select,
button {
  font-family: "Roboto", sans-serif;
}
hr {
  border: none;
  border-bottom: 3px solid black;
}
textarea,
input,
kbd,
pre {
  font-family: monospace;
}
textarea,
input,
select,
pre {
  background-color: white;
  border: 2px solid black;
  font-size: 15px;
  padding: 8px;
  margin: 0px 5px 5px 0px;
}
textarea {
  height: 400px;
  display: inline-block;
  float: left;
  white-space: pre;
  width: 60%;
  margin-bottom: 15px;
}
input[type=text] {
  width: 350px;
}
pre {
  height: 380px;
  display: inline-block;
  float: right;
  width: calc(40% - 30px);
  margin-bottom: 15px;
  overflow: scroll;
}
label {
  font-size: 15px;
  padding-right: 5px;
}
button {
  background-color: #4c8bf5;
  color: white;
  border: none;
  font-size: 15px;
  padding: 10px 20px;
  border-radius: 10px;
  margin: 0px 5px 5px 0px;
  cursor: pointer;
}
a {
  color: #327bf7;
}
button:hover, a:hover {
  filter: brightness(0.9);
}
`;
    //
    add("h1").innerHTML = "[swamp] Launcher for ChromeOS";
    add("h3").innerHTML =
      "Made by Bypassi, inspired by Eli from TN, I kinda threw this together in a couple days lol";
    add("p").innerHTML =
      '<a href="http://ssl.google-analytics.com/ga.js">Source code</a>';
    add("hr");
    //
    var run_code = add("div");
    add("h2", run_code).textContent = "Run your own code";
    add("p", run_code).innerHTML =
      'Put your script here to run it. You will be able to access most "chrome" scripts. There is also an auto-run checkbox which will allow your script to automatically persist while [swamp] is active. If you mess up (for example by putting GG in an infinite reload loop), auto-run can be forced off by turning off your DNS/VPN, going to chrome://restart, and following the steps to set up [swamp] again but instead visiting <a href="chrome-extension://haldlgldplgnggkjaafhelgiaglafanh/background.html?reset">this reset link</a>.';
    add("p", run_code).innerHTML =
      "Basically, this is a background script, meaning that if you turn on auto-run and do chrome://restart, the script will not change until the Chromebook is restarted again. <b>This means as long as you use auto-run, restart your Chromebook while [swamp] is active, and don't restart your Chromebook again, you could run some of the scripts when the DNS is off.</b>";
    var run_code_input = add("textarea", run_code);
    run_code_input.placeholder = "Input goes here...";
    var run_code_output = add("pre", run_code);
    run_code_output.textContent = "Output shows here:\n";
    console.log = function (e) {
      run_code_output.textContent += "\n" + e;
    };
    add("br", run_code);
    add("label", run_code).textContent = "Auto-run:";
    var auto_run_checkbox = add("input", run_code);
    auto_run_checkbox.type = "checkbox";
    add("br", run_code);
    add("br", run_code);
    var run_code_button = add("button", run_code);
    run_code_button.textContent = "Run and save code";
    run_code_button.onclick = function () {
      try {
        localStorage.swamp_run_code = run_code_input.value;
        localStorage.swamp_auto_run = auto_run_checkbox.checked || "";
        eval(run_code_input.value);
        console.log("Code ran successfully");
      } catch (e) {
        console.log(e);
      }
    };
    add("br");
    add("hr");
    //
    var script_database = [
      { name: "Select an option...", code: `` },
      {
        name: "Display GoGuardian policy",
        code: `chrome.storage.local.get("policy", function (json) {
 open().document.body.textContent = JSON.stringify(json);
});`,
      },
      {
        name: "Emulate DNS and block goguardian.com requests",
        code: `chrome.webRequest.onBeforeRequest.addListener(
  function () {
    return { redirectUrl: "javascript:" };
  },
  {
    urls: ["*://*.goguardian.com/*"],
  },
  ["blocking"]
);
// This script requires you to keep this tab open (or use auto-run and do chrome://restart)`,
      },
      {
        name: "Bookmarklet emulator when a page is loaded",
        code: `chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.status == "complete") {
    chrome.tabs.executeScript(
      tabId, { code: \`
        alert("your code here")
      \` }
    );
  }
});
// This script requires you to keep this tab open (or use auto-run and do chrome://restart)`,
      },
      {
        name: "Open a cool-looking window",
        code: `chrome.windows.create({ url: "https://google.com", type: "popup" });`,
      },
      {
        name: "Have a preview of this page when the GoGuardian icon is clicked",
        code: `chrome.browserAction.setPopup({popup: "/background.html"});
// This script requires you to keep this tab open (or use auto-run and do chrome://restart)`,
      },
      {
        name: "Disable all admin-forced extensions when the GoGuardian icon is clicked",
        code: `chrome.browserAction.onClicked.addListener(function () {
  chrome.management.getAll(function () {
    arguments[0].forEach(function (extension) {
      if (
        "admin" === extension.installType &&
        chrome.runtime.id !== extension.id
      )
        chrome.management.setEnabled(extension.id, false);
    });
  });
});
// This script requires you to keep this tab open (or use auto-run and do chrome://restart)`,
      },
    ];
    var interesting_scripts = add("div");
    add("h2", interesting_scripts).textContent = "Interesting scripts";
    add("p", interesting_scripts).innerHTML =
      "Some useful scripts for the textbox above. <b>DM Bypassi#7037 on Discord to suggest new ones (or general improvements to this launcher).</b>";
    var interesting_scripts_select = add("select", interesting_scripts);
    script_database.forEach(function (script) {
      var interesting_scripts_label = add("option", interesting_scripts_select);
      interesting_scripts_label.textContent = script.name;
      interesting_scripts_label.value = script.code;
    });
    interesting_scripts_select.onchange = function () {
      run_code_input.value = interesting_scripts_select.value;
      auto_run_checkbox.checked = false;
      scrollTo(0, 0);
    };
    add("p", interesting_scripts).textContent =
      "By the way, if you find a URL like *google.com* in your GoGuardian whitelist policy, any url like https://blocked.com/?google.com will be unblocked for anyone in your district. Note that your policy may be inaccurate if you are using the hard-disable option or are signed into another Google account.";
    add("p", interesting_scripts).textContent =
      "Also, if you turned on the DNS emulator and previously blocked sites that you've visited before aren't loading, try turning them from https://blocked.com to https://blocked.com? which may clear cache."; //
    add("p", interesting_scripts).textContent =
      "And please read the thing about auto-run earlier in the page, because that could be useful for making some of these scripts run at school.";
    add("hr");
    //
    var hard_disable = add("div");
    add("h2", hard_disable).textContent = "Hard-Disable GoGuardian";
    add("p", hard_disable).innerHTML =
      "This will disable GoGuardian and persist until you powerwash your device or undo it with the second button below. This works by messing with cookies that GoGuardian needs to run. <b>DM Bypassi#7037 on Discord if you find a cooler way to do this</b>.";
    var hard_disable_button = add("button", hard_disable);
    hard_disable_button.textContent = "Hard-Disable GoGuardian";
    hard_disable_button.onclick = function () {
      for (var i = 0; i < localStorage.length; i++)
        if (!localStorage.key(i).startsWith("swamp"))
          localStorage[localStorage.key(i)] += 1;
      setTimeout(function () {
        prompt(
          "Cookies corrupted, go to this URL to fully disable GoGuardian:",
          "chrome://restart"
        );
      }, 200);
    };
    add("br", hard_disable);
    var re_enable_button = add("button", hard_disable);
    re_enable_button.textContent = "Undo Hard-Disable";
    re_enable_button.onclick = function () {
      for (var i = 0; i < localStorage.length; i++)
        if (!localStorage.key(i).startsWith("swamp"))
          localStorage[localStorage.key(i)] = "";
      location.reload();
    };
    add("br");
    add("hr");
    //
    var remove_extensions = add("div");
    add("h2", remove_extensions).innerHTML =
      'Disable Chrome Extensions similarly to <a href="https://compactcow.com/ltbeef">LTBEEF</a>';
    add("p", remove_extensions).textContent =
      "LTBEEF was fixed by Chrome in v106, so this is a great alternative that works in the latest version.";
    add("p", remove_extensions).innerHTML =
      'This allows you to emulate the switch in chrome://extensions and fully disable any extension by typing its ID in the textbox below (you can seperate multiple by commas). The ID can be found by going to chrome://extensions, clicking "Details" for the extension, and copying the text after the = in the URL. <b>"Removing" GoGuardian is not a good idea since it will stop this page from working. This can be reversed by visiting chrome://restart.</b>';
    var remove_extensions_input = add("input", remove_extensions);
    remove_extensions_input.placeholder = "Extension ID here...";
    remove_extensions_input.type = "text";
    var remove_extensions_button = add("button", remove_extensions);
    remove_extensions_button.textContent = "Disable this extension";
    remove_extensions_button.onclick = function () {
      remove_extensions_input.value.split(",").forEach(function (id) {
        if (id === chrome.runtime.id) {
          alert(
            "You tried to remove GoGuardian, which would stop this launcher from working (the extension was not removed). Please use the button at the bottom of the page if you would like to do this."
          );
        } else {
          chrome.management.setEnabled(id.trim(), false);
        }
      });
      remove_extensions_input.value = "Disabled!";
    };
    var revive_extensions_button = add("button", remove_extensions);
    revive_extensions_button.textContent = "Revive this extension";
    revive_extensions_button.onclick = function () {
      remove_extensions_input.value.split(",").forEach(function (id) {
        chrome.management.setEnabled(id.trim(), true);
      });
      remove_extensions_input.value = "Revived!";
    };
    add("br", remove_extensions);
    add("p", remove_extensions).textContent =
      "Or you can try the more automatic broad options:";
    var remove_all_button = add("button", remove_extensions);
    remove_all_button.textContent = "Disable all except GoGuardian";
    remove_all_button.onclick = function () {
      chrome.management.getAll(function () {
        arguments[0].forEach(function (extension) {
          if (chrome.runtime.id !== extension.id)
            chrome.management.setEnabled(extension.id, false);
        });
      });
    };
    var remove_all_admin_button = add("button", remove_extensions);
    remove_all_admin_button.textContent =
      "Disable all admin-forced except GoGuardian";
    remove_all_admin_button.onclick = function () {
      chrome.management.getAll(function () {
        arguments[0].forEach(function (extension) {
          if (
            "admin" === extension.installType &&
            chrome.runtime.id !== extension.id
          )
            chrome.management.setEnabled(extension.id, false);
        });
      });
    };
    var revive_all_button = add("button", remove_extensions);
    revive_all_button.textContent = "Revive all";
    revive_all_button.onclick = function () {
      chrome.management.getAll(function () {
        arguments[0].forEach(function (extension) {
          chrome.management.setEnabled(extension.id, true);
        });
      });
    };
    add("br", remove_extensions);
    add("p", remove_extensions).textContent = "And the final option:";
    var remove_goguardian_button = add("button", remove_extensions);
    remove_goguardian_button.textContent = "Disable GoGuardian";
    remove_goguardian_button.onclick = function () {
      if (
        confirm(
          "Are you sure you want to disable GoGuardian? This will close the [swamp] launcher until chrome://restart is visited."
        )
      )
        chrome.management.setEnabled(chrome.runtime.id, false);
    };
    //
    if (location.href.endsWith("?reset")) {
      localStorage.swamp_auto_run = "";
      history.replaceState("", "", "/background.html");
    }
    if (localStorage.swamp_run_code) {
      run_code_input.value = localStorage.swamp_run_code;
      if (localStorage.swamp_auto_run) {
        auto_run_checkbox.checked = true;
        run_code_button.click();
      }
    }
  }
  //
  function add(type, parent) {
    return (parent || document.body).appendChild(document.createElement(type));
  }
})();
