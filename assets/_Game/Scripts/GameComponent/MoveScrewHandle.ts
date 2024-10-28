import { _decorator, Camera, Collider2D, Color, Component, director, EventMouse, Graphics, input, Input, Layers, Node, PhysicsSystem2D, Rect, Vec2, Vec3 } from 'cc';
import { GameConfig } from '../GameConfig/GameConfig';
import { GameLayerMaskConfig } from '../GameConfig/GameLayerMaskConfig';
import { GameLayerComponent } from './GameLayerComponent';
import { Screw } from './Screw/Screw';
const { ccclass, property } = _decorator;

@ccclass( 'MoveScrewHandle' )
export class MoveScrewHandle extends Component
{
    private lastMousePosition: Vec2 = new Vec2();

    @property( { type: Camera } )
    private camera: Camera | null = null;

    protected onLoad (): void
    {
        input.on( Input.EventType.MOUSE_DOWN, this.onMouseDown, this );
        //this.camera = director.getScene().getChildByName( 'Main Camera' )?.getComponent( Camera ) || null;
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
        this.lastMousePosition = new Vec2( worldPosition.x, worldPosition.y );
        this.checkClickScrew();

    }

    //tạo 1 biến kiểu layers có thể kéo thả vào inspector

    private checkClickScrew (): void
    {
        console.log( "checkClickScrew" );
        let component = this.CheckClick( GameLayerMaskConfig.SCREW_LAYER_MASK );
        if ( component )
        {
            let screw = component.node.getComponent( Screw );
            screw.CheckMove();
        }
    }

    private cachedColliders: Collider2D[] = [];


    private CheckClick ( layer: Layers ): GameLayerComponent
    {
        const aabb = new Rect(
            this.lastMousePosition.x - GameConfig.CLICK_RADIUS,
            this.lastMousePosition.y - GameConfig.CLICK_RADIUS,
            GameConfig.CLICK_RADIUS * 2,
            GameConfig.CLICK_RADIUS * 2 );

        let cachedCols = PhysicsSystem2D.instance.testAABB( aabb );

        //loc cac collider theo layer
        if( cachedCols.length === 0 ) return null;

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
                    let distance = Vec2.distance( this.lastMousePosition, nodePosition2D );
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

}
