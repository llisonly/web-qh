define([], function(){
	/**
	*@param type success 添加、修改、删除成功 error 操作失败 confirm 二次确认
	*@param title header描述性文字
	*@param text body描述性文字
	*@param okCallback 确定执行
	*@param cancelCallback 取消操作
	*/
	function modal(options){		
		this.options = {
			type: 'success',
			title: '',
			text: '',
			autoOpen: true			
		};

		$.extend(this.options, options||{});

		this._create();
	}

	modal.prototype = {
		constructor: modal,
		_create: function(){
			this.wrapper = $('<div class="modal fade c-modal" tabindex="-1" role="dialog"></div>');
			this.content = $('<div class="modal-dialog"></div>').appendTo(this.wrapper);			
			this.wrapper.appendTo($('body'));
			this._init();
		},
		_bindEvent: function(){
			var self = this,
				opt = this.options;

			this.wrapper.on('click', '.J-btn-ok', function(e){
				if(typeof opt.okCallback == 'function') opt.okCallback(e);
				self._destroy();
			});

			this.wrapper.on('click', '.J-btn-cancel', function(e){
				if(typeof opt.cancelCallback == 'function') opt.cancelCallback(e);
				self._destroy();
			});

			this.wrapper.on('click', '.J-btn-close', function(e){
				if(typeof opt.closeCallback == 'function') opt.closeCallback(e);
				self._destroy();
			});

			if(opt.type == 'success'){
				setTimeout(function(){
					if(typeof opt.closeCallback == 'function') opt.closeCallback();
					self._destroy();
				}, 2000);
			}
		},
		_init: function(){
			var self = this,
				opt = this.options;

			this._reset();

			if(opt.type == 'success'){
				this.wrapper.addClass('c-modal-success');
				this.content.append('<div class="modal-content">\
										<div class="modal-header">\
							       			<a class="r c-icon c-icon-close J-btn-close" href="javascript:;"></a>\
							       			<h4 class="modal-title">'+ opt.title + '</h4>\
							      		</div>\
							      		<div class="modal-body">\
							        		<i class="c-icon alert-success"></i>\
							        		<p>' + (opt.text ? opt.text : "操作成功") + '</p>\
							        	</div>\
						      		</div>');
			}else if(opt.type == 'error'){
				this.wrapper.addClass('c-modal-error');
				this.content.append('<div class="modal-content">\
										<div class="modal-header">\
							       			<a class="r c-icon c-icon-close J-btn-close" href="javascript:;"></a>\
							       			<h4 class="modal-title">'+ opt.title + '</h4>\
							      		</div>\
							      		<div class="modal-body">\
							        		<i class="c-icon alert-warning"></i>\
							        		<p>'+ (opt.text ? opt.text : "操作失败") +'</p>\
							        	</div>\
						      		</div>');
			}else if(opt.type == 'confirm'){
				this.wrapper.addClass('c-modal-confirm');
				this.content.append('<div class="modal-content">\
										<div class="modal-header">\
							       			<a class="r c-icon c-icon-close J-btn-close" href="javascript:;"></a>\
							       			<h4 class="modal-title">'+ (opt.title ? opt.title : "提示") + '</h4>\
							      		</div>\
							      		<div class="modal-body">\
							        		<i class="c-icon alert-warning"></i>\
							        		<p>'+ (opt.text ? opt.text : "确定删除吗？") + '</p>\
							      		</div>\
							      		<div class="modal-footer">\
							      			<div class="c-btn-group">\
								        		<a class="c-btn c-btn--small c-btn--blue J-btn-ok">确定</a>\
								        		<a class="ml10 c-btn c-btn--small J-btn-cancel">取消</a>\
							      			</div>\
							      		</div>\
						      		</div>');
			}

			if(opt.autoOpen) this._show();			
			this._bindEvent();
		},
		_reset: function(){
			this.wrapper.off('click');
			this.wrapper.attr('class', 'modal fade c-modal');
			this.content.empty();
		},
		_show: function(){
			var self = this,
				options,
				existModal;

			options = {show: true};

			existModal = self._isExist();

			if(existModal) existModal.modal('hide');
			this.wrapper.modal(options);
		},
		_isExist: function(){
			var successModal = $('.c-modal-success'),
				errorModal = $('.c-modal-error');

			if(successModal.length) return successModal;
			if(errorModal.length) return errorModal;
			return false;
		},
		_hide: function(){
			this.wrapper.modal('hide');
			this._reset();
		},
		_destroy: function(){
			this.wrapper.modal('hide');
			this._reset();
			self.wrapper.remove();
		}
	};

	return modal;
});