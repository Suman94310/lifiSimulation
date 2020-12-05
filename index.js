window.onload = ()=>{
    console.log("lol")
    const PIXI = window.PIXI
    console.log(PIXI)
    let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
        type = "canvas"
    }

    PIXI.utils.sayHello(type)
    let app = new PIXI.Application({
        width: window.innerWidth, 
        height: window.innerHeight,
        antialias: true,
        transparent: false,
        resolution: 1
    });
    document.body.appendChild(app.view);
}