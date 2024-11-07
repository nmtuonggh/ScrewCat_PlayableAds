import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'ScrewAnim' )
export class ScrewAnim extends Component
{
    public anim: Animation | null = null;

    private _callback: Function = null;

    protected onLoad (): void
    {
        this.anim = this.getComponent( Animation );
        // this.anim.on("finished", this.onAnimCompleted, this);
    }

    public ScrewOut (): void
    {
        //this._callback = callback;
        this.anim.play( 'ScrewOut' );
    }

    public ScrewIn (): void
    {
        //this._callback = callback;
        this.anim.play( 'ScrewIn' );
    }

    public PlayTutorial (): void
    {
        //tôi chỉ muốn play anim này khi nó không bị null
        if ( this.anim.clips.length > 6 )
        {
            this.anim.play( 'TutorialScrew' );
        }
    }

    public ScrewBlock ( axis: Number ): void
    {
        switch ( axis )
        {
            case 0:
                this.anim.play( 'top' );
                break;
            case 1:
                this.anim.play( 'bot' );
                break;
            case 2:
                this.anim.play( 'left' );
                break;
            case 3:
                this.anim.play( 'right' );
                break;
        }
    }

    private onAnimCompleted (): void
    {
        this._callback && this._callback();
    }
}


