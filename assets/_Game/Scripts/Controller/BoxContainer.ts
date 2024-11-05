import { _decorator, color, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BoxSlot } from '../GameComponent/HoleContainer/Box/BoxSlot';
import { eColorType } from '../GameConfig/GameColorConfig';
import { Hole } from '../GameComponent/Hole/Hole';
import { BoxData } from '../FakeSO/BoxData';
import { Box } from '../GameComponent/HoleContainer/Box/Box';
import { Queue } from '../Custom/Queue';
import { GameManager } from '../Manager/GameManager';
import { CahedContainer } from './CahedContainer';
import { colorTypeCount } from './LogicSpawnBoxController';
const { ccclass, property } = _decorator;

@ccclass( 'BoxContainer' )
export class BoxContainer extends Component
{
    @property( BoxData )
    private BoxData: BoxData = null;

    public boxSlots: BoxSlot[] = [];

    public boxIsActive: Box[] = [];

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

    public InitBox ( colorType: eColorType, parent: Node, data: BoxData ): void
    {
        const box = instantiate( data.BoxPrefab );
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

        for ( const boxSlot of this.boxSlots )
        {
            const box = boxSlot.Box;
            if ( box === null )
            {
                const randomIndex = Math.floor( Math.random() * 9 );
                const newbox = this.CreatBox( boxSlot, randomIndex );
                boxSlot.Box = newbox;
            }
        }
    }

    public CreatBox ( boxSlot: BoxSlot, colorType: eColorType ): Box
    {
        ///


        ///
        const boxNode = instantiate( this.BoxData.BoxPrefab );
        boxNode.parent = boxSlot.node;
        boxNode.setPosition( new Vec3( 0, 200, 0 ) );
        const box = boxNode.getComponent( Box );
        box.boxRenderer.SetBoxData( colorType, this.BoxData );
        box.MoveIn();
        this.boxIsActive.push( box );
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

    private GetHoleNeedForBox ( color: eColorType ): number
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


