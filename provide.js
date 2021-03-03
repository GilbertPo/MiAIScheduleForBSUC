function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
  let result = "";
  try {
    let frmIds = ["frmbody","frmDesk","frame_1","frmReport"];//iframe嵌套
    let getSuccess = true;
    for (let i=0;i<frmIds.length;i++)
    {
        iframeContent = dom.getElementById(frmIds[i]);
        if(iframeContent == null)
        {
          getSuccess = false;
          alert("当前没有检测到课表，导入失败。\n导入方法及注意事项：\n1. 登录教务系统，进入「教学安排」，选择正确的学期，待课表出现后点击「一键导入」即可。\n2. 请在导入前设置正确节数（上午5节、下午4节、晚上3节，时间可以先不用管），以免导入时出现错误。\n3. 当前不支持导入当前周，导入后可能会出现当前周变为第1周，请手动重新设置。\n");
          break;
        }
        dom = iframeContent.contentWindow.document;
    }
    if(getSuccess)
    {
      let tb = dom.getElementById("mytable").outerHTML;
      result = tb;
      //console.log(result);
    }
    
  }
  catch(err)
  {
     alert("导入时遇到问题\n错误信息:"+err);
  }
  return result;
}