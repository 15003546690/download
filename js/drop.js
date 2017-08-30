;(function($){
	var json = {
			"page_no": 1,
			"page_size": 7,
			"notice_state": "'3','4'",
			"order_by": "create_date"
		};
	$("#main").drop({
		reloadPag:function(_this){//下拉刷新
			json.page_no=1
			var aa = {
				"page_no": 1,
				"page_size": 7,
				"notice_state": "'3','4'",
				"order_by": "create_date"
			};
			$.ajax({
				url: 'http://192.168.5.220:20010/notice/search',
				type: 'POST',
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify(aa),
				success:function(re){
					var sDow="";
					$.each(re.data.notice_list,function(i,ele){
						sDow+='<a href="#">'+
									'<img src="img/1.jpg" alt="">'+
									'<h3>'+ele.notice_publisher+'</h3>'+
									'<span>'+ele.notice_id+'</span>'+
								'</a>';
					})
					setTimeout(function(){
						_this.main.find(".all").html(sDow);
						_this.box
							.css("height",0)
							.on("webkitTransitionEnd",function(){
								this.remove();
								_this.have=false;
							})
					},2000)
				}
			})
		},
		loadPag:function(_this){//上拉加载
			var that = this
			var totalCount=null
			json.page_no++   //每次加载   页数+1
			$.ajax({
				url: 'http://192.168.5.220:20010/notice/search',
				type: 'POST',
				contentType: "application/json; charset=UTF-8",
				data: JSON.stringify(json),
				success:function(re){
					console.log(re.data.total_count)
					totalCount=parseInt(re.data.total_count/7+1) //一共有多少页
					console.log(totalCount)
					if(json.page_no>=totalCount){ //最后一次加载改变html内容
						alert(0)
						$('.load > .ld').text('没有更多内容了')
					}
					var sDow="";
					$.each(re.data.notice_list,function(i,ele){
						if(i<7){
							sDow+='<a href="#">'+
									'<img src="img/1.jpg" alt="">'+
									'<h3>'+ele.notice_publisher+'</h3>'+
									'<span>'+ele.notice_id+'</span>'+
								'</a>';
						}
					})
					setTimeout(function(){
						_this.main.find(".all").append($(sDow));
						_this.box
							.css("height",0)
							.on("webkitTransitionEnd",function(){
								this.remove();
								_this.have=false;
							})
					},0)
				}
			})
		}
	})
})(Zepto)