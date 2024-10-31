import { _decorator, Camera, Collider2D, Component, EventMouse, input, Input, Layers, Node, PhysicsSystem2D, Rect, Vec2, Vec3 } from 'cc';
import { GameConfig } from '../GameConfig/GameConfig';
import { GameLayerMaskConfig } from '../GameConfig/GameLayerMaskConfig';
import { GameLayerComponent } from '../GameComponent/GameLayerComponent';
import { Screw } from '../GameComponent/Screw/Screw';
import { Hole } from '../GameComponent/Hole/Hole';
import { eColorType } from '../GameConfig/GameColorConfig';
import { BoxContainer } from './BoxContainer';
import { CahedContainer } from './CahedContainer';
const { ccclass, property } = _decorator;

@ccclass( 'MoveScrewHandle' )
export class MoveScrewHandle extends Component
{
    //#region Properties
    @property( { type: Camera } )
    private camera: Camera | null = null;

    private _lastMousePosition: Vec2 = new Vec2();
    //#endregion

    private static _instance: MoveScrewHandle = null;

    public static get Instance (): MoveScrewHandle
    {
        if ( this._instance === null )
        {
            this._instance = new MoveScrewHandle();
        }
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( MoveScrewHandle._instance === null )
        {
            MoveScrewHandle._instance = this;
        }
        input.on( Input.EventType.MOUSE_DOWN, this.onMouseDown, this );
    }

    protected onDestroy (): void
    {
        input.off( Input.EventType.MOUSE_DOWN, this.onMouseDown, this );
    }


    private onMouseDown ( event: EventMouse ): void
    {
        if ( event.getButton() === EventMouse.BUTTON_LEFT )
        {
            this.onClickHandle( event );
        }
    }

    private onClickHandle ( event: EventMouse ): void
    {
        if ( !this.camera ) return;

        const mousePosition = event.getLocation();
        const worldPosition = this.camera.screenToWorld( new Vec3( mousePosition.x, mousePosition.y, 0 ) );
        this._lastMousePosition = new Vec2( worldPosition.x, worldPosition.y );
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
            screw.CheckMove();
        }
    }

    private cachedColliders: Collider2D[] = [];

    private CheckClick ( layer: Layers ): GameLayerComponent
    {
        this.cachedColliders = [];
        const aabb = new Rect(
            this._lastMousePosition.x - GameConfig.CLICK_RADIUS,
            this._lastMousePosition.y - GameConfig.CLICK_RADIUS,
            GameConfig.CLICK_RADIUS * 2,
            GameConfig.CLICK_RADIUS * 2 );

        let cachedCols = PhysicsSystem2D.instance.testAABB( aabb );
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



}
