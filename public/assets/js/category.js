$('#addCategory').on('submit', function () {
  // 获取用户在分类表单总输入的内容
  var formData = $(this).serialize();
  $.ajax({
    type: 'post',
    url: '/categories',
    data: formData,
    success: function () {
      location.reload();
    }
  });
  // 阻止默认提交功能
  return false;
});

// 发送ajax请求，向服务器端请求所有分类的数据
$.ajax({
  type: 'get',
  url: '/categories',
  success: function (response) {
    var html = template('categoryListTpl', {
      data: response
    });
    // 将拼接好的内容放到页面中
    $('#categoryBox').html(html);
  }
})

// 为编辑按钮添加点击事件
$('#categoryBox').on('click', '.edit', function () {
  // 获取要分类的数据的id
  var id = $(this).attr('data-id');
  // 发送请求获取分类信息
  $.ajax({
    type: 'get',
    url: '/categories/' + id,
    success: function (response) {
      var html = template('modifyCategoryTpl', response);
      $('#formBox').html(html);
    }
  });
});

$('#formBox').on('submit', '#modifyCategory', function() {
  // 获取管理员在表单中输入的内容
  var formData = $(this).serialize();
  // 获取要修改的分类id
  var id = $(this).attr('data-id');
  // 发送请求
  $.ajax({
    type: 'put',
    url: '/categories/' + id,
    data: formData,
    success: function () {
      location.reload();
    }
  });
  // 阻止表单默认提交行为
  return false;
})

// 当删除按钮被点击
$('#categoryBox').on('click', '.delete', function() {
  if (confirm('确认删除')) {
    var id = $(this).attr('data-id');
    $.ajax({
      type: 'delete',
      url: '/categories/' + id,
      success: function() {
        location.reload();
      }
    });
  }
});