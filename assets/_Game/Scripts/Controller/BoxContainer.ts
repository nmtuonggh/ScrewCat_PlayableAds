import { _decorator, color, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BoxSlot } from '../GameComponent/HoleContainer/Box/BoxSlot';
import { eColorType } from '../GameConfig/GameColorConfig';
import { Hole } from '../GameComponent/Hole/Hole';
import { BoxData } from '../FakeSO/BoxData';
import { Box } from '../GameComponent/HoleContainer/Box/Box';
import { Queue } from '../Custom/Queue';
import { GameManager } from '../Manager/GameManager';
import { CahedContainer } from './CahedContainer';
import { LevelController } from './LevelController';
import { Graphics } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'BoxContainer' )
export class BoxContainer extends Component
{
    @property( BoxData )
    private BoxData: BoxData = null;
    @property(Prefab)
    public grap: Prefab = null;

    public boxSlots: BoxSlot[] = [];

    public boxIsActive: Box[] = [];

    private static _instance: BoxContainer = null;

    public static get Instance (): BoxContainer
    {
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

    public InitQueue (): void
    {
        for ( const boxSlot of this.boxSlots )
        {
            const box = boxSlot.Box;
            if ( box !== null )
            {
                this.boxIsActive.push( box );
            }
        }
    }

    public GetFreeBoxSlot ( colorType: eColorType ): Hole 
    {
        //duyệt qua từng phần tử trong queue
        for ( const box of this.boxIsActive )
        {
            if ( box === null || box.IS_ANIMATING ) continue;
            const hole = box.GetFreeHole( colorType );
            if ( hole !== null )
            {
                return hole;
            }
        }

        return null;
    }

    public GetBoxAvailable (): Box[]
    {
        let box = [];
        for(const slot of this.boxSlots)
        {
            if(slot.Box !== null)
            {
                box.push(slot.Box);
            }
        }
        return box;
    }

    public InitBox ( colorType: eColorType, parent: Node, data: BoxData , holeCount: number): void
    {
        const box = instantiate( data.boxPrefab[holeCount - 1] );
        box.parent = parent;
        box.setPosition( new Vec3( 0, 0, 0 ) );
        const boxComponent = box.getComponent( Box );
        boxComponent.boxRenderer.SetBoxData( colorType, data );
    }

    public CheckCreateBox (): void
    {
        if ( !this.needMoreBox() )
        {
            return;
        }

        if(LevelController.Instance.currentIndex >= LevelController.Instance.colorBoxSpawnData.length) return;

        for ( const boxSlot of this.boxSlots )
        {
            const box = boxSlot.Box;
            if ( box === null )
            {
                const newbox = this.CreatBox( boxSlot );
                boxSlot.Box = newbox;
            }
        }
    }

    public CreatBox ( boxSlot: BoxSlot ): Box
    {
        ///
        
        console.log( "Create Box with index : "  + LevelController.Instance.currentIndex + " color: " 
            +  LevelController.Instance.colorBoxSpawnData[ LevelController.Instance.currentIndex ].color + " holeCount: " 
            + LevelController.Instance.colorBoxSpawnData[ LevelController.Instance.currentIndex ].holeCount );

        const color = LevelController.Instance.colorBoxSpawnData[ LevelController.Instance.currentIndex ].color;
        const holeCount = LevelController.Instance.colorBoxSpawnData[ LevelController.Instance.currentIndex ].holeCount;

        if (color === eColorType.None) return null;

        ///
        const boxNode = instantiate( this.BoxData.boxPrefab[holeCount - 1] );
        boxNode.parent = boxSlot.node;
        boxNode.setPosition( new Vec3( 0, 200, 0 ) );
        const box = boxNode.getComponent( Box );
        box.boxRenderer.SetBoxData( color, this.BoxData );
        box.MoveIn();
        this.boxIsActive.push( box );
        LevelController.Instance.currentIndex++;
        return box;
    }

    public RemoveActiveBox ( box: Box ): void
    {
        const index = this.boxIsActive.indexOf( box );
        this.boxIsActive.splice( index, 1 );
    }

    public needMoreBox (): boolean
    {
        let screwRemain = GameManager.Instance.GetRemainningScrew();
    
        for ( const box of this.boxIsActive )
        {
            screwRemain -= box.GetFreeHoleCount();
        }

        if ( screwRemain <= 0 )
        {
            return false;
        }

        return true;
    }

    public GetMostColorType (): eColorType
    {
        let mostColorType;
        if(CahedContainer.Instance.GetMostColorType() !== eColorType.None)
        {
            mostColorType = CahedContainer.Instance.GetMostColorType();
        }
        return mostColorType;
    }

    private GetHoleNeedForBox (color : eColorType): number
    {
        for ( const box of this.boxIsActive )
        {
            if ( box.boxRenderer.colorType === color )
            {
                return box.GetFreeHoleCount();
            }
        }
    }

}


