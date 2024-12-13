import { _decorator, color, Component, Node, Sprite } from 'cc';
import { Box } from '../HoleContainer/Box/Box';
import { Screw } from '../Screw/Screw';
import { tween } from 'cc';
import { Vec3 } from 'cc';
import { eColorType } from '../../GameConfig/GameColorConfig';
import { getGameSystem } from '../../GameSystem';
import { Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'Hole' )
export class Hole extends Component
{
    
    @property( Node )
    private warning: Node = null;
    @property( Node )
    private vfx: Node = null;

    public Box: Box = null;
    public isLinked: boolean = false;
    public linkingScrew: Screw = null;

    private _colorType: eColorType;
    //#region PROPERTY
    public get ColorType (): eColorType
    {
        return this._colorType;
    }
    public get VFX (): Node
    {
        return this.vfx;
    }
    public set VFX ( value: Node )
    {
        this.vfx = value;
    }
    //#endregion
    public IsFree (): boolean 
    {
        return this !== null;
    }

    public ShowWarning ()
    {
        if(!this.warning) return;
        const tweenSequence = tween( this.warning );
        for ( let i = 0; i < 3; i++ )
        {
            tweenSequence
                .to( 0.25, { scale: new Vec3( 1.8, 1.8, 1.8 ) } )
                .call( () => { getGameSystem().AudioController.playWarning(); } )
                .to( 0.25, { scale: new Vec3( 0.3, 0.3, 0.3 ) } )
        }
        tweenSequence.start();
    }
}


