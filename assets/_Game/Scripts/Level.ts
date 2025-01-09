import { _decorator, Component, Node } from 'cc';
import { BarController } from './GameComponent/Bar/BarController';
import { Screw } from './GameComponent/Screw/Screw';
import { PolygonCollider2D } from 'cc';
import { GameLayerOder } from './GameComponent/GameLayerOder';
import { ScrewRenderer } from './GameComponent/Screw/ScrewRenderer';

const { ccclass, property } = _decorator;

@ccclass( 'Level' )
export class Level extends Component
{
    //#region PRIVATE FIELDS
    private _updatedGamePlayer = false;
    private updatedHideLayer = false;
    private flex = false;
    private syncDataBox = false;

    private barLayer: 10;
    private screwLayer: 11;
    @property( [ BarController ] )
    listBar: BarController[] = [];

    //#endregion

    //#region PROPERTIES
    @property
    set UpdatedGamePlayer ( value: boolean )
    {
        if ( !this._updatedGamePlayer )
        {
            this._updatedGamePlayer = value;
            this.updateGameLayer();
            this.updateLayerBarAndScrew();
            this.setPolygonCollider();
            this.setScrewToBar();
        }
    }

    get UpdatedGamePlayer ()
    {
        return this._updatedGamePlayer;
    }

    @property
    set Flex ( value: boolean )
    {
        if ( !this.flex )
        {
            this.flex = value;
            this.setFlex();
        }
    }

    get Flex ()
    {
        return this.flex;
    }

    @property
    set SyncDataBox ( value: boolean )
    {
        if ( !this.syncDataBox )
        {
            this.syncDataBox = value;

        }
    }
    get SyncDataBox ()
    {
        return this.syncDataBox;
    }


    //#endregion

    updateGameLayer ()
    {
        var gamelayers = this.node.getComponentsInChildren( GameLayerOder );
        for ( let i = 0; i < gamelayers.length; i++ )
        {
            gamelayers[ i ].layerOrder = i;
        }
    }

    updateLayerBarAndScrew ()
    {
        var bars = this.node.getComponentsInChildren( BarController );
        var screws = this.node.getComponentsInChildren( Screw );

        bars.forEach( element =>
        {
            element.node.layer = 1 << 10;
            var child = element.node.children;
            child.forEach( element =>
            {
                element.layer = 1 << 10;
            } );
        } );
        screws.forEach( element =>
        {
            element.node.layer = 1 << 11;
            var child = element.node.children;
            child.forEach( element =>
            {
                element.layer = 1 << 11;
            } );
        } );
    }

    setPolygonCollider ()
    {
        var bars = this.node.getComponentsInChildren( BarController );
        bars.forEach( element =>
        {
            var modelCollider = element.node.children[ 0 ].getComponent( PolygonCollider2D );
            if ( modelCollider === null ) return;
            element.getComponent( PolygonCollider2D ).threshold = 10;
            element.getComponent( PolygonCollider2D ).points = [];
            element.getComponent( PolygonCollider2D ).points = modelCollider.points;
            element.getComponent( PolygonCollider2D ).apply();
            modelCollider.destroy();
        } );
    }

    setScrewToBar ()
    {
        // var bars = this.node.getComponentsInChildren( BarController );

        // for ( let i = 0; i < bars.length; i++ )
        // {
        //     if ( bars[ i ].ListScrews.length !== 0 ) continue;
        //     const bar = bars[ i ];
        //     bar.ListScrews.length = 0;

        //     let listScrewInLayer = bar.node.parent.getComponentsInChildren( Screw );

        //     for ( let j = 0; j < listScrewInLayer.length; j++ )
        //     {
        //         const screw = listScrewInLayer[ j ];
        //         const fullName = screw.node.name;
        //         const extractedName = fullName.substring( fullName.indexOf( "_" ) + 1 );
        //         const barName = bar.node.name;
        //         var barId = barName.substring( barName.indexOf( "_" ) + 1 );

        //         if ( extractedName === barId )
        //         {
        //             bar.ListScrews.push( screw );
        //         }

        //         //lay colorIndex
        //         const parts = fullName.split( "_" );
        //         const colorIndex = parts[ 1 ];

        //         screw.ScrewRenderer = screw.node.getComponent( ScrewRenderer );
        //         screw.ScrewRenderer.colorIndex = parseInt( colorIndex);
        //     }
        // }
        var bars = this.node.getComponentsInChildren( BarController );

        for ( let i = 0; i < bars.length; i++ )
        {
            if ( bars[ i ].ListScrews.length !== 0 ) continue;
            const bar = bars[ i ];
            bar.ListScrews.length = 0;

            let listScrewInLayer = bar.node.parent.getComponentsInChildren( Screw );

            for ( let j = 0; j < listScrewInLayer.length; j++ )
            {
                const screw = listScrewInLayer[ j ];
                const fullName = screw.node.name;
                const extractedName = fullName.substring( fullName.indexOf( "-" ) + 1 );
                const barName = bar.node.name;
                var barId = barName.substring( barName.indexOf( "_" ) + 1 );

                console.log( extractedName + " === " + barId );
                if ( extractedName === barId )
                {
                    bar.ListScrews = [];
                    bar.ListScrews.push( screw );
                }

                //lay colorIndex
                const parts = fullName.split( "_" );
                const colorIndex = parts[ 1 ];

                screw.ScrewRenderer = screw.node.getComponent( ScrewRenderer );
                screw.ScrewRenderer.colorIndex = parseInt( colorIndex );
            }
        }
    }

    setFlex ()
    {
        // var screws = this.node.getComponentsInChildren( Screw );
        // var bars = this.node.getComponentsInChildren( BarController );
        // // for ( let i = 0; i < this.listBar.length; i++ )
        // // {
        // //     var bar = this.listBar[ i ];
        // //     for ( let i = 0; i < screws.length; i++ )
        // //     {
        // //         var screw = screws[ i ];
        // //         if ( screw.node.name === "Screw_3_-0" )
        // //         {
        // //            bar.ListScrews.push( screw );
        // //         }
        // //     }
        // // }
        // for ( let i = 0; i < bars.length; i++ )
        // {
        //     var bar = bars[ i ];
        //     // if(bar.node.name === "Bar_0")
        //     // {
        //     //     console.log("Bar_0 lenght : " + bar.ListScrews.length);
        //     //     for ( let j = 0; j < bar.ListScrews.length; j++ )
        //     //     {
        //     //         var screw = bar.ListScrews[ j ];
        //     //         console.log("Screw name: " + screw.node.name);
        //     //     }

        //     // }
        //     bar.ListScrews = [];
        // }

        // var bars = this.node.getComponentsInChildren( BarController );

        // for ( let i = 0; i < bars.length; i++ )
        // {
        //     if ( bars[ i ].ListScrews.length !== 0 ) continue;
        //     const bar = bars[ i ];
        //     bar.ListScrews.length = 0;

        //     let listScrewInLayer = bar.node.parent.getComponentsInChildren( Screw );

        //     for ( let j = 0; j < listScrewInLayer.length; j++ )
        //     {
        //         const screw = listScrewInLayer[ j ];
        //         const fullName = screw.node.name;
        //         const extractedName = fullName.substring( fullName.indexOf( "-" ) + 1 );
        //         const barName = bar.node.name;
        //         var barId = barName.substring( barName.indexOf( "_" ) + 1 );

        //         console.log( extractedName + " === " + barId );
        //         if ( extractedName === barId )
        //         {
        //             bar.ListScrews = [];
        //             bar.ListScrews.push( screw );
        //         }

        //         //lay colorIndex
        //         const parts = fullName.split( "_" );
        //         const colorIndex = parts[ 1 ];

        //         screw.ScrewRenderer = screw.node.getComponent( ScrewRenderer );
        //         screw.ScrewRenderer.colorIndex = parseInt( colorIndex );
        //     }
        // }

        var bars = this.node.getComponentsInChildren( BarController );
        for ( let i = 0; i < bars.length; i++ )
        {
            var bar = bars[ i ];
            bar.ListScrews = [];
            for ( let j = 0; j < bar.listNodes.length; j++ )
            {
                bar.ListScrews.push( bar.listNodes[ j ].getComponent( Screw ) );
            }
        }
    }
}


