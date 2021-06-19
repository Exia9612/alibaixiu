// 当修改密码表单发生提交行为时
$('#modifyForm').on('submit', function () {
  // 获取用户在表单中的输入内容
  var formData = $(this).serialize();
  // 调用后端借口
  $.ajax({
    type: 'put',
    url: '/users/password',
    data: formData,
    success: function () {
      location.href = '/admin/login.html';
    }
  });
  // 阻止默认提交
  return false;
});