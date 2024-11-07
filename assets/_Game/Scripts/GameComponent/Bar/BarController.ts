import { _decorator, Component, ERigidBody2DType, HingeJoint2D, instantiate, Node, Prefab, RigidBody2D, UITransform, Vec2 } from 'cc';
import { GameLayerComponent } from '../GameLayerComponent';
import { eScrewState, Screw } from '../Screw/Screw';
import { BarPhysic } from './BarPhysic';
import { eColorType } from '../../GameConfig/GameColorConfig';
import { ScrewData } from '../../FakeSO/ScrewData';
import { StarController } from '../../Star/StarController';
import { GameManager } from '../../Manager/GameManager';
import { PolygonCollider2D } from 'cc';
import { Sprite } from 'cc';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'BarController' )
export class BarController extends GameLayerComponent
{

    //#region Fields
    @property( Node )
    public listHolePos: Node[] = [];

    @property( Screw )
    public listScrews: Screw[] = [];
    @property(BarPhysic)
    public barPhysic: BarPhysic = null;

    @property( PolygonCollider2D )
    public collider: PolygonCollider2D = null;
    @property( PolygonCollider2D )
    public modelCollider: PolygonCollider2D = null;
    @property( Node )
    public Moldel: Node = null;

    //#endregion

    protected onLoad (): void
    {
        this.barPhysic = this.getComponent( BarPhysic );
        this.modelCollider = this.Moldel.getComponent( PolygonCollider2D );
    }

    protected start (): void
    {
        this.collider.points = this.modelCollider.points.map(point => {
            return new Vec2(
                point.x * 0.7,
                point.y * 0.7
            );
        });
        this.collider.apply();
        
    }

    protected update ( dt: number ): void
    {
        if ( this.node.position.y < -2000 )
        {
            this.node.destroy();
        }
    }

    // setColliderShape ( collider: PolygonCollider2D )
    // {
    //     const spriteFrame = this.sprite.spriteFrame;
    //     if ( spriteFrame )
    //     {
    //         const rect = spriteFrame.getRect();
    //         const points = [
    //             new Vec2( rect.xMin, rect.yMin ),
    //             new Vec2( rect.xMax, rect.yMin ),
    //             new Vec2( rect.xMax, rect.yMax ),
    //             new Vec2( rect.xMin, rect.yMax )
    //         ];
    //         collider.points = points;
    //     }
    // }
    //#region Spawn Screw
    public SpawnScrew ( screwData: ScrewData ): void 
    {
        for ( let i = 0; i < this.listHolePos.length; i++ )
        {
            const randomIndex = Math.floor( Math.random() * 9 );

            const spawnPos = this.listHolePos[ i ].getWorldPosition();
            const screwNode = instantiate( screwData.ScrewPrefab );
            const screw = screwNode.getComponent( Screw );

            screwNode.setParent( this.node.parent );
            screwNode.setWorldPosition( spawnPos );

            screw.InitSCrewData( randomIndex, screwData );
            this.listScrews.push( screw );

           
        }
    }

    //#endregion
}


