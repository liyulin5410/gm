function cardToImageUrls(cardString) {
    var cards = cardString.split(" ");
    return cards.map(function (card, index, context) {
        if (card === '') {
            return '';
        }
        var imageName =  "poker_" + card[1].toLowerCase() + card[0].replace('A', '1').replace('T', '10').replace('J', '11').replace('Q', '12').replace('K', 13) + ".JPG";
        return "<img width='44px' height='61px' src='/img/pokers/" + imageName + "'>";
    });
}

function showCards() {
    var form = new Ext.FormPanel({
        frame : true,
        title : '',
        width : 'auth',
        height : 35,
        region : 'center',
        fieldDefaults : {
            labelAlign : 'left',
            msgTarget : 'side',
            width : 500,
            style : 'margin-left:15px;'
        },
        layout : 'column',
        items : [
            {
                xtype : 'textfield',
                fieldLabel: '玩家ID',
                labelWidth: 50,
                width: 160,
                name : 'queryId'
            },
            {
                xtype : 'button', 
                style : 'margin-left:5px;',
                text : '查询',
                handler : function () {
                    var args = form.getForm().getValues();
                    Ext.Ajax.request({
                        url : 'http://' + window.location.host + "/cards/getTableInfo",
                        method : 'GET',
                        params : args,
                        success : function (response) {
                            var json = Ext.JSON.decode(response.responseText);
                            json = json.map(function (card, index, context) {
                                 return {
                                     nickname : card.nickname,
                                     cards : cardToImageUrls(card.cards)
                                 }
                            });
                            Ext.getDom('dataRegion').innerHTML = '';
                            Ext.define('Cards', {
                                extend : 'Ext.data.Model',
                                fields : [
                                    {name : 'nickname', type : 'string'},
                                    {name : 'cards', type : 'string'}
                                ]
                            });

                            var store = Ext.create('Ext.data.JsonStore',{
                                model : Cards,
                                data : json
                            });

                            var list = Ext.create('Ext.grid.Panel', {
                                store : store,
                                viewConfig : {
                                    enableTextSelection : true
                                },
                                loadMask : true,
                                columnLines : true,
                                frame : true, 
                                tripeRows : true,
                                autoScroll : true, 
                                height : 700,
                                columns : [
                                   {text : '玩家昵称', width : 300, dataIndex : 'nickname'},
                                   {text : '牌', width : 300, dataIndex : 'cards'}

                                ],
                                width : 'auto'
                            });

                            list.render('dataRegion');
                        },
                        failure : function (response) {
                            Ext.Msg.alert("查询失败", "");
                        }
                    });
                }
            }
        ]
    }); 

    form.render('condition');
}
