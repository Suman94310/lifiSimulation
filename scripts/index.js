window.onload = () =>{
    const PIXI = window.PIXI
    let app = new PIXI.Application(
        {
            width: 730,
            height: 600,
            backgroundColor: 0xAAAAAA
        }
    )

    document.getElementById("canvas").appendChild(app.view)

    // road

    let road = new PIXI.Sprite.from("../images/road.svg")
    road.anchor.set(0.5)
    road.scale.set(1.5,1.5)
    road.x = app.view.width/2
    road.y = app.view.height/2

    app.stage.addChild(road)

    // speed
    let speed = 0.3

    // vehicles
    let vehicles = []

    let vehiclesSprite = []

    // traffic light
    let trafficLight = {
        up: undefined,
        down: undefined
    }
    let up = trafficLight.up
    let upCount = 0
    let upEmergency = 0
    let down = trafficLight.up
    let downCount = 0
    let downEmergency = 0
    // main loop

    app.ticker.add((delta)=>{
        // starting everything with undefined
        trafficLight.up = undefined,
        trafficLight.down = undefined
        
        for(let i=0; i<vehicles.length; i++){
            vehicles[i].forward = undefined
            vehicles[i].backward = undefined
        }



        // check forward backward
        for(let i=0; i<vehicles.length; i++){
            for(let j=0; j<vehicles.length; j++){
                if (i !=j){
                    if (vehicles[i].pos.x < vehicles[j].pos.x && Math.pow(Math.pow(vehicles[i].pos.x-vehicles[j].pos.x,2) + Math.pow(vehicles[i].pos.y-vehicles[j].pos.y,2),0.5) < 200 && vehicles[i].lane == vehicles[j].lane){
                        vehicles[i].forward = vehicles[j]
                        vehicles[j].backward = vehicles[i]
                    }
                }
            }
        }

        for(let i=0; i<vehicles.length; i++){
            if(vehicles[i].forward && Math.pow(Math.pow(vehicles[i].forward.pos.x - vehicles[i].pos.x,2) + Math.pow(vehicles[i].forward.pos.x - vehicles[i].pos.x,2),0.5)< 110 && vehicles[i].tag == "car" && vehicles[i].forward.tag == "car"){
                console.log("dss")
                vehicles[i].velocity = {x:0, y:0}
            }
            else if(vehicles[i].pos.x >app.view.width/2){
                vehicles[i].angle = 0
                // vehicles[i].turn = Math.PI - vehicles[i].angle > 0 ? 0.1:-0.1
                if (vehicles[i].tag == "emergency")
                    vehicles[i].velocity = {x:speed*1.5, y:0}
                else
                    vehicles[i].velocity = {x:speed, y:0}
                vehicles[i].lane = 0
            }
            else if(vehicles[i].angle == Math.PI/6){
                if(vehicles[i].tag=="emergency"){
                    vehicles[i].velocity= {x: speed*Math.sin(Math.PI/3)*1.5, y: speed*Math.sin(Math.PI/6)*1.5}
                }
                else
                    vehicles[i].velocity= {x: speed*Math.sin(Math.PI/3), y: speed*Math.sin(Math.PI/6)}
            }
            else if(vehicles[i].angle == Math.PI*3/2+Math.PI/3 ){
                if(vehicles[i].tag=="emergency"){
                    vehicles[i].velocity= {x: speed*Math.sin(Math.PI/3)*1.5, y: -speed*Math.sin(Math.PI/6)*1.5}
                }
                else
                    vehicles[i].velocity= {x: speed*Math.sin(Math.PI/3), y: -speed*Math.sin(Math.PI/6)}
            }

            
        }

        // traffic light update
        for(let i=0; i<vehicles.length; i++){
            if(vehicles[i].pos.x < app.view.width/2 && app.view.width/2 - vehicles[i].pos.x < 100){
                // console.log("df")
                if(vehicles[i].angle == Math.PI/6 && trafficLight.up==undefined){
                    trafficLight.up = vehicles[i]
                }
                else if (vehicles[i].angle == Math.PI*3/2+Math.PI/3 && trafficLight.down==undefined){
                    trafficLight.down = vehicles[i]
                }
            }
        }

        // traffic light weight
        up = trafficLight.up
        upCount = 0
        upEmergency = 0
        while(up){
            upCount+=1
            if(up.tag == "emergency"){
                upEmergency+=1
            }
            up = up.backward
        }

        down = trafficLight.down
        downCount = 0
        downEmergency = 0
        while(down){
            downCount+=1
            if(down.tag == "emergency"){
                downEmergency+=1
            }
            down = down.backward
        }

        if(upEmergency > downEmergency){
            // console.log(1,trafficLight.up,trafficLight.down)

            if(trafficLight.down){
                trafficLight.down.velocity = {x:0, y:0}
            }
        }
        else if(upEmergency < downEmergency){
            // console.log(2,trafficLight.up,trafficLight.down)

            if(trafficLight.up){
                trafficLight.up.velocity = {x:0, y:0}
            }
        }
        else if(upCount > downCount){
            // console.log(4,trafficLight.up,trafficLight.down)

            if(trafficLight.down){
                trafficLight.down.velocity = {x:0, y:0}
                // console.log("sda",trafficLight.down.velocity.x, vehicles)
            }
        }
        else{
            // console.log(3,trafficLight.up,trafficLight.down)

            if(trafficLight.up){
                trafficLight.up.velocity = {x:0, y:0}
            }
        }

        // if (vehicles.length)
        // console.log(vehicles)
        // if(upCount){
        //     console.log("upp")
        // }
        // console.log(upCount,downCount)
        // if(trafficLight.up)
        // console.log(trafficLight.up.id)
        // vehicles.forEach(vehicle =>{console.log(vehicle.id, vehicle.velocity)})

        // ambulance reaction for vehicle

        for (let i=0; i<vehicles.length; i++){
            if(vehicles[i].tag == "emergency" && vehicles[i].forward && vehicles[i].forward.parked == false && vehicles[i].forward.pos.x - vehicles[i].pos.x < 60){
                console.log("rer",i,vehicles[i].tag)
                // if(vehicles[i].forward.velocity.y > 0){
                    // vehicles[i].forward.velocity.y += 1*speed
                    vehicles[i].forward.parked = true
                    vehicles[i].forward.pos.y+=30
                    let vehicle = vehicles[i].forward
                    setTimeout(()=>{
                        console.log("yoo")
                        vehicle.pos.y-=30
                    },4500/speed)
                // }
            }
        }

        // for(let i=0; i<vehicles.length; i++){
        //     if(vehicles[i].parked){
        //         if(vehicles[i].pos.x >app.view.width/2){
        //             vehicles[i].angle = 0
        //             // vehicles[i].turn = Math.PI - vehicles[i].angle > 0 ? 0.1:-0.1
        //             vehicles[i].velocity = {x:speed, y:speed}
        //             vehicles[i].lane = 0
        //         }
        //         else if(vehicles[i].angle == Math.PI/6){
        //             if(vehicles[i].tag=="emergency"){
        //                 vehicles[i].velocity= {x: speed*Math.sin(Math.PI/3)*1.5, y: speed*Math.sin(Math.PI/6)*1.5}
        //             }
        //             else
        //                 vehicles[i].velocity= {x: speed*Math.sin(Math.PI/3), y: speed*Math.sin(Math.PI/6)}
        //         }
        //         else if(vehicles[i].angle == Math.PI*3/2+Math.PI/3 ){
        //             if(vehicles[i].tag=="emergency"){
        //                 vehicles[i].velocity= {x: speed*Math.sin(Math.PI/3)*1.5, y: -speed*Math.sin(Math.PI/6)*1.5}
        //             }
        //             else
        //                 vehicles[i].velocity= {x: speed*Math.sin(Math.PI/3), y: -speed*Math.sin(Math.PI/6)}
        //         }
        //     }
        // }

        // animation
        for(let i=0; i<vehicles.length; i++){
            // vehicles[i].angle -=delta*vehicles[i].turn
            vehiclesSprite[i].rotation = vehicles[i].angle
            vehicles[i].pos = {x: vehicles[i].pos.x+ vehicles[i].velocity.x*delta, y: vehicles[i].pos.y+ vehicles[i].velocity.y*delta}
            vehiclesSprite[i].x = vehicles[i].pos.x
            vehiclesSprite[i].y = vehicles[i].pos.y
        }
    })


    // controller

    // adding vehicles
    document.getElementById("car1").onclick = (e)=>{
        vehicles.push({
            parked: false,
            lane: 1,
            id:vehicles.length,
            pos: {x: app.view.width/2 - 400*Math.sin(Math.PI/3), y: app.view.height/2 - 400*Math.sin(Math.PI/6)},
            velocity: {x: speed*Math.sin(Math.PI/3), y: speed*Math.sin(Math.PI/6)},
            tag: "car",
            angle: Math.PI/6,
            turn: 0,
            forward: undefined,
            backward: undefined
        })
        vehiclesSprite.push(new PIXI.Sprite.from("../images/blue.png"))
        vehiclesSprite[vehiclesSprite.length-1].anchor.set(0.5)
        vehiclesSprite[vehiclesSprite.length-1].scale.set(0.05,0.05)
        vehiclesSprite[vehiclesSprite.length-1].x = vehicles[vehicles.length-1].pos.x
        vehiclesSprite[vehiclesSprite.length-1].y = vehicles[vehicles.length-1].pos.y
        vehiclesSprite[vehiclesSprite.length-1].rotation = vehicles[vehicles.length-1].angle
        app.stage.addChild(vehiclesSprite[vehiclesSprite.length-1])
    }

    document.getElementById("ambulance1").onclick = (e)=>{
        vehicles.push({
            parked: false,
            lane: 1,
            id:vehicles.length,
            pos: {x: app.view.width/2 - 400*Math.sin(Math.PI/3), y: app.view.height/2 - 400*Math.sin(Math.PI/6)},
            velocity: {x: speed*Math.sin(Math.PI/3)*1.5, y: speed*Math.sin(Math.PI/6)*1.5},
            tag: "emergency",
            angle: Math.PI/6,
            turn: 0,
            forward: undefined,
            backward: undefined
        })
        vehiclesSprite.push(new PIXI.Sprite.from("../images/ambulance.svg"))
        vehiclesSprite[vehiclesSprite.length-1].anchor.set(0.5)
        vehiclesSprite[vehiclesSprite.length-1].scale.set(0.2,0.2)
        vehiclesSprite[vehiclesSprite.length-1].x = vehicles[vehicles.length-1].pos.x
        vehiclesSprite[vehiclesSprite.length-1].y = vehicles[vehicles.length-1].pos.y
        vehiclesSprite[vehiclesSprite.length-1].rotation = vehicles[vehicles.length-1].angle
        app.stage.addChild(vehiclesSprite[vehiclesSprite.length-1])
    }



    document.getElementById("car2").onclick = (e)=>{
        vehicles.push({
            parked: false,
            lane: 2,
            id:vehicles.length,
            pos: {x: app.view.width/2 - 400*Math.sin(Math.PI/3), y: app.view.height/2 + 400*Math.sin(Math.PI/6)},
            velocity: {x: speed*Math.sin(Math.PI/3), y: -speed*Math.sin(Math.PI/6)},
            tag: "car",
            angle: Math.PI*3/2+Math.PI/3,
            turn: 0,
            forward: undefined,
            backward: undefined
        })
        vehiclesSprite.push(new PIXI.Sprite.from("../images/blue.png"))
        vehiclesSprite[vehiclesSprite.length-1].anchor.set(0.5)
        vehiclesSprite[vehiclesSprite.length-1].scale.set(0.05,0.05)
        vehiclesSprite[vehiclesSprite.length-1].x = vehicles[vehicles.length-1].pos.x
        vehiclesSprite[vehiclesSprite.length-1].y = vehicles[vehicles.length-1].pos.y
        vehiclesSprite[vehiclesSprite.length-1].rotation = vehicles[vehicles.length-1].angle
        app.stage.addChild(vehiclesSprite[vehiclesSprite.length-1])
    }

    document.getElementById("ambulance2").onclick = (e)=>{
        vehicles.push({
            parked: false,
            lane: 2,
            id:vehicles.length,
            pos: {x: app.view.width/2 - 400*Math.sin(Math.PI/3), y: app.view.height/2 + 400*Math.sin(Math.PI/6)},
            velocity: {x: speed*Math.sin(Math.PI/3)*1.5, y: -speed*Math.sin(Math.PI/6)*1.5},
            tag: "emergency",
            angle: Math.PI*3/2+Math.PI/3,
            turn: 0,
            forward: undefined,
            backward: undefined
        })
        vehiclesSprite.push(new PIXI.Sprite.from("../images/ambulance.svg"))
        vehiclesSprite[vehiclesSprite.length-1].anchor.set(0.5)
        vehiclesSprite[vehiclesSprite.length-1].scale.set(0.2,0.2)
        vehiclesSprite[vehiclesSprite.length-1].x = vehicles[vehicles.length-1].pos.x
        vehiclesSprite[vehiclesSprite.length-1].y = vehicles[vehicles.length-1].pos.y
        vehiclesSprite[vehiclesSprite.length-1].rotation = vehicles[vehicles.length-1].angle
        app.stage.addChild(vehiclesSprite[vehiclesSprite.length-1])
    }


    // changing speed

    document.getElementById("speed").oninput = (e)=>{
        speed = e.target.value
    }
}