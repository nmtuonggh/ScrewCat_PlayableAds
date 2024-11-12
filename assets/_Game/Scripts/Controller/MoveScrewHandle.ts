import { _decorator, Camera, Collider2D, Component, EventMouse, input, Input, Layers, Node, PhysicsSystem2D, Rect, Vec2, Vec3 } from 'cc';
import { GameConfig } from '../GameConfig/GameConfig';
import { GameLayerMaskConfig } from '../GameConfig/GameLayerMaskConfig';
import { GameLayerComponent } from '../GameComponent/GameLayerComponent';
import { eScrewState, Screw } from '../GameComponent/Screw/Screw';
import { Hole } from '../GameComponent/Hole/Hole';
import { eColorType } from '../GameConfig/GameColorConfig';
import { BoxContainer } from './BoxContainer';
import { CahedContainer } from './CahedContainer';
import { TutorialController } from '../TutorialController';
import { AudioController } from '../AudioController/AudioController';
import { PoolTouch } from '../PoolTouch';
import { tween } from 'cc';
import { PlayableAdsManager } from '../../../PA_iKame/base-script/PlayableAds/PlayableAdsManager';
import { GameManager } from '../Manager/GameManager';
import { Game } from 'cc';
import { EventTouch } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'MoveScrewHandle' )
export class MoveScrewHandle extends Component
{
    //#region Properties
    @property( { type: Camera } )
    private camera: Camera | null = null;
    @property( TutorialController )
    private tutorialController: TutorialController = null;
    @property( PoolTouch )
    private poolTouch: PoolTouch = null;
    @property( PlayableAdsManager )
    private playableAdsManager: PlayableAdsManager = null;

    private _lastMousePosition: Vec2 = new Vec2();

    public isFirstTouch: boolean = false;
    //#endregion

    private static _instance: MoveScrewHandle = null;

    public static get Instance (): MoveScrewHandle
    {
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( MoveScrewHandle._instance === null )
        {
            MoveScrewHandle._instance = this;
        }
        
        this.poolTouch.initializePool( 15 );
        input.on( Input.EventType.TOUCH_START, this.onTouchStart, this );
    }


    protected onDestroy (): void
    {
        input.off( Input.EventType.TOUCH_START, this.onTouchStart, this );
    }


    private onTouchStart ( event: EventTouch ): void
    {

        this.onClickHandle( event );

    }

    private onClickHandle ( event: EventTouch ): void
    {
        if ( !this.camera ) return;

        if ( this.isFirstTouch === false )
        {
            this.isFirstTouch = true;
            this.playableAdsManager.ActionFirstClicked();

            this.tutorialController.stopTutorial();
            AudioController.Instance.PlayerBG();
        }
        console.log( "currentScrew: ", GameManager.Instance.currentScrew );
        if ( GameManager.Instance.currentScrew <= 1 ) 
        {
            this.playableAdsManager.ForceOpenStore();
            return;
        }

        if ( GameManager.Instance.lose === true )
        {
            this.playableAdsManager.ForceOpenStore();
            return;
        }
        const mousePosition = event.getLocation();
        const worldPosition = this.camera.screenToWorld( new Vec3( mousePosition.x, mousePosition.y, 0 ) );
        this._lastMousePosition = new Vec2( worldPosition.x, worldPosition.y );
        this.pointSpawnTouchEffect( this._lastMousePosition );
        this.checkClickScrew();
    }

    //#region CheckClickScrew
    private checkClickScrew (): void
    {
        //console.log( "checkClickScrew" );
        let component = this.CheckClick( GameLayerMaskConfig.SCREW_LAYER_MASK );
        if ( component !== null )
        {
            let screw = component.node.getComponent( Screw );
            if ( screw.State === eScrewState.IN_CACHED || screw.State === eScrewState.IS_HIDING) return;
            screw.CheckMove();
        }
    }

    private cachedColliders: Collider2D[] = [];

    private CheckClick ( layer: Layers ): GameLayerComponent
    {
        this.cachedColliders = [];
        // const aabb = new Rect(
        //     this._lastMousePosition.x - GameConfig.CLICK_RADIUS,
        //     this._lastMousePosition.y - GameConfig.CLICK_RADIUS,
        //     GameConfig.CLICK_RADIUS * 2,
        //     GameConfig.CLICK_RADIUS * 2 );

        //ban 10 diem xung quanh
        const points = [];
        const numPoints = 10;
        const angleStep = ( 2 * Math.PI ) / numPoints;

        for ( let i = 0; i < numPoints; i++ )
        {
            const angle = i * angleStep;
            const x = this._lastMousePosition.x + GameConfig.CLICK_RADIUS * Math.cos( angle );
            const y = this._lastMousePosition.y + GameConfig.CLICK_RADIUS * Math.sin( angle );
            points.push( new Vec2( x, y ) );
        }

        let cachedCols: Collider2D[] = [];
        //let cachedCols = PhysicsSystem2D.instance.testAABB( aabb );

        for ( const point of points )
        {
            let collider = PhysicsSystem2D.instance.testPoint( point );
            if ( collider.length > 0 )
            {
                for ( let i = 0; i < collider.length; i++ )
                {
                    cachedCols.push( collider[ i ] );
                }
            }
        }

        //loc cac collider theo layer
        if ( cachedCols.length === 0 ) return null;

        for ( let i = 0; i < cachedCols.length; i++ )
        {
            if ( cachedCols[ i ].node.layer === layer )
            {
                this.cachedColliders.push( cachedCols[ i ] );
            }
        }

        if ( this.cachedColliders.length > 0 && this.cachedColliders !== null )
        {
            ///Tim layer cao nhat
            let tallestLayer = 0;
            const size = this.cachedColliders.length;
            for ( let i = 0; i < size; i++ )
            {
                let iClickable = this.cachedColliders[ i ].node.getComponent( GameLayerComponent );
                if ( iClickable )
                {
                    let layer = iClickable.Layer;
                    if ( layer > tallestLayer )
                    {
                        tallestLayer = layer;
                    }
                }
            }

            //console.log( "Tallest Layer: ", tallestLayer );

            //Tim node gan nhat trong layer cao nhat
            let collider: Collider2D | null = null;
            let nearest = Number.MAX_VALUE;

            for ( let i = 0; i < size; i++ )
            {
                let iClickable = this.cachedColliders[ i ].node.getComponent( GameLayerComponent );
                if ( iClickable )
                {
                    let layer = iClickable.Layer;
                    if ( layer !== tallestLayer ) continue;
                    let nodePosition2D = new Vec2( this.cachedColliders[ i ].node.position.x, this.cachedColliders[ i ].node.position.y );
                    let distance = Vec2.distance( this._lastMousePosition, nodePosition2D );
                    if ( distance < nearest )
                    {
                        nearest = distance;
                        collider = this.cachedColliders[ i ];
                    }
                }
            }

            if ( collider === null ) return null;
            let clickable = collider.node.getComponent( GameLayerComponent );
            if ( clickable ) return clickable;
        }

        return null;
    }
    //#endregion

    //#region GetFreeHole
    public GetFreeHoleBox ( colorType: eColorType ): Hole
    {
        return BoxContainer.Instance.GetFreeBoxSlot( colorType );
    }

    public GetFreeHoleCache (): Hole
    {
        return CahedContainer.Instance.GetFreeHole();
    }
    //#endregion


    private pointSpawnTouchEffect ( pos: Vec2 ): void
    {
        const touch = this.poolTouch.getFromPool();

        touch.worldPosition = new Vec3( pos.x, pos.y, 0 );
        touch.setScale( new Vec3( 0.1, 0.1, 0.1 ) );

        tween( touch )
            .to( 0.4, { worldScale: new Vec3( 1, 1, 1 ) } )
            .call( () =>
            {
                this.poolTouch.returnToPool( touch );
            } )
            .start();
        // 
    }
}
