import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { BoxSlot } from '../GameComponent/HoleContainer/Box/BoxSlot';
import { eColorType } from '../GameConfig/GameColorConfig';
import { Hole } from '../GameComponent/Hole/Hole';
const { ccclass, property } = _decorator;

@ccclass( 'BoxContainer' )
export class BoxContainer extends Component
{
    public boxSlots: BoxSlot[] = [];

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
        //console.log( "BoxSlots: ", this.boxSlots.length );
        for ( const boxSlot of this.boxSlots ) 
        {
            const box = boxSlot.Box;
            if ( box === null ) continue;

            const hole = box.GetFreeHole( colorType );
            if ( hole !== null )
            {
                
                return hole;
            } 
        }
        return null;
    }

    public InitBox(boxPrefabs : Prefab, parent : Node): void
    {
        const box = instantiate( boxPrefabs );
        box.parent = parent;
    }

    public CreatNewBox ( ): void
    {
        
    }

}


