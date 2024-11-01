import { Color } from "cc";
import { eColorType } from "./GameColorConfig";

export class GameColorData 
{
    public static readonly Green: Color = new Color( 42, 255, 127, 255 );
    public static readonly Cyan: Color = new Color( 128, 255, 255, 255 );
    public static readonly Yellow: Color = new Color( 255, 255, 128, 255 );
    public static readonly Blue: Color = new Color( 128, 128, 255, 255 );
    public static readonly Lilac: Color = new Color( 255, 128, 255, 255 );
    public static readonly Red: Color = new Color( 255, 128, 128, 255 );
    public static readonly Pink: Color = new Color( 255, 51, 255, 255 );
    public static readonly Purple: Color = new Color( 128, 51, 255, 255 );
    public static readonly Orange: Color = new Color( 255, 204, 153, 255 );

    public static GetColorByType ( colorType: eColorType ): Color
    {
        switch ( colorType )
        {
            case eColorType.Green:
                return this.Green;
            case eColorType.Cyan:
                return this.Cyan;
            case eColorType.Yellow:
                return this.Yellow;
            case eColorType.Blue:
                return this.Blue;
            case eColorType.Gray:
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
                throw new Error( "Invalid color type" );
        }
    }
}


