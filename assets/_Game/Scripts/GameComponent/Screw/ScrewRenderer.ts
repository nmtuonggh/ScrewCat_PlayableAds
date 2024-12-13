import { _decorator, CCInteger, color, Component, Node, Sprite } from 'cc';
import { eColorType } from '../../GameConfig/GameColorConfig';
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
    private botSprite: Sprite = null
    @property( UIOpacity )
    private topOpacity: UIOpacity = null;
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

    public setSprite ( colorType: eColorType, data: ScrewData ): void
    {
        this.colorType = colorType;
        this.topSprite.spriteFrame = data.ScrewTopSprite[ colorType ];
    }

    public setSelfColor ( data: ScrewData )
    {
        this.topSprite.spriteFrame = data.ScrewTopSprite[ this.colorIndex ];
        this.colorType = this.colorIndex;
    }

    public hideScrew (): void
    {
        if ( this.topOpacity !== null )
        {
            this.topOpacity.opacity = 0;
        }
        this.botSprite.node.active = false;
    }

    public showScrew (): void
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
        else
        {
            this.botSprite.node.active = true;
        }
    }

}


