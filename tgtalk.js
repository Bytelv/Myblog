// 直接在JS文件开始时，提取代理基础URL并存储在变量中
var proxyBaseUrl = document.getElementById('qexot').getAttribute('data-proxy-base-url');
var dataUrl = 'path_to_your_json_data';
// 通过ID获取元素
var channelInfoElement = document.getElementById('channelInfo');

// 读取data-channel-name属性值
var channelName = channelInfoElement.getAttribute('data-channel-name');

// 现在你可以在JavaScript中使用这个channelName的值了

// 将qexoFormatTime定义移到全局作用域中
function qexoFormatTime(format, timestamp) {
  var format = format || "YYYY-mm-dd HH:MM:SS";
  var num = typeof timestamp === 'number' ? timestamp : new Date().getTime();
  var date = new Date(num);

  var opt = {
    "Y": date.getFullYear().toString(),
    "m": (date.getMonth() + 1).toString().padStart(2, '0'),
    "d": date.getDate().toString().padStart(2, '0'),
    "H": date.getHours().toString().padStart(2, '0'),
    "M": date.getMinutes().toString().padStart(2, '0'),
    "S": date.getSeconds().toString().padStart(2, '0')
  };

  return format.replace(/(YYYY|mm|dd|HH|MM|SS)/g, function(match) { return opt[match[0]]; });
}
document.addEventListener("DOMContentLoaded", function() {
  

    // 根据消息数据生成HTML元素
    function generateChannelMessageItem(id, text, time, views, images, telegramUrl) {
      var viewsDisplay = views ? "<div class=\"flex left\">" + views + " views</div>" : "";
      var cleanText = text.replace(/<i class="emoji".*?>(.*?)<\/i>/g, '$1').replace(/<b>(.*?)<\/b>/g, '<b>$1</b>');
      
      // 解析time参数，如果是无效日期则使用当前时间戳
      var timestamp = new Date(time).getTime();
      if (isNaN(timestamp)) {
        timestamp = Date.now(); // 若time无效，使用当前时间戳
      }
      var dateObject = new Date(timestamp);
      var formattedTime = qexoFormatTime('YYYY-mm-dd HH:MM:SS', timestamp);
    
      // 清理并生成图片的HTML，如果它们是有效的URL
      var imagesHtml = images.map(function(image) {
        return image.startsWith('https://') ? '<img src="' + proxyBaseUrl + encodeURIComponent(image) + '" alt="Image" />' : '';
      }).join('');
    
      // 创建Telegram的SVG图标和跳转链接HTML
      var telegramIconHTML = views ? `
        <a href="${telegramUrl}" target="_blank" class="telegram-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" class="telegram-icon">
          <defs>
          <linearGradient id="telegram-gradient-${id}" x1="160.01" x2="100.01" y1="40.008" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#37aee2"></stop>
            <stop offset="1" stop-color="#1e96c8"></stop>
          </linearGradient>
        </defs>
        <circle cx="120" cy="120" r="120" fill="url(#telegram-gradient-${id})"></circle>
        <path fill="#fff" d="M44.691 125.87c14.028-7.727 29.687-14.176 44.318-20.658 25.171-10.617 50.442-21.05 75.968-30.763 4.966-1.655 13.89-3.273 14.765 4.087-.48 10.418-2.45 20.775-3.802 31.132-3.431 22.776-7.398 45.474-11.265 68.175-1.333 7.561-10.805 11.476-16.866 6.637-14.566-9.84-29.244-19.582-43.624-29.65-4.71-4.786-.342-11.66 3.864-15.078 11.997-11.823 24.72-21.868 36.09-34.302 3.067-7.406-5.995-1.164-8.984.749-16.424 11.318-32.446 23.327-49.762 33.274-8.845 4.869-19.154.708-27.995-2.01-7.927-3.281-19.543-6.588-12.708-11.592z"></path>
          </svg>
          ${views} views
        </a>
      ` : "";
    
      var html = `
        <div class="timenode">
          <div class="header">
            <time class="qexot-datetime" datetime="${dateObject.toISOString()}">${formattedTime}</time>
          </div>
          <div class="body">
            ${cleanText}
            ${imagesHtml}
          </div>
          <div class="footer">

            ${telegramIconHTML}
          </div>
        </div>
      `;
      return html;
    }
    
    // 给定JSON数据，展示信息到指定的DOM元素中
// 给定JSON数据，展示信息到指定的DOM元素中
    function showChannelMessages(jsonData, domId) {
      // 移除或隐藏加载动画
      var loadingAnimation = document.querySelector('.qexo_loading');
      if (loadingAnimation) {
        loadingAnimation.style.display = 'none';
      }

      var messagesContainer = document.getElementById(domId);
      var htmlContent = '<div class="qexot-list">';

      // 获取所有带有 ID 的消息
      var messageArray = Object.keys(jsonData.ChannelMessageData).map(function(key) {
        var messageItem = jsonData.ChannelMessageData[key];
        messageItem.id = key; // 添加索引作为 id
        return messageItem;
      }).filter(function(messageItem) {
        return messageItem.text.includes('#SFCN'); // 过滤包含 #SFCN 标签的消息
      });

      // 降序排序函数，根据时间排序
      messageArray.sort(function(a, b) {
        return b.time - a.time;
      });

      // 遍历所有过滤并排序后的消息数组
      messageArray.forEach(function(messageItem) {
        var messageText = messageItem.text.replace(/#SFCN/g, ''); // 移除 #SFCN 标签
        var telegramUrl = `https://t.me/${channelName}/${messageItem.id}`; // 使用 messageItem.id 生成正确的 URL
        var messageImages = messageItem.image || [];
        var formattedTime = qexoFormatTime("YYYY-mm-dd HH:MM:SS", Number(messageItem.time));
        // 生成 HTML 包括图片、文本和 Telegram 链接
        htmlContent += generateChannelMessageItem(messageItem.id, messageText, formattedTime, messageItem.views, messageImages, telegramUrl);
      });

      htmlContent += '</div>';
      messagesContainer.innerHTML = htmlContent; // 将生成的 HTML 设置到容器中
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












