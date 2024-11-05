import { _decorator, color, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { BoxSlot } from '../GameComponent/HoleContainer/Box/BoxSlot';
import { eColorType } from '../GameConfig/GameColorConfig';
import { Hole } from '../GameComponent/Hole/Hole';
import { BoxData } from '../FakeSO/BoxData';
import { Box } from '../GameComponent/HoleContainer/Box/Box';
import { Queue } from '../Custom/Queue';
import { GameManager } from '../Manager/GameManager';
import { CahedContainer } from './CahedContainer';
import { colorTypeCount, LogicSpawnBoxController } from './LogicSpawnBoxController';
import { Screw } from '../GameComponent/Screw/Screw';
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
        //TODO
        const box = instantiate( data.BoxPrefab[2] );
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

        const color = LogicSpawnBoxController.Instance.GetMostColorType( false );
        const holeNeeded = this.GetHoleNeedForBox( color ) - 1;

        if ( holeNeeded < 0 )
        {
            //duyet qua currentScrew neu trung mau voi color thi remove
            for ( let i = 0; i < LogicSpawnBoxController.Instance.currentScrew.length; i++ )
            {
                if ( LogicSpawnBoxController.Instance.currentScrew[ i ].ScrewRenderer.colorType === color )
                {
                    LogicSpawnBoxController.Instance.RemoveScrew( LogicSpawnBoxController.Instance.currentScrew[ i ] );
                }
            }
            
            this.CheckCreateBox();
        }

        for ( const boxSlot of this.boxSlots )
        {
            const box = boxSlot.Box;
            if ( box === null )
            {
                const newbox = this.CreatBox( boxSlot, color, holeNeeded );
                boxSlot.Box = newbox;
            }
        }
    }

    public CreatBox ( boxSlot: BoxSlot, colorType: eColorType , holeNeed : number): Box
    {
        ///
        
        ///
        const boxNode = instantiate( this.BoxData.BoxPrefab[holeNeed] );
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
        let screwRemain = LogicSpawnBoxController.Instance.currentScrew.length;

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
        let count = 0;
        const currentScrew = LogicSpawnBoxController.Instance.currentScrew;

        for ( const screw of currentScrew )
        {
            if ( screw.ScrewRenderer.colorType === color )
            {
                count++;
            }
        }

        for ( const box of this.boxIsActive )
        {
            if ( box.boxRenderer.colorType === color )
            {
                const freehole =  box.GetFreeHoleCount();
                count -= freehole;
            }
        }

        if ( count <= 0 )
        {
            console.error( "Het lo: Bug" + count );
            return 1;
        }

        if ( count >= 3 )
        {
            return 3;
        }
        else
        {
            return count;
        }
    }

}


