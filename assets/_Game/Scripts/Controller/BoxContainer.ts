import { _decorator, Component, Node } from 'cc';
import { BoxSlot } from '../GameComponent/HoleContainer/Box/BoxSlot';
import { eColorType } from '../GameConfig/GameColorConfig';
import { Hole } from '../GameComponent/Hole/Hole';
const { ccclass, property } = _decorator;

@ccclass( 'BoxContainer' )
export class BoxContainer extends Component
{
    private boxSlots: BoxSlot[] = [];

    private static _instance: BoxContainer = null;

    public static get Instance (): BoxContainer
    {
        if ( this._instance === null )
        {
            this._instance = new BoxContainer();
        }
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( BoxContainer._instance === null )
        {
            BoxContainer._instance = this;
        }

        this.boxSlots = this.getComponentsInChildren( BoxSlot );
    }

    public GetFreeBoxSlot ( colorType: eColorType ): Hole 
    {
        console.log( "BoxSlots: ", this.boxSlots.length );
        for ( const boxSlot of this.boxSlots ) 
        {
            const box = boxSlot.Box;
            if ( box === null ) continue;

            const hole = boxSlot.Box.GetFreeHole( colorType );
            if ( hole !== null )
            {
                console.log( "Tim duoc slot: " + hole);
                return hole;
            } 
        }
        return null;
    }

}


