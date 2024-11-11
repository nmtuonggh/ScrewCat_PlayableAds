import { _decorator, Component, ERigidBody2DType, HingeJoint2D, instantiate, Node, Prefab, RigidBody2D, UITransform, Vec2 } from 'cc';

import { BarPhysic } from './BarPhysic';
import { PolygonCollider2D } from 'cc';
import { Screw } from '../Screw/Screw';
import { ScrewData } from '../../FakeSO/ScrewData';
import { GameLayerComponent } from '../GameLayerComponent';
import { Sprite } from 'cc';
import { Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'BarController' )
export class BarController extends GameLayerComponent
{
    //#region Fields
    @property( Number )
    public idFirstScrew: number = 0;
    @property( Number )
    public screwCount: number = 0;
    @property( Screw )
    public listScrews: Screw[] = [];
    @property( BarPhysic )
    public barPhysic: BarPhysic = null;


    @property( PolygonCollider2D )
    public collider: PolygonCollider2D = null;
    @property( PolygonCollider2D )
    public modelCollider: PolygonCollider2D = null;

    public sprite: Sprite = null;

    //#endregion

    protected onLoad (): void
    {
        this.barPhysic = this.getComponent( BarPhysic );
        this.sprite = this.node.children[ 0 ].getComponent( Sprite );
    }

    protected start (): void
    {
        // this.collider.points = this.modelCollider.points.map(point => {
        //     return new Vec2(
        //         point.x * 0.7,
        //         point.y * 0.7
        //     );
        // });
        //log ten cua cac screw trong listScrews

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
            this.listScrews[ i ].getComponent( Screw ).ScrewRenderer.SetSelfColor( screwData );
        }
    }

    //#endregion

    public HideBar (): void
    {
        this.sprite.color = new Color( 0, 0, 0, 255 );
    }

    public ShowBar (): void
    {
        this.sprite.color = new Color( 255, 255, 255, 255 );
    }
}


