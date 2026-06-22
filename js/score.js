(function () {
  // 页面保护：只能通过home.html跳转访问
  var fromHome = sessionStorage.getItem('fromHome');
  if (fromHome !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  // 加载JSON数据
  function loadJson(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'json/info.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      }
    };
    xhr.send();
  }

  // 渲染成绩信息
  function renderScore(data) {
    var userId = localStorage.getItem('userId');
    if (!userId) {
      window.location.href = 'index.html';
      return;
    }

    var user = data.userInfo.find(function (u) {
      return u.id === userId;
    });

    if (!user) {
      window.location.href = 'index.html';
      return;
    }

    // 渲染考试科目
    document.getElementById('test-sub').textContent = user.testSub;

    // 渲染学生信息
    document.getElementById('user-name').textContent = user.uname;
    document.getElementById('user-idcard').textContent = user.idCard;
    document.getElementById('user-school').textContent = user.schoolName;

    // reportNum为0时隐藏成绩报告单编号
    var reportNumLi = document.getElementById('user-report-num').parentElement;
    if (user.reportNum === '0') {
      reportNumLi.style.display = 'none';
    } else {
      document.getElementById('user-report-num').textContent = user.reportNum;
    }

    // 渲染笔试成绩
    document.getElementById('score-exam-num').textContent = user.examNum;
    document.getElementById('score-total').textContent = user.totalScore;
    document.getElementById('score-listening').textContent = user.listening;
    document.getElementById('score-reading').textContent = user.reading;
    document.getElementById('score-writing').textContent = user.writing;

    // 渲染口试成绩
    document.getElementById('speaking-exam-num').textContent = user.speakingExamNum;
    document.getElementById('speaking-score').textContent = user.speakingScore;

    // 本地持久化成绩数据，保证刷新后信息不丢失
    localStorage.setItem('scoreData', JSON.stringify(user));
  }

  // 从localStorage恢复成绩数据
  function restoreFromStorage() {
    var scoreData = localStorage.getItem('scoreData');
    if (!scoreData) return;

    var user = JSON.parse(scoreData);

    document.getElementById('test-sub').textContent = user.testSub;
    document.getElementById('user-name').textContent = user.uname;
    document.getElementById('user-idcard').textContent = user.idCard;
    document.getElementById('user-school').textContent = user.schoolName;

    var reportNumLi = document.getElementById('user-report-num').parentElement;
    if (user.reportNum === '0') {
      reportNumLi.style.display = 'none';
    } else {
      document.getElementById('user-report-num').textContent = user.reportNum;
    }

    document.getElementById('score-exam-num').textContent = user.examNum;
    document.getElementById('score-total').textContent = user.totalScore;
    document.getElementById('score-listening').textContent = user.listening;
    document.getElementById('score-reading').textContent = user.reading;
    document.getElementById('score-writing').textContent = user.writing;

    document.getElementById('speaking-exam-num').textContent = user.speakingExamNum;
    document.getElementById('speaking-score').textContent = user.speakingScore;
  }

  // 初始化
  loadJson(function (data) {
    renderScore(data);

    // 返回按钮
    var backBtn = document.querySelector('.btn button');
    backBtn.addEventListener('click', function () {
      // 设置标记，允许home.html正常访问
      sessionStorage.setItem('fromHome', 'true');
      window.location.href = 'home.html';
    });
  });
})();
