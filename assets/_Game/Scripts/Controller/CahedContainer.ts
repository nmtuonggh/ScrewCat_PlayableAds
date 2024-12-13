import { _decorator, CCInteger, Component, Node } from 'cc';
import { HorizontalGrid } from '../GameComponent/HoleContainer/Cache/HorizontalGrid';
import { Hole } from '../GameComponent/Hole/Hole';
import { eColorType } from '../GameConfig/GameColorConfig';
import { Screw } from '../GameComponent/Screw/Screw';

import { getGameSystem } from '../GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'CahedContainer' )
export class CahedContainer extends Component
{
    //#region EDITOR EXPOSED FIELDS 
    @property( CCInteger )
    private holeCount: number = 0;
    @property( CCInteger )
    private currentScrewCount: number = 0;
    //#endregion

    //#region PRIVATE FIELDS
    private horizontalGrid: HorizontalGrid = null;
    private listHole: Hole[] = [];
    public listActiveHole: Hole[] = [];
    public isFirstTime4Screw: boolean = false;
    public showingWarning: boolean = false;
    //#endregion
    //#region PROPERTIES
    public get CurrentScrewCount (): number
    {
        return this.currentScrewCount;
    }
    public set CurrentScrewCount ( value: number )
    {
        this.currentScrewCount = value;
    }
    //#endregion
    //#region CC METHODS
    protected onLoad (): void
    {
        this.listHole = this.node.getComponentsInChildren( Hole );
        this.horizontalGrid = this.node.getComponent( HorizontalGrid );
    }

    protected start (): void
    {
        this.holeCount = 5;
        this.ActiveHole( this.holeCount );
    }
    //#endregion

    //#region PUBLIC METHODS
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
                if ( hole.linkingScrew.checkMoveBox() )
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
            //         getGameSystem().MultiScreneController.SetPopUpWarningStatus(true);
            //         getGameSystem().MoveScrewHandle.DisableTouch();
            //     }
            //cutom cho booster tutorial
            // if ( this.isFirstTime4Screw === false )
            // {
            //     getGameSystem().MoveScrewHandle.DisableTouch();
            //     this.isFirstTime4Screw = true;
            //     this.showingWarning = true;
            //     setTimeout( () =>
            //     {
            //         getGameSystem().MultiScreneController.SetPopUpWarningStatus( true );
            //         if ( getGameSystem().BoosterControll && getGameSystem().BoosterControll.node && getGameSystem().BoosterControll.node.active )
            //         {
            //             getGameSystem().BoosterControll.HightlightBooster.HLBooster( BoosterType.Drill );
            //         }
            //     }, 1000 );
            // }
        }

    }

    public StopShowingWarning ()
    {
        this.showingWarning = false;
        getGameSystem().MultiScreneController.SetPopUpWarningStatus( false );
        getGameSystem().MoveScrewHandle.EnableTouch();
        ///
        //getGameSystem().BoosterControll.BoosterUI.getComponent(UIOpacity).opacity = 255;

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
    //#endregion
}

export class colorTypeCount
{
    public colorType: eColorType = eColorType.None;
    public count: number = 0;

}


