import { _decorator, CCInteger, Component, Node } from 'cc';
import { HorizontalGrid } from '../GameComponent/HoleContainer/Cache/HorizontalGrid';
import { Hole } from '../GameComponent/Hole/Hole';
import { eColorType } from '../GameConfig/GameColorConfig';
import { Screw } from '../GameComponent/Screw/Screw';
import { CanvasScreenController } from '../MultiScreen/CanvasScreenController';
import { MultiScreneController } from './MultiScreneController';
import { MoveScrewHandle } from './MoveScrewHandle';
const { ccclass, property } = _decorator;

@ccclass( 'CahedContainer' )
export class CahedContainer extends Component
{
    @property( CCInteger )
    private holeCount: number = 0;
    @property( CCInteger )
    public currentScrewCount: number = 0;
    @property(Node)
    public popUpWarning: Node = null;

    public horizontalGrid: HorizontalGrid = null;
    private listHole: Hole[] = [];
    public listActiveHole: Hole[] = [];
    public isFirstTime4Screw: boolean = false;
    public showingWarning: boolean = false;

    private static _instance: CahedContainer = null;

    public static get Instance (): CahedContainer
    {
        return this._instance;
    }

    protected onLoad (): void
    {
        if ( CahedContainer._instance === null )
        {
            CahedContainer._instance = this;
        }
        this.listHole = this.node.getComponentsInChildren( Hole );
        this.horizontalGrid = this.node.getComponent( HorizontalGrid );
    }

    protected start (): void
    {
        this.holeCount = 5;
        this.ActiveHole( this.holeCount );
    }

    ActiveHole ( holeCount: number ): void
    {
        for ( let i = 0; i < holeCount; i++ )
        {
            this.listHole[ i ].node.active = true;
            this.listActiveHole.push( this.listHole[ i ] );
        }

        this.horizontalGrid.RepositionHoleChange();
    }

    public AddNewHole ( count: number ): Hole
    {
        let hole = this.horizontalGrid.AddNewHole( count );
        if ( hole !== null )
        {
            this.listActiveHole.push( hole );
            return hole;
        }
        else
        {
            return null;
        }
    }

    public GetFreeHole (): Hole
    {
        for ( const hole of this.listActiveHole )
        {
            if ( hole.IsFree() && hole.isLinked === false )
            {
                return hole;
            }
        }

        return null;
    }

    public GetScrewOnCached (): Screw[]
    {
        let screwList: Screw[] = [];
        for ( const hole of this.listActiveHole )
        {
            if ( hole.linkingScrew && hole.linkingScrew.isValid )
            {
                screwList.push( hole.linkingScrew );
            }
        }

        return screwList;
    }

    public CheckMoveScrewFromCachedToBox (): void 
    {
        for ( let i = 0; i < this.listActiveHole.length; i++ )
        {
            const hole = this.listActiveHole[ i ];
            if ( hole.isLinked && hole.linkingScrew && hole.linkingScrew.isValid )
            {
                if ( hole.linkingScrew.CheckMoveBox() )
                {
                    hole.isLinked = false;
                    this.currentScrewCount--;
                }
            }
        }
    }

    public CheckWarning ()
    {
        if ( this.currentScrewCount == this.listActiveHole.length - 1 )
        {
            for ( let i = 0; i < this.listActiveHole.length; i++ )
            {
                const hole = this.listActiveHole[ i ];
                hole.ShowWarning();
            }
            
            //Pop up warning lan dau tien 4 screw
            // if (this.isFirstTime4Screw === false)
            //     {
            //         this.isFirstTime4Screw = true;
            //         this.showingWarning = true;
            //         MultiScreneController.Instance.SetPopUpWarningStatus(true);
            //         MoveScrewHandle.Instance.DisableTouch();
            //     }
        }

    }

    public StopShowingWarning ()
    {
        this.showingWarning = false;
        MultiScreneController.Instance.SetPopUpWarningStatus(false);
        MoveScrewHandle.Instance.EnableTouch();
    }

    public GetScrewForBooster (): Screw[]
    {
        let screwList: Screw[] = [];
        for ( const hole of this.listActiveHole )
        {
            if ( hole.linkingScrew && hole.linkingScrew.isValid )
            {
                screwList.push( hole.linkingScrew );
                hole.isLinked = false;
                hole.linkingScrew = null;
            }
        }

        return screwList;
    }
}

export class colorTypeCount
{
    public colorType: eColorType = eColorType.None;
    public count: number = 0;

}


