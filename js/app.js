(() => {
  // ts/app.ts
  document.addEventListener("DOMContentLoaded", () => {
    new App();
  });
  function getDom(selectors) {
    return document.querySelector(selectors);
  }
  function isMobileDevice() {
    let mobileDevices = ["Android", "webOS", "iPhone", "iPad", "iPod", "BlackBerry", "Windows Phone"];
    for (var i = 0; i < mobileDevices.length; i++) {
      if (navigator.userAgent.match(mobileDevices[i])) {
        return true;
      }
    }
    return false;
  }
  var App = class {
    constructor() {
      let domHeader = getDom("#header");
      let domBtnIndex = domHeader.querySelector(".js-index");
      let domBtnPlugin = domHeader.querySelector(".js-plugin");
      let domBtnSupport = domHeader.querySelector(".js-support");
      let domBtnLang = domHeader.querySelector(".js-lang");
      initHearder();
      if (getDom(".page-index") !== null) {
        initIndex();
        domBtnIndex.setAttribute("active", "true");
      } else if (getDom(".page-plugin") !== null) {
        initPlugin();
        domBtnPlugin.setAttribute("active", "true");
      } else if (getDom(".page-support") !== null) {
        initSupport();
        domBtnSupport.setAttribute("active", "true");
      }
      function initHearder() {
        if (isMobileDevice() === false) {
          VanillaTilt.init(getDom(".header-content"), {
            max: 3,
            speed: 400
            //scale: 1.1
          });
        }
        let domMenuLang = getDom("#menu-lang");
        let isShow = false;
        domBtnLang?.addEventListener("click", () => {
          setTimeout(() => {
            domBtnLang?.setAttribute("hover", "true");
            domMenuLang?.setAttribute("active", "true");
            isShow = true;
          }, 1);
        });
        window.addEventListener("click", (e) => {
          if (isShow) {
            domBtnLang?.setAttribute("hover", "");
            domMenuLang?.setAttribute("active", "");
          }
        }, false);
        let lang = document.documentElement.lang;
        let path = window.location.pathname;
        let pageName = "/" + path.split("/").pop();
        let arItem = domMenuLang?.querySelectorAll(".item");
        for (let i = 0; i < arItem.length; i++) {
          const item = arItem[i];
          let dataLang = item.getAttribute("data-lang");
          if (dataLang === lang) {
            item.setAttribute("active", "true");
          }
          item.addEventListener("click", () => {
            location.href = `../${dataLang}${pageName}`;
          });
        }
      }
      function initIndex() {
        console.log(isMobileDevice());
        if (isMobileDevice() === false) {
          VanillaTilt.init(document.querySelectorAll(".infoBox-link-btn"), {
            max: 10,
            speed: 400,
            //"full-page-listening": true,
            scale: 1.05
          });
          VanillaTilt.init(document.querySelectorAll(".contentBox2 .item-img"), {
            max: 3,
            speed: 400,
            scale: 1.05
          });
          VanillaTilt.init(document.querySelectorAll(".contentBox3 .item"), {
            max: 10,
            speed: 400
            //scale: 1.05
          });
        }
      }
      function initPlugin() {
        let ar = document.querySelectorAll(".plugin-item .plugin-moreBtn");
        for (let i = 0; i < ar.length; i++) {
          addEvent(ar[i]);
        }
        function addEvent(btn) {
          let dom = btn;
          while (true) {
            dom = dom.parentNode;
            if (dom === null || dom === document.body) {
              return;
            }
            if (dom.className.indexOf("plugin-item") !== -1) {
              break;
            }
          }
          btn.addEventListener("click", () => {
            if (dom.getAttribute("open") == "true") {
              dom.setAttribute("open", "");
            } else {
              dom.setAttribute("open", "true");
            }
          });
        }
      }
      function initSupport() {
      }
    }
  };
})();
