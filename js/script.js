document.addEventListener('DOMContentLoaded', function() {setBkg(), fullScreenEndpoint(), _onMobile()}, false);
window.setInterval(function(){setBkg()}, 10000);  // call all 10 seconds
document.onkeydown = function(e){_checkKey(e.keyCode)};

var inLightMode = false;

// ..######...##........#######..########.....###....##......
// .##....##..##.......##.....##.##.....##...##.##...##......
// .##........##.......##.....##.##.....##..##...##..##......
// .##...####.##.......##.....##.########..##.....##.##......
// .##....##..##.......##.....##.##.....##.#########.##......
// .##....##..##.......##.....##.##.....##.##.....##.##......
// ..######...########..#######..########..##.....##.########

/**
 * Chill out.
 * @function relaxMode
 * @param goFullscreen: bool = decides if it goes into fullscreen or not
 */
function relaxMode(goFullscreen){
    this.inLightMode = true;
    _toggleBkg();
    _toggleBox();
    _toggleMarkedElements();
    if(goFullscreen) _toggleFullscreen(), this.inLightMode = false;
}


/**
 * Set the background property for the children of div.#bkg.
 * @function setBkg
 */
async function setBkg(){
    const bkgElemRoot = document.getElementById('bkg');
    let bkg = bkgElemRoot.firstElementChild;
    let fg = bkgElemRoot.children[1];

    let data = await _getArchiData();
    bkg.style.backgroundImage = "url("+data['screenbg']+")";
    fg.style.backgroundImage = "url("+data['screenfg']+")";
    setId(data['gifid']);
    setTimeout(function(){
        bkg.style.backgroundImage = "url("+data['buffer']+")";
        fg.style.backgroundImage = "url("+data['buffer']+")";
        setId(data['gifid_buffer']);
    }, 5000);  // read from the buffer every 5 seconds/half the time; save API calls
}


function setId(id){
    let gifId = document.getElementById('gif_id');
    let gifLink = gifId.children[0];

    gifLink.text = '#'+id;
    gifLink.href = 'https://archillect.com/'+id;
}

/**
 * Start in fullscreen.
 * Just put ?fullscreen as query parameter.
 * @function fullScreenEndpoint
 */
function fullScreenEndpoint(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    if(urlParams.get('fullscreen') != null){
        relaxMode(false);
    }
}


// .##.....##.########.##.......########..########.########.
// .##.....##.##.......##.......##.....##.##.......##.....##
// .##.....##.##.......##.......##.....##.##.......##.....##
// .#########.######...##.......########..######...########.
// .##.....##.##.......##.......##........##.......##...##..
// .##.....##.##.......##.......##........##.......##....##.
// .##.....##.########.########.##........########.##.....##

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
 * Toggle visibility of the box.
 * @function _toggleBox
 */
function _toggleBox(){
    let box = document.getElementById('box-root');

    if(box.style.visibility == 'visible')box.style.visibility = 'hidden', box.style.opacity = 0, box.style.fontSize = 0;
    else box.style.visibility = 'visible', box.style.opacity = 1, box.style.fontSize = 'initial';
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
 * Toggle fullscreen.
 * @function _toggleFullscreen
 */
function _toggleFullscreen(){
    let webRoot = document.body;

    webRoot.requestFullScreen = webRoot.requestFullScreen || webRoot.webkitRequestFullScreen || webRoot.mozRequestFullScreen || document.msRequestFullscreen || function () { return false; };
    document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen || function () { return false; };
    _checkFullscreen() ? document.cancelFullScreen() : webRoot.requestFullScreen();
}


function _toggleMarkedElements(){
    let markedElements = document.getElementsByClassName('toggle');

    [].forEach.call(markedElements, function(element){
        let direction = element.getAttribute('tt_direction');
        let value = element.getAttribute('tt_value');

        if(element.style.visibility == ''){
            element.style[direction] = value;
            element.style.visibility = 'hidden';
        }else{
            element.style.removeProperty('visibility');
            element.style.removeProperty(direction);
        }
    });
}


/**
 * Checks which key was pressed and calls according function.
 * [SPACE] = toggle between relax mode light and fullscreen
 * @function _checkKey
 * @param keyCode Keyboard Code
 */
function _checkKey(keyCode){
    if(keyCode == 32 && !_onMobile()){
        _toggleBox();
        _toggleBkg();
        _toggleMarkedElements();
        if(_checkFullscreen() && !inLightMode) _toggleFullscreen();
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
 * Check what browser is being used.
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


/**
 * Check if smartphone device is being used.
 * @function _onMobile
 * @return bool
 */
function _onMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true;
    }
    return false;
}
