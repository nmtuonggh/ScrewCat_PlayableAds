import { _decorator, Component, instantiate, Node, Prefab, RichText, Sprite, tween } from 'cc';
import { Hole } from '../GameComponent/Hole/Hole';
import { GameManager } from '../Manager/GameManager';
import { Vec3 } from 'cc';
import { Label } from 'cc';
import { sp } from 'cc';
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
    @property(sp.Skeleton)
    public collectEff: sp.Skeleton = null

    private startScale : Vec3 = null;

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

    public SpawnStar ( amout: number, hole: Hole[] ): Node[]
    {
        const starList: Node[] = [];
        for ( let index = 0; index < amout; index++ )
        {
            const star = instantiate( this.starPrefab );
            star.parent = this.Holder;
            star.worldPosition = hole[ index ].node.worldPosition;
            starList.push( star );
        }
        return starList;
    }

    public Move ( starList: Node[] ): void 
    {
        for ( let index = 0; index < starList.length; index++ )
        {
            this.TweenMove( starList[ index ] );
        }
    }

    public TweenMove ( star: Node ): void
    {
        tween( star )
            .to( 0.7, { worldPosition: this.node.worldPosition }, { easing: 'backIn' } )
            .call( () =>
            {
                star.destroy();
                this.collectEff.setAnimation(0, 'animation', false);
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
        let scale = this.startScale.clone().add(new Vec3(0.3, 0.3, 0));
        let startScale = this.startScale.clone();
        tween(this.node)
        .to(0.2, { scale: new Vec3( scale.x, scale.y, 1 ) } )
        .to(0.2, { scale: new Vec3( startScale.x, startScale.y, 1 ) })
        .start();
    }
}


