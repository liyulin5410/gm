/**
 * Created by Administrator on 2016/3/22.
 * 活动管理
 */
var announce_popup_win = null;

function manageActivityData() {
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
        ]
    });
    logForm.render('condition')
    searchList();
}

function searchList() {
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/manageActivity/get",
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
            url: "http://" + window.location.host + "/manageActivity/new",
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
            {name: 'ManageActivityList', type: 'string'},
            {name: 'ManageActivityService', type: 'string'},
            {name: 'ManageActivityCreateTime', type: 'string'},
            {name: 'ManageActivityStartTime', type: 'string'},
            {name: 'ManageActivityEndTime', type: 'string'},
            {name: 'ManageActivityName', type: 'string'},
            {name: 'ManageActivityMessage', type: 'string'},
            {name: 'ManageActivityStatus', type: 'string'}
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
                {text: '编号', width: 60, dataIndex: 'ManageActivityList'},
                {text: '服务器', width: 70, dataIndex: 'ManageActivityService'},
                {text: '创建时间', width: 140, dataIndex: 'ManageActivityCreateTime'},
                {text: '开始时间', width: 140, dataIndex: 'ManageActivityStartTime'},
                {text: '结束时间', width: 140, dataIndex: 'ManageActivityEndTime'},
                {text: '标题', width: 100, dataIndex: 'ManageActivityName'},
                {text: '内容', width: 340, dataIndex: 'ManageActivityMessage'},
                {text: '状态', width: 80, dataIndex: 'ManageActivityStatus'},
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
            url: "http://" + window.location.host + "/manageActivity/cancel",
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