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
    app.stage.addChild(container)

    let cars = []
    let carsProp = [
        {
            velocity:{x:2,y:1.0},
            position:{x:110,y:70},
            angle: 2,
            road:1
        },
        {
            velocity:{x:2,y:1.0},
            position:{x:110,y:window.innerHeight-70},
            angle: 1,
            road: -1
        }
    ]

    let road1 = [0]
    let road2 = [1]
    let current = 1
    
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
        cars[i].height = window.innerWidth/30
        cars[i].width = window.innerWidth/42
        cars[i].anchor.x = 0.5
        cars[i].x = carsProp[i].position.x
        cars[i].y = carsProp[i].position.y
        cars[i].rotation = carsProp[i].angle
        container.addChild(cars[i])
    }
    let len = cars.length
    

    // main loop

    app.ticker.add((delta)=>{
        // console.log(cars[road1[0]].x)
        len = carsProp.length
        if(road1.length >= road2.length){
            if(road1.length){
                carsProp[road1[0]].velocity = {x:2, y:1.0}
            }
            if(road2.length && carsProp[road2[0]].road && cars[road2[0]].x > window.innerWidth/2 -200){
                carsProp[road2[0]].velocity = {x:0, y:0}
            }
        }
        else{
            if(road2.length){
                carsProp[road2[0]].velocity = {x:2, y:1.0}
            }
            if(road1.length && carsProp[road1[0]].road && cars[road1[0]].x > window.innerWidth/2 -200){
                carsProp[road1[0]].velocity = {x:0, y:0}
            }
        }


        for(let i=0; i<len; i++){

            cars[i].x += carsProp[i].velocity.x*delta
            cars[i].y += carsProp[i].velocity.y*delta*carsProp[i].road

            if(cars[i].x >= window.innerWidth/2-60 && cars[i].rotation*carsProp[i].road > 1.55*carsProp[i].road && carsProp[i].road){
                // cars[i].rotation = cars[i].rotation -0.01*carsProp[i].road
                cars[i].rotation = 1.55
                
                carsProp[i].velocity.y = 0
                if (carsProp[i].road == 1){
                    road1.shift()
                }
                else{
                    road2.shift()
                }
                carsProp[i].road = 0
                
            }
            // if (cars[i].x >= window.innerWidth/2+40){
            //     carsProp[i].road = 0
            // }

            for(let j=0; j<cars.length; j++){
                if(carsProp[i].road ==0 && carsProp[i].velocity.x ==0 && carsProp[i].velocity.y == 0 && Math.abs(cars[j].x-cars[i].x) >70){
                    carsProp[i].velocity = {x:2, y:0}
                }
                if((carsProp[i].road ==1 || carsProp[i].road ==-1) && carsProp[i].velocity.x ==0 && carsProp[i].velocity.y == 0 && Math.abs(cars[j].x-cars[i].x) >70){
                    console.log("bl")
                    carsProp[i].velocity = {x:2, y:1.0}
                }
            }
            for(let j=0; j<cars.length; j++){
                if(i!==j && cars[i].x<cars[j].x && carsProp[i].road == carsProp[j].road && Math.abs(cars[j].x-cars[i].x) <90){
                    console.log("blyat")
                    carsProp[i].velocity = {x:0, y:0}
                    // console.log(carsProp[i], i)
                }
            }
        }
    })

    // creating cars
    
    window.onclick = (e)=>{
        let flag = 1
        if(e.clientY < window.innerHeight/2){
            for(let k=0; k<len; k++){
                console.log(cars[k].x,k)
                if (cars[k].x < 70 && carsProp[k].road==1){
                    flag = 0
                }
            }
            if (flag){
                carsProp.push({
                    velocity:{x:2 ,y:1.0},
                    position:{x:60,y:40 + Math.random()*window.innerHeight/20},
                    angle: 2,
                    road:1
                })
                current+=1
                road1.push(current)
            }
            
        }
        else{
            for(let k=0; k<len; k++){
                if (cars[k].x <130 && carsProp[k].road==-1){
                    flag = 0
                }
            }
            if (flag){
                carsProp.push({
                    velocity:{x:2,y:1.0},
                    position:{x:110,y:window.innerHeight-40 - Math.random()*window.innerHeight/20},
                    angle: 1,
                    road:-1
                })
                current+=1
                road2.push(current)
            }
            
        }
        if (flag){
            const carTexture = PIXI.Texture.from("./car.svg")
        cars.push(new PIXI.Sprite(carTexture))
        cars[cars.length-1].height = window.innerWidth/30
        cars[cars.length-1].width = window.innerWidth/42
        cars[cars.length-1].anchor.x = 0.5
        cars[cars.length-1].x = carsProp[cars.length-1].position.x
        cars[cars.length-1].y = carsProp[cars.length-1].position.y
        cars[cars.length-1].rotation = carsProp[cars.length-1].angle
        container.addChild(cars[cars.length-1])
        }
    }

    // trafficLight
    
}
