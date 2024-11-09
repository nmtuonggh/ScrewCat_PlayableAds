import { _decorator, CCInteger, color, Component, Node, Sprite } from 'cc';
import { eColorType } from '../../GameConfig/GameColorConfig';
import { GameColorData } from '../../GameConfig/GameColorData';
import { ScrewData } from '../../FakeSO/ScrewData';
import { Enum } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScrewRenderer')
export class ScrewRenderer extends Component 
{
    @property(Sprite)
    private topSprite: Sprite = null

    @property( { type: Enum(eColorType) } )
    public colorType: eColorType = eColorType.Green;

    //#region Encapsulated
    //#endregion

    protected start (): void
    {
        //this.screwSprite.color = GameColorData.GetColorByType( this.colorType );
    }

    public SetSprite ( colorType: eColorType, data : ScrewData ): void
    {
        this.colorType = colorType;
        this.topSprite.spriteFrame = data.ScrewTopSprite[ colorType ];
    }

    public SetSelfColor(data : ScrewData){
        this.topSprite.spriteFrame = data.ScrewTopSprite[ this.colorType ];
    }

}


