import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BoxSlot } from '../GameComponent/HoleContainer/Box/BoxSlot';
import { eColorType } from '../GameConfig/GameColorConfig';
import { Hole } from '../GameComponent/Hole/Hole';
import { BoxData } from '../FakeSO/BoxData';
import { Box } from '../GameComponent/HoleContainer/Box/Box';
const { ccclass, property } = _decorator;

@ccclass( 'BoxContainer' )
export class BoxContainer extends Component
{
    @property( BoxData )
    private BoxData: BoxData = null;

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
            if ( box === null || box.IS_ANIMATING) continue;

            const hole = box.GetFreeHole( colorType );
            if ( hole !== null )
            {
                return hole;
            }
        }
        return null;
    }

    public InitBox ( boxPrefabs: Prefab, parent: Node ): void
    {
        const box = instantiate( boxPrefabs );
        box.parent = parent;
    }

    public CheckCreateBox (): void
    {
        for ( const boxSlot of this.boxSlots )
        {
            const box = boxSlot.Box;
            if ( box === null )
            {
                const newbox = this.CreatBox( boxSlot, this.BoxData.BoxPrefab[ 0 ] );
                boxSlot.Box = newbox;
            }
        }
    }

    public CreatBox ( boxSlot: BoxSlot, boxPrefabs: Prefab ): Box
    {
        const boxNode = instantiate( boxPrefabs );
        boxNode.parent = boxSlot.node;
        boxNode.setPosition( new Vec3( 0, 200, 0 ) );
        const box = boxNode.getComponent( Box );
       // box.IS_ANIMATING = true;
        box.MoveIn();
        return box;
    }

}


