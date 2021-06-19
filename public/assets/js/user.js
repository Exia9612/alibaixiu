// 当表单发生提交行为的时候
$('#userForm').on('submit', function () {
	// 获取到用户在表单中输入的内容并将内容格式化成参数字符串，get参数形式
	// 对于头像信息获取的是#avatar中的地址信息
	var formData = $(this).serialize();
	// 向服务器端发送添加用户的请求
	$.ajax({
		type: 'post',
		url: '/users',
		data: formData,
		success: function () {
			// 刷新页面
			location.reload();
		},
		error: function () {
			alert('用户添加失败')
		}
	})
	// 阻止表单的默认提交行为
	// 默认提交的化表单页面会加载
	return false;
});

// 当用户选择文件的时候
// 添加用户时userForm和修改用户时modifyForm的共同的父级元素modifyBox
$('#modifyBox').on('change', '#avatar', function () {
	// 用户选择到的文件
	// this.files[0]就是用户选择的头像
	var formData = new FormData();
	formData.append('avatar', this.files[0]);

	$.ajax({
		type: 'post',
		url: '/upload',
		data: formData,
		// 告诉$.ajax方法不要解析请求参数
		processData: false,
		// 告诉$.ajax方法不要设置请求参数的类型
		contentType: false,
		success: function (response) {
			console.log(response)
			// 实现头像预览功能
			$('#preview').attr('src', response[0].avatar);
			$('#hiddenAvatar').val(response[0].avatar)
		}
	})
});

// 向服务器端发送请求 索要用户列表数据
$.ajax({
	type: 'get',
	url: '/users',
	success: function (response) {
		console.log(response)
		// 使用模板引擎将数据和HTML字符串进行拼接
		var html = template('userTpl', { data: response });
		// 将拼接好的字符串显示在页面中
		$('#userBox').html(html);
	}
});

// 通过事件委托的方式为编辑按钮添加点击事件
// 点击.edit按钮时，事件冒泡到父级#userBox中，触发它的click的绑定事件
/* 
	之所以不直接给edit类添加点击事件，因为edit类是经过ajax异步请求到用户数据后
	在交给模版渲染的。直接找edit类找不到edit类
*/
$('#userBox').on('click', '.edit', function () {
	// 获取被点击用户的id值
	var id = $(this).attr('data-id');
	// 根据id获取用户的详细信息
	$.ajax({
		type: 'get',
		url : '/users/' + id,
		success: function (response) {
			console.log(response)
			var html = template('modifyTpl', response);
			$('#modifyBox').html(html);
		}
	})
});

// 为修改表单添加表单提交事件
$('#modifyBox').on('submit', '#modifyForm', function () {
	// 获取用户在表单中输入的内容
	var formData = $(this).serialize();
	// 获取要修改的那个用户的id值，id存储在modifyForm的data-id属性中
	var id = $(this).attr('data-id');
	// 发送请求 修改用户信息
	$.ajax({
		type: 'put',
		url: '/users/' + id,
		data: formData,
		success: function (response) {
			// 修改用户信息成功 重新加载页面
			location.reload()
		}
	})

	// 阻止表单默认提交
	return false;
});

// 通过事件委托为删除按钮添加事件
$('#userBox').on('click', '.delete', function () {
	if (confirm('确认删除')) {
		var id = $(this).attr('data-id');
		$.ajax({
			type: 'delete',
			url: '/users/' + id,
			success: function () {
				location.reload();
			}
		})
	}
});

// 获取全选按钮
var selectAll = $('#selectAll');
// 获取批量删除按钮
var deleteMany = $('#deleteMany');
// 当全选按钮发生改变时
selectAll.on('change', function () {
	// 获取当前按钮的状态
	// attr不能获取到checked属性的值
	var status = $(this).prop('checked');
	if (status) {
		deleteMany.show();
	} else {
		deleteMany.hide();
	}

	// 获取所有用户,将用户状态和全选按钮保持一致
	$('#userBox').find('input').prop('checked', status);
});

// 当用户前面的复选框发生改变时
$('#userBox').on('change', '.userStatus', function () {
	/*
		获取所有被选中的用户的数量，与所有用户数数量比较，相等即为都选中 
	*/
	var inputs = $('#userBox').find('input');
	if (inputs.length == inputs.filter(':checked').length) {
		selectAll.prop('checked', true);
	} else {
		selectAll.prop('checked', false);
	}

	if (inputs.filter(':checked').length > 0) {
		deleteMany.show();
	} else {
		deleteMany.hide();
	}
})

// 为批量删除按钮添加点击事件
deleteMany.on('click', function () {
	var ids = [];
	// 获取选中的用户
	var checkedUser = $('#userBox').find('input').filter(':checked');
	checkedUser.each((index, element) => {
		ids.push($(element).attr('data-id'));
	});
	if (confirm('确认批量删除')) {
		$.ajax({
			type: 'delete',
			url: '/users/' + ids.join('-'),
			success: function () {
				location.reload();
			}
		})
	}
});