window.onload = ()=>{
    const PIXI = window.PIXI
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

    app.renderer.backgroundColor = 0xffffff
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);

    const container = new PIXI.Container()
    // container.x = app.screen.width
    // container.y = app.screen.height
    app.stage.addChild(container)

    let cars = []
    let carsProp = [
        {
            velocity:{x:2,y:1.13},
            position:{x:60,y:40},
            angle: 2,
            road:1
        },
        {
            velocity:{x:2,y:1.13},
            position:{x:60,y:window.innerHeight-40},
            angle: 1,
            road: -1
        }
    ]

    const roadTexture = PIXI.Texture.from("./road.png")

    const road = new PIXI.Sprite(roadTexture)
    road.position.set(0,window.innerHeight)
    road.width = window.innerHeight
    road.height = window.innerWidth
    road.rotation = -1.57
    container.addChild(road)

    for(let i=0; i<carsProp.length; i++){
        const carTexture = PIXI.Texture.from("./car.svg")
        cars.push(new PIXI.Sprite(carTexture))
        cars[i].height = window.innerWidth/25
        cars[i].width = window.innerWidth/35
        cars[i].anchor.x = 0.5
        cars[i].x = carsProp[i].position.x
        cars[i].y = carsProp[i].position.y
        cars[i].rotation = carsProp[i].angle
        container.addChild(cars[i])
    }
    let len = cars.length
    
    app.ticker.add((delta)=>{
        len = cars.length
        for(let i=0; i<len; i++){
            // console.log(i)
            cars[i].x += carsProp[i].velocity.x*delta
            cars[i].y += carsProp[i].velocity.y*delta*carsProp[i].road

            if(cars[i].x >= window.innerWidth/2-60 && cars[i].rotation*carsProp[i].road > 1.55*carsProp[i].road){
                cars[i].rotation = cars[i].rotation -0.01*carsProp[i].road
                carsProp[i].velocity.y = 0
                if (cars[i].x >= window.innerWidth/2+40){
                    carsProp[i].road = 0
                }
            }

            for(let j=0; j<cars.length; j++){
                if(i!==j && cars[i].x<cars[j].x && carsProp[i].road == carsProp[j].road && (cars[j].x-cars[i].x) <200){
                    carsProp[i].velocity = {x:0, y:0}
                }
                else if((carsProp[i].road ==1 || carsProp[i].road ==-1) && carsProp[i].velocity.x ==0 && carsProp[i].velocity.y == 0){
                    carsProp[i].velocity = {x:2, y:1.13}
                }
                else if(carsProp[i].road ==0 && carsProp[i].velocity.x ==0 && carsProp[i].velocity.y == 0){
                    carsProp[i].velocity = {x:2, y:0}
                }
            }
        }
    })
    
    window.onclick = (e)=>{
        if(e.clientY < window.innerHeight/2){
            carsProp.push({
                velocity:{x:2,y:1.13},
                position:{x:60,y:40},
                angle: 2,
                road:1
            })
        }
        else{
            carsProp.push({
                velocity:{x:2,y:1.13},
                position:{x:60,y:window.innerHeight-40},
                angle: 1,
                road:-1
            })
        }
        const carTexture = PIXI.Texture.from("./car.svg")
        cars.push(new PIXI.Sprite(carTexture))
        cars[cars.length-1].height = window.innerWidth/25
        cars[cars.length-1].width = window.innerWidth/35
        cars[cars.length-1].anchor.x = 0.5
        cars[cars.length-1].x = carsProp[cars.length-1].position.x
        cars[cars.length-1].y = carsProp[cars.length-1].position.y
        cars[cars.length-1].rotation = carsProp[cars.length-1].angle
        container.addChild(cars[cars.length-1])
    }
}
