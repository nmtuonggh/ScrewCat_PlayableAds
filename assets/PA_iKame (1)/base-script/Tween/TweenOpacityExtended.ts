import { tween } from 'cc';
import { UIOpacity } from 'cc';
import { Widget } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TweenOpacityExtended')
export class TweenOpacityExtended extends Component {
    @property
    delay: number = 1
    @property
    duration : number = 0.5;
    @property
    loop : boolean = false;
    @property
    from = 255
    @property
    to = 255

    protected start(): void {
        this.ActionTween();
    }
    ActionTween(){
        this.node.getComponent(Widget).enabled = false;
        if(this.loop){
            tween(this.node.getComponent(UIOpacity))
            .set( {opacity: this.from})
            .delay(this.delay)
            .to(this.duration, {opacity: this.to} , {easing: "smooth"})
            .to(this.duration, {opacity: this.from} , {easing: "smooth"})
            .union()
            .repeatForever()
            .start();
        }else{
            tween(this.node.getComponent(UIOpacity))
            .set( {opacity: this.from})
            .delay(this.delay)
            .to(this.duration, {opacity: this.to} , {easing: "smooth"})
            .start();
        }
        
    }
}


