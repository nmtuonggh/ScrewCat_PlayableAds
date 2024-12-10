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
import { getGameSystem } from '../GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'BoxContainer' )
export class BoxContainer extends Component
{
    @property( BoxData )
    private BoxData: BoxData = null;
    @property( Prefab )
    public grap: Prefab = null;

    public boxSlots: BoxSlot[] = [];

    public boxIsActive: Box[] = [];

    protected override onLoad (): void
    {
        this.boxSlots = this.getComponentsInChildren( BoxSlot );
    }

    public InitQueue (): void
    {
        for ( const boxSlot of this.boxSlots )
        {
            if ( boxSlot.isAds ) continue;

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
        for ( const slot of this.boxSlots )
        {
            if ( slot.Box !== null )
            {
                box.push( slot.Box );
            }
        }
        return box;
    }

    public InitBox ( colorType: eColorType, parent: Node, data: BoxData, holeCount: number ): void
    {
        const box = instantiate( data.boxPrefab[ holeCount - 1 ] );
        box.parent = parent;
        box.setPosition( new Vec3( 0, 0, 0 ) );
        const boxComponent = box.getComponent( Box );
        boxComponent.boxRenderer.SetBoxData( colorType, data );
    }

    public InitAdsBox ( parent: Node, data: BoxData ): void
    {
        const box = instantiate( data.boxAdsPrefab );
        box.parent = parent;
        //box.setPosition( new Vec3( 0, 0, 0 ) );
    }

    public CheckCreateBox (): void
    {
        // if ( !this.needMoreBox() )
        // {
        //     return;
        // }

        if ( getGameSystem().LevelController.currentIndex >= getGameSystem().LevelController.colorBoxSpawnData.length ) return;

        for ( const boxSlot of this.boxSlots )
        {
            if ( boxSlot.isAds ) continue;
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

        // console.log( "Create Box with index : " + getGameSystem().LevelController.currentIndex + " color: "
        //     + getGameSystem().LevelController.colorBoxSpawnData[ getGameSystem().LevelController.currentIndex ].color + " holeCount: "
        //     + getGameSystem().LevelController.colorBoxSpawnData[ getGameSystem().LevelController.currentIndex ].holeCount );

        const color = getGameSystem().LevelController.colorBoxSpawnData[ getGameSystem().LevelController.currentIndex ].color;
        const holeCount = getGameSystem().LevelController.colorBoxSpawnData[ getGameSystem().LevelController.currentIndex ].holeCount;

        if ( color === eColorType.None ) return null;

        ///
        const boxNode = instantiate( this.BoxData.boxPrefab[ holeCount - 1 ] );
        boxNode.parent = boxSlot.boxHolder;
        boxNode.setPosition( new Vec3( 0, 200, 0 ) );
        const box = boxNode.getComponent( Box );
        box.boxRenderer.SetBoxData( color, this.BoxData );
        box.MoveIn();
        this.boxIsActive.push( box );
        getGameSystem().LevelController.currentIndex++;
        return box;
    }

    public RemoveActiveBox ( box: Box ): void
    {
        const index = this.boxIsActive.indexOf( box );
        this.boxIsActive.splice( index, 1 );
    }

    public needMoreBox (): boolean
    {
        let screwRemain = getGameSystem().GameManager.getRemainningScrew();

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

}


