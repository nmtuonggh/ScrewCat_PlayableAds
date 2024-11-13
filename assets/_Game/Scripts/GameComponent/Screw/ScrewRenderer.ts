import { _decorator, CCInteger, color, Component, Node, Sprite } from 'cc';
import { eColorType } from '../../GameConfig/GameColorConfig';
import { GameColorData } from '../../GameConfig/GameColorData';
import { ScrewData } from '../../FakeSO/ScrewData';
import { Enum } from 'cc';
import { tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'ScrewRenderer' )
export class ScrewRenderer extends Component 
{
    @property( Sprite )
    private topSprite: Sprite = null
    @property( Sprite )
    public botSprite: Sprite = null

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
        //this.topSprite.node.active = false;
        this.topSprite.color = color( 255, 255, 255, 0 );
        this.botSprite.node.active = false;
    }

    public ShowScrew (): void
    {
        //this.topSprite.node.active = true;
        tween(this.topSprite.color)
        .to(0.5, { a: 255 })
        .start();
        this.botSprite.node.active = true;
    }

}


