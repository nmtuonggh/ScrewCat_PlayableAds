export class GameLayerMaskConfig{
    public static BAR_LAYER = 10 ;
    public static SCREW_LAYER = 11;

    public static BAR_LAYER_MASK = 1 << this.BAR_LAYER;
    public static SCREW_LAYER_MASK = 1 << this.SCREW_LAYER;
}