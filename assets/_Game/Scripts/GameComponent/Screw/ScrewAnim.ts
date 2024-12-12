import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'ScrewAnim' )
export class ScrewAnim extends Component
{
    private anim: Animation | null = null;

    protected onLoad (): void
    {
        this.anim = this.getComponent( Animation );
    }


    public ScrewOut (): void
    {
        this.anim.play( 'ScrewOut' );
    }

    public ScrewIn (): void
    {
        this.anim.play( 'ScrewIn' );
    }

    public stopPlayTutorial (): void
    {
        if ( this.anim.clips.length > 6 )
        {
            this.anim.play( 'TutorialScrew' );
        }
    }

    public ScrewBlock ( axis: Number ): void
    {
        switch ( axis )
        {
            case 0:
                this.anim.play( 'top' );
                break;
            case 1:
                this.anim.play( 'bot' );
                break;
            case 2:
                this.anim.play( 'left' );
                break;
            case 3:
                this.anim.play( 'right' );
                break;
        }
    }
}


