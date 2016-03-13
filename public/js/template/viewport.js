function viewport() {
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [
            {
                title: '点点网络后台管理平台',
                region: 'north',
                width: 'auto',
                height: 120,
                xtype: 'panel',
                layout: 'fit',
                items: [
                    {
                        html: '<div id="gmHead"></div>'
                    }
                ]
            },
            {
                region: 'west',
                xtype: 'panel',
                split: true,
                collapsible: true,
                collapseMode: 'mini',
                title: '关键数据总览',
                bodyStyle: 'padding:5px;',
                layout: 'fit',
                width: 200,
                minSize: 200,
                items: [
                    {
                        html: '<div id="navigation"></div>'
                    }
                ]
            },
            {
                region: 'center',
                xtype: 'panel',
                layout: 'fit',
                items: [
                    {
                        html: '<div id="condition"></div>' +
                        '<div id="dataRegion" style="width:100%; height:100%"> ' +
                        '<div id="search_player" style="float:left; width:340px;"></div>' +
                        '<div id="player_region" style="float:left; width:872px;">' +
                        '<div id="player_info"></div>' +
                        '<div id="player_data"></div>' +
                        '</div>' +
                        '</div>'
                    }

                ]
            }
        ]
    });

    return viewport;
}