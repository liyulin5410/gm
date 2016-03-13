/**
 * Created by shine on 2015/8/27.
 */
function gmHead(account){
	var serverList = [];
	var appList = [];
	var operatorList = [];

	for(var i = 1; i <= serverConfig.maxServerId; i++){
		serverList.push([i.toString(), i.toString()]);
	}

	var appList = serverConfig.appIds.map(function(e, index){
		return [(index + 1).toString(), e];
	});

	var operatorList = serverConfig.operators.map(function(e, index){
		return [(index + 1).toString(), e];
	});

	var serverOptions = new Ext.data.SimpleStore({
		fields: ['id', 'serverOption'],
		data: serverList
	});

	var appOptions = new Ext.data.SimpleStore({
		fields: ['id', 'appOption'],
		data: appList
	});

	var operatorOptions = new Ext.data.SimpleStore({
		fields: ['id', 'operatorOption'],
		data: operatorList
	});


	var headPanel = new Ext.FormPanel({
		frame : true,
		title : '',
		width : 1000,
		height: 80, //document.documentElement.clientHeight,
		style : 'margin-left:200px;margin-top:30px;',
		layout : 'column',
		items: [
			{
				xtype : 'label',
				style : 'margin-top:13px;margin-left:15px',
				text: "账户:  " + account.name,
				width: 150
			},
			{
				xtype : 'textfield',
				fieldLabel: '服务器ID',
				value: account.serverId,
				style : 'margin-top:10px;margin-left:15px',
				id: "textServerId",
				labelWidth: 60,
				width: 150
			},
			{
				xtype : 'textfield',
				fieldLabel: '产品ID',
				value: account.appId,
				style : 'margin-top:10px;margin-left:15px',
				id: "textAppId",
				labelWidth: 60,
				width: 150
			},
			{
				xtype : 'textfield',
				fieldLabel: '渠道ID',
				value: account.operator,
				style : 'margin-top:10px;margin-left:15px',
				id: "textOperatorId",
				labelWidth: 60,
				width: 150
			},
			{
				xtype : 'button',
				style : 'margin-top:10px;margin-left:15px',
				text:'设 置',
				handler : function(){
					Ext.MessageBox.confirm("提示", "您确定要修改么?", function(e) {
						if (e != "yes") {
							return;
						}

						var serverId =  Ext.getCmp("textServerId").getValue();
						var appId =  Ext.getCmp("textAppId").getValue();
						var operator =  Ext.getCmp("textOperatorId").getValue();

						console.log("serverId: " + serverId + ", appId: " + appId + ", operator: " + operator);

						if(serverId < 1 || appId == "" || operator == ""){
							Ext.Msg.alert("提示", "参数非法");
							return;
						}

						Ext.Ajax.request({
							url: "http://" + window.location.host + "/account/setGmQuery",
							method: 'POST',
							params: {"serverId": serverId, "appId": appId, "operator": operator},
							success: function(response){
								var json = Ext.JSON.decode(response.responseText);

								if (json.resultCode === 200) {
									Ext.Msg.alert("成功", "操作成功");
								} else {
									Ext.Msg.alert("错误", "操作失败");
								}
							},
							failure: function(){
								Ext.Msg.alert("错误", "请求失败");
							}
						});
					});
				}
			},
		]
	});

	var totalPanel = new Ext.Panel({
		title: '',
		width: 'auto',
		height: document.documentElement.clientHeight,
		frame: true,
		items: [
			headPanel
		]
	});

	totalPanel.render("gmHead");
};

