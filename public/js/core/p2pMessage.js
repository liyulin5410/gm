function p2pMessage(){
    var logForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height: 50,
        layout : 'column',
        items:[
            {
                xtype : 'textfield',
                style : 'margin-left:30px;margin-top:10px;',
                fieldLabel: '玩家ID',
                id: 'queryId',
                labelWidth: 50,
                width: 130
            },
            {
                xtype : 'datefield',
                style : 'margin-left:10px;margin-top:10px;',
                fieldLabel: '日期',
                labelWidth: 30,
                width: 180,
                name: 'startTime',
                id: 'startTime',
                format: 'Y-m-d H:i:s',
                value:Ext.Date.add(new Date(), Ext.Date.DAY, -2),
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'datefield',
                style : 'margin-left:10px;margin-top:10px;',
                width: 150,
                name: 'endTime',
                id: 'endTime',
                format: 'Y-m-d H:i:s',
                value: Ext.Date.add(new Date(), Ext.Date.DAY, 1),
                allowBlank : false,
                blankText:'此项不能为空'
            },
            {
                xtype : 'button',
                style : 'margin-left:20px;margin-top:10px;',
                text:'查 询',
                handler : function(){
                    submit();
                }
            },
            {
                xtype : 'button',
                style : 'margin-left:30px;margin-top:10px;',
                text:'设置关键字',
                handler : function(){
                    setMaskWords();
                }
            }
        ]
    });

    logForm.render('condition');
    function submit(){
        var startTime = Ext.getCmp('startTime').getValue();
        var endTime = Ext.getCmp('endTime').getValue();
        var queryId = Ext.getCmp('queryId').getValue();

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/p2pMessage/getSendP2PMessage",
            method: 'GET',
            params: {queryId : queryId ? queryId : 0, startTime : new Date(startTime).getTime(), endTime: new Date(endTime).getTime()},
            success: function(response){
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 500) {
                    Ext.getDom('dataRegion').innerHTML = '';
                    Ext.Msg.alert("错误", "没有找到相关记录");
                } else {
                    json.sort(function(a, b) {
                        return b.ts - a.ts;
                    });
                    for (var i in json) {
                        json[i].ts = dateFormat(json[i].ts);
                    }
                    console.log(json);
                    drawTable(json);
                }
            },
            failure: function(){
                Ext.Msg.alert("错误", "没有找到相关记录");
            }
        });
    }

    function drawTable( dataFromServer ){
        Ext.getDom('dataRegion').innerHTML = '';
        Ext.define('LogDataStruct', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'fromQueryId', type:'string'},
                {name: 'fromNickname', type:'string'},
                {name: 'toQueryId', type:'string'},
                {name: 'toNickname', type:'string'},
                {name: 'message', type: 'string'},
                {name: 'ts', type: 'string'}
            ]
        });

        var store = Ext.create('Ext.data.JsonStore', {
            model: LogDataStruct,
            data: dataFromServer
        });

        var logList = Ext.create('Ext.grid.Panel', {
            store: store,
            viewConfig  : {
                enableTextSelection:true
            },
            loadMask: true,
            columnLines:true,
            frame: true,
            tripeRows:true,
            autoScroll : true,
            height: 700,
            columns: [
                {text: '发送玩家ID', width: 80, dataIndex: 'fromQueryId'},
                {text: '发送玩家昵称', width: 100, dataIndex: 'fromNickname'},
                {text: '内容', width: 350,  dataIndex: 'message'},
                {text: '接收玩家ID', width: 80, dataIndex: 'toQueryId'},
                {text: '接收玩家昵称', width: 100, dataIndex: 'toNickname'},
                {text: '时间', width: 150,  dataIndex: 'ts'}
            ],
            width: 'auto'
        });

        logList.render('dataRegion');
    }
};

function setMaskWords(){
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/p2pMessage/getMaskWords",
        method: 'GET',
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            console.log(json);
            drawMaskWords(json)
        },
        failure: function(){
            Ext.Msg.alert("错误", "没有找到相关记录");
        }
    });
}

function submitMaskWords(maskWords){
    var words = maskWords.split("\n");
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/p2pMessage/setMaskWords",
        method: 'POST',
        params: {maskWords : words},
        success: function(response){
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 500) {
                Ext.Msg.alert("错误", "提交失败");
            } else {
                Ext.Msg.alert("成功", "提交成功");
            }
        },
        failure: function(){
            Ext.Msg.alert("错误", "提交失败");
        }
    });

}

var drawMaskWords = function(dataFromServer) {
    var maskWords = dataFromServer.join("\n");
    console.log(maskWords);
    var maskWordsForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 400,
        height:350,
        region: 'center',
        items:[
            {
                xtype:"label",
                style : 'margin-top:10px;margin-left:20px;',
                html: "<font size=3>设置关键字, 一行一个关键字: </font><br>"
            },
            {
                xtype : 'textarea',
                style : 'margin-top:10px;margin-left:20px;',
                labelWidth: 100,
                height: 230,
                width: 340,
                name: 'maskWords',
                id: 'maskWords',
                editable:true,
                allowBlank : false,
                blankText:'此项不能为空',
                value : maskWords
            },
            {
                xtype : 'button',
                style:'margin-top:10px;margin-left:170px;',
                text:'提 交',
                handler : function(){
                    var maskWords = Ext.getCmp('maskWords').getValue();
                    submitMaskWords(maskWords);
                }
            }
        ]
    });

    var win = new Ext.Window({
        title:'设置关键字',
        width:400,
        height:350,
        closeAction:'close',
        items:[ maskWordsForm ]
    });

    win.on('close',function(){
        if(win){
            win.destroy();
        }
    });

    win.show();
}

