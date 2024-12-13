import { _decorator, AudioClip, AudioSource, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass( 'AudioController' )
export class AudioController extends Component
{
    //#region EXPOSED EDITOR FIELDS
    @property( AudioSource )
    public audioSource: AudioSource = null;
    @property( AudioSource )
    public backGroudSource: AudioSource = null;

    @property( AudioClip )
    public audioClip: AudioClip[] = [];
    @property( AudioClip )
    public audioComplete: AudioClip[] = [];
    @property( AudioClip )
    public audioWarning: AudioClip = null;
    @property( AudioClip )
    public chainVibrate: AudioClip = null;
    @property( AudioClip )
    public warning: AudioClip = null;
    @property( AudioClip )
    public starAudio: AudioClip = null;
    @property( AudioClip )
    public block: AudioClip = null;
    @property( AudioClip )
    public drill: AudioClip = null;
    @property( AudioClip )
    public win: AudioClip = null;

    //#endregion

    public lose(): void
    {
        this.audioSource.stop();
        this.backGroudSource.stop();
    }

    public playWin(): void
    {
        this.backGroudSource.stop();
        this.audioSource.clip = this.win;
        this.audioSource.playOneShot( this.audioSource.clip );
    }

    public playAudio ( type: AudioType )
    {
        this.audioSource.clip = this.audioClip[ type ];
        this.audioSource.playOneShot( this.audioSource.clip );
    }

    public playMewoComplete ( index: number )
    {
        this.audioSource.clip = this.audioComplete[ index ];
        this.audioSource.playOneShot( this.audioSource.clip );
    }

    public playerBGMusic ()
    {
        this.backGroudSource.play()
    }

    public playChain ()
    {
        this.audioSource.playOneShot( this.chainVibrate );
    }

    public playBlock ()
    {
        this.audioSource.playOneShot( this.block );
    }

    public playWarning ()
    {
        this.audioSource.playOneShot( this.warning );
    }

    public playProgessStar ()
    {
        this.audioSource.playOneShot( this.starAudio );
    }

    public playDrill ()
    {
        this.audioSource.playOneShot( this.drill );
    }
}

export enum AudioType
{
    screwIn = 0,
    screwOut = 1,
    boxComplete = 2,
    lose = 3,
    chainVibrate = 4,
    unlockChain = 5,
}



