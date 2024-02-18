// 直接在JS文件开始时，提取代理基础URL并存储在变量中
var proxyBaseUrl = document.getElementById('qexot').getAttribute('data-proxy-base-url');
var dataUrl = 'path_to_your_json_data';

document.addEventListener("DOMContentLoaded", function() {
  
    // 时间格式化函数，此处应替换为您的实际代码
    function qexoFormatTime(format, timestamp) {
        var format = arguments[0] !== (void 0) ? arguments[0] : "";
        var num = arguments[1] !== (void 0) ? arguments[1] : new Date().getTime();
        format = format || "YYYY-mm-dd HH:MM:SS";
        var ret,
          date,
          renum;
        if (num.toString().length == 10) {
          date = new Date(parseInt(num) * 1000);
        } else {
          date = new Date(parseInt(num));
        }
        var opt = {
          "Y": date.getFullYear().toString(),
          "m": (date.getMonth() + 1).toString(),
          "d": date.getDate().toString(),
          "H": date.getHours().toString(),
          "M": date.getMinutes().toString(),
          "S": date.getSeconds().toString()
        };
        for (var k in opt) {
          ret = new RegExp("(" + k + "+)").exec(format);
          if (ret) {
            renum = (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0"));
            format = format.replace(ret[1], renum);
          };
        };
        return format;
    }


    // 根据消息数据生成HTML元素
    function generateChannelMessageItem(id, text, time, views, images) {
      var viewsDisplay = views ? "<div class=\"flex left\">" + views + " views</div>" : "";
      // 正确地清理<i>标签，只保留<b>标签内的文本
      var cleanText = text.replace(/<i class="emoji".*?>(.*?)<\/i>/g, '$1');
    
      // 检测time是否是数字，如果不是则尝试解析字符串格式日期
      var timestamp = !isNaN(time) ? Number(time) : new Date(time).getTime();
      
      // 格式化时间，调用qexoFormatTime函数
      var formattedTime = qexoFormatTime("YYYY-mm-dd HH:MM:SS", timestamp);
    
      var html = `
        <div class="timenode">
          <div class="header">
            <time class="qexot-datetime" datetime="${new Date(timestamp).toISOString()}">${formattedTime}</time>
          </div>
          <div class="body">
            ${cleanText}
          </div>
          <div class="footer">${viewsDisplay}</div>
        </div>
      `;
      return html;
    }
    
    // 给定JSON数据，展示信息到指定的DOM元素中
// 给定JSON数据，展示信息到指定的DOM元素中
    function showChannelMessages(jsonData, domId) {
        // Remove or hide loading animation
      if(document.querySelector('.qexo_loading')) {
        document.querySelector('.qexo_loading').style.display = 'none'; // Option 1: Hide
        // document.querySelector('.qexo_loading').remove(); // Option 2: Remove
      }
      var channelMessageData = jsonData.ChannelMessageData;
      var html = '<div class="qexot-list">';

      var messageArray = Object.values(channelMessageData).filter(function(messageData) {
        return messageData.text.includes('#SFCN'); // 只包含含有#SFCN标签的消息
      });

      messageArray.sort(function(a, b) {
        // 降序排序
        return b['time'] - a['time'];
      });

      // 遍历已过滤并排序后的数组
      messageArray.forEach(function(messageData) {
        // 移除#SFCN标签
        var messageText = messageData['text'].replace(/#SFCN/g, '');

        var formattedTime = qexoFormatTime("YYYY-mm-dd HH:MM:SS", Number(messageData['time']));
        var messageImages = messageData['image'] || [];
        // 生成HTML包含图片信息（如果有）和去除了#SFCN标签的文本
        html += generateChannelMessageItem(messageData['id'], messageText, formattedTime, messageData['views'] || 0, messageImages);
      });

      html += '</div>';
      document.getElementById(domId).innerHTML = html;
    }
  
    // Ajax请求获取JSON数据
    function fetchAndShowChannelMessages(domId, url) {
      var element = document.getElementById(domId);
      var url = element.getAttribute('data-url'); // 从HTML元素读取数据URL
      document.getElementById(domId).innerHTML = '<div class="qexo_loading"><div class="qexo_part"><div style="display: flex; justify-content: center"><div class="qexo_loader"><div class="qexo_inner one"></div><div class="qexo_inner two"></div><div class="qexo_inner three"></div></div></div></div><p style="text-align: center; display: block">消息加载中...</p></div>';
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            try {
              var jsonData = JSON.parse(xhr.responseText);
              showChannelMessages(jsonData, domId);
            } catch (e) {
              console.error("Error parsing JSON data: ", e);
            }
          } else {
            console.error("Failed to fetch data: ", xhr.status, xhr.statusText);
          }
        }
      };
      xhr.open('GET', url, true);
      xhr.send(null);
    }
  
    // JSON数据链接和DOM元素的id
    var domId = 'qexot';
    fetchAndShowChannelMessages(domId);

  
    // 获取并展示ChannelMessageData信息
    fetchAndShowChannelMessages(domId, dataUrl);
  });












