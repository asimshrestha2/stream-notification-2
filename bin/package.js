var electronPackager = require('electron-packager')
var fs = require('fs')
var pkg = require('../package.json')
var path = require('path')
var zip = require('cross-zip')

var rootPath = path.join(__dirname, "../")
var distPath = path.join(__dirname, "../../build")
var appName = "Stream Notification"
var aName = "Stream-Notification-" + pkg.version

var win = {
    appVersion: pkg.version,
    asar: true,
    dir: rootPath,
    name: "Stream-Notification",
    out: distPath,
    overwrite: true,
    prune: true,
    ignore: /^\/src|^\/dist|\/(appveyor.yml|\.appveyor.yml|\.github|appdmg|AUTHORS|CONTRIBUTORS|bench|benchmark|benchmark\.js|bin|bower\.json|component\.json|coverage|doc|docs|docs\.mli|dragdrop\.min\.js|example|examples|example\.html|example\.js|externs|ipaddr\.min\.js|Makefile|min|minimist|perf|rusha|simplepeer\.min\.js|simplewebsocket\.min\.js|static\/screenshot\.png|test|tests|test\.js|tests\.js|webtorrent\.min\.js|\.[^/]*|.*\.md|.*\.markdown)$/,    
    electronVersion: require('electron/package.json').version,
    platform: 'win32',
    arch: ['ia32', 'x64'],
    win32metadata: {
        CompanyName: appName,
        FileDescription: appName,
        OriginalFilename: appName + '.exe',
        ProductName: appName,
        InternalName: appName
    },
    icon: rootPath + '/images/icon.png'
}
var buildWin = function(){
    var electronInstaller = require('electron-winstaller');
    electronPackager(win, (err, appPaths) => {
        if(err) throw err
        console.log('Windows Package: ' + appPaths)

        appPaths.forEach( (appPath) => {
            console.log("Creating Zip for: ", appPath)
            var inPath = appPath
            var outPath = appPath + ".zip"

            if(outPath.includes("-ia32"))
                outPath = outPath.replace("-ia32", "")

            zip.zipSync(inPath, outPath)
            console.log("Done creating Zip: ", outPath)
        })

        appPaths.forEach( (appPath) => {
            console.log(`Windows: Creating ${appPath} installer...`)

            var sys = "win32"

            if(appPath.includes("x64"))
                sys += "-x64"

            electronInstaller.createWindowsInstaller({
                appDirectory: appPath,
                outputDirectory: path.join(appPath, "../", sys),
                authors: pkg.authors,
                exe: 'Stream-Notification.exe',
                noMsi: true,
                productName: appName,
                title: appName,
                name: 'Stream-Notification',
                setupExe: 'Stream-Notification-Setup-' + pkg.version + '-' + sys + '.exe'
            })
            .then(function(){
                console.log(`Windows installer ${appPath} created`)
            })
        })
    })
}

buildWin();