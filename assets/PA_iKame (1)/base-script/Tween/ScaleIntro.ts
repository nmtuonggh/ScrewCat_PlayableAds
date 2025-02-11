import { tween } from 'cc';
import { Tween } from 'cc';
import { easing } from 'cc';
import { Vec3 } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'ScaleIntro' )
export class ScaleIntro extends Component
{
    @property
    initScale: Vec3 = new Vec3( 0, 0, 0 )
    @property
    scaleTo: Vec3 = new Vec3( 0, 0, 0 );
    @property
    duration: number = 1;
    @property
    delay: number = 0;
    @property
    repeatForever: boolean = false;
    start ()
    {
    }
    play (): Promise<void>
    {
        this.node.setScale( this.initScale );
        const tweenScale = tween( this.node )
            .delay( this.delay )
            .to( this.duration, { scale: this.scaleTo }, { easing: easing.backOut } );
        if ( this.repeatForever )
        {
            tween( this.node )
                .delay( this.delay )
                .repeatForever(
                    tween().to( this.duration, { scale: this.scaleTo }, { easing: easing.backOut } )
                )
                .start();
        }
        else
        {
            tweenScale.start();
        }
        return new Promise<void>( ( resolve, reject ) =>
        {
            setTimeout( () =>
            {
                resolve();
                Tween.stopAllByTarget( this.node );
            }, ( this.duration + this.delay + 1 ) * 1000 );
        } );
    }
}


