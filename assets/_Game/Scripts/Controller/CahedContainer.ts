import { _decorator, CCInteger, Component, Node } from 'cc';
import { HorizontalGrid } from '../GameComponent/HoleContainer/Cache/HorizontalGrid';
import { Hole } from '../GameComponent/Hole/Hole';
import { eColorType } from '../GameConfig/GameColorConfig';
import { Screw } from '../GameComponent/Screw/Screw';
const { ccclass, property } = _decorator;

@ccclass( 'CahedContainer' )
export class CahedContainer extends Component
{
    @property( CCInteger )
    private holeCount: number = 0;
    @property( CCInteger )
    public currentScrewCount: number = 0;

    private horizontalGrid: HorizontalGrid = null;
    private listHole: Hole[] = [];
    public listActiveHole: Hole[] = [];

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
        // let holeHasScrew = [];

        // for ( let i = 0; i < this.listActiveHole.length; i++ )
        // {
        //     const hole = this.listActiveHole[ i ];
        //     if ( hole.isLinked && hole.linkingScrew && hole.linkingScrew.isValid )
        //     {
        //         holeHasScrew.push( hole );
        //     }
        // }

        // if ( this.listActiveHole.length - holeHasScrew.length <= 2 )
        // {
        //     for ( let i = 0; i < this.listActiveHole.length; i++ )
        //     {
        //         const hole = this.listActiveHole[ i ];

        //         hole.ShowWarning();

        //     } 
        // }
        if ( this.currentScrewCount >= this.listActiveHole.length - 1 )
        {
            for ( let i = 0; i < this.listActiveHole.length; i++ )
            {
                const hole = this.listActiveHole[ i ];
                hole.ShowWarning();
            }
        }
    }

    public GetMostColorType (): eColorType
    {
        let colorTypeCountList: colorTypeCount[] = [];
        //lay so luong phan tu trong eColorType


        //khoi tao list colorTypeCount
        for ( let i = 0; i < 9; i++ )
        {
            let color = new colorTypeCount();
            color.colorType = i;
            color.count = 0;
            colorTypeCountList.push( color );
        }

        for ( const hole of this.listActiveHole )
        {
            if ( hole.linkingScrew == null ) continue;

            for ( let i = 0; i < colorTypeCountList.length; i++ )
            {
                if ( colorTypeCountList[ i ].colorType === hole.linkingScrew.ScrewRenderer.colorType )
                {
                    colorTypeCountList[ i ].count++;
                }
            }
        }

        //tim colorType co so luong lon nhat
        let maxCount = 0;
        let maxColorType = eColorType.None;
        for ( let i = 0; i < colorTypeCountList.length; i++ )
        {
            if ( colorTypeCountList[ i ].count > maxCount )
            {
                maxCount = colorTypeCountList[ i ].count;
                maxColorType = colorTypeCountList[ i ].colorType;
            }
        }

        return maxColorType;
    }
}

export class colorTypeCount
{
    public colorType: eColorType = eColorType.None;
    public count: number = 0;

}


