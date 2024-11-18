import { _decorator, color, Component, Node, Sprite } from 'cc';
import { Box } from '../HoleContainer/Box/Box';
import { Screw } from '../Screw/Screw';
import { tween } from 'cc';
import { Vec3 } from 'cc';
import { AudioManager } from '../../../../PA_iKame (1)/base-script/Manager/AudioManager';
import { AudioController, AudioType } from '../../AudioController/AudioController';
const { ccclass, property } = _decorator;

@ccclass( 'Hole' )
export class Hole extends Component
{

    @property( { type: [ Sprite ] } )
    private sprite: Sprite;
    @property( Node )
    warning: Node = null;

    public Box: Box = null;

    public isLinked: boolean = false;
    @property( { type: Screw } )
    public linkingScrew: Screw = null;


    public IsFree (): boolean 
    {
        console.log( "Hole IsFree" );
        return this !== null;
    }

    public ShowWarning ()
    {
        const tweenSequence = tween( this.warning );

        for ( let i = 0; i < 3; i++ )
        {
            
            tweenSequence
                .to( 0.5, { scale: new Vec3( 1.5, 1.5, 1.5 ) } )
                .to( 0.5, { scale: new Vec3( 0.3, 0.3, 0.3 ) } )
                .call( () => { AudioController.Instance.PlayWarning(); } )
        }

        tweenSequence.start();
    }
}


