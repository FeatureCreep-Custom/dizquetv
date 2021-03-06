module.exports = function (plex, dizquetv, $timeout) {
    return {
        restrict: 'E',
        templateUrl: 'templates/plex-settings.html',
        replace: true,
        scope: {},
        link: function (scope, element, attrs) {
            dizquetv.getPlexServers().then((servers) => {
                scope.servers = servers
            })
            scope.addPlexServer = function () {
                scope.isProcessing = true
                plex.login()
                    .then((result) => {
                        result.servers.forEach((server) => {
                            // add in additional settings
                            server.arGuide = true
                            server.arChannels = false // should not be enabled unless dizqueTV tuner already added to plex
                            dizquetv.addPlexServer(server)
                        });
                        return dizquetv.getPlexServers()
                    }).then((servers) => {
                        scope.$apply(() => {
                            scope.servers = servers
                            scope.isProcessing = false
                        })
                    }, (err) => {
                        scope.$apply(() => {
                            scope.isProcessing = false
                            scope.error = err
                            $timeout(() => {
                                scope.error = null
                            }, 3500)
                        })
                    })
            }
            scope.deletePlexServer = (x) => {
                dizquetv.removePlexServer(x)
                    .then((servers) => {
                        scope.servers = servers
                    })
            }
            dizquetv.getPlexSettings().then((settings) => {
                scope.settings = settings
            })
            scope.updateSettings = (settings) => {
                dizquetv.updatePlexSettings(settings).then((_settings) => {
                    scope.settings = _settings
                })
            }
            scope.resetSettings = (settings) => {
                dizquetv.resetPlexSettings(settings).then((_settings) => {
                    scope.settings = _settings
                })
            }
            scope.pathOptions=[
                {id:"plex",description:"Plex"},
                {id:"direct",description:"Direct"}
            ];
            scope.hideIfNotPlexPath = () => {
                return scope.settings.streamPath != 'plex'
            };
            scope.hideIfNotDirectPath = () => {
                return scope.settings.streamPath != 'direct'
            };
            scope.maxAudioChannelsOptions=[
                {id:"1",description:"1.0"},
                {id:"2",description:"2.0"},
                {id:"3",description:"2.1"},
                {id:"4",description:"4.0"},
                {id:"5",description:"5.0"},
                {id:"6",description:"5.1"},
                {id:"7",description:"6.1"},
                {id:"8",description:"7.1"}
            ];
            scope.resolutionOptions=[
                {id:"420x420",description:"420x420"},
                {id:"576x320",description:"576x320"},
                {id:"720x480",description:"720x480"},
                {id:"1024x768",description:"1024x768"},
                {id:"1280x720",description:"1280x720"},
                {id:"1920x1080",description:"1920x1080"},
                {id:"3840x2160",description:"3840x2160"}
            ];
            scope.streamProtocols=[
                {id:"http",description:"HTTP"},
                {id:"hls",description:"HLS"}
            ];
            scope.audioBoostOptions=[
                {id:"100",description:"None"},
                {id:"120",description:"Small"},
                {id:"140",description:"Medium"},
                {id:"160",description:"Large"},
                {id:"180",description:"Huge"}
            ];
        }
    };
}
