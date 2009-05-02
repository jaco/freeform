// this will probably evolve into another framework

var Forms = {
	
	lang: 'en-US',	
	start: function() {
		if (typeof arguments[0] != 'undefined') {
			this.lang = arguments[0];
		}
		this.validateForms();
	},
	
	validateForms: function() {
		var global = this;
		
		function getParamValue(param, classNameAttr) {
			var classNames = classNameAttr.split(' ');
			for (var i = 0; i < classNames.length; i++) {
				if (classNames[i].indexOf(':') > -1) {
					var className = classNames[i].split(':');
					var value = (className[0] == param) ? className[1] : '';
				}
			};
			return value;
		}
		
		function manageErrors(error_stack) {
			var $field = $(error_stack.field).parent();
			var $cell = $field.parent();
			for (var i = 0; i < error_stack.messages.length; i++) {
				var $msg = $('<p class="message">' + error_stack.messages[i] + '</p>');
				$field.append($msg);
			};
			$cell.addClass('error');
		};		
		
		$('form').bind('submit', function(e) {
			var $form = $(this);
			var error_count = 0;
			
			var $fields_inputs = $('input[type="text"]', $form);
			var $fields_textarea = $('textarea', $form);
			var $text_fields = $fields_inputs.add($fields_textarea);
			
			$text_fields.each(function() {
				var $text_field = $(this);
				
				var value = this.value;
				var is_required = $text_field.is('.required');
				var is_empty = /^(\s+)?$/.test(value);
				
				// create error stack
				var error_stack = {
					error: false,
					field: this,
					messages: []
				};
				
				if (is_required && is_empty) {
					error_stack.error = true;
					error_stack.messages.push(L18n[global.lang].empty_field_not_allowed);
				}
				
				if ((is_required && !is_empty) || (!is_required && !is_empty)) {
					// if required and not empty, proceed with validation
					// if not required, do it too
				}
				
				if (error_stack.error) {
					error_count++;
					manageErrors(error_stack);
				}
			});

			if (error_count > 0) {
				e.preventDefault();
			}
		});
	}
};

$(function() {
	Forms.start();
});