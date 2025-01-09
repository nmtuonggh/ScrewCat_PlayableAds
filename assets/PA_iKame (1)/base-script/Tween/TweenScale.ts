import { _decorator, Component, Node, tween, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TweenScale')
export class TweenScale extends Component {
    @property
    initScale : Vec3 = new Vec3(0,0,0)
    @property
    scaleTo : Vec3 = new Vec3(0,0,0);
    @property
    duration : number = 1;
    
    @property
    delay : number = 0;

    @property
    repeatForever : boolean = false;


    start()
    {
       
    }
    
    play()
    {
        this.node.setScale(this.initScale);
        const tweenScale = tween(this.node)
            .delay(this.delay )
            .to(this.duration, { scale: this.scaleTo })
        if (this.repeatForever) {
            tween(this.node)
                .delay(this.delay)
                .repeatForever(
                    tween().to(this.duration, { scale: this.scaleTo })
                )
                .start();
        }
        else {
            tweenScale.start();
        }
    }
}


