import { _decorator, Component, Node } from 'cc';
import { BoxSlot } from './BoxSlot';
import { sSingleton } from '../../../../Singleton/sSingleton';
import { eColorType } from '../../../GameConfig/GameColorConfig';
import { Hole } from '../../Hole/Hole';
const { ccclass, property } = _decorator;

@ccclass( 'BoxContainer' )
export class BoxContainer extends sSingleton<BoxContainer>
{
    private boxSlots: BoxSlot[] = [];

    protected override onLoad (): void
    {
        super.onLoad();
        this.boxSlots = this.getComponentsInChildren( BoxSlot );
    }

    public GetFreeBoxSlot (colorType : eColorType): Hole 
    {
        console.log("GetFreeBoxSlot");
        
        for ( const boxSlot of this.boxSlots ) 
        {
            const box = boxSlot.Box;
            console.log(box.node.name);
            if( box === null) continue;

            const hole = boxSlot.Box.GetFreeHole( colorType );
            if ( hole !== null ) return hole;
        }
        return null;
    }

}


