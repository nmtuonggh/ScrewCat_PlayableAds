import { _decorator, Component, Node } from 'cc';
import { GameLayerComponent } from '../GameLayerComponent';
import { eColorType } from '../../GameConfig/GameColorConfig';
import { Hole } from '../Hole/Hole';
const { ccclass, property } = _decorator;

@ccclass( 'Screw' )
export class Screw extends GameLayerComponent
{

    private _colorType: eColorType = eColorType.Blue;

    //#region Encapsulation

    public get ColorType (): eColorType
    {
        return this._colorType;
    }

    public set ColorType ( value: eColorType )
    {
        this._colorType = value;
    }

    //#endregion
    public CheckMove (): void
    {
        if(this.CheckMoveBox()){
            //console.log("Can move to box");
        }
    }

    public CheckMoveBox (): boolean
    {
        let freeBox = this.GameLogic.GetFreeHoleBox( this.ColorType );
        if ( freeBox !== null )
        {
            this.MoveToBoxSlot( freeBox );
            return true;
        }

        return false;
    }

    private MoveToBoxSlot ( hole: Hole ): void
    {
        //console.log( 'MoveToBoxSlot' );
        hole.isLinked = true;
        hole.SetColor();
        this.node.active = false;
    }
}


