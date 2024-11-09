import { _decorator, Component, ERigidBody2DType, HingeJoint2D, instantiate, Node, Prefab, RigidBody2D, UITransform, Vec2 } from 'cc';
import { GameLayerComponent } from '../GameLayerComponent';
import { eScrewState, Screw } from '../Screw/Screw';
import { BarPhysic } from './BarPhysic';
import { ScrewData } from '../../FakeSO/ScrewData';
import { PolygonCollider2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'BarController' )
export class BarController extends GameLayerComponent
{

    //#region Fields
    @property( Screw )
    public listScrews: Screw[] = [];
    @property( Screw )
    public listScrews2: Screw[] = [];
    @property( BarPhysic )
    public barPhysic: BarPhysic = null;

    @property( PolygonCollider2D )
    public collider: PolygonCollider2D = null;
    @property( PolygonCollider2D )
    public modelCollider: PolygonCollider2D = null;

    //#endregion

    protected onLoad (): void
    {
        this.barPhysic = this.getComponent( BarPhysic );
    }

    protected start (): void
    {
        // this.collider.points = this.modelCollider.points.map(point => {
        //     return new Vec2(
        //         point.x * 0.7,
        //         point.y * 0.7
        //     );
        // });

    }

    public SetCollider ()
    {
        this.collider.points = this.modelCollider.points;
        this.collider.apply();
    }

    protected update ( dt: number ): void
    {
        if ( this.node.position.y < -2000 )
        {
            this.node.destroy();
        }
    }

    //#region Spawn Screw
    

    public InitScrewColor ( screwData: ScrewData ): void
    {
        for ( let i = 0; i < this.listScrews.length; i++ )
        {
            this.listScrews[ i ].ScrewRenderer.SetSelfColor( screwData );
        }
    }

    //#endregion
}


