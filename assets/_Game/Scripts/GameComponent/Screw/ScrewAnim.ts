import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScrewAnim')
export class ScrewAnim extends Component {
    public anim : Animation | null = null;

    private _callback: Function = null;

    protected onLoad (): void
    {
        this.anim = this.getComponent( Animation );
       // this.anim.on("finished", this.onAnimCompleted, this);
    }

    public ScrewOut () : void
    {
        //this._callback = callback;
        this.anim.play('ScrewOut');
    }

    public ScrewIn () : void
    {
        //this._callback = callback;
        this.anim.play('ScrewIn');
    }

    private onAnimCompleted(): void {
        this._callback && this._callback();
    }
}


