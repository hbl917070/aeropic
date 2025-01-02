export class I18n {

    getData; //取得 翻譯json
    setData; //設定 翻譯json
    pushData; //加入 翻譯json

    t; //取得翻譯。 key(多層範例 aa.b.c), type=語言(選填)
    get; //取得翻譯。 key(多層範例 aa.b.c), type=語言(選填)

    getDefaultLang; //取得預設語言
    setDefaultLang; //設定預設語言
    getLang; //取得目前的語言
    setLang; //設定語言

    constructor() {

        this.getData = getData; //取得 翻譯json
        this.setData = setData; //設定 翻譯json
        this.pushData = pushData; //加入 翻譯json

        this.t = get; //取得翻譯。 key(多層範例 aa.b.c), type=語言(選填)
        this.get = get; //取得翻譯。 key(多層範例 aa.b.c), type=語言(選填)

        this.getDefaultLang = getDefaultLang; //取得預設語言
        this.setDefaultLang = setDefaultLang; //設定預設語言
        this.getLang = getLang; //取得目前的語言
        this.setLang = setLang; //設定語言

        var lang = ""; //目前的語言
        var defaultLang = "en"; //預設語言

        //--------------

        /**
         * 取得預設語言
         */
        function getDefaultLang() { return defaultLang; }

        /**
         * 設定預設語言
         * @param {string} type
         */
        function setDefaultLang(type) { defaultLang = type; }

        /**
         * 取得 翻譯json
         */
        function getData() { return data; }

        /**
         * 設定 翻譯json
         * @param {object} json 
         */
        function setData(json) { data = json; }

        /**
         * 加入新的 翻譯json
         * @param {object} json 
         */
        function pushData(json) {
            mergeJSON(data, json); //合併json
            data = json;
        }

        /**
         * 取得目前的語言
         */
        function getLang() { return lang; }

        /**
         * 設定語言，並且翻譯網頁
         */
        function setLang(type) { lang = type; }

        /**
         * 處理字串內的變數
         * @param {string} str 要處理的文字。例如 "ss{a}ss{b}sss"
         * @param {object} value 用於替換的json資料。例如 {a:123, b:"xx"}
         */
        function applyValue(str, value) {

            //沒有輸入value，就只會回傳原文字
            if (value === undefined || value.length === 0) { return str; }

            let arkay = Object.keys(value);
            for (let i = 0; i < arkay.length; i++) {
                const k = arkay[i];
                const v = value[k];

                // [ ]* 表示無視{}內的空白
                str = str.replace(new RegExp("{[ ]*" + k + "[ ]*}", "g"), v);
            }
            return str;
        }

        /**
         * 取得翻譯
         * @param {string} key 
         * @param {object} value 參數json(選填)
         * @param {string} type 語言(選填)
         */
        function get(key, value, type) {

            if (key === null) { return ""; }

            let arkey = key.split(".");
            let d = data;

            for (let i = 0; i < arkey.length; i++) {
                let k = arkey[i];
                if (d.hasOwnProperty(k)) {
                    d = d[k];
                }
            }

            //未填入語言的話，就是用預設語言
            if (type === undefined) { type = lang }

            if (typeof d === "string") { //連結到另一筆資料
                return get(d.toString(), value, type);

            } else if (d.hasOwnProperty(type) && d[type] !== null) { //翻譯存在的話就回傳
                return applyValue(d[type], value);

            } else if (d.hasOwnProperty(defaultLang)) { //如果不存在該語言的翻譯，則回傳預設語言的翻譯
                return applyValue(d[defaultLang], value);

            }

            //什麼都找不到，回傳key
            if (key !== "") {
                console.log(`i18n missing: "${key}"`);
            }
            return arkey[arkey.length - 1];
        }


        /**
         * 合併json
         * 遇到相同元素級屬性，以後者（main）為準
         * 不返還新Object，而是main改變
         * @param {object} minor 
         * @param {object} main 
         */
        function mergeJSON(minor, main) {
            for (var key in minor) {
                if (main[key] === undefined) { //不衝突的，直接賦值
                    main[key] = minor[key];
                    continue;
                }
                //衝突了，如果是Object，看看有麼有不衝突的屬性
                //不是Object 則以main為主，忽略即可。故不需要else
                if (isJSON(minor[key])) {
                    // arguments.callee 遞迴呼叫，並且與函式名解耦
                    arguments.callee(minor[key], main[key]);
                }
            }
        }


        /**
         * 檢查是否為 json
         */
        function isJSON(target) {
            return typeof target == "object" && target.constructor == Object;
        }



        var data = {

            /*//單層範例
            "sss": {
                "zh": "1",
                "cn": "2",
                "en": "3",
            },

            //多層範例
            "aaa": {
                "a1": {
                    "zh": "zh-a1",
                    "cn": "cn-a1",
                },
                "a2": {
                    "zh": "a2-a2",
                    "cn": "a2-cn",
                    "en": "a2-en",
                },
            },

            //有變數的範例。範例 i18n.t("vvv", {a:123})
            "vvv": {
                "zh": "zz{a}zz",
                "en": "ee{ a}ee",
            },*/

            //-----------------------------
        }

    }
}

export var langData = {
    /*"sss": {
        "zh": "1",
        "cn": "2",
        "en": "3",
    },

    //多層範例
    "aaa": {
        "a1": {
            "zh": "zh-a1",
            "cn": "cn-a1",
        },
        "a2": {
            "zh": "a2-a2",
            "cn": "a2-cn",
            "en": "a2-en",
        },
    },

    //有變數的範例。範例 i18n.t("vvv", {a:123})
    "vvv": {
        "zh": "zz{a}zz",
        "en": "ee{ a}ee",
    }*/

    "head": {
        "title": {
            "zh-TW": "Tiefsee 圖片檢視器",
            "en": "Tiefsee Image Viewer",
        },
        "description": {
            "zh-TW": "Tiefsee 是一款適用於 Windows 的開源圖片檢視器，具有強大的功能和易用性",
            "en": "Tiefsee is an open-source image viewer for Windows with powerful features and ease of use.",
        },
        "keyWords": {
            "zh-TW": `Tiefsee 圖片檢視器, 看圖程式, 漫畫檢視器`,
            "en": `Tiefsee image viewer, image viewing program, comic viewer`,
        },
    },

    "header": {
        "plugin": {
            "zh-TW": "擴充套件",
            "en": "Plugin",
        },
        "support": {
            "zh-TW": "常見問題",
            "en": "FAQ",
        },
    },

    "bottom": {
        "author": {
            "zh-TW": "作者：",
            "en": "Author:",
        },
        "email": {
            "zh-TW": "信箱：",
            "en": "Email:",
        },
    },

    "index": {
        "subTitle": {
            "zh-TW": "一款適用於 Windows 的開源圖片檢視器，具有強大的功能和易用性",
            "en": "An open-source image viewer for Windows with powerful features and ease of use",
        },
        "version": {
            "zh-TW": "已推出 {v} 版",
            "en": "Version {v} released",
        },
        "getTiefsee": {
            "zh-TW": "從商店獲取 Tiefsee",
            "en": "Get Tiefsee from the store",
        },
        "downloadZip": {
            "zh-TW": "下載免安裝版",
            "en": "Download the portable version",
        },
        "updateNotes": {
            "zh-TW": "更新說明",
            "en": "Update notes",
        },
        "viewOldVersion": {
            "zh-TW": "查看舊版 3.0.2",
            "en": "View old version 3.0.2",
        },

        item: {

            "windowTheme": {
                title: {
                    "zh-TW": "視窗主題",
                    "en": "Window Theme",
                },
                text: {
                    "zh-TW": `
                        視窗效果：<br>半透明視窗、AERO、Acrylic<br><br>
                        自訂選項：<br>背景色, 文字顏色, 圖示顏色, 圖示粗細, 文字粗細, 視窗圓角
                    `,
                    "en": `
                        Window effects:<br>Transparent window, AERO, Acrylic<br><br>
                        Custom options:<br>Background color, Text color, Icon color, Icon thickness, Text thickness, Window rounded corners
                    `,
                },
            },
            "filePanel": {
                title: {
                    "zh-TW": "檔案預覽面板",
                    "en": "File Panel",
                },
                text: {
                    "zh-TW": `查看目前資料夾中的所有圖片，方便切換圖片和管理圖片`,
                    "en": `View all images in the current folder for easy switching and management of images`,
                },
            },
            "folderPanel": {
                title: {
                    "zh-TW": "資料夾預覽面板",
                    "en": "Folder Panel",
                },
                text: {
                    "zh-TW": `查看目前資料夾周圍的同級資料夾，並預覽資料夾內的圖片，方便切換資料夾和管理資料夾`,
                    "en": `View and preview images in folders at the same level as the current folder for easy switching and management of folders`,
                },
            },
            "informationPanel": {
                title: {
                    "zh-TW": "詳細資料面板",
                    "en": "Information Panel",
                },
                text: {
                    "zh-TW": `
                        讀取圖片內的附加資訊：<br>
                        <ul>
                            <li>EXIF 資訊，並以 Google Map 顯示拍攝地點</li>
                            <li>AI 繪圖參數，支援</li>
                            <ul>
                                <li><a target="_blank" class="link" href="https://github.com/AUTOMATIC1111/stable-diffusion-webui"> A1111 (Stable Diffusion web UI) </li>
                                <li><a target="_blank" class="link" href="https://novelai.net/"> NovelAI </a></li>
                                <li><a target="_blank" class="link" href="https://github.com/comfyanonymous/ComfyUI"> ComfyUI </a></li>
                                <li><a target="_blank" class="link" href="https://github.com/invoke-ai/InvokeAI"> InvokeAI </a></li>
                                <li><a target="_blank" class="link" href="https://github.com/Stability-AI/StableSwarmUI"> StableSwarmUI </a></li>
                            </ul>
                        </ul>
                    `,
                    "en": `
                        Read additional information from the image:<br>
                        <ul>
                            <li>EXIF information and display shooting location with Google Map</li>
                            <li>AI drawing parameters, supports</li>
                            <ul>
                                <li><a target="_blank" class="link" href="https://github.com/AUTOMATIC1111/stable-diffusion-webui"> A1111 (Stable Diffusion web UI) </li>
                                <li><a target="_blank" class="link" href="https://novelai.net/"> NovelAI </a></li>
                                <li><a target="_blank" class="link" href="https://github.com/comfyanonymous/ComfyUI"> ComfyUI </a></li>
                                <li><a target="_blank" class="link" href="https://github.com/invoke-ai/InvokeAI"> InvokeAI </a></li>
                                <li><a target="_blank" class="link" href="https://github.com/Stability-AI/StableSwarmUI"> StableSwarmUI </a></li>
                            </ul>
                        </ul>
                    `,
                },
            },
            "bulkView": {
                title: {
                    "zh-TW": "大量瀏覽模式",
                    "en": "Bulk View",
                },
                text: {
                    "zh-TW": `
                        以垂直捲動的方式查看多張圖片<br>
                        <ul>
                            <li>可讓圖片垂直排列或雙欄排列，適合用於看漫畫</li>
                            <li>使用瀑布流自動排列圖片，同時查看多張圖片</li>
                        </ul>
                    `,
                    "en": `
                        View multiple images by scrolling vertically<br>
                        <ul>    
                            <li>Images can be arranged vertically or in two columns, suitable for reading comics</li>
                            <li>Use waterfall flow to automatically arrange images and view multiple images at the same time</li>
                        </ul>
                        `,
                },
            },
            "quickDragFile": {
                title: {
                    "zh-TW": "快速拖曳",
                    "en": "Quick Drag File",
                },
                text: {
                    "zh-TW": `直接從 Tiefsee 將圖片拖曳至其他程式進行開啟或上傳`,
                    "en": `Drag images directly from Tiefsee to other programs to open or upload`,
                },
            },
            "openWebImage": {
                title: {
                    "zh-TW": "開啟網頁圖片",
                    "en": "Open Web Image",
                },
                text: {
                    "zh-TW": `可從 瀏覽器 或 Discord 把圖片拖曳至 Tiefsee 來開啟`,
                    "en": `Drag images from a browser or Discord to Tiefsee to open`,
                },
            },


            "supportFormats": {
                title: {
                    "zh-TW": "支援多種格式",
                    "en": "Supports Multiple Formats",
                },
                text: {
                    "zh-TW": `
                        支援超過50種圖片格式：<br>
                        svg、webp、webm、psd、clip、heic、avif、qoi ...
                    `,
                    "en": `
                        Supports over 50 image formats:<br>
                        svg, webp, webm, psd, clip, heic, avif, qoi ...
                    `,
                },
            },
            "fastStartup": {
                title: {
                    "zh-TW": "快速啟動",
                    "en": "Fast Startup",
                },
                text: {
                    "zh-TW": `所有的 Tiefsee 共用同一個執行個體。只要 Tiefsee 的視窗尚未全部關閉，就能快速啟動 Tiefsee`,
                    "en": `All Tiefsee windows share the same instance. As long as not all Tiefsee windows are closed, Tiefsee can be started quickly`,
                },
            },
            "onlineImageSearch": {
                title: {
                    "zh-TW": "線上搜圖",
                    "en": "Online Image Search",
                },
                text: {
                    "zh-TW": `
                        支援：<br>
                        sauceNAO, Yandex, Ascii2d, Google, Google Lens, Bing
                    `,
                    "en": `
                        Supported:<br>
                        sauceNAO, Yandex, Ascii2d, Google, Google Lens, Bing
                    `,
                },
            },
            "quickLook": {
                title: {
                    "zh-TW": "QuickLook",
                    "en": "QuickLook",
                },
                text: {
                    "zh-TW": `在桌面或資料夾選中任一檔案，然後長按空白鍵，即可預覽檔案`,
                    "en": `Select a file on the desktop or in a folder and then press and hold the spacebar to preview the file`,
                },
            },
            "otherFeatures": {
                title: {
                    "zh-TW": "其他功能",
                    "en": "Other Features",
                },
                text: {
                    "zh-TW": `
                        Markdown 編輯器, 文字檔編輯器,<br>
                        PDF 閱讀器, docx 閱讀器, pptx 閱讀器
                    `,
                    "en": `
                        Markdown editor, text file editor,<br>
                        PDF reader, docx reader, pptx reader
                    `,
                },
            },


        },

    },

    plugin: {
        "pluginList": {
            "zh-TW": "Tiefsee 擴充套件列表",
            "en": "Tiefsee Plugin List",
        },
        "download": {
            "zh-TW": "下載",
            "en": "Download",
        },
        "pluginInstallationMethod": {
            "zh-TW": "擴充套件安裝方法",
            "en": "Plugin Installation Method",
        },
        "pluginInstallationInstructions": {
            "zh-TW": `
                在這裡下載的擴充套件是 ZIP 檔，解壓縮後放到「Plugin」資料夾內
                <br>
                然後重新開啟 Tiefsee。
                <br><br>
                <div> 從這裡可以開啟「Plugin」資料夾 </div>
                <img src="../img/plugin/plugin-2.png" alt="How to open 「Plugin」 directory">
                <br><br>
                <div>安裝完成後的示意圖</div>
                <img src="../img/plugin/plugin-1.png" alt="Schematic">
            `,
            "en": `
                The plugins downloaded here are ZIP files. Unzip and place them in the 'Plugin' folder
                <br>
                Then restart Tiefsee.
                <br><br>
                <div> You can open the 'Plugin' folder from here </div>
                <img src="../img/plugin/plugin-2.png" alt="How to open 「Plugin」 directory">
                <br><br>
                <div>Schematic after installation</div>
                <img src="../img/plugin/plugin-1.png" alt="Schematic">
            `,
        },


        item: {
            "quickLook": {
                subTitle: {
                    "zh-TW": "在桌面或資料夾選中任一檔案，然後長按空白鍵，即可預覽檔案",
                    "en": "Select a file on the desktop or in a folder and then press and hold the spacebar to preview the file",
                },
                text: {
                    "zh-TW": `
                        <br>
                        GitHub：<br>
                        <a class="link" href="https://github.com/hbl917070/Tiefsee.QuickLook" target="_blank">https://github.com/hbl917070/Tiefsee.QuickLook</a>
                    `,
                    "en": `
                        <br>
                        GitHub：<br>
                        <a class="link" href="https://github.com/hbl917070/Tiefsee.QuickLook" target="_blank">https://github.com/hbl917070/Tiefsee.QuickLook</a>
                    `,
                }
            },
            "monacoEditor": {
                subTitle: {
                    "zh-TW": "讓 Tiefsee 使用 monaco-editor 來載入文字檔。常用於閱讀與編輯程式碼",
                    "en": "Let Tiefsee use monaco-editor to load text files. Commonly used for reading and editing code",
                },
                text: {
                    "zh-TW": `
                        <img src="../img/plugin/demo-monaco-editor.jpg" alt="monaco-editor demo">
                        <br><br>
                        GitHub：<br>
                        <a class="link" href="https://github.com/microsoft/monaco-editor" target="_blank">https://github.com/microsoft/monaco-editor</a>
                    `,
                    "en": `
                        <img src="../img/plugin/demo-monaco-editor.jpg" alt="monaco-editor demo">
                        <br><br>
                        GitHub：<br>
                        <a class="link" href="https://github.com/microsoft/monaco-editor" target="_blank">https://github.com/microsoft/monaco-editor</a>
                    `,
                }
            },
            "webViewer": {
                subTitle: {
                    "zh-TW": "讓 Tiefsee 支援「doc、docx、ppt、pptx」",
                    "en": `Let Tiefsee support "doc, docx, ppt, pptx"`,
                },
                text: {
                    "zh-TW": `
                        點擊「下載」進入官網的下載中心，<br>
                        建議下載 8.12 版，其他新的版本並未測試過與 Tiefsee 的相容性。<br>
                        <br>
                        Web → Older Versions → Version 8.12<br>
                        <br>
                        ※ 解壓縮後如果資料夾名稱是「WebViewer-8.12.0」，則將其改成「WebViewer」<br>
                        <br>
                        <img src="../img/plugin/demo-WebViewer.jpg" alt="WebViewer demo">
                        <br><br>
                        WebViewer 是 PDFTron 的產品，官網有提供免費試用。
                        <br>
                        如果需要 PDFTron 的授權，請至：
                        <a class="link" href="https://www.pdftron.com" target="_blank">https://www.pdftron.com</a>
                    `,
                    "en": `
                        Click "Download" to enter the official website's download center.<br>
                        It is recommended to download version 8.12, as other newer versions have not been tested for compatibility with Tiefsee.<br>
                        <br>
                        Web → Older Versions → Version 8.12<br>
                        <br>
                        ※ After unzipping, if the folder name is "WebViewer-8.12.0", change it to "WebViewer".<br>
                        <br>
                        <img src="../img/plugin/demo-WebViewer.jpg" alt="WebViewer demo">
                        <br><br>
                        WebViewer is a product of PDFTron, and their official website provides a free trial. If you need a license for PDFTron, please visit:<br>
                        <a class="link" href="https://www.pdftron.com" target="_blank">https://www.pdftron.com</a>
                    `,
                },
            },
            "hdrfix": {
                subTitle: {
                    "zh-TW": `讓 JPEG XR (.jxr) 的 HDR 色彩更好的顯示<br>
                        (將 HDR 色彩空間以 Hable 算法處理成 SDR 色彩空間)`,
                    "en": `Let JPEG XR (.jxr) display HDR colors better<br>
                        (Process HDR color space to SDR color space with Hable algorithm)`,
                },
                text: {
                    "zh-TW": `
                        <br>
                        GitHub：<br>
                        <a class="link" href="https://github.com/bvibber/hdrfix" target="_blank">https://github.com/bvibber/hdrfix</a>
                    `,
                    "en": `
                        <br>
                        GitHub：<br>
                        <a class="link" href="https://github.com/bvibber/hdrfix" target="_blank">https://github.com/bvibber/hdrfix</a>
                    `,
                }
            },
        },
    },


    support: {

        "introduction": {
            "zh-TW": "簡介",
            "en": "Introduction",
        },
        "description": {
            "zh-TW": `
                Tiefsee 是一款適用於 Windows 的開源圖片檢視器，具有強大的功能和易用性。<br>
                該專案採用 .NET 8 構建，以 C#、TypeScript、SCSS 和 EJS 進行開發，<br>
                整個使用者界面都是使用 WebView2 渲染的，提供了流暢的使用體驗。<br><br>
        
                運行最低需求：64位元的 Windows 10
            `,
            "en": `
                Tiefsee is an open-source image viewer for Windows with powerful features and ease of use.<br>
                The project is built with .NET 8 and developed using C#, TypeScript, SCSS, and EJS.<br>
                The entire user interface is rendered using WebView2, providing a smooth user experience.<br><br>
        
                Minimum requirements: 64-bit Windows 10
            `,
        },
        "faq": {
            "zh-TW": "常見問題",
            "en": "FAQ",
        },


        faqItem: {
            "differenceBetweenStoreAndPortable": {
                title: {
                    "zh-TW": "商店版 與 免安裝版 有什麼差異？",
                    "en": "What is the difference between the Store and Portable versions?",
                },
                text: {
                    "zh-TW": `
                        <ul>
                            <li>商店版 與 免安裝版 功能上沒有差異</li>
                            <li>商店版 可以透過商店來進行更新，且刪除 Tiefsee 後不會留下任何資料</li>
                            <li>免安裝版 需要安裝 <a class="link" target="_blank" href="https://dotnet.microsoft.com/en-us/download/dotnet/8.0">.NET Desktop Runtime 8 (x64)</a> 才能運行</li>
                            <li>免安裝版 可以使用「便攜模式」 ，在 Tiefsee.exe 旁邊新建一個 PortableMode 資料夾，資料就都會儲存在裡面</li>
                        </ul>
                        沒有特別需求的話，推薦使用商店版
                    `,
                    "en": `
                        <ul>
                            <li>There is no functional difference between the Store and Portable versions</li>
                            <li>The Store version can be updated through the store and will not leave any data after Tiefsee is deleted</li>
                            <li>The Portable version requires the installation of <a class="link" target="_blank" href="https://dotnet.microsoft.com/en-us/download/dotnet/8.0">.NET Desktop Runtime 8 (x64)</a> to run</li>
                            <li>The Portable version can use 'portable mode' by creating a PortableMode folder next to Tiefsee.exe, and all data will be stored inside</li>
                        </ul>
                        If there are no special requirements, it is recommended to use the Store version
                    `,
                }
            },
            "storeVersionLarger": {
                title: {
                    "zh-TW": "為什麼 商店版 比 免安裝版 還要大？",
                    "en": "Why is the Store version larger than the Portable version?",
                },
                text: {
                    "zh-TW": `
                        商店版 在編譯的時候會把 .NET 的執行環境整個打包進程式裡面，微軟目前尚未提出有效的解決方案
                    `,
                    "en": `
                        The Store version packages the entire .NET runtime environment into the program during compilation, and Microsoft has not yet proposed an effective solution
                    `,
                }
            },
            "dataCollection": {
                title: {
                    "zh-TW": "Tiefsee 是否會收集使用者資料？",
                    "en": "Does Tiefsee collect user data?",
                },
                text: {
                    "zh-TW": `
                        Tiefsee 不會收集使用者的任何資料，<br>
                        不過使用「搜圖」時，Tiefsee 會先把圖片上傳至
                        <a class="link" target="_blank" href="https://github.com/hbl917070/TiefseeSearchImageServer/blob/master/routes/imgSearch.js">暫存圖片的伺服器</a>，
                        然後才上傳至第三方的圖片搜尋引擎，<br>
                        在伺服器上的圖片副本，會在 60 秒後永久刪除。
                    `,
                    "en": `
                        Tiefsee does not collect any user data,<br>
                        However, when using 'Image Search', Tiefsee will first upload the image to
                        <a class="link" target="_blank" href="https://github.com/hbl917070/TiefseeSearchImageServer/blob/master/routes/imgSearch.js">a temporary image server</a>,
                        and then upload it to a third-party image search engine,<br>
                        The image copy on the server will be permanently deleted after 60 seconds.
                    `,
                }
            },

            "webView2Error": {
                title: {
                    "zh-TW": "啟動程式時顯示「WebView2 must be installed to run this application」",
                    "en": "Program displays 'WebView2 must be installed to run this application' when starting",
                },
                text: {
                    "zh-TW": `
                        可能的原因如下：
                        <ul>
                            <li>電腦尚未安裝 WebView2：「<a class="link" target="_blank" href="https://go.microsoft.com/fwlink/p/?LinkId=2124703">點此</a>」進行下載</li>
                            <li>已經安裝 WebView2 但安裝失敗：移除舊的 WebView2 後，對「WebView2 的安裝檔」右鍵→系統管理員身份執行</li>
                            <li>WebView2 初始化錯誤：避免在 Tiefsee 的路徑裡面包含中文日文韓文之類的特殊字元</li>
                        </ul>
                    `,
                    "en": `
                        Possible reasons are:
                        <ul>
                            <li>WebView2 is not installed on the computer: '<a class="link" target="_blank" href="https://go.microsoft.com/fwlink/p/?LinkId=2124703">Click here</a>' to download</li>
                            <li>WebView2 is installed but failed to install: Remove the old WebView2, then right-click on 'WebView2 installer' and run as administrator</li>
                            <li>WebView2 initialization error: Avoid special characters such as Chinese, Japanese, and Korean in the Tiefsee path</li>
                        </ul>
                    `,
                }
            },
            "aeroAcrylicError": {
                title: {
                    "zh-TW": "使用毛玻璃(AERO、Acrylic)視窗效果後產生異常",
                    "en": "Abnormalities occur after using frosted glass (AERO, Acrylic) window effects",
                },
                text: {
                    "zh-TW": `
                        毛玻璃視窗效果並非 Windows 正式公開的 API，這項功能在某些裝置上可能存在 BUG，或是無法使用。常見的問題為：
                        <ul>
                            <li>模糊區域溢出到視窗外</li>
                            <li>Tiefsee 的視窗在移動時嚴重延遲</li>
                        </ul>
                    `,
                    "en": `
                        The frosted glass window effect is not an officially released API of Windows. This feature may have bugs or be unusable on some devices. Common problems include:
                        <ul>
                            <li>The blurred area overflows outside the window</li>
                            <li>Tiefsee's window is severely delayed when moving</li>
                        </ul>
                    `,
                }
            },

        },
    },
}