window.Hub = (() => {
  const menuRoot = document.getElementById("sidebar_menu");

  // Internal helper: create and return a menu section
  function createMenu(title) {
    const section = document.createElement("li");

    let id = `checkbox_${title}`

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id;

    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = title;

    const submenu = document.createElement("ul");
    submenu.className = "submenu"

    section.appendChild(checkbox)
    section.appendChild(label)
    section.appendChild(submenu)

    const menuAPI = {
      addHeader(text, nestingLevel=0) {
        const header = document.createElement("li");
        header.textContent = text;
        header.className = "sebmenu-header";
        header.style.marginLeft = `${nestingLevel}em`
        submenu.appendChild(header);
      },
      addLink(label, href, nestingLevel=0) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = label;
        a.style.marginLeft = `${nestingLevel}em`
        li.appendChild(a);
        submenu.appendChild(li);
      }
    };

    menuRoot.insertBefore(section, menuRoot.lastElementChild);
    return menuAPI;
  }

  // Public API exposed to plugins
  const appAPI = {
    addMenu(label, builderFn) {
      const menu = createMenu(label);
      builderFn(menu);
    }
  };

  return {
    registerPlugin(plugin) {
      if (plugin && typeof plugin.init === "function") {
        plugin.init(appAPI);
      } else {
        console.warn("Invalid plugin:", plugin);
      }
    }
  };
})();

// const api = {

//   init(app) {

//   }

//   registerMenuItem({ label, onClick }) {
//     const menuEl = document.getElementById("menu");
//     const li = document.createElement("li");
//     const btn = document.createElement("button");
//     btn.textContent = label;
//     btn.onclick = onClick;
//     li.appendChild(btn);
//     menuEl.appendChild(li);
//   },

//   registerWidget({ title, content }) {
//     const widgetContainer = document.getElementById("main-panel");

//     const widget = document.createElement("div");
//     widget.className = "widget";

//     const header = document.createElement("h4");
//     header.textContent = title;

//     const body = document.createElement("div");
//     if (typeof content === "function") {
//       body.appendChild(content());
//     } else if (typeof content === "string") {
//       body.innerHTML = content;
//     }

//     widget.appendChild(header);
//     widget.appendChild(body);
//     widgetContainer.appendChild(widget);
//   }
// };

// return {
//   registerPlugin(plugin) {
//     if (plugin && typeof plugin.init === "function") {
//       plugin.init(api);
//     } else {
//       console.warn("Invalid plugin:", plugin);
//     }
//   }
// };