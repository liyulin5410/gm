var new_mail_popup_win = null;

function initMail(items) {
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
                xtype: 'textfield',
                fieldLabel: '关键词',
                labelWidth: 55,
                width: 200,
                name: 'keywordsValue',
                value: "",
                allowBlank: true
            },
            {
                xtype: 'button',
                style: 'margin-left:10px;',
                text: '查询',
                handler: function () {
                    search();
                }
            },
            {
                xtype: 'button',
                style: 'margin-left:10px;',
                text: '新增邮件',
                handler: function () {
                    popupNewMail(items);
                }
            }
        ]
    });

    logForm.render('condition');

    // 搜索所有的邮件列出来
    getMailList(items);
}

function getMailList(items) {
    Ext.Ajax.request({
        url: "http://" + window.location.host + "/mail/get",
        method: 'GET',
        success: function (response) {
            var json = Ext.JSON.decode(response.responseText);
            drawTable(json, items);
        },
        failure: function () {
            Ext.Msg.alert("错误", "没有找到相关记录");
        }
    });
}

function drawTable(dataFromServer, items) {
    for (var i = 0; i < dataFromServer.length; i++) {
        var data = dataFromServer[i];
        if (data.item && data.item.id && data.item.count) {
            for (var j = 0; j < items.length; j++) {
                if (items[j].id == data.item.id) {
                    data.item = data.item.id + ' - ' +items[j].name + '(' + data.item.count + ')';
                    break;
                }
            }
        }
    }

    Ext.getDom('dataRegion').innerHTML = '';
    Ext.define('LogDataStruct', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'index', type: 'string'},
            {name: 'serverId', type: 'string'},
            {name: 'createTime', type: 'string'},
            {name: 'sendTime', type: 'string'},
            {name: 'endTime', type: 'string'},
            {name: 'title', type: 'string'},
            {name: 'message', type: 'string'},
            {name: 'item', type: 'string'},
            {name: 'state', type: 'string'}
        ]
    });

    var store = Ext.create('Ext.data.JsonStore', {
        model: LogDataStruct,
        data: dataFromServer
    });

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
            {text: '编号', width: 40, dataIndex: 'index'},
            {text: '服务器', width: 50, dataIndex: 'serverId'},
            {text: '发送时间', width: 130, dataIndex: 'sendTime'},
            {text: '状态', width: 50, dataIndex: 'state'},
            {text: '标题', width: 100, dataIndex: 'title'},
            {text: '内容', width: 200, dataIndex: 'message'},
            {text: '道具', width: 130, dataIndex: 'item'},
            {text: '创建时间', width: 130, dataIndex: 'createTime'},
            {text: '结束时间', width: 130, dataIndex: 'endTime'},
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

/**
 * 弹出新增邮件的窗口
 */
function popupNewMail(items) {
    // 已经弹出窗口了，就不再弹出
    if (new_mail_popup_win && !new_mail_popup_win.hidden && new_mail_popup_win.rendered) {
        return;
    }

    var itemList = [];
    items.forEach(function (item) {
        var value = '';
        value += item.id;
        value += '-';
        value += item.name;
        itemList.push([item.id, value]);
    });

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
                fieldLabel: '邮件发送时间',
                style: 'margin-top:20px;margin-left:20px;',
                labelWidth: 100,
                width: 280,
                name: 'sendTime',
                value: new Date(),
                format: 'Y-m-d H:i:s',
                allowBlank: false,
                blankText: '此项不能为空'
            },
            {
                xtype: 'textfield',
                fieldLabel: '邮件标题',
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
                fieldLabel: '邮件内容',
                style: 'margin-top:20px;margin-left:20px;',
                labelWidth: 100,
                height: 210,
                width: 400,
                name: 'message',
                editable: true
            },
            {
                xtype: 'combo',
                fieldLabel: '道具id',
                displayField: 'text',
                valueField: 'value',
                store: new Ext.data.SimpleStore({
                    fields: ['value', 'text'],
                    data: itemList
                }),
                style: 'margin-top:20px;margin-left:20px;',
                labelWidth: 100,
                width: 400,
                name: 'item',
                readOnly: false,
                editable: false,
                allowBlank: false,
                blankText: '此项不能为空'
            },
            {
                xtype: 'textfield',
                fieldLabel: '道具数量',
                style: 'margin-top:20px;margin-left:20px;',
                labelWidth: 100,
                width: 400,
                name: 'count',
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

    new_mail_popup_win = new Ext.Window({
        title: '新增公告',
        width: 500,
        height: 500,
        closeAction: 'hide',
        items: [sumbitForm]
    });

    new_mail_popup_win.show();

    /**
     * @description 提交到gm后台
     */
    function submit() {
        var args = sumbitForm.getForm().getValues();
        if (args.title.trim() === "") {
            Ext.Msg.alert("错误", "标题不能为空!");
            return;
        }

        // 不能选择现在之前的时间
        if (!isToday(args.sendTime)) {
            Ext.Msg.alert("错误", "时间格式错误!");
            return;
        }

        // 必须选择一个道具
        if (!args.item) {
            Ext.Msg.alert("错误", "邮件中必须包含道具!");
            return;
        }

        // 数量必须为数字且大于1小于100
        args.count = parseInt(args.count);
        if (isNaN(args.count) || args.count < 1 || args.count > 100) {
            Ext.Msg.alert("错误", "道具数量必须为1-100!");
            return;
        }

        args.item = {
            id: args.item,
            count: args.count
        };
        delete args.count;

        Ext.Ajax.request({
            url: "http://" + window.location.host + "/mail/new",
            method: 'POST',
            jsonData: args,
            //params: args,
            success: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                drawTable(json, items);
            },
            failure: function (response) {
                var json = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert("错误", "提交失败: " + json.error);
            }
        });

        new_mail_popup_win.close();
    }
}