import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
import * as exp from 'constants';
import { GameManager } from '../Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass( 'AudioController' )
export class AudioController extends Component
{
    @property( AudioClip )
    public audioClip: AudioClip[] = [];
    @property( AudioClip )
    public audioComplete: AudioClip[] = [];
    @property( AudioClip )
    public audioWarning: AudioClip = null;

    @property( AudioSource )
    public audioSource: AudioSource = null;

    @property( AudioSource )
    public bg: AudioSource = null;

    @property( AudioSource )
    public Chain: AudioSource = null;

    @property( AudioSource )
    public Waning: AudioSource = null;

    @property( AudioSource )
    public ProgessStar: AudioSource = null;
    @property( AudioClip )
    public star: AudioClip = null;

    @property( AudioSource )
    public Block: AudioSource = null;

    private static _instance: AudioController = null;

    public static get Instance (): AudioController
    {
        return this._instance;
    }

    protected onLoad (): void
    {
        if ( AudioController._instance === null )
        {
            AudioController._instance = this;
        }
        //this.PlayerBG( );
    }


    public CheckLose (): void
    {
        if ( GameManager.Instance.lose === false ) return;
        this.bg.stop();
        this.Chain.stop();
        this.Waning.stop();
    }

    public PlayAudio ( type: AudioType )
    {
        this.audioSource.clip = this.audioClip[ type ];
        this.audioSource.playOneShot( this.audioSource.clip );
    }

    public PlayMewoComplete ( index: number )
    {
        //const index = Math.floor(Math.random() * this.audioComplete.length);
        this.audioSource.clip = this.audioComplete[ index ];
        this.audioSource.playOneShot( this.audioSource.clip );
    }

    public PlayerBG ()
    {
        this.bg.play();
    }

    public PlayChain ()
    {
        this.Chain.play();
    }

    public PlayBlock ()
    {
        this.Block.play();
    }

    public PlayWarning ()
    {
        this.Waning.playOneShot( this.audioWarning );
    }

    public PlayProgessStar ()
    {
        this.ProgessStar.playOneShot(this.star);
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



