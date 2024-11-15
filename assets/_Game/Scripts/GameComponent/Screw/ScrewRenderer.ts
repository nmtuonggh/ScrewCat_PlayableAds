import { _decorator, CCInteger, color, Component, Node, Sprite } from 'cc';
import { eColorType } from '../../GameConfig/GameColorConfig';
import { GameColorData } from '../../GameConfig/GameColorData';
import { ScrewData } from '../../FakeSO/ScrewData';
import { Enum } from 'cc';
import { tween } from 'cc';
import { UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'ScrewRenderer' )
export class ScrewRenderer extends Component 
{
    @property( Sprite )
    private topSprite: Sprite = null
    @property( Sprite )
    public botSprite: Sprite = null
    @property( UIOpacity )
    public topOpacity: UIOpacity = null;

    @property( { type: Enum( eColorType ) } )
    public colorType: eColorType = eColorType.Green;

    @property( Number )
    public colorIndex: number = 0;

    //#region Encapsulated
    //#endregion

    protected start (): void
    {
        //this.screwSprite.color = GameColorData.GetColorByType( this.colorType );
    }

    public SetSprite ( colorType: eColorType, data: ScrewData ): void
    {
        this.colorType = colorType;
        this.topSprite.spriteFrame = data.ScrewTopSprite[ colorType ];
    }

    public SetSelfColor ( data: ScrewData )
    {
        this.topSprite.spriteFrame = data.ScrewTopSprite[ this.colorIndex ];
        this.colorType = this.colorIndex;
    }

    public HideScrew (): void
    {
        if ( this.topOpacity !== null )
        {
            this.topOpacity.opacity = 0;
        }
        this.botSprite.node.active = false;
    }

    public ShowScrew (): void
    {
        if ( this.topOpacity !== null )
        {
            tween( this.topOpacity )
                .delay( 0.5 )
                .to( 0.5, { opacity: 255 } )
                .call( () =>
                {
                    this.botSprite.node.active = true;
                } )
                .start();
        }
        this.botSprite.node.active = true;
    }

}


