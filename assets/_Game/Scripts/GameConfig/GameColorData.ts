import { Color } from "cc";
import { eColorType } from "./GameColorConfig";

export class GameColorData 
{
    public static readonly Green: Color = new Color(0.1650943, 1, 0.1650943, 1);
    public static readonly Cyan: Color = new Color(0.5, 1, 1, 1);
    public static readonly Yellow: Color = new Color(1, 1, 0.5, 1);
    public static readonly Blue: Color = new Color(0.5, 0.5, 1, 1);
    public static readonly Lilac: Color = new Color(1, 0.5, 1, 1);
    public static readonly Red: Color = new Color(1, 0.5, 0.5, 1);
    public static readonly Pink: Color = new Color(1, 0.2, 1, 1);
    public static readonly Purple: Color = new Color(0.5, 0.2, 1, 1);
    public static readonly Orange: Color = new Color(1, 0.8, 0.6, 1);

    public static GetColorByType ( colorType: eColorType ): Color
    {
        switch (colorType) {
            case eColorType.Green:
                return this.Green;
            case eColorType.Cyan:
                return this.Cyan;
            case eColorType.Yellow:
                return this.Yellow;
            case eColorType.Blue:
                return this.Blue;
            case eColorType.Lilac:
                return this.Lilac;
            case eColorType.Red:
                return this.Red;
            case eColorType.Pink:
                return this.Pink;
            case eColorType.Purple:
                return this.Purple;
            case eColorType.Orange:
                return this.Orange;
            default:
                throw new Error("Invalid color type");
        }
    }
}


