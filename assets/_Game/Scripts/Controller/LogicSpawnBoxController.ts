import { _decorator, CCInteger, Component, Node } from 'cc';
import { eColorType } from '../GameConfig/GameColorConfig';
import { CahedContainer } from './CahedContainer';
import { BarController } from '../GameComponent/Bar/BarController';
import { Screw } from '../GameComponent/Screw/Screw';
const { ccclass, property } = _decorator;

@ccclass( 'LogicSpawnBoxController' )
export class LogicSpawnBoxController extends Component 
{
    public toltalScrew: Screw[] = [];
    public currentScrew: Screw[] = [];

    public colorScrewData: colorTypeCount[] = [];
    public currentBar: BarController[] = [];


    private static _instance: LogicSpawnBoxController = null;

    public static get Instance (): LogicSpawnBoxController
    {
        if ( this._instance === null )
        {
            this._instance = new LogicSpawnBoxController();
        }
        return this._instance;
    }

    protected onLoad (): void
    {
        if ( LogicSpawnBoxController._instance === null )
        {
            LogicSpawnBoxController._instance = this;
        }
    }

    public RemoveScrew ( screw: Screw ): void
    {
        const index = this.currentScrew.indexOf( screw );
        if ( index > -1 ) 
        {
            this.currentScrew.splice( index, 1 );
        }
    }

    public RemoveBar ( bar: BarController ): void
    {
        const index = this.currentBar.indexOf( bar );
        if ( index > -1 ) 
        {
            this.currentBar.splice( index, 1 );
        }
    }

    public GetColorData (): void 
    {
        this.currentScrew.forEach( screw =>
        {
            let colorTypeCount = this.colorScrewData.find( ctc => ctc.colorType === screw.ScrewRenderer.colorType );
            if ( colorTypeCount )
            {
                colorTypeCount.count++;
            } else
            {
                this.colorScrewData.push( { colorType: screw.ScrewRenderer.colorType, count: 1 } );
            }
        } );
    }

    public GetMostColorType ( isStart: boolean ): eColorType
    {
        if ( !isStart )
        {
            const mostCachedColor = CahedContainer.Instance.GetMostColorType();
            const mostBarColor = this.GetMostBarColor();

            if ( mostCachedColor.colorType !== eColorType.None  )
            {
                if(mostCachedColor.count >= mostBarColor.count)
                {
                    return mostCachedColor.colorType;
                }
                else
                {
                    return mostBarColor.colorType;
                }
            }
        }


        const mostBarColor = this.GetMostBarColor();

        if ( mostBarColor.colorType !== eColorType.None )
        {
            const color = mostBarColor.colorType;
            return color;
        }
    }

    public GetMostBarColor (): colorTypeCount
    {
        let colorData: colorTypeCount[] = [];
        this.currentBar.forEach( bar =>
        {
            bar.listScrews.forEach( screw =>
            {
                if ( !screw.IsBlocked() )
                {
                    let colorType = screw.ScrewRenderer.colorType;
                    let colorTypeCountItem = colorData.find( ctc => ctc.colorType === colorType );
                    if ( colorTypeCountItem )
                    {
                        colorTypeCountItem.count++;
                    } else
                    {
                        colorData.push( { colorType: colorType, count: 1 } );
                    }
                }

            } );
        } );

        let maxColorType = colorData[ 0 ];
        colorData.forEach( ctc =>
        {
            if ( ctc.count >= maxColorType.count )
            {
                maxColorType = ctc;
            }
        } );

        return maxColorType;
    }
}

export class colorTypeCount
{
    public colorType: eColorType = eColorType.None;
    public count: number = 0;

}


