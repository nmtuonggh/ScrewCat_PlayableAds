import { _decorator, CCInteger, color, Component, Node, Sprite } from 'cc';
import { eColorType } from '../../GameConfig/GameColorConfig';
import { GameColorData } from '../../GameConfig/GameColorData';
const { ccclass, property } = _decorator;

@ccclass('ScrewRenderer')
export class ScrewRenderer extends Component 
{
    @property(Sprite)
    private screwSprite: Sprite = null

    @property( CCInteger )
    public colorType: eColorType = eColorType.Green;

    //#region Encapsulated
    //#endregion

    protected onLoad (): void
    {
        this.screwSprite = this.getComponentInChildren( Sprite );
    }

    protected start (): void
    {
        //this.screwSprite.color = GameColorData.GetColorByType( this.colorType );
    }

}


