import { _decorator, CCInteger, Component, Node } from 'cc';
import { Screw } from '../GameComponent/Screw/Screw';
import { UIOpacity } from 'cc';
import { getGameSystem } from '../GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'GameManager' )
export class GameManager extends Component
{
    //#region EDITOR EXPOSED FIELDS
    @property( CCInteger )
    private collectedScrew: number = 0;
    @property( CCInteger )
    private currentScrew: number = 0;
    @property( CCInteger )
    private totalScrew: number = 0;
    //#endregion

    //#endregion PROPERTIES
    public get CollectedScrew (): number
    {
        return this.collectedScrew;
    }
    public set CollectedScrew ( value: number )
    {
        this.collectedScrew = value;
    }
    public get CurrentScrew (): number
    {
        return this.currentScrew;
    }
    public set CurrentScrew ( value: number )
    {
        this.currentScrew = value;
    }
    public get TotalScrew (): number
    {
        return this.totalScrew;
    }
    public set TotalScrew ( value: number )
    {
        this.totalScrew = value;
    }
    //#endregion

    //#region PUBLIC FIELDS
    public lose: boolean = false;
    public win: boolean = false;
    //#endregion

    //#region PUBLIC METHOD
    public checkLose (): void
    {
        const cacheContainer = getGameSystem().CahedContainer;
        const uiController = getGameSystem().UIController;

        if ( cacheContainer.CurrentScrewCount >= cacheContainer.listActiveHole.length && this.lose === false )
        {
            this.scheduleOnce( () =>
            {
                this.lose = true;
                getGameSystem().lose();
                uiController.tweenFail();
                uiController.showOutOfMove();
                getGameSystem().BoosterControll.BoosterUI.getComponent( UIOpacity ).opacity = 0;
                //wait for 2s
                setTimeout( () =>
                {
                    uiController.showLose();
                    uiController.setIQText( getGameSystem().TestIQController.currentIQ.toString() );
                }, 2000 );
            }, 1 );
        }
    }

    public getRemainningScrew (): number
    {
        return this.CurrentScrew;
    }

    public updateDataBox ( screw: Screw ): void
    {
        //duyệt ngược colorBoxdata của levelcontroller, tìm ra colorBoxData đầu tiên có cùng màu với screw và trừ đi 1 holecount nếu holecount = 0 thì xóa luôn phần tử đó

        let colorBoxData = getGameSystem().LevelController.colorBoxSpawnData;
        for ( let i = colorBoxData.length - 1; i >= 0; i-- )
        {
            if ( colorBoxData[ i ].color === screw.ScrewRenderer.colorType )
            {
                colorBoxData[ i ].holeCount--;
                if ( colorBoxData[ i ].holeCount <= 0 )
                {
                    colorBoxData.splice( i, 1 );
                }
                break;
            }
        }
    }
    //#endregion

}


