import { _decorator, Component, Node } from 'cc';
import { eColorType } from '../GameConfig/GameColorConfig';
import { BoxContainer } from './BoxContainer';
import { CahedContainer } from './CahedContainer';
import { Box } from '../GameComponent/HoleContainer/Box/Box';
import { Screw } from '../GameComponent/Screw/Screw';
const { ccclass, property } = _decorator;

@ccclass( 'GameDifficultyHandler' )
export class GameDifficultyHandler extends Component
{
    private boxContainer: BoxContainer = null;
    private cachedContainer: CahedContainer = null;

    public cachedScrews : Screw[];
    public cachedBlockedScrews : Screw[];

    protected start (): void
    {
        this.boxContainer = BoxContainer.Instance;
        this.cachedContainer = CahedContainer.Instance;
    }

    public GetAvailableBoxes (): Box[] 
    {
        if ( this.boxContainer == null ) return null;
        return this.boxContainer.GetBoxAvailable();
    }


    public GetRandomBoxColor (): eColorType
    {
        let color = eColorType.None;
        let currentPoint = 0;
        let point = 0;

        for ( const box of this.GetAvailableBoxes() )
        {
            //currentPoint +=
        }

        return color;
    }

    private GetColorPoint ( colorType: eColorType )
    {
        this.cachedScrews.length = 0;
        this.cachedBlockedScrews.length = 0;

        //for (const screw)
    }
}


