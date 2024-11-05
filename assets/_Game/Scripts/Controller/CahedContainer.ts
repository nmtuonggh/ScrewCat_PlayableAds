import { _decorator, CCInteger, Component, Node } from 'cc';
import { HorizontalGrid } from '../GameComponent/HoleContainer/Cache/HorizontalGrid';
import { Hole } from '../GameComponent/Hole/Hole';
import { eColorType } from '../GameConfig/GameColorConfig';
import { colorTypeCount } from './LogicSpawnBoxController';
const { ccclass, property } = _decorator;

@ccclass( 'CahedContainer' )
export class CahedContainer extends Component
{
    @property( CCInteger )
    private holeCount: number = 0;

    private horizontalGrid: HorizontalGrid = null;
    private listHole: Hole[] = [];
    private listActiveHole: Hole[] = [];

    private static _instance: CahedContainer = null;

    public static get Instance (): CahedContainer
    {
        if ( this._instance === null )
        {
            this._instance = new CahedContainer();
        }
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

    public CheckMoveScrewFromCachedToBox (): void 
    {
        for ( let i = 0; i < this.listActiveHole.length; i++ )
        {
            const hole = this.listActiveHole[ i ];
            if ( hole.isLinked && hole.linkingScrew !== null )
            {
                if ( hole.linkingScrew.CheckMoveBox() )
                {
                    hole.isLinked = false;
                }
            }
        }
    }

    public GetMostColorType (): eColorType
    {
        let colorTypeCount: colorTypeCount[] = [];
        this.listActiveHole.forEach( hole =>
        {
            if ( hole.linkingScrew !== null )
            {
                let colorType = hole.linkingScrew.ScrewRenderer.colorType;
                let colorTypeCountItem = colorTypeCount.find( ctc => ctc.colorType === colorType );
                if ( colorTypeCountItem )
                {
                    colorTypeCountItem.count++;
                } else
                {
                    colorTypeCount.push( { colorType: colorType, count: 1 } );
                }
            };
        });

        let maxColorType = colorTypeCount[ 0 ];
        let color = eColorType.None;
        colorTypeCount.forEach( ctc =>
        {
            if ( ctc.count > maxColorType.count )
            {
                maxColorType = ctc;
                color = ctc.colorType;
            }
        } );

        return color;
    }
}




