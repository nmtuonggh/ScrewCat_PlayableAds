exports.onCreateMenu = function (assetInfo) {
    return [
      {
        label: 'NVTHAN.createAsset',
        click() {
          if (!assetInfo) {
            console.log('get create command from header menu');
          } else {
            console.log('get create command, the detail of diretory asset is:');
            console.log(assetInfo);
          }
        },
      },
    ];
  };
  
  exports.onAssetMenu = function (assetInfo) {
    return [
      {
        label: 'NVTHAN.assetCommandParent',
        submenu: [
          {
            label: 'NVTHAN.assetCommand1',
            enabled: assetInfo.isDirectory,
            click() {
              console.log('get it');
              console.log(assetInfo);
            },
          },
          {
            label: 'NVTHAN.assetCommand2',
            enabled: !assetInfo.isDirectory,
            click() {
              console.log('yes, you clicked');
              console.log(assetInfo);
            },
          },
        ],
      },
    ];
  };