import { _decorator, Component, instantiate, Node, Prefab, RichText, Sprite, tween } from 'cc';
import { Hole } from '../GameComponent/Hole/Hole';
import { GameManager } from '../Manager/GameManager';
import { Vec3 } from 'cc';
import { Label } from 'cc';
import { sp } from 'cc';
import { Tween } from 'cc';
import { set } from '../../../../extensions/nvthan/@types/packages/scene/@types/cce/utils/lodash';
const { ccclass, property } = _decorator;

@ccclass( 'StarController' )
export class StarController extends Component 
{
    @property( Sprite )
    private starSprite: Sprite = null;
    @property( Label )
    private text: Label = null;
    @property( Prefab )
    private starPrefab: Prefab = null;
    @property( Node )
    private Holder: Node = null;
    @property( Prefab )
    private starParticle: Prefab = null;
    @property( [ sp.Skeleton ] )
    public listCollectEff: sp.Skeleton[] = []
    private currentIndexEff: number = 0;

    private startScale: Vec3 = null;

    private static _instance: StarController = null;

    public static get Instance (): StarController
    {
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( StarController._instance === null )
        {
            StarController._instance = this;
        }
        // let prop = {v: 0};
        // tween(prop).to(1, {v: 1}, {onUpdate: (target, ratio) => console.log(ratio)}).start();
    }

    protected start (): void
    {
        this.SetFillAmount();
        this.startScale = this.node.scale;
    }

    public SetFillAmount (): void
    {
        const collectedScrew = GameManager.Instance.CollectedScrew;
        const toltalScrew = GameManager.Instance.TotalScrew;
        if ( collectedScrew > 0 )
        {
            const value = collectedScrew / toltalScrew;
            const intValue = Math.round( value * 100 ); // Làm tròn giá trị đến số nguyên gần nhất và nhân với 100
            this.text.string = `${ intValue }%`;
            //this.starSprite.fillRange = value; 
            tween( this.starSprite )
                .to( 0.5, { fillRange: value } )
                .start();
        }
        else
        {
            this.text.string = ``;
            this.starSprite.fillRange = 0;
        }
    }

    public SpawnStar ( amout: number, listWorldPosition: Vec3[], delay: number ): Node[]
    {
        const starList: Node[] = [];
        for ( let index = 0; index < amout; index++ )
        {
            const star = instantiate( this.starPrefab );
            star.parent = this.Holder;
            star.worldPosition = listWorldPosition[ index ];
            starList.push( star );
            setTimeout( () =>
            { }, delay );
        }
        return starList;
    }

    public SpawnStarAtBar ( worldPosition: Vec3, delay: number ): Node
    {
        const star = instantiate( this.starPrefab );
        star.parent = this.Holder;
        star.worldPosition = worldPosition;
        return star;
    }


    public MoveListStart ( starList: Node[] ): void 
    {
        for ( let index = 0; index < starList.length; index++ )
        {
            this.TweenMove( starList[ index ], index );
        }
    }

    public MoveStart ( star: Node ): void 
    {
        this.TweenMove( star, 0 );
    }


    public TweenMove ( star: Node, order: number ): void
    {
        tween( star )
            .delay( 0.15 * order )
            .to( 0.7, { worldPosition: this.node.worldPosition }, { easing: 'backIn' } )
            .call( () =>
            {
                star.destroy();
                this.CollectEffect();
                this.SetFillAmount();
                this.AnimGetStar();
            } )
            .start();
    }

    public PlayParticle ( pos: Vec3 ): void
    {
        const particle = instantiate( this.starParticle );
        particle.parent = this.Holder;
        particle.worldPosition = pos;
        setTimeout( () =>
        {
            particle.destroy();
        }, 2000 );
    }

    public AnimGetStar (): void 
    {
        let scale = new Vec3( 1.3, 1.3, 1 );
        let startScale = new Vec3( 1, 1, 1 );

        tween( this.node )
            .to( 0.05, { scale: new Vec3( startScale.x, startScale.y, 1 ) } )
            .to( 0.2, { scale: new Vec3( scale.x, scale.y, 1 ) } )
            .to( 0.2, { scale: new Vec3( startScale.x, startScale.y, 1 ) } )
            .start();
    }

    public CollectEffect (): void
    {
        //mỗi khi hàm này được gọi thì active 1 skeleton đang unactive trong listCollectEff, 
        //sau đó chạy animation của skeleton đó, chạy xong thì unactive skeleton đó
        let starSkeleton = this.listCollectEff[ this.currentIndexEff ];
        starSkeleton.node.active = true;
        starSkeleton.setCompleteListener( ( trackListener: sp.spine.TrackEntry ) =>
        {
            if ( trackListener.animation.name === 'animation' )
            {
                starSkeleton.node.active = false;
            }
        } );
        starSkeleton.setAnimation( 0, 'animation', false );

        this.currentIndexEff++;
        if ( this.currentIndexEff >= this.listCollectEff.length )
        {
            this.currentIndexEff = 0;
        }
    }
}


