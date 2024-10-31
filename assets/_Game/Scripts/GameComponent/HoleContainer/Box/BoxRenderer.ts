import { _decorator, CCInteger, Component, Node, Sprite, tween, Vec3 } from 'cc';
import { eColorType } from '../../../GameConfig/GameColorConfig';
import { GameColorData } from '../../../GameConfig/GameColorData';
const { ccclass, property } = _decorator;

@ccclass( 'BoxRenderer' )
export class BoxRenderer extends Component
{
    @property( Sprite )
    private boxSprite: Sprite = null
    @property( Node )
    public closeBox: Node = null;
    @property( CCInteger )
    private colorType: eColorType = eColorType.Blue;

    //#region Encapsulated

    public get ColorType (): eColorType
    {
        return this.colorType;
    }

    public set ColorType ( value: eColorType )
    {
        this.colorType = value;
    }

    //#endregion

    protected start (): void
    {
        this.boxSprite.color = GameColorData.GetColorByType( this.colorType );
    }

}


