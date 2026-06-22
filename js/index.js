(function () {
  // 验证码图片路径前缀
  var imgBase = 'verify-code-img/';
  // 当前验证码对应的code
  var currentCode = '';

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

  // 随机加载验证码图片
  function loadVerifyCode(data) {
    var verifyList = data.verifyInfo;
    var index = Math.floor(Math.random() * verifyList.length);
    var item = verifyList[index];
    currentCode = item.code;
    var img = document.querySelector('.verif-code img');
    img.src = imgBase + item.picName;
  }

  // 登录验证
  function handleLogin(data) {
    var idCardInput = document.getElementById('idCard');
    var passwordInput = document.getElementById('password');
    var verifCodeInput = document.getElementById('verifCode');

    var idCard = idCardInput.value.trim();
    var password = passwordInput.value.trim();
    var verifCode = verifCodeInput.value.trim();

    // 验证码不区分大小写
    if (verifCode.toLowerCase() !== currentCode.toLowerCase()) {
      alert('请输入正确的登录信息');
      return;
    }

    // 验证证件号码和密码
    var user = data.userInfo.find(function (u) {
      return u.idCard === idCard && u.password === password;
    });

    if (user) {
      // 登录成功，将用户id存入localStorage
      localStorage.setItem('userId', user.id);
      window.location.href = 'home.html';
    } else {
      alert('请输入正确的登录信息');
    }
  }

  // 初始化
  loadJson(function (data) {
    // 页面加载时随机加载验证码
    loadVerifyCode(data);

    // 点击验证码图片刷新
    var verifImg = document.querySelector('.verif-code img');
    verifImg.style.cursor = 'pointer';
    verifImg.addEventListener('click', function () {
      loadVerifyCode(data);
    });

    // 登录按钮事件
    var form = document.querySelector('form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleLogin(data);
    });
  });
})();
