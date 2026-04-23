import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import ejs from 'gulp-ejs';
import rename from 'gulp-rename';
import gulpEsbuild from 'gulp-esbuild';
import sassFactory from 'gulp-sass';
import * as sassCompiler from 'sass';
import { I18n } from "./I18n.js";
import { langData } from "./I18n.js";

const sass = sassFactory(sassCompiler);
var i18n = new I18n();
i18n.setData(langData);

// scss 轉 css
gulp.task("scss", () => {
    return gulp.src("./scss/**/*.scss") // 指定要處理的 Scss 檔案目錄
        .pipe(sass({
            //outputStyle: "compressed", // 壓縮
        }).on("error", sass.logError))
        .pipe(gulp.dest("./css")) // 指定編譯後的 css 檔案目錄
});

// ejs 轉 html
gulp.task("ejs", async () => {
    const arLang = [
        { lang: "en", dest: "./" },
        { lang: "en", dest: "./en/" },
        { lang: "zh-TW", dest: "./zh-TW/" },
    ];
    const arSrc = [
        "./ejs/index.ejs",
        "./ejs/plugin.ejs", // 擴充套件
        "./ejs/support.ejs", // 常見問題
    ];

    const streams = [];

    for (let i = 0; i < arLang.length; i++) {
        const lang = arLang[i].lang;
        const dest = arLang[i].dest;
        for (let j = 0; j < arSrc.length; j++) {
            const src = arSrc[j];
            const urlRoot = '.'.repeat(dest.match(/[/]/g).length);

            streams.push(new Promise((resolve, reject) => {
                gulp.src(src)
                    .pipe(ejs({
                        readFile: readFile,
                        lang: lang,
                        root: urlRoot,
                        t: (key, value) => { return i18n.t(key, value, lang) },
                    }, { async: true }))
                    .on("error", reject)
                    .pipe(rename({ extname: ".html" })) // 修改輸出的副檔名
                    .pipe(gulp.dest(dest))
                    .on("end", resolve)
                    .on("error", reject);
            }));
        }
    }

    return Promise.all(streams);
});

// ts 轉 js
gulp.task("ts", async () => {
    return new Promise((resolve, reject) => {
        gulp.src("./ts/app.ts")
            .pipe(gulpEsbuild({
                // minify: true, // 壓縮
                outfile: path.basename("./ts/app.ts", ".ts") + ".js",
                bundle: true,
            }))
            .on("error", reject)
            .pipe(gulp.dest("./js"))
            .on("end", resolve)
            .on("error", reject);
    });
});

// 打包 - 持續監控檔案變化
gulp.task("watch", gulp.series("scss", "ts", "ejs", () => {
    gulp.watch("./scss/**/*.scss", gulp.series("scss"));
    gulp.watch("./ts/**/*.ts", gulp.series("ts"));
    gulp.watch("./ejs/**/*.ejs", gulp.series("ejs"));
}));

// 打包 - 單次
gulp.task("build", gulp.series(
    "ejs",
    "scss",
    "ts",
));

// ------------------------------------------------


/**
 * 讀取文字檔(用於ejs匯入svg
 * @param {*} path 
 * @returns 
 */
async function readFile(path) {
    let t = await new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", function (err, data) {
            if (err) {
                resolve("");
                return;
            }
            resolve(data); // 繼續往下執行
        });
    })
    return t;
}
