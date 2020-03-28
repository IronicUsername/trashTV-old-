document.addEventListener('DOMContentLoaded', function() {setBkg()}, false);
window.setInterval(function(){setBkg()}, 10000);  // call all 10 seconds
document.onkeydown = function(e){_checkKey(e.keyCode)};

var inLightMode = false;


/**
 * Get API pic data.
 * @function _getArchiData
 * @returns Dict[str, str]
 */
async function _getArchiData(){
    const url='https://archi.trash-economy.io/getTV';
    let resp = await fetch(url);
    let data = await resp.json()
    return data;
}


/**
 * Set the background property for the children of div.#bkg.
 * @function setBkg
 */
async function setBkg(){
    const bkgElemRoot = document.getElementById('bkg');
    let bkg = bkgElemRoot.firstElementChild;
    let fg = bkgElemRoot.children[1];

    let kaka = await _getArchiData();
    bkg.style.backgroundImage = "url("+kaka['screenbg']+")";
    fg.style.backgroundImage = "url("+kaka['screenfg']+")";
    setTimeout(function(){
        bkg.style.backgroundImage = "url("+kaka['buffer']+")";
        fg.style.backgroundImage = "url("+kaka['buffer']+")";
    }, 5000);  // read from the buffer every 5 seconds/half the time; save API calls

}

/**
 * Checks which key was pressed and calls according function.
 * [SPACE] = toggle between relax mode light and fullscreen
 * @function _checkKey
 * @param keyCode Keyboard Code
 */
function _checkKey(keyCode){
    if(keyCode == 32){
        _toggleBox();
        _toggleBkg();
        if(_checkFullscreen && !inLightMode) _toggleFullscreen();
    }
}


/**
 * Chill out.
 * @function relaxMode
 * @param goFullscreen: bool = decides if it goes into fullscreen or not
 */
function relaxMode(goFullscreen){
    this.inLightMode = true;
    _toggleBkg();
    _toggleBox();
    if(goFullscreen) _toggleFullscreen(), this.inLightMode = false;
}


/**
 * Toggle visibility of the box.
 * @function _toggleBox
 */
function _toggleBox(){
    let box = document.getElementById('box-root');

    if(box.style.display == 'block')box.style.display = 'none';
    else box.style.display = 'block';
}


/**
 * Toggle width and height of the background pics/gifs.
 * @function _toggleBkg
 */
function _toggleBkg(){
    let bkgRoot = document.getElementById('bkg');
    let bkgWidth = bkgRoot.style.width;
    let bkgHeight = bkgRoot.style.height;

    if((bkgWidth != '100%') && (bkgHeight != '100%')){
        bkgRoot.style.width = '100%';
        bkgRoot.style.height = '100%';
    }else{
        bkgRoot.style.removeProperty('width');
        bkgRoot.style.removeProperty('height');
    }
}


/**
 * Check if page is fullscreen.
 * @function _checkFullscreen
 */
function _checkFullscreen(){
    let isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
    return isFullscreen ? true : false;
}


/**
 * Toggle fullscreen.
 * @function _toggleFullscreen
 */
function _toggleFullscreen(){
    let webRoot = document.body;

    webRoot.requestFullScreen = webRoot.requestFullScreen || webRoot.webkitRequestFullScreen || webRoot.mozRequestFullScreen || document.msRequestFullscreen || function () { return false; };
    document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen || function () { return false; };
    _checkFullscreen() ? document.cancelFullScreen() : webRoot.requestFullScreen();
}


/**
 * Check what browser is used.
 * @function _checkBrowser
 * @return str
 */
function _checkBrowser(){
    let isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    let isFirefox = typeof InstallTrigger !== 'undefined';
    let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
    let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    let isIE = /*@cc_on!@*/false || !!document.documentMode;
    let isEdge = !isIE && !!window.StyleMedia;
    let isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

    switch(true){
        case isOpera: return 'opera';
        case isFirefox: return 'firefox';
        case isSafari: return 'safari';
        case isChrome: return 'chrome';
        case isIE: return 'ie';
        case isEdge: return 'edge';
        case isEdgeChromium: return 'edgeCHROME';
        default: return 'unknown';
    }
}
