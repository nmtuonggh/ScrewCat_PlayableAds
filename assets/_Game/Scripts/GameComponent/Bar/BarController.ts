import { _decorator, Component, ERigidBody2DType, HingeJoint2D, instantiate, Node, Prefab, RigidBody2D, UITransform, Vec2 } from 'cc';

import { BarPhysic } from './BarPhysic';
import { Screw } from '../Screw/Screw';
import { ScrewData } from '../../FakeSO/ScrewData';
import { GameLayerComponent } from '../GameLayerComponent';
import { Sprite } from 'cc';
import { Color } from 'cc';
import { UIOpacity } from 'cc';
import { tween } from 'cc';
import { getGameSystem } from '../../GameSystem';
const { ccclass, property } = _decorator;

@ccclass( 'BarController' )
export class BarController extends GameLayerComponent
{
    //#region EDITOR EXPOSED FIELD
    @property( { type: [ Screw ], visible: true, } )
    private listScrews: Screw[] = [];
    @property([Node])
    public listNodes: Node[] = [];
    @property( BarPhysic )
    private barPhysic: BarPhysic = null;
    @property( Sprite )
    private hideSprite: Sprite = null;
    @property( UIOpacity )
    private hideOpacity: UIOpacity = null;
    @property()
    public isNotCollide: boolean = false;
    //#endregion
    private modelSprite: Sprite = null;

    //#region PROPERTY
    public get ListScrews (): Screw[]
    {
        return this.listScrews;
    }
    public set ListScrews ( value: Screw[] )
    {
        this.listScrews = value;
    }
    public get BarPhysic (): BarPhysic
    {
        return this.barPhysic;
    }
    public set BarPhysic ( value: BarPhysic )
    {
        this.barPhysic = value;
    }
    //#endregion

    protected onLoad (): void
    {
        this.barPhysic = this.getComponent( BarPhysic );
        this.modelSprite = this.node.children[ 0 ].getComponent( Sprite );
    }

    protected update ( dt: number ): void
    {
        if ( this.node.position.y < -2000 )
        {
            this.node.destroy();
        }
    }

    //#region PUBLIC METHOD
    //#region Spawn Screw

    public InitScrewColor ( screwData: ScrewData ): void
    {
        for ( let i = 0; i < this.listScrews.length; i++ )
        {
            this.listScrews[ i ].getComponent( Screw ).ScrewRenderer.setSelfColor( screwData );
        }
        if ( this.listScrews.length === 1 )
        {
            this.barPhysic.setRigidBodyType( ERigidBody2DType.Kinematic );
        }
    }

    //#endregion

    public hideBar (): void
    {
        this.modelSprite.node.active = false;

        if ( this.hideSprite !== null )
        {
            this.hideSprite.node.active = true;
            this.hideOpacity.opacity = 0;
            this.hideOpacity.getComponent( Sprite ).color = new Color( 190, 190, 190, 255 );

            tween( this.hideOpacity )
                .delay( 0.5 )
                .to( 0.5, { opacity: 200 } )
                .start();
        }

    }

    public showBar (): void
    {
        this.modelSprite.node.active = true;

        if ( this.hideSprite !== null )
        {
            tween( this.hideOpacity )

                .to( 0.5, { opacity: 0 } )
                .call( () =>
                {
                    this.hideSprite.node.active = false;
                } )
                .start();
        }
    }

    public breakBar (): void
    {
        let listStar: Node[] = [];
        let listScrewsBreak = this.listScrews;
        for ( let i = 0; i < listScrewsBreak.length; i++ )
        {
            let screw = listScrewsBreak[ i ];
            if ( screw !== null )
            {
                getGameSystem().GameManager.CurrentScrew--;
                getGameSystem().GameManager.CollectedScrew++;
                if ( !screw.checkMoveBox() )
                {
                    let star = getGameSystem().StarController.spawnStarAtBar( screw.node.worldPosition, 0 );
                    getGameSystem().GameManager.updateDataBox( screw );
                    screw.node.destroy();
                    listStar.push( star );
                }

            }
        }

        if ( listStar.length > 0 )
        {
            //getGameSystem().GameManager.CollectedScrew += listStar.length;
            getGameSystem().StarController.moveListStart( listStar );
        }

        this.node.destroy();
    }
    //#endregion
}



