import { _decorator, Component, Node } from 'cc';
import { UILose } from '../UI/UILose';
import { OutOfMove } from '../OutOfMove';
import { tween } from 'cc';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'UICanvasScreen' )
export class UICanvasScreen extends Component
{
    @property( UILose )
    public loseScreen: UILose = null;
    @property( OutOfMove )
    public outOfMoveScreen: OutOfMove = null;
    @property( Node )
    public uiFail: Node = null;
    @property( Node )
    public textTapToPlay: Node = null;
    @property( Node )
    public Warning: Node = null;
    
    //#region PUBLIC METHOD
    public tweenFail (): void
    {
        this.uiFail.active = true;
        this.uiFail.scale = new Vec3( 5, 5, 0 );
        tween( this.uiFail )
            .to( 0.5, { scale: new Vec3( 1.5, 1.5, 1 ) } )
            .delay( 1.5 )
            .call( () => { this.uiFail.active = false; } )
            .start();
    }
    public SetIQText ( text: string ): void
    {
        this.loseScreen.setIQtext( text );
    }
    public setLoseUIStatus ( status: boolean ): void
    {
        this.loseScreen.node.active = status;
    }
    public setOutOfMoveUIStatus ( status: boolean ): void
    {
        this.outOfMoveScreen.node.active = status;
        this.scheduleOnce( () =>
        {
            this.outOfMoveScreen.node.active = false;
        }, 2 );
    }
    public setFailUIStatus ( status: boolean ): void
    {
        this.uiFail.active = status;
    }
    public setTextTapToPlayStatus ( status: boolean ): void
    {
        this.textTapToPlay.active = status;
    }
    //#endregion
}


