export default class car {
    constructor(velocity, position, angle, road){
        this.position = position,
        this.velocity = velocity,
        this.angle = angle,
        this.road = road,
        this.car = undefined
    }

    move = (time)=>{
        this.position.x+=this.velocity.x*time
        this.position.y+=this.velocity.y*time
        this.car.x = this.position.x
        this.car.y = this.position.y
    }

    turn = (r) =>{
        this.angle += r
        this.car.rotation = this.angle
    }
    
    create = (PIXI, app) =>{
        const setup =()=>{
            this.car = new PIXI.Sprite(
                PIXI.loader.resources["car.svg"].texture
            )
            app.stage.addChild(this.car)
            this.car.anchor.x = 0.5
            this.car.x = this.position.x
            this.car.y = this.position.y
            this.car.height = window.innerWidth/25
            this.car.width = window.innerWidth/35
            if(this.road == 0){
                this.car.rotation = 2
                this.angle = 2
            }
            else{
                this.car.rotation = -2
                this.angle = -2
            }
        }
        PIXI.loader
        .add("car.svg")
        .load(setup)

    }
}