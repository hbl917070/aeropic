/*const fs = require("fs");
const path = require("path");

const gulp = require("gulp");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const gulpEsbuild = require("gulp-esbuild");
const sass = require("gulp-sass")(require("sass"));
*/

import fs from 'fs';
import path from 'path';

import gulp from 'gulp';
import ejs from 'gulp-ejs';
import rename from 'gulp-rename';
import gulpEsbuild from 'gulp-esbuild';
import sassFactory from 'gulp-sass';
import sassCompiler from 'sass';
const sass = sassFactory(sassCompiler);

import { I18n } from "./I18n.js";
import { langData } from "./I18n.js";
var i18n = new I18n();
i18n.setData(langData);

// scss 轉 css
gulp.task("scss", async () => {
    await sleep(1);
    return gulp.src("./scss/**/*.scss") // 指定要處理的 Scss 檔案目錄
        .pipe(sass({
            //outputStyle: "compressed", //壓縮
        }))
        .pipe(gulp.dest("./css")) // 指定編譯後的 css 檔案目錄
});

// ejs 轉 html
gulp.task("ejs", async () => {
    await sleep(1);
    let arLang = [
        { lang: "en", dest: "./" },
        { lang: "en", dest: "./en/" },
        { lang: "zh-TW", dest: "./zh-TW/" },
    ];
    let arSrc = [
        "./ejs/index.ejs",
        "./ejs/plugin.ejs", //擴充套件
        "./ejs/support.ejs", //常見問題
    ];

    for (let i = 0; i < arLang.length; i++) {
        const lang = arLang[i].lang;
        const dest = arLang[i].dest;
        for (let j = 0; j < arSrc.length; j++) {
            const src = arSrc[j];

            let urlRoot = '.'.repeat(dest.match(/[/]/g).length);

            gulp.src(src)
                .pipe(ejs({
                    readFile: readFile,
                    lang: lang,
                    root: urlRoot,
                    t: (key, value) => { return i18n.t(key, value, lang) },
                }, { async: true }))
                .pipe(rename({ extname: ".html" })) //修改輸出的副檔名
                .pipe(gulp.dest(dest))
        }
    }
    /*
    gulp.src("./ejs/index.ejs")
        .pipe(ejs({
            readFile: readFile,
            lang: "en"
        }, { async: true }))
        .pipe(rename({ extname: ".html" })) //修改輸出的副檔名
        .pipe(gulp.dest("./"))
    */
});

// ts 轉 js
gulp.task("ts", async () => {
    await sleep(1);
    return gulp.src("./ts/app.ts")
        .pipe(gulpEsbuild({
            //minify: true, //壓縮
            outfile: "app.js",
            bundle: true,
            //loader: { ".tsx": "tsx", },
        }))
        .pipe(gulp.dest("./js"))
});

//檔案變化時
gulp.task("watch", gulp.series("scss", "ts", "ejs", () => {
    gulp.watch("./scss/**/*.scss", gulp.series("scss"));
    gulp.watch("./ts/**/*.ts", gulp.series("ts"));
    gulp.watch("./ejs/**/*.ejs", gulp.series("ejs"));
}));


//------------------------------------------------


/**
 * 讀取文字檔(用於ejs匯入svg
 * @param {*} path 
 * @returns 
 */
async function readFile(path) {
    let t = await new Promise((resolve, reject) => {
        fs.readFile(path, "utf8", function (err, data) {
            resolve(data); //繼續往下執行
        });
    })
    return t;
}


async function sleep(ms) {
    await new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve(1); //繼續往下執行
        }, ms);
    })
}
