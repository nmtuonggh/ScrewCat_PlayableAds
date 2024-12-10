import { _decorator, color, Component, Node, Sprite } from 'cc';
import { Box } from '../HoleContainer/Box/Box';
import { Screw } from '../Screw/Screw';
import { tween } from 'cc';
import { Vec3 } from 'cc';
import { AudioManager } from '../../../../PA_iKame (1)/base-script/Manager/AudioManager';
import { AudioController, AudioType } from '../../AudioController/AudioController';
import { eColorType } from '../../GameConfig/GameColorConfig';
import { getGameSystem } from '../../GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'Hole' )
export class Hole extends Component
{
    @property( Node )
    warning: Node = null;

    public Box: Box = null;

    public isLinked: boolean = false;
    public linkingScrew: Screw = null;

    private _colorType: eColorType;

    public get ColorType (): eColorType
    {
        return this._colorType;
    }

    public IsFree (): boolean 
    {
        return this !== null;
    }

    public ShowWarning ()
    {
        const tweenSequence = tween( this.warning );

        for ( let i = 0; i < 3; i++ )
        {
            tweenSequence
                .to( 0.25, { scale: new Vec3( 1.5, 1.5, 1.5 ) } )
                .call( () => { getGameSystem().AudioController.playWarning(); } )
                .to( 0.25, { scale: new Vec3( 0.3, 0.3, 0.3 ) } )
        }

        tweenSequence.start();
    }
}


