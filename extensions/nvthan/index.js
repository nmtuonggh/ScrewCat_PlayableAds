
const Movement = {
    Horizontal: 0,
    Vertical: 1,
    Unrestricted: 2,
    Custom: 3
}

const Arrangement = {
    Horizontal: 0,
    Vertical: 1,
    CellSnap: 2
}

const FillDirection = {
    Horizontal: 0,
    Vertical: 1,
    Radial90: 2,
    Radial180: 3,
    Radial360: 4,
}



exports.template = `
	
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>NVTHAN PANEL</title>
<div style = "display: flex; flex-direction: column; width: 100%; height: 100%;">
    <div style=
    "
    width: 100%;
    height: 100%;
    ">
        <h1 style="text-align: center;">PREFAB</h1>
        <div>
        <h3>Hole Prefab</h3>
        <ui-asset droppable="cc.Prefab" value="83fe9427-348b-4ce9-b03c-5888f24b8029" style = "margin-top: 10px; margin-bottom: 10px;width : 100%;" class = "holePrefab"></ui-asset>
        <h3>Screw Prefab</h3>
        <ui-asset droppable="cc.Prefab" value="83fe9427-348b-4ce9-b03c-5888f24b8029" style = "margin-top: 10px; margin-bottom: 10px;width : 100%;" class = "screwPrefab"></ui-asset>
        <h3>Bar Prefab</h3>
        <ui-asset droppable="cc.Prefab" value="feb5cdc1-51c5-42a5-9f88-f4a5adcae7bf" style = "margin-top: 10px; margin-bottom: 10px;width : 100%;" class = "barPrefab"></ui-asset>
        <h3>Level Prefab</h3>
        <ui-asset droppable="cc.Prefab" value="16656d9e-3a95-4f0a-bc34-ab58ca58da15" style = "margin-top: 10px; margin-bottom: 10px;width : 100%;" class = "levelPrefab"></ui-asset>
        <h3>PATH JSON
            <ui-icon color value="home" style="font-size: 12px;"></ui-icon>
        </h3>
        </div>

        <h1 style="text-align: center;">SETTING</h1>

        <h3>Level name</h3> 
        <div>
            <ui-input value="test" class="levelName" style = "width : 100%"></ui-input>
        </div>

        <h3>Ratio Position</h3> 
        <div>
            <ui-input value="46.9" class="ratioPosition" style = "width : 100%"></ui-input>
        </div>

        <h3>Optimize Texture</h3>
        <div>
            <ui-checkbox value="true" class = "checkOptimize">OPTIMIZE</ui-checkbox>
            <br>
            <ui-select placeholder="choose" value = "1" class = "selectType">
            <option value="1">Type 1</option>
            <option value="2">Type 2</option>
            <option value="3">Type 3</option>
            </ui-select>
        </div>
        <h1 style="text-align: center;">FOLDER</h1>
        <h3>JSON Folder
            <ui-icon color value="home" style="font-size: 12px;"></ui-icon>
        </h3>
        
        <div>
            <ui-input 
                value="C:/Users/Admin/Desktop/ScrewCat_PlayableAds/assets/LevelData"
                class="pathJSON" 
                style = "margin-top: 10px; margin-bottom: 10px;width : 100%" ></ui-input>
                <ui-button 
                    stype = "align-items : center;"
                    class="openDirectoryJSON" 
                    type="default"">
                        OPEN JSON FOLDER
                </ui-button>
        </div>

        <h3>Texture Folder
            <ui-icon color value="home" style="font-size: 12px;"></ui-icon>
        </h3>

        <div>
            <ui-input value="db://assets/_Game/Images" class="textureFolder" style = "margin-top: 10px; margin-bottom: 10px;width : 100%;" ></ui-input>
        </div>

        <div>
            <ui-button class="openDirectoryTexture" type="default" >OPEN TEXTURE FOLDER</ui-button>
        </div>
        <br>
        <div>
            <ui-button class="onCreateClicked">CREATE</ui-button>
        </div>
    </div>
</div>
`

//D:/Cocos_Project/Screw Puzzle/ScrewPuzzlePA/Source/ScrewPuzzle2D_PlayableAds/assets/JSON
//F:/Cocos_Project/ScrewPuzzle2D/ScrewPuzzle2D_PlayableAds/Source/ScrewPuzzle2D_PlayableAds/assets/JSON




exports.$ = {
    holePrefab: '.holePrefab',
    screwPrefab: '.screwPrefab',
    barPrefab: '.barPrefab',
    levelPrefab: '.levelPrefab',

    ratioPosition: '.ratioPosition',
    levelName: '.levelName',

    checkOptimize: '.checkOptimize',
    selectType: '.selectType',


    onCreateClicked: '.onCreateClicked',
    openDirectoryTexture: '.openDirectoryTexture',
    openDirectoryJSON: '.openDirectoryJSON',
    pathJSON: '.pathJSON',
    textureFolder: '.textureFolder',
}

exports.ready = async function ()
{
    this.$.openDirectoryJSON.addEventListener( 'click', () =>
    {
        this.openDirectoryJSON();
    } )
    this.$.openDirectoryTexture.addEventListener( 'click', () =>
    {
        this.openDirectoryTexture();
    } )
    this.$.onCreateClicked.addEventListener( 'click', () =>
    {
        this.create();
        //this.Testing();
    } )
}
exports.methods = {
    async openDirectoryTexture ()
    {
        const config = {
            type: 'directory',
        };
        const data = await Editor.Dialog.select( config );
        let targetPath = "db://assets";
        if ( data.filePaths[ 0 ] != null )
        {
            const splitPath = data.filePaths[ 0 ].split( '\\' );
            let index = 0;
            for ( let i = 0; i < splitPath.length; i++ )
            {
                if ( splitPath[ i ] == "assets" )
                {
                    index = i;
                }
            }
            for ( let i = index + 1; i < splitPath.length; i++ )
            {
                targetPath += "/" + splitPath[ i ];
            }
        }
        this.$.textureFolder.value = targetPath;
    },
    async openDirectoryJSON ()
    {
        const config = {
            type: 'directory',
        };
        const data = await Editor.Dialog.select( config );
        this.$.pathJSON.value = data.filePaths[ 0 ];

        let targetPath = "";
        if ( data.filePaths[ 0 ] != null )
        {
            const splitPath = data.filePaths[ 0 ].split( '\\' );
            targetPath = splitPath[ 0 ] + "";
            for ( let i = 1; i < splitPath.length; i++ )
            {
                targetPath += "/" + splitPath[ i ];
            }
        }
        this.$.pathJSON.value = targetPath;
    },

    async create ()
    {
        const json = require( this.$.pathJSON.value + "/" + this.$.levelName.value + '.json' );
        //console.log(this.$.Canvas.value);
        if ( json != null )
        {
            let root = await Editor.Message.request( 'scene', 'create-node', {
                "name": this.$.levelName.value,
                "assetUuid": this.$.levelPrefab.value,
            } );

            let node = await Editor.Message.request( 'scene', 'query-node', root );
            this.editNode( json, root, node )
        }
    },

    async editNode ( info, uuidNode, parentNode )
    {
        const assets = await Editor.Message.request( 'asset-db', 'query-assets', {
            type: 'image',
            pattern: this.$.textureFolder.value + "/" + this.$.levelName.value + "/**/*",
        } );

        console.log( assets.length );

        var uuidLayer = [];
        let targetParent = parentNode;
        let targetUUIDParent = uuidNode;

        var maxIndexLayer = 0;
        for ( let i = 0; i < info.layers.length; i++ )
        {
            if ( maxIndexLayer < parseInt( info.layers[ i ].layerOrder ) )
            {
                maxIndexLayer = parseInt( info.layers[ i ].layerOrder );
            }
        }

        for ( let i = 0; i <= maxIndexLayer; i++ )
        {
            let root = await Editor.Message.request( 'scene', 'create-node', {
                "name": "Layer_" + i,
                "parent": targetUUIDParent
            } );
            uuidLayer.push( root );
        }
        let ratioPosition = parseFloat( this.$.ratioPosition.value );
        var indexBar = 0;
        if ( info )
        {
            if ( info.bars )
            {

                for ( let i = 0; i < info.bars.length; i++ )
                {
                    var child = info.bars[ i ];
                    let splitName = child.shapeName.split( '_' );
                    let root = await Editor.Message.request( 'scene', 'create-node', {
                        "name": child.shapeName,
                        "parent": uuidLayer[ parseInt( child.layer ) ],
                        "assetUuid": this.$.barPrefab.value,
                    } );
                    indexBar++;
                    let node = await Editor.Message.request( 'scene', 'query-node', root );
                    const position = node.position;
                    Editor.Message.send( 'scene', 'set-property', {
                        "uuid": root,
                        "path": `position`,
                        "dump": {
                            "type": 'cc.Vec3',
                            "value": { x: child.position.x * ratioPosition, y: child.position.y * ratioPosition, z: 0 }
                        }
                    } );
                    const rotation = node.rotation;
                    Editor.Message.send( 'scene', 'set-property', {
                        "uuid": root,
                        "path": `rotation`,
                        "dump": {
                            "type": 'cc.Vec3',
                            "value": { x: 0, y: 0, z: child.rotation }
                        }
                    } );

                    if ( splitName[ 0 ] == "Bar" )
                    {

                        var uuidChildren = node.children[ 0 ].value.uuid
                        let newNode = await Editor.Message.request( 'scene', 'query-node', uuidChildren );
                        let posBar = splitName[ 2 ];
                        const comps = newNode.__comps__;
                        let textures = 0;

                        for ( let i = 0; i < assets.length; i++ )
                        {
                            if ( assets[ i ] != null )
                            {
                                if ( assets[ i ].name.split( '.' )[ 0 ] == child.shapeName )
                                {
                                    textures = assets[ i ].subAssets.f9941.uuid;
                                    break;
                                }
                            }
                        }
                        for ( let i = 0; i < comps.length; i++ )
                        {
                            if ( comps[ i ].type === 'cc.Sprite' )
                            {
                                Editor.Message.send( 'scene', 'set-property', {
                                    "uuid": uuidChildren,
                                    "path": `__comps__.${ i }.spriteFrame`,
                                    "dump": {
                                        "type": 'cc.SpriteFrame',
                                        "value": {
                                            "uuid": textures
                                        }
                                    }
                                } );
                            }
                        }


                    }

                };
            }
            if ( info.screws )
            {
                let indexBolts = 0;
                for ( let i = 0; i < info.screws.length; i++ )
                {
                    var layer = parseInt( info.screws[ i ].layer );
                    let root = await Editor.Message.request( 'scene', 'create-node', {
                        "name": "Screw_" + info.screws[ i ].colorIndex + "_" + info.screws[ i ].barName,
                        "parent": uuidLayer[ layer ],
                        "assetUuid": this.$.screwPrefab.value,
                    } );
                    indexBolts++;
                    let node = await Editor.Message.request( 'scene', 'query-node', root );
                    const position = node.position;
                    Editor.Message.send( 'scene', 'set-property', {
                        "uuid": root,
                        "path": `position`,
                        "dump": {
                            "type": 'cc.Vec3',
                            "value": { x: info.screws[ i ].position.x * ratioPosition, y: info.screws[ i ].position.y * ratioPosition, z: 0 }
                        }
                    } );

                    // //test setvalue
                    // const comps = node.__comps__;
                    // for ( let i = 0; i < comps.length; i++ )
                    // {
                    //     if ( comps[ i ].type === 'ScrewRenderer' )
                    //     {
                    //         console.log( comps[ i ].type )
                    //         Editor.Message.send( 'scene', 'set-property',
                    //             {
                    //                 "uuid": node.uuid,
                    //                 "path": `__comps__.${ i }.colorIndex`,
                    //                 "dump": {
                    //                     "type": 'Number',
                    //                     "value":
                    //                     {
                    //                         "colorIndex": info.screws[ i ].colorIndex
                    //                     }
                    //                 }
                    //             } );
                    //     }
                    // }
                };

            }
        }
    },

    async Testing ()
    {
        let root = await Editor.Message.request( 'scene', 'create-node', {
            "name": "Testing",
            "assetUuid": this.$.barPrefab.value,
        } );
        let newNode = await Editor.Message.request( 'scene', 'query-node', root );
        uuidNode = newNode.children[ 0 ].value.uuid;
        let rendererNode = await Editor.Message.request( 'scene', 'query-node', uuidNode );
        const comps = rendererNode.__comps__;
        for ( let i = 0; i < comps.length; i++ )
        {
            if ( comps[ i ].type === 'cc.Sprite' )
            {
                console.log( comps[ i ] );
            }
        }
        //_sizeMode
        //_type
    }
}
