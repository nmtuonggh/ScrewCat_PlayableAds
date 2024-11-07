import { _decorator, Component, instantiate, Node, Prefab, RichText, Sprite, tween } from 'cc';
import { Hole } from '../GameComponent/Hole/Hole';
import { GameManager } from '../Manager/GameManager';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'StarController' )
export class StarController extends Component 
{
    @property( Sprite )
    private starSprite: Sprite = null;
    @property( RichText )
    private text: RichText = null;
    @property( Prefab )
    private starPrefab: Prefab = null;
    @property( Node )
    private Holder: Node = null;
    @property(Prefab)
    private starParticle: Prefab = null;

    private static _instance: StarController = null;

    public static get Instance (): StarController
    {
        if ( this._instance === null )
        {
            this._instance = new StarController();
        }
        return this._instance;
    }

    protected override onLoad (): void
    {
        if ( StarController._instance === null )
        {
            StarController._instance = this;
        }
        this.SetFillAmount();
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
            this.starSprite.fillRange = value; 
            // tween(this.starSprite.fillRange)
            // .to( 0.5, { value: value } )
            // .start();
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
            .to( 0.5, { worldPosition: this.node.worldPosition } , { easing: 'sineInOut' } )
            .call( () =>
            {
                star.destroy();
                this.SetFillAmount();
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
}


