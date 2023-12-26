shop2.options.msgTime = 2000;

shop2.msg = function(text, obj) {
    var selector = '#shop2-msg',
        msg = $(selector),
        offset = obj.offset(),
        width = obj.outerWidth(true),
        height = obj.outerHeight(true);

    if (!msg.get(0)) {
        msg = $('<div id="shop2-msg">');
        $(document.body).append(msg);
        msg = $(selector);
    }

    msg.html(text).fadeIn(150);

    var msgWidth = msg.outerWidth();
    var msgHeight = msg.outerHeight();
    var left = offset.left + width;
    var top = offset.top + height;

    if (left + msgWidth > $(window).width()) {
        left = offset.left - msgWidth;
    }

    msg.css({
        left: 50 + '%',
        top: 50 + '%',
        'position': 'fixed',
        'margin-left': msgWidth / 2 * -1,
        'margin-top': msgHeight / 2 * -1
    });
    
    $.s3throttle('msg', function() {
		msg.hide();
    }, shop2.options.msgTime);

    $(document).on('click', '#shop2-msg', function() {
        $(this).fadeOut(150);
    });
};


shop2.queue.compare = function() {

	var $document = $(document);
	if ($('html').attr('lang') == 'ru') {
		var compareBtn = '<a href="' + shop2.uri + '/compare" class="go-to-compare-btn" target="_blank">к сравнению</a>';
		var compareBtn2 = '<a href="' + shop2.uri + '/compare" class="go-to-compare-btn" target="_blank">Перейти к сравнению</a>';
	} else {
		var compareBtn = '<a href="' + shop2.uri + '/compare" class="go-to-compare-btn" target="_blank">сompare</a>';
		var compareBtn2 = '<a href="' + shop2.uri + '/compare" class="go-to-compare-btn" target="_blank">Compare</a>';
	};

	function update(el, res) {

		$('input[type=checkbox][value=' + el.val() + ']').closest('.product-compare').replaceWith(res.data);
		$('.product-compare-added a span').html(res.count);
		
		$('.compare-block .compare-block__amount').html(res.count);
		
		if (+$('.compare-block .compare-block__amount').text() == '0') {
			$('.compare-block').removeClass('active');
		} else {
			$('.compare-block').addClass('active');
		}

		if ($('html').attr('lang') == 'ru') {
			shop2.msg('Товар добавлен ' + compareBtn + '&nbsp;&nbsp;' + res.count, $('body'));
		} else {
			shop2.msg('Added to ' + compareBtn + '&nbsp;&nbsp;' + res.count, $('body'));
		};

		if (res.panel) {
			$('#shop2-panel').replaceWith(res.panel);
		};

	}

	$document.on('click', '.product-compare input:checkbox', function() {
		var $this = $(this),
			action = $this.attr('checked') ? 'del' : 'add';
			
		shop2.compare.action(action, $this.val(), function(res, status) {
			if (status == 'success') {
				
				if (res.errstr) {
					shop2.msg(res.errstr + '&nbsp;<br>' + compareBtn2, $('body'));
					$this.prop('checked', false);
				} else {
					update($this, res);
					
					if (action == 'del') {
						if ($('html').attr('lang') == 'ru') {
							shop2.msg('Товар удален из сравнения', $('body'));
						} else {
							shop2.msg('Product removed from comparison', $('body'));
						};
					}
				}
			}
		});
	});

};