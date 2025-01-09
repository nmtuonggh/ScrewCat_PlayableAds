import { tween } from 'cc';
import { easing } from 'cc';
import { TweenEasing } from 'cc';
import { Vec3 } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TweenRotation')
export class TweenRotation extends Component {

    @property
    private duration: number = 0.3
    @property
    private delay = 3
    @property
    private from : Vec3 = new Vec3(0,0,0)
    @property
    private to: Vec3 = new Vec3(0, 0, 0)
    @property
    private repeatForever: boolean = false;
    
    start()
    {
    }

    play()
    {
        this.node.eulerAngles = this.from;
        const tweenRotate = tween(this.node)
            .delay(this.delay)
            .to(this.duration, { eulerAngles: this.to }, { easing: easing.backOut })
        if (this.repeatForever)
            tweenRotate.repeatForever();
        tweenRotate.start();
    }
}


