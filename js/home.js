(function () {
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

  // 根据testSub获取select的option value
  function getSubjectValue(testSub) {
    var select = document.getElementById('subject');
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].text === testSub) {
        return select.options[i].value;
      }
    }
    return '';
  }

  // 渲染用户信息到表单
  function renderUserInfo(data) {
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

    var subjectSelect = document.getElementById('subject');
    var unameInput = document.getElementById('uname');
    var idNumInput = document.getElementById('idNum');

    // 渲染考试科目
    var subjectValue = getSubjectValue(user.testSub);
    if (subjectValue) {
      subjectSelect.value = subjectValue;
    }

    // 渲染姓名
    unameInput.value = user.uname;

    // 渲染证件号码
    idNumInput.value = user.idCard;

    // 本地持久化：考试科目、姓名、证件号码
    localStorage.setItem('subject', user.testSub);
    localStorage.setItem('uname', user.uname);
    localStorage.setItem('idCard', user.idCard);
  }

  // 从localStorage恢复信息
  function restoreFromStorage() {
    var subject = localStorage.getItem('subject');
    var uname = localStorage.getItem('uname');
    var idCard = localStorage.getItem('idCard');

    if (subject) {
      var subjectValue = getSubjectValue(subject);
      if (subjectValue) {
        document.getElementById('subject').value = subjectValue;
      }
    }
    if (uname) {
      document.getElementById('uname').value = uname;
    }
    if (idCard) {
      document.getElementById('idNum').value = idCard;
    }
  }

  // 查询验证
  function handleQuery(data) {
    var userId = localStorage.getItem('userId');
    var user = data.userInfo.find(function (u) {
      return u.id === userId;
    });

    if (!user) {
      alert('请输入正确的信息');
      return;
    }

    var subjectSelect = document.getElementById('subject');
    var unameInput = document.getElementById('uname');
    var idNumInput = document.getElementById('idNum');

    var selectedSubject = subjectSelect.options[subjectSelect.selectedIndex].text;
    var uname = unameInput.value.trim();
    var idNum = idNumInput.value.trim();

    // 验证三个输入框信息是否正确
    if (selectedSubject === user.testSub && uname === user.uname && (idNum === user.idCard || idNum === user.examNum)) {
      // 更新本地持久化
      localStorage.setItem('subject', selectedSubject);
      localStorage.setItem('uname', uname);
      localStorage.setItem('idCard', idNum);
      // 设置标记，允许score.html访问
      sessionStorage.setItem('fromHome', 'true');
      window.location.href = 'score.html';
    } else {
      alert('请输入正确的信息');
    }
  }

  // 初始化
  loadJson(function (data) {
    // 页面加载时渲染用户信息
    renderUserInfo(data);

    // 如果刷新后信息丢失，从localStorage恢复
    restoreFromStorage();

    // 查询按钮事件
    var form = document.querySelector('.form form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleQuery(data);
    });
  });
})();
