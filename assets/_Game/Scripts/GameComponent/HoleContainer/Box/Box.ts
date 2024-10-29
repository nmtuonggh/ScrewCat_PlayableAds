import { _decorator, Component, Node } from 'cc';
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
    protected override onload (): void
    {
        super.onload();
    }

    public GetFreeHole ( colorType: eColorType ) : Hole
    {
        console.log("GetFreeHole");
        if ( this._colorType != colorType ) return null;
        console.log("Same color");

        for(const hole of this._holes)
        {
            if ( hole.IsFree ) return hole;
        }

        return null;
    }
}


