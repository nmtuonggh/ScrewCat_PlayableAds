import { _decorator, CCBoolean, Component, Node } from 'cc';
import { HoleContainer } from '../HoleContainer';
import { HoleColor } from '../../Hole/HoleColor';
import { eColorType } from '../../../GameConfig/GameColorConfig';
import { Hole } from '../../Hole/Hole';
import { BoxRenderer } from './BoxRenderer';
const { ccclass, property } = _decorator;

@ccclass( 'Box' )
export class Box extends HoleContainer
{
    
    private boxRenderer: BoxRenderer = null;
    //#endregion

    protected onLoad (): void
    {
        this.listHoles = this.getComponentsInChildren( HoleColor );
        this.boxRenderer = this.getComponent( BoxRenderer );
    }

    public GetFreeHole ( colorType: eColorType ): Hole
    {
        if ( this.boxRenderer.ColorType != colorType ) return null;

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


