var announce_popup_win = null;

function announce() {
    var logForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 'auto',
        height: 35,
        region: 'center',
        fieldDefaults: {
            labelAlign: 'left',
            msgTarget: 'side',
            width: 200,
            style: 'margin-left:15px;'
        },
        layout: 'column',
        items: [
            {
                xtype: 'button',
                style: 'margin-left:100px;',
                text: '新增公告',
                handler: function () {
                    insert();
                }
            },
            {
                xtype: 'label',
                style: 'margin-left:300px;margin-top:3px;',
                id: "serverState"
            },
            {
                xtype: 'button',
                style: 'margin-left:10px;',
                id: "closeBtn",
                handler: function () {
                    var labelText = Ext.getCmp("serverState").text;
                    if (labelText === "服务器状态: 开服") {
                        Ext.MessageBox.confirm("提示", "您确定停服么?", function (e) {
                            setClosing(e, 1);
                        });
                    } else if (labelText === "服务器状态: 停服") {
                        Ext.MessageBox.confirm("提示", "您确定开服么?", function (e) {
                            setClosing(e, 0);
                        });
                    }
                }
            }
            /*{
             xtype : 'checkbox',
             style : 'margin-left:300px;',
             boxLabel: '停服',
             name: 'setClosing',
             checked: false,
             listeners: {
             afterrender:function(obj){
             obj.getEl().dom.onclick = function(){
             if (logForm.getForm().findField("setClosing").getValue()) {
             Ext.MessageBox.confirm("提示", "您确定停服么?", function(e) {
             setClosing(e, 1);
             });
             } else {
             Ext.MessageBox.confirm("提示", "您确定开服么?", function(e) {
             setClosing(e, 0);
             });
             }
             };
             }
             }

             } */
        ]
    });

    logForm.render('condition');
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/getClosing",
        method: 'GET',
        success: function (response) {
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 200) {
                Ext.getCmp("serverState").setText("服务器状态: 停服");
                Ext.getCmp("closeBtn").setText("开 服");
            } else {
                Ext.getCmp("serverState").setText("服务器状态: 开服");
                Ext.getCmp("closeBtn").setText("停 服");
            }
        },
        failure: function () {
        }
    });
    searchList();
}

function searchList() {
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/announce/get",
        method: 'GET',
        success: function (response) {
            var json = Ext.JSON.decode(response.responseText);
            drawTable(json);
        },
        failure: function () {
            Ext.Msg.alert("错误", "没有找到相关记录");
        }
    });
}

function setClosing(e, isClosing) {
    if (e != "yes") {
        //console.log(e);
        return;
    }

    Ext.Ajax.request({
        url: "http://" + window.location.host + "/setClosing",
        method: 'POST',
        params: {"isClosing": isClosing},
        success: function (response) {
            var json = Ext.JSON.decode(response.responseText);
            if (json.resultCode === 200) {
                Ext.Msg.alert("成功", "操作成功");
                if (isClosing) {
                    Ext.getCmp("serverState").setText("服务器状态: 停服");
                    Ext.getCmp("closeBtn").setText("开 服");
                } else {
                    Ext.getCmp("serverState").setText("服务器状态: 开服");
                    Ext.getCmp("closeBtn").setText("停 服");
                }
            } else {
                Ext.Msg.alert("错误", "操作失败");
            }
        },
        failure: function () {
            Ext.Msg.alert("错误", "操作失败");
        }
    });
}

function insert() {
    // 已经弹出窗口了，就不再弹出
    if (announce_popup_win && !announce_popup_win.hidden && announce_popup_win.rendered) {
        return;
    }

    var sumbitForm = new Ext.FormPanel({
        frame: true,
        title: '',
        width: 500,
        height: 500,
        region: 'center',
        fieldDefaults: {
            labelAlign: 'left',
            msgTarget: 'side',
            width: 200,
            style: 'margin-left:15px;'
        },
        items: [
            {
                xtype: 'datefield',
                fieldLabel: '公告开始时间',
                style: 'margin-top:20px;margin-left:20px;',
                labelWidth: 100,
                width: 320,
                name: 'startTime',
                value: new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank: false,
                blankText: '此项不能为空'
            },
            {
                xtype: 'datefield',
                fieldLabel: '公告结束时间',
                style: 'margin-top:20px;margin-left:20px;',
                labelWidth: 100,
                width: 320,
                name: 'endTime',
                value: new Date(Date.now() + 24 * 60 * 60 * 1000),
                format: 'Y-m-d H:i:s',
                allowBlank: false,
                blankText: '此项不能为空'
            },
            {
                xtype: 'textfield',
                fieldLabel: '公告标题',
                style: 'margin-top:20px;margin-left:20px;',
                labelWidth: 100,
                width: 400,
                name: 'title',
                editable: true,
                allowBlank: false,
                blankText: '此项不能为空'
            },
            {
                xtype: 'textarea',
                fieldLabel: '公告内容',
                style: 'margin-top:20px;margin-left:20px;',
                labelWidth: 100,
                height: 250,
                width: 400,
                name: 'message',
                editable: true,
                allowBlank: false,
                blankText: '此项不能为空'
            },
            {
                xtype: 'button',
                style: 'margin-top:20px;margin-left:370px;',
                text: '提交',
                handler: function () {
                    submit();
                }
            }
        ]
    });

    announce_popup_win = new Ext.Window({
        title: '新增公告',
        width: 500,
        height: 500,
        closeAction: 'hide',
        items: [sumbitForm]
    });

    announce_popup_win.show();

    /**
     * 提交到gm后台
     */
    function submit() {
        var args = sumbitForm.getForm().getValues();
        if (args.message === "") {
            Ext.Msg.alert("错误", "内容不能为空!");
            return;
        }

        if (!isToday(args.startTime) || !isToday(args.endTime)) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/announce/new",
            method: 'POST',
            params: args,
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                drawTable(json);
            },
            failure: function () {
                Ext.Msg.alert("错误", "提交失败");
            }
        });

        announce_popup_win.close();
    }
}

function drawTable(dataFromServer) {
    Ext.getDom('dataRegion').innerHTML = '';
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'announceId', type: 'string'},
            {name: 'serverId', type: 'string'},
            {name: 'createTime', type: 'string'},
            {name: 'startTime', type: 'string'},
            {name: 'endTime', type: 'string'},
            {name: 'title', type: 'string'},
            {name: 'message', type: 'string'},
            {name: 'available', type: 'string'}
        ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: dataFromServer
    });

    initLogList();

    function initLogList() {
        var logList = Ext.create('Ext.grid.Panel', {
            store: store,
            viewConfig: {
                enableTextSelection: true
            },
            loadMask: true,
            columnLines: true,
            autoScroll: true,
            height: 700,
            columns: [
                {text: '编号', width: 60, dataIndex: 'announceId'},
                {text: '服务器', width: 70, dataIndex: 'serverId'},
                {text: '创建时间', width: 140, dataIndex: 'createTime'},
                {text: '开始时间', width: 140, dataIndex: 'startTime'},
                {text: '结束时间', width: 140, dataIndex: 'endTime'},
                {text: '公告标题', width: 100, dataIndex: 'title'},
                {text: '公告内容', width: 340, dataIndex: 'message'},
                {
                    text: "操作",
                    width: 100,
                    dataIndex: 'available',
                    align: 'center',
                    renderer: function (value, cellmeta, record, rowIndex, columnIndex, store) {
                        var buttonId = "cancelBtn" + rowIndex;
                        var createTime = "\"" + dataFromServer[rowIndex].createTime + "\"";
                        var clickFunc = "'cancel(" + buttonId + "," + createTime + ")'";
                        if (parseInt(value)) {
                            return "<input type='button' value= '取 消' onclick=" + clickFunc + "id=" + buttonId + ">";
                        }
                    }
                }
            ],
            width: 'auto'
        });

        logList.render('dataRegion');
    }
}

/**
 * 取消公告
 * @param buttonId
 * @param createTime
 */
function cancel(buttonId, createTime) {
    Ext.MessageBox.confirm("提示", "您确定取消此公告么?", function (e) {
        if (e != "yes") {
            //console.log(e);
            return;
        }

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/announce/cancel",
            method: 'POST',
            params: {
                "createTime": createTime,
                "available": 0
            },
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                if (json.resultCode === 200) {
                    Ext.Msg.alert("成功", "操作成功");
                    buttonId.style.display = "none";
                } else {
                    Ext.Msg.alert("错误", "操作失败");
                }
            },
            failure: function () {
                Ext.Msg.alert("错误", "操作失败");
            }
        });
    });
}
