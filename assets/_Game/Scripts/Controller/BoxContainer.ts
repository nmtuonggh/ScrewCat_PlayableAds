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
    //#region EDITOR EXPOSED FIELD
    @property( BoxData )
    private boxData: BoxData = null;
    //#endregion

    //#region PRIVATE FIELD
    private boxSlots: BoxSlot[] = [];
    private boxIsActive: Box[] = [];
    //#endregion

    //#region PROPERTY
    public get BoxSlots (): BoxSlot[]
    {
        return this.boxSlots;
    }
    public get BoxData (): BoxData
    {
        return this.boxData;
    }
    public get BoxIsActive (): Box[]
    {
        return this.boxIsActive;
    }
    //#endregion

    protected override onLoad (): void
    {
        this.boxSlots = this.getComponentsInChildren( BoxSlot );
    }
    //#region PUBLIC METHOD
    public InitQueue (): void
    {
        for ( const boxSlot of this.boxSlots )
        {
            if ( boxSlot.IsBlockByChain || boxSlot.IsInProgress) continue;

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
            const hole = box.getFreeHole( colorType );
            if ( hole !== null )
            {
                return hole;
            }
        }

        return null;
    }

    public getActiveBoxColor(): eColorType[]
    {
        let color = [];
        for ( const box of this.boxIsActive )
        {
            if ( box === null ) continue;
            color.push( box.BoxRenderer.colorType );
        }
        return color;
    }

    public getBoxForTutorial (): Box[]
    {
        var box = [];
        for ( const slot of this.boxSlots )
        {
            if ( slot.Box !== null )
            {
                box.push( slot.Box );
            }
        }
        return box;
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
        boxComponent.BoxRenderer.SetBoxData( colorType, data );
    }

    public CheckCreateBox (): void
    {
        if ( getGameSystem().LevelController.CurrentBoxDataIndex >= getGameSystem().LevelController.ColorBoxSpawnData.length ) return;
        for ( const boxSlot of this.boxSlots )
        {
            if ( boxSlot.IsBlockByChain || boxSlot.IsInProgress) continue;
            const box = boxSlot.Box;
            if ( box === null )
            {
                const newbox = this.CreatBox( boxSlot );
                boxSlot.Box = newbox;
            }
        }
    }
    public RemoveActiveBox ( box: Box ): void
    {
        const index = this.boxIsActive.indexOf( box );
        this.boxIsActive.splice( index, 1 );
    }
    //#endregion

    //#region PRIVATE METHOD
    private CreatBox ( boxSlot: BoxSlot ): Box
    {
        const color = getGameSystem().LevelController.ColorBoxSpawnData[ getGameSystem().LevelController.CurrentBoxDataIndex ].color;
        const holeCount = getGameSystem().LevelController.ColorBoxSpawnData[ getGameSystem().LevelController.CurrentBoxDataIndex ].holeCount;

        if ( color === eColorType.None ) return null;

        ///
        const boxNode = instantiate( this.boxData.boxPrefab[ holeCount - 1 ] );
        boxNode.parent = boxSlot.boxHolder;
        boxNode.setPosition( new Vec3( 0, 200, 0 ) );
        const box = boxNode.getComponent( Box );
        box.BoxRenderer.SetBoxData( color, this.boxData );
        box.MoveIn();
        this.boxIsActive.push( box );
        getGameSystem().LevelController.CurrentBoxDataIndex++;
        return box;
    }
    //#endregion

}


