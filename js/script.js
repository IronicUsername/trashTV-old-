async function getArchiData(){
    const url='https://archi.trash-economy.io/getTV';
    let resp = await fetch(url);
    let data = await resp.json()
    return data;
}

async function setBkg(){
    const delay = 5000;
    const bkgElemRoot = document.getElementById('bkg');
    let bkg = bkgElemRoot.firstElementChild;
    let fg = bkgElemRoot.children[1];

    let kaka = await getArchiData();
    bkg.style.backgroundImage = "url("+kaka['screenbg']+")";
    fg.style.backgroundImage = "url("+kaka['screenfg']+")";
    setTimeout(function(){
        bkg.style.backgroundImage = "url("+kaka['buffer']+")";
        fg.style.backgroundImage = "url("+kaka['buffer']+")";
    }, 5000);  // read from the buffer; save API calls

}

document.addEventListener('DOMContentLoaded', function() {setBkg()}, false);
window.setInterval(function(){setBkg()}, 10000);  // rebuild all 10 seconds


function relaxMode(el, fullScreen, rmBox=false){
    let element = el.parentNode.parentNode;
    let bkgRoot = document.getElementById('bkg');
    let bgStyle = bkgRoot.children[0];
    let fgStyle = bkgRoot.children[1];

    if(!document.fullscreenElement){
        if(fullScreen){
            if(rmBox) element.removeChild(el.parentNode);
            _launchFullScreen(document.documentElement);
        }
        bkgRoot.style.width = '100%';
        bkgRoot.style.height = '100%';
        bkgRoot.style.transition = '.2s all ease-in-out';
        element.style.display = 'none';
    }

    document.body.onkeyup = function(e){
        if((e.keyCode = 32) || (e.keyCode = 27)){
            if(!rmBox){
                bkgRoot.style.removeProperty('width');
                bkgRoot.style.removeProperty('height');
                element.style.display = 'initial';
                if(document.fullscreenElement) document.webkitExitFullscreen();
            }
        }
    }
}

function _launchFullScreen(element) {
    if(element.requestFullScreen) {
      element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }
