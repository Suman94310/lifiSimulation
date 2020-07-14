console.log("blyat")
window.onload= ()=>{
    console.log("started")
    var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
     
    var engine = Engine.create();
    
    console.log(window.innerHeight)
    let map = []

    for(let i=0; i<31; i++){
        map.push([])
        for(let j=0; j<31; j++){
            map[i].push(0)
        }
    }

    var render = Render.create({
                    element: document.body,
                    engine: engine,
                    options: {
                        width: window.innerWidth,
                        height: window.innerHeight,
                        wireframes: false
                    }
                });

    console.log(map.length, map[0].length)
    for(let i=0; i<map.length; i++){
        for(let j=0; j<map[0].length; j++){
            if(map[i][j]===0){
                map[i][j] = Bodies.rectangle(j*20+5,i*20+5, 19, 19, {isStatic: true})
            }
        }
    }
             
    for(let i=0; i<map.length; i++){
        for(let j=0; j<map[0].length; j++){
            if(map[i][j]!==1){
                World.add(engine.world,map[i][j])
            }
        }
    }
  
    Engine.run(engine);
    Render.run(render);
}