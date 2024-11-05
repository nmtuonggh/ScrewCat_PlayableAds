import { _decorator, CCInteger, Component, Node } from 'cc';
import { eColorType } from '../GameConfig/GameColorConfig';
import { Screw } from '../GameComponent/Screw/Screw';
import { CahedContainer } from './CahedContainer';
const { ccclass, property } = _decorator;

@ccclass( 'LogicSpawnBoxController' )
export class LogicSpawnBoxController extends Component 
{
    @property( Screw )
    public toltalScrew: Screw[] = [];
    @property( Screw )
    public currentScrew: Screw[] = [];
    
    public colorScrewData: colorTypeCount[] = [];


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

    public GetMostColorType (): eColorType
    {
        const mostCachedColor = CahedContainer.Instance.GetMostColorType();
        
        if ( mostCachedColor !== eColorType.None )
        {
            return mostCachedColor;
        }

    }
}

export class colorTypeCount
{
    public colorType: eColorType = eColorType.None;
    public count: number = 0;

}


