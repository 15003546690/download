;(function($){
	var Drop=function(opt,main){
		var _default={
			refreshDown:{
				_class:"refr",
				down:"<div>下拉刷新</div>",
				rele:"<div>释放更新</div>",
				loading:"<div class='ld'>加载中...</div>",
			},
			loadDown:{
				_class:"load",
				down:"<div>上拉加载</div>",
				rele:"<div>释放加载</div>",
				loading:"<div class='ld'>加载中...</div>",
			},
			dist:50,
			reloadPag:null,
			loadPag:null
		};
		this.settings=$.extend({},_default,opt);
		this.main=main;
		this.have=false;
		this.init();
	}
	Drop.prototype={
		init:function(){
			var _this=this;
			this.main
				.on("touchstart",function(e){
					getTouches(e);
					startFn(e,_this);
				})
				.on("touchmove",function(e){
					getTouches(e);
					moveFn(e,_this);
				})
				.on("touchend",function(e){
					getTouches(e);
					endFn(e,_this);
				})
		}
	};
	function getTouches(e){
		if(!e.touches){
			e.touches || e.originalEventTouches;
		}
	};
	function startFn(e,_this){
		_this.startY=e.touches[0].clientY;
		_this.sTop=_this.main.scrollTop();
		_this.mainH=_this.main.height();
		_this.allH=_this.main.find(".all").height();
	};
	function moveFn(e,_this){
		_this.offsetY=e.touches[0].clientY-_this.startY;
		if(_this.offsetY>0){
			_this.direction="向下";
		}else{
			_this.direction="向上";
		}
		if(_this.direction=="向下" && _this.sTop==0 && _this.settings.reloadPag){
			e.preventDefault();
			var _class=_this.settings.refreshDown._class,
				dis=_this.settings.dist,
				down=_this.settings.refreshDown.down,
				rele=_this.settings.refreshDown.rele,
				loading=_this.settings.refreshDown.loading,
				h=0;
			if(!_this.have){
					_this.rfBox=$("<div class='"+_class+"'></div>")
					_this.main.prepend(_this.rfBox);
					_this.have=true;
			}
			if(_this.offsetY<dis){
				$("."+_class).html(down);
				h=_this.offsetY;
			}else if(_this.offsetY>dis && _this.offsetY<dis*2){
				$("."+_class).html(rele);
				h=dis+(_this.offsetY-dis)*0.5;
			}else{
				h=dis*2+(_this.offsetY-dis*2)*0.1;
			}
			$("."+_class).css("height",h+'px');			
		}
		if(_this.direction=="向上" && _this.settings.loadPag && _this.allH<=_this.mainH+_this.main.scrollTop()){
			var _class=_this.settings.loadDown._class,
				dis=_this.settings.dist,
				down=_this.settings.loadDown.down,
				rele=_this.settings.loadDown.rele,
				loading=_this.settings.loadDown.loading,
				h=0;
			if(!_this.have){
					_this.ldBox=$("<div class='"+_class+"'></div>");
					_this.main.append(_this.ldBox);
					_this.have=true;
			}
			var absY=Math.abs(_this.offsetY)
			if(absY<dis){
				$("."+_class).html(down);
				h=absY;
			}else if(absY>dis && absY*2){
				$("."+_class).html(rele);
				h=dis+(absY-dis)*0.5;
			}else{
				h=dis*2+(absY-dis*2)*0.1;
			}
			$("."+_class).css({"height":h+"px"});
		}
	};
	function endFn(e,_this){
		var dis=_this.settings.dist;
		if(!_this.have) return false;
		if(_this.direction=="向上"){
			_this.box=_this.ldBox;
			_this.ld=_this.settings.loadDown.loading;
		}else{
			_this.box=_this.rfBox;
			_this.ld=_this.settings.refreshDown.loading;
		}
		if(Math.abs(_this.offsetY)<dis+"px"){
			_this.box
				.css("height",0)
				.on("webkitTransitionEnd",function(){
					this.remove();
					_this.have=false;
				})
		}else{
			_this.box
				.html(_this.ld)
				.css("height",dis+"px");
			if(_this.direction=="向上"){
				_this.settings.loadPag(_this);
			}else{
				_this.settings.reloadPag(_this);
				}
			}
		_this.box.css("transition","height .8s")
	};
	$.fn.drop=function(opt){
		new Drop(opt,$(this))
	}
})(Zepto)