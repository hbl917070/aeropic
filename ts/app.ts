declare var VanillaTilt: any; //3D互動



document.addEventListener("DOMContentLoaded", () => {

    new App();

});

/**  */
function getDom(selectors: string) {
    return document.querySelector(selectors);
}

/** 檢測是否為手機 */
function isMobileDevice() {
    let mobileDevices = ["Android", "webOS", "iPhone", "iPad", "iPod", "BlackBerry", "Windows Phone"];
    for (var i = 0; i < mobileDevices.length; i++) {
        if (navigator.userAgent.match(mobileDevices[i])) {
            return true;
        }
    }
    return false;
}


class App {
    constructor() {

        let domHeader = getDom("#header") as HTMLElement;
        let domBtnIndex = domHeader.querySelector(".js-index") as HTMLElement;
        let domBtnPlugin = domHeader.querySelector(".js-plugin") as HTMLElement;
        let domBtnSupport = domHeader.querySelector(".js-support") as HTMLElement;
        let domBtnLang = domHeader.querySelector(".js-lang") as HTMLElement;

        initHearder();

        if (getDom(".page-index") !== null) {
            initIndex();
            domBtnIndex.setAttribute("active", "true");
        }
        else if (getDom(".page-plugin") !== null) {
            initPlugin();
            domBtnPlugin.setAttribute("active", "true");
        }
        else if (getDom(".page-support") !== null) {
            initSupport();
            domBtnSupport.setAttribute("active", "true");
        }

        /**
         * 
         */
        function initHearder() {
            if (isMobileDevice() === false) {
                VanillaTilt.init(getDom(".header-content"), {
                    max: 3,
                    speed: 400,
                    //scale: 1.1
                });
            }
            //----------

            // 顯示或隱藏語言選單
            let domMenuLang = getDom("#menu-lang") as HTMLElement;
            let isShow = false;

            domBtnLang?.addEventListener("pointerdown", () => {
                setTimeout(() => {
                    domBtnLang?.setAttribute("hover", "true");
                    domMenuLang?.setAttribute("active", "true");
                    isShow = true;
                }, 1);
            })
            window.addEventListener("pointerdown", (e) => {
                if (isShow) {
                    domBtnLang?.setAttribute("hover", "");
                    domMenuLang?.setAttribute("active", "");
                    //e.preventDefault();
                }
            }, false)

            //----------

            // 切換語言
            let lang = document.documentElement.lang; //取得目前的語言
            let path = window.location.pathname;
            let pageName = '/' + path.split('/').pop(); // 取得目前的頁面，例如 "/support.html"

            let arItem = domMenuLang?.querySelectorAll(".item");
            for (let i = 0; i < arItem.length; i++) {
                const item = arItem[i];
                let dataLang = item.getAttribute("data-lang");

                //根據目前的語言來設定打勾
                if (dataLang === lang) {
                    item.setAttribute("active", "true");
                }

                //切換語言
                item.addEventListener("click", () => {
                    location.href = `../${dataLang}${pageName}`;
                })
            }

        }

        /**
         * 首頁
         */
        function initIndex() {
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
                    speed: 400,
                    //scale: 1.05
                });
            }
        }

        /**
         * 擴充套件
         */
        function initPlugin() {

            //初始化手風琴功能
            let ar = document.querySelectorAll(".plugin-item .plugin-moreBtn");
            for (let i = 0; i < ar.length; i++) {
                addEvent(ar[i]);
            }

            function addEvent(btn) {
                let dom = btn;

                while (true) { //取得要設定open="true"的父親物件
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
                        dom.setAttribute("open", "")
                    } else {
                        dom.setAttribute("open", "true")
                    }
                })
            }
        }

        /**
         * 常見問題
         */
        function initSupport() {

        }


    }
}




