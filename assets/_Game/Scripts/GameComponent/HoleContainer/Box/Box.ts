import { _decorator, CCBoolean, Component, Node } from 'cc';
import { HoleContainer } from '../HoleContainer';
import { HoleColor } from '../../Hole/HoleColor';
import { eColorType } from '../../../GameConfig/GameColorConfig';
import { Hole } from '../../Hole/Hole';
const { ccclass, property } = _decorator;

@ccclass( 'Box' )
export class Box extends HoleContainer
{
    private _colorType: eColorType = eColorType.Blue;

    //#region Encapsulated

    public get ColorType (): eColorType
    {
        return this._colorType;
    }

    public set ColorType ( value: eColorType )
    {
        this._colorType = value; 
    }


    //#endregion

    protected onLoad (): void
    {
        this.listHoles = this.getComponentsInChildren( HoleColor );
    }

    public GetFreeHole ( colorType: eColorType ): Hole
    {
        if ( this._colorType != colorType ) return null;

        for ( const hole of this.listHoles )
        {
            if ( hole.IsFree() && hole.isLinked === false)
            {
                //console.log( "Tim duoc hole: " + hole );
                return hole;
            }
        }

        return null;
    }
}


