import { _decorator, Component, Node } from 'cc';
import { CanvasScreenController } from './MultiScreen/CanvasScreenController';
import { getGameSystem } from './GameSystem';
import { TrackingManager } from '../../PA_iKame (1)/base-script/PlayableAds/Tracking/TrackingManager';
import { PlayableAdsManager } from '../../PA_iKame (1)/base-script/PlayableAds/PlayableAdsManager';
const { ccclass, property } = _decorator;

@ccclass( 'UIController' )
export class UIController extends Component
{
    @property( [ CanvasScreenController ] )
    public canvasScreenController: CanvasScreenController[] = [];

    public onChangedScreen (): void
    {
        if ( !getGameSystem().GameManager.lose ) return;
        this.canvasScreenController.forEach( element =>
        {  //UI Canvas
            element.uiCanvasScreen.setOutOfMoveUIStatus( false );
            element.uiCanvasScreen.setFailUIStatus( false );
        } );
    }

    public showOutOfMove (): void
    {
        this.canvasScreenController.forEach( element =>
        {
            element.uiCanvasScreen.setOutOfMoveUIStatus( true );
        } );
    }

    public showFail (): void
    {
        this.canvasScreenController.forEach( element =>
        {
            element.uiCanvasScreen.setFailUIStatus( true );
        } );
    }

    public showLoseUI (): void
    {
        TrackingManager.LoseLevel();
        setTimeout( () =>
        {
            PlayableAdsManager.Instance().ForceOpenStore();
        }, 3000 );
        this.canvasScreenController.forEach( element =>
        {
            element.uiCanvasScreen.setLoseUIStatus( true );
        } );
        // const screen = getGameSystem().MultiScreneController.ScreenType;
        // this.canvasScreenController[screen].uiCanvasScreen.setLoseUIStatus( true );
    }
    public tweenFail (): void
    {
        this.canvasScreenController.forEach( element =>
        {
            element.uiCanvasScreen.tweenFail();
        } );
    }
    public setIQText ( text: string ): void
    {
        if ( getGameSystem().TestIQController && getGameSystem().TestIQController.node && getGameSystem().TestIQController.node.active )
        {
            this.canvasScreenController.forEach( element =>
            {
                element.uiCanvasScreen.SetIQText( text );
            } );
        }
    }
}


