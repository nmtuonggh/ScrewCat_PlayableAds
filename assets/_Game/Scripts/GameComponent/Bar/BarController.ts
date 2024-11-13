import { _decorator, Component, ERigidBody2DType, HingeJoint2D, instantiate, Node, Prefab, RigidBody2D, UITransform, Vec2 } from 'cc';

import { BarPhysic } from './BarPhysic';
import { PolygonCollider2D } from 'cc';
import { Screw } from '../Screw/Screw';
import { ScrewData } from '../../FakeSO/ScrewData';
import { GameLayerComponent } from '../GameLayerComponent';
import { Sprite } from 'cc';
import { Color } from 'cc';
import { UIOpacity } from 'cc';
import { tween } from 'cc';
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

    public modelSprite: Sprite = null;
    @property( Sprite )
    public hideSprite: Sprite = null;
    @property( UIOpacity )
    public hideOpacity: UIOpacity = null;
    //#endregion

    protected onLoad (): void
    {
        this.barPhysic = this.getComponent( BarPhysic );
        this.modelSprite = this.node.children[ 0 ].getComponent( Sprite );
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
        this.modelSprite.node.active = false;
        this.hideSprite.node.active = true;
        this.hideOpacity.opacity = 255;
    }

    public ShowBar (): void
    {
        tween( this.hideOpacity )

            .to( 0.5, { opacity: 0 } )
            .call( () =>
            {
                this.modelSprite.node.active = true;
                this.hideSprite.node.active = false;
            } )
            .start();
    }
}



