import ImageUtils from "./engine/ImageUtils"
import {GameData}  from "./engine/Types"
import SpriteSheet from "./engine/SpriteSheet"
import SpriteSheetSprite from "./engine/SpriteSheetSprite"
import Animation from "./engine/Animation"
import Range from "./engine/Range"
import Sprite from "./engine/Sprite"
import Entity from "./engine/Entity"

class Player extends Entity{

    private sprites: {[direction:string]:Sprite} = {}

    private xPos = 0
    private yPos = 0
    private width: number
    private height: number
    
    private speed = 150
    private velX = 0
    private velY = 0
    
    public async setup(gameData: GameData){

        const spriteSheetImage = await ImageUtils.loadImageFromUrl("http://localhost:4000/static/player_spritesheet.png")
        const spriteSheet = new SpriteSheet(spriteSheetImage, 64, 128)

        const imagePromises = [
            await ImageUtils.loadImageFromUrl("http://localhost:4000/static/player_f00.png"),
            await ImageUtils.loadImageFromUrl("http://localhost:4000/static/player_b00.png"),
            await ImageUtils.loadImageFromUrl("http://localhost:4000/static/player_r00.png")
        ]
        
        const [imageF, imageB, imageR] = await Promise.all(imagePromises)

        this.sprites = {
            idle: new SpriteSheetSprite(spriteSheet, 0, 0),
            forward: new Animation(spriteSheet, Range.rowRange(0,8), 100),
            backward: new Animation(spriteSheet, Range.rowRange(1,8), 100),
            right: new Animation(spriteSheet, Range.rowRange(2,8), 100),
            left: new Animation(spriteSheet, Range.rowRange(2,8), 100, {flippedX:true}),
        }

        this.width = 64
        this.height = 128

    }

    public update(gameData: GameData, delta: number){
        const {keyListener} = gameData
        this.velX = 0
        this.velY = 0
        
        if(keyListener.isAnyKeyDown(["d", "ArrowRight"])){
            this.velX = this.speed * delta
        }
        else if(keyListener.isAnyKeyDown(["q", "a", "ArrowLeft"])){
            this.velX = -(this.speed * delta)
        }

        if(keyListener.isAnyKeyDown(["s", "ArrowDown"])){
            this.velY = this.speed * delta
        }
        else if(keyListener.isAnyKeyDown(["z", "w", "ArrowUp"])){
            this.velY = -(this.speed * delta) 
        }

        this.xPos += this.velX
        this.yPos += this.velY

        this.getMovingSprite().update(gameData, delta)
    }

    public render(gameData: GameData){
        this.getMovingSprite().render(gameData, this.xPos, this.yPos, this.width, this.height)
    }

    private getMovingSprite(){
        if(this.velX === 0 && this.velY === 0) return this.sprites["idle"]
        if(this.velX > 0) return this.sprites["right"]
        if(this.velX < 0) return this.sprites["left"]
        if(this.velY < 0) return this.sprites["backward"]
        return this.sprites["forward"]
    }

}

export default Player