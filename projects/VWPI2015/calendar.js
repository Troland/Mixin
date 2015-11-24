/**
 * User: Tristan
 * Date: 14-7-18
 * Time: 上午11:10
 * var dates = ["2014-03-27", "2013-06-26", "2013-04-18"];
   var monthWeekList = [{"weeks":[null,null,null,"201015","201019","201024","201028","201032","201036","201040","201044","201048"],"year":"2010"},{"weeks":["201204","201208","201213","201217","201222","201226","201230","201235","201239","201243","201248","201252"],"year":"2012"},{"weeks":["201305","201309","201313","201317","201322","201326","201331","201335","201339","201344","201348","201352"],"year":"2013"}];

   var weeks = ["201434", "201135", "201204", "200944"];
   $('#time-sel-picker').calendar({
        data: dates,
        monthWeekMap: monthWeekList,
        visible: false,
        showMode: 'day',
        onSelect: function () {
            
        }
   });
 */
//Todo:点击轨道的时候进行移动
define(function (require, exports, module) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        helper;

    require('mousewheel');
    require('scrollPanel');
    require('selectBox');
    var defaults = {
            lang: 'zh-CN',
            count: 3, //日历个数
            format: 'mm/dd/yyyy',
            hasData: true, //是否传入数据
            prevClass: '.cam-calendar-ctrl-prev',   //向上翻
            nextClass: '.cam-calendar-ctrl-next',   //向下翻
            visible: true, //是否显示
            showControls: false, //是否显示控制
            close: false,  //是否显示关闭
            showMode: 'month', //month:月,halfMonth:半月,week：周,day: 天
            type: 'range', //默认range为选择范围,single为选择单个
            appendTo: null, //挂载到指定的目标元素
            weekStart: 1,  //一周默认从星期一开始
            onShow: null,
            onSelect: null,
            onClose: null,
            calendarWeeks: false,
            todayHighlight: false,
            zIndex: 3
        };

        //打印消息
        function log() {

        }
        function alias(method) {
            return function () {
                return this[method].apply(this, arguments);
            };
        }
        helper = {
            getDaysInMonth: function (year, month) {
                return [31, (helper.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
            },
            //判定是否为闰年
            isLeapYear: function (year) {
                //能被4整除并且不能够被100整除或者能够被400整除
                return !(year % 400) || (!(year % 4) && !!(year % 100));
            }
        };
        //日历构造函数
        var Calendar = function (element, options) {
            this.$el = $(element);
            this.init(options);
        };

        var CalendarRange = function (element, options) {
            this.element = $(element);
            this.inputs = $.map(options.inputs, function (i) {
                return i.jquery ? i[0] : i;
            });
            delete options.inputs;

            $(this.inputs)
                .datepicker(options)
                .bind('changeDate', $.proxy(this.dateUpdated, this));

            this.pickers = $.map(this.inputs, function (i) {
                return $(i).data('datepicker');
            });
            this.updateDates();
        };
        CalendarRange.prototype = {
            updateDates: function () {
                this.dates = $.map(this.pickers, function (i) {
                    return i.getUTCDate();
                });
                this.updateRanges();
            },
            updateRanges: function () {
                var range = $.map(this.dates, function (d) {
                    return d.valueOf();
                });
                $.each(this.pickers, function (i, p) {
                    p.setRange(range);
                });
            },
            dateUpdated: function (e) {
                // `this.updating` is a workaround for preventing infinite recursion
                // between `changeDate` triggering and `setUTCDate` calling.  Until
                // there is a better mechanism.
                if (this.updating)
                    return;
                this.updating = true;

                var dp = $(e.target).data('datepicker'),
                    new_date = dp.getUTCDate(),
                    i = $.inArray(e.target, this.inputs),
                    l = this.inputs.length;
                if (i === -1)
                    return;

                $.each(this.pickers, function (i, p) {
                    if (!p.getUTCDate())
                        p.setUTCDate(new_date);
                });

                if (new_date < this.dates[i]) {
                    // Date being moved earlier/left
                    while (i >= 0 && new_date < this.dates[i]) {
                        this.pickers[i--].setUTCDate(new_date);
                    }
                }
                else if (new_date > this.dates[i]) {
                    // Date being moved later/right
                    while (i < l && new_date > this.dates[i]) {
                        this.pickers[i++].setUTCDate(new_date);
                    }
                }
                this.updateDates();

                delete this.updating;
            },
            remove: function () {
                $.map(this.pickers, function (p) { p.remove(); });
                delete this.element.data().datepicker;
            }
        };

        //模板
        var  CalendarGlobal = {
            headTpl: '<div class="calendar-head"></div>',
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
        };

        function UTCDate() {
            return new Date(Date.UTC.apply(Date, arguments));
        }

        function UTCToday() {
            var today = new Date();
            return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
        }

        Calendar.prototype = {
            constructor: Calendar,

            init: function (options) {
                var self = this;
                this.options = $.extend({}, defaults, options);
                this.showMode = this.options.showMode;
                this.visible = this.options.visible;
                this.close = this.options.close;
                this.data = this.options.data;
                this.dates = [];
                this.hasData = this.options.hasData;
                this.appendTo = this.options.appendTo;
                this.selectedDates = [];
                this.zIndex = this.options.zIndex;
                this.position = this.options.position;
                this.count = this.options.count;
                this.$calendarWrap = $('<div class="cam-calendar-wrapper" />');
                this.showControls = this.options.showControls;
                this.viewDate = UTCToday();
                this.weekStart = this.options.weekStart % 7;
                this.weekEnd = ((this.weekStart + 6) % 7);
                this.buttons = this.options.buttons;
                this.isInput = this.$el.is('input');
                //周的时候显示的是最近三周，六周，十二周
                if (this.showMode == 'day' || this.showMode == 'month') {
                    this.controlHtml =$(
                        '<div class="calendar-head clearfix">' +
                            '<div class="cdropdown year-picker">' +
                                '<div class="cdropdown-t"><span class="cdropdown-label"></span><span class="cdropdown-arrow"></span></div>' +
                                '<div class="cdropdown-list"><ul></ul></div>'+
                            '</div>' +
                            '<div class="cdropdown month-picker">' +
                                '<div class="cdropdown-t"><span class="cdropdown-label"></span><span class="cdropdown-arrow"></span></div>' +
                                '<div class="cdropdown-list"><ul></ul></div>' +
                            '</div>' +
                        '</div>');
                } else {
                    this.controlHtml = $(
                        '<div class="calendar-head">' +
                            '<div class="cdropdown year-picker">' +
                                '<div class="cdropdown-t"><span class="cdropdown-label"></span><span class="cdropdown-arrow"></span></div>' +
                                '<div class="cdropdown-list"><ul></ul></div>' +
                            '</div>' +
                        '</div>');
                }
                this.setData(this.options.data);
                if (!this.visible) {
                    this.$el.on('click', function () {
                        //判断日历是否已经插入
                        /*if (!self.isShown) {
                            self.show();
                            self.setPosition();
                            self.isShown = true;
                        }*/
                        self.show();
                        
                    });
                }
                // if (this.close) {
                //     this.$calendarWrap.on('click', '.cam-calendar-close', function () {
                //         self.$calendarWrap.hide();
                //     });
                // }
                this.bindEvents();
                return this;
            },

            setUTCDates: function () {
                var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
                this.update.apply(this, $.map(args, this._utc_to_local));
                this._trigger('changeDate');
                this.setValue();
            },

            setUTCDate: alias('setUTCDates'),

            // 设置日期
            _setDate: function (date, which) {
                // if (!which || which === 'date')
                //     this._toggle_multidate(date && new Date(date));
                // if (!which || which === 'view')
                //     this.viewDate = date && new Date(date);

                this.viewDate = date && new Date(date);
                /*var days = this.fill();
                this.$calendarWrap.find('.calendar-days .calendar-rows').replaceWith(days);*/
                this.setValue();
                //this._trigger('changeDate');
                // var element;
                // if (this.isInput) {
                //     element = this.element;
                // }
                // else if (this.component) {
                //     element = this.element.find('input');
                // }
                // if (element) {
                //     element.change();
                // }
                // if (this.o.autoclose && (!which || which === 'date')) {
                //     this.hide();
                // }
            },

            _trigger: function (event) {
                this.$el.trigger({
                    type: event
                });
            },

            // 设置值
            setValue: function (value) {
                var formatted, dateValue;
                dateValue = value ? value : this.dates[0];
                if (this.showMode == 'day') {
                    var year = dateValue.getUTCFullYear(),
                        month = (dateValue.getUTCMonth() + 1) < 10 ? '0' + (dateValue.getUTCMonth() + 1) : '' + (dateValue.getUTCMonth() + 1),
                        day = dateValue.getUTCDate() < 10 ? '0' + dateValue.getUTCDate() : '' + dateValue.getUTCDate();
                    formatted = year + '/' + month + '/' + day;
                } else {
                	
                }
                if (!this.isInput) {
                    // if (this.component) {
                    //     this.element.find('input').val(formatted).change();
                    // }
                    this.$el.find('input').val(value).change();
                } else {
                    this.$el.val(formatted).change();
                }
            },
            
            setActive: function (value) {
            	var formatted, dateValue;
                dateValue = value ? value : this.dates[0];
                if (this.showMode == 'day') {
                    var year = dateValue.getUTCFullYear(),
                        month = (dateValue.getUTCMonth() + 1) < 10 ? '0' + (dateValue.getUTCMonth() + 1) : '' + (dateValue.getUTCMonth() + 1),
                        day = dateValue.getUTCDate() < 10 ? '0' + dateValue.getUTCDate() : '' + dateValue.getUTCDate();
                    formatted = year + '/' + month + '/' + day;
                } else {
                	formatted = dateValue.slice(0, 4) + '/' + dateValue.slice(4);
                }
                if (!this.isInput) {
                    // if (this.component) {
                    //     this.element.find('input').val(formatted).change();
                    // }
                    this.$el.find('input').val(value).change();
                } else {
                    this.$el.val(formatted).change();
                }
                if (this.showMode == 'day') {
                	
                } else if (this.showMode == 'week') {
                	this.$calendarWrap.find('.year-picker .cdropdown-list li').filter(function () {
                		return $(this).data('value') == dateValue.slice(0, 4);
                	}).trigger('click');
                	
                	this.$calendarWrap.find('.weekno').filter(function () {
                		return $(this).data('value') == value;
                	}).addClass('active');
                }
            },
            
            bindEvents: function () {
                var self = this;
                if (this.hasData) {
                    switch (this.showMode) {
                        case 'month':
                            this.$calendarWrap.on('click', 'ul li.clickable', $.proxy(this.select, this));
                            break;

                        case 'halfMonth':
                            this.$calendarWrap.on('click', 'ul li .d-half', $.proxy(this.select, this));
                            break;

                        case 'week':
                            this.$calendarWrap.on('click', '.calendar-weeks .weekno', $.proxy(this.select, this));
                            this.$calendarWrap.on('mouseenter mouseleave', '.calendar-weeks .weekno', $.proxy(this.mouseOver, this));
                            break;

                        case 'day':
                            this.$calendarWrap.on('click', '.calendar-days .day', $.proxy(this.select, this));
                            this.$calendarWrap.on('mouseenter mouseleave', '.calendar-days .day', $.proxy(this.mouseOver, this));
                            break;
                    }
                } else {
                    this.$calendarWrap.on('click', 'ul li', $.proxy(this.select, this));
                }
                this.$calendarWrap.on('click', '.cdropdown .cdropdown-t', function () {
                    var $dropDownList = $(this).next();
                    self.$calendarWrap.find('.cdropdown-list').not($dropDownList).hide();
                    $dropDownList.toggle();
                    return false;
                });
                this.$calendarWrap.on('mouseenter mouseleave', '.cdropdown .cdropdown-list li', $.proxy(this.mouseOver, this));
                this.$calendarWrap.on('click', '.cdropdown .cdropdown-list li', function () {
                    var $this = $(this),
                        value = $this.data('value');

                    if ( $this.hasClass('disable') ) return;
                    if ( $this.hasClass('selected') ) return;
                    $this
                    	.siblings()
                    	.removeClass('selected').end().addClass('selected');
                    if ( $this.closest('.cdropdown').hasClass('month-picker') && self.showMode == 'day') {
                        $this.closest('.cdropdown').find('.cdropdown-label').text(CalendarGlobal.monthsShort[value - 1]).data('value', value);
                    } else {
                        $this.closest('.cdropdown').find('.cdropdown-label').text(value).data('value', value);
                    }
                    if ($this.closest('.cdropdown').hasClass('month-picker') && self.showMode == 'month') {
                    	$this.closest('.cdropdown').find('.cdropdown-label').text(value).data('value', value);
                    }
                    //当显示模式为月的时候
                    if ($this.closest('.cdropdown').hasClass('year-picker') && self.showMode == 'month') {
                    	self.$calendarWrap.find('.month-picker .cdropdown-list li').removeClass('disable');
                    	var activeMonth = _.find(self.yearMonthMap, function (obj) { return obj.year == value; }).activeMonths[0];
                    	self.$calendarWrap.find('.month-picker .cdropdown-list li').each(function () {
                    		var $this = $(this), month = $this.data('value') + '';
                    		if ( !(_.find(self.yearMonthMap, function (obj) { return obj.year == value && _.indexOf(obj.activeMonths, month) > -1;})) ) {
                                $this.addClass('disable');
                            }
                    		if (month == activeMonth) {
                                $this.addClass('selected');
                            } else {
                            	$this.removeClass('selected');
                            }
                    	});
                    	self.$calendarWrap.find('.month-picker .cdropdown-label').text(activeMonth).data('value', activeMonth);
                    }
                    self.viewDate.setUTCFullYear(self.$calendarWrap.find('.year-picker').find('.cdropdown-label').text());
                    if ( self.$calendarWrap.find('.month-picker').length && self.showMode == 'day') {
                        self.viewDate.setUTCMonth(self.$calendarWrap.find('.month-picker').find('.cdropdown-label').data('value') - 1);
                    }
                    $this.closest('.cdropdown-list').hide();
                    self.reRender();
                    return false;
                });
                //日历关闭
                $(document).on('mousedown.calendar', function (e) {
                    if (!(self.$el.is(e.target) ||
                                self.$el.find(e.target).length ||
                                self.$calendarWrap.is(e.target) ||
                                self.$calendarWrap.find(e.target).length)) {

                        self.hide();
                    }
                    //判断点击的是不是下拉框
                    // if (!$(e.target).parents('.cdropdown-list').length) {
                    //     self.$calendarWrap.find('.cdropdown-list').hide();
                    // }
                });
                if (this.showMode == 'week') {
                    this.$calendarWrap.on('click', '.calendar-rows .weekno', $.proxy(this.select, this));
                }
            },

            stopListening: function () {
            	var self = this;
            	this.$calendarWrap.off('click', '.cdropdown .cdropdown-t');
            	this.$calendarWrap.off('click', '.cdropdown .cdropdown-list li');
                if (this.hasData) {
                    switch (this.showMode) {
                        case 'month':
                            this.$calendarWrap.off('click', 'ul li.clickable');
                            break;

                        case 'halfMonth':
                            this.$calendarWrap.off('click', 'ul li .d-half');
                            break;

                        case 'week':
                            break;

                        case 'day':
                            this.$calendarWrap.off('click', '.day');
                            break;
                    }
                } else {
                    this.$calendarWrap.off('click', 'ul li');
                }

                if (this.showMode == 'halfMonth') {
                    this.$calendarWrap.off('click', '.calendar-menu-text');
                    this.$calendarWrap.off('mousedown', '.cam-scroll-slider');
                    this.$calendarWrap.off('mousemove', '.cam-scroll-slider');

                    $(document).off('click.cdropdown');
                    this.$calendarWrap.off('mouseenter mouseleave', '.scroll-ctrl');

                    this.$calendarWrap.off('click', '.cdropdown-items li');
                }
                if (this.showMode == 'week') {
                    this.$calendarWrap.off('click', '.calendar-rows .weekno');
                }
            },

            button: function(e) {
                var $target = $(e.target),
                    fn = this._callbacks[$target.data('id')];

                return fn.call(this) !== false ? this.$calendarWrap.hide() : this;
            },

            //取消拖拽
            cancelDrag: function () {
                $('html').unbind('dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp');
            },

            // Stop IE from allowing text selection
            nil: function () {
                return false;
            },

            //日历类型为周的时候进行年切换的时候月份计算
            //date：201209，count为加或减
            processMonths: function(date, count) {
                var newMonth, newYear;

                if (+date.slice(4) + count > 12) {
                    newMonth = (+date.slice(4) + count) % 12;
                    newMonth = newMonth < 10 ? '0' + newMonth : newMonth;
                    newYear = +date.slice(0, 4) + 1;
                    return newYear + '' + newMonth;
                }
                if (+date.slice(4) + count < 1) {
                    newMonth = (+date.slice(4) + count) + 12;
                    newMonth = newMonth < 10 ? '0' + newMonth : newMonth;
                    newYear = +date.slice(0, 4) - 1;
                    return newYear + '' + newMonth;
                }

                return date.slice(0, 4) + '' + ((+date.slice(4) + count) < 10 ? ('0' + (+date.slice(4) + count)) : (+date.slice(4) + count));
            },

            //type:1:周,2:半月的时候
            updateDate: function(pos, date, type) {
                var isYear,
                    showDates;

                switch (type) {
                    case 1:
                        if (pos == 0) {
                            this.showRange = [date + '', this.processMonths(date + '', 1), this.processMonths(date + '', 2)];
                        } else if (pos == 1) {
                            this.showRange = [this.processMonths(date + '', -1), date + '', this.processMonths(date + '', 1)];
                        } else {
                            this.showRange = [this.processMonths(date + '', -2), this.processMonths(date + '', -1), date + ''];
                        }
                        for (var i = 0; i < this.showRange.length; i++) {
                            var theDate = '' + this.showRange[i], days = '';

                            days += this.fill(theDate);

                            this.$calendarWrap.find('.cam-calendar-s').eq(i).find('.calendar-rows').html(days);
                            this.$calendarWrap.find('.cam-calendar-s').eq(i)
                                .find('.cam-calendar-s-title .calendar-menu-year .calendar-menu-text-s').text(theDate.slice(0, 4));
                            this.$calendarWrap.find('.cam-calendar-s').eq(i)
                                .find('.cam-calendar-s-title .calendar-menu-month .calendar-menu-text-s').text(theDate.slice(4));
                            this.$calendarWrap.find('.cam-calendar-s').eq(i)
                                .find('.cam-calendar-s-title').data('year', theDate.slice(0, 4)).data('month', theDate.slice(4));
                        }
                        this.calculate();
                        break;

                    case 2:
                        if (pos == 0) {
                            this.showRange = [date + '', date + 1 + '', date + 2 + ''];
                        } else if (pos == 1) {
                            this.showRange = [date - 1 + '', date + '', date + 1 + ''];
                        } else {
                            this.showRange = [date - 2 + '', date - 1 + '', date + ''];
                        }
                        for (var i = 0; i < this.showRange.length; i++) {
                            var year = this.showRange[i], monthItems = '', yearHtml;
                            yearHtml = '<div class="calendar-cdropdown-wrapper calendar-menu-year">' +
                                            '<div class="calendar-menu-text">' +
                                                '<div class="calendar-menu-text-s">' + year + '年' + '</div>' +
                                                '<div class="calendar-icon"><div class="calendar-icon-border"><i class="calendar-icon-arr"></i></div></div>' +
                                            '</div>' +
                                            '<div class="cdropdown">' +
                                                '<div class="cdropdown-items">' +
                                                    this.fillYears(year + '') +
                                                '</div>' +
                                                '<div class="scroll-ctrl">' +
                                                    '<div class="cam-scroll-axis"></div>' +
                                                    '<div class="cam-scroll-slider">' +
                                                        '<div class="cam-scroll-s-top"></div>' +
                                                        '<div class="cam-scroll-s-bottom"></div>' +
                                                        '<div class="cam-scroll-s-block"></div>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>';
                            for (var j = 1; j <= 12; j++) {
                                var value = year + (j < 10 ? '0' + j : j + '');
                                monthItems += '<li class="cam-calendar-halfmonth" value="' + value + '">' +
                                                    '<span class="m-text">' + j + '</span>' +
                                                    '<div class="split-line"></div>' +
                                                    '<div class="cam-month-first-half d-half" value="' + value + '0' + '"><span class="d-half-text">半月</span></div>' + '<div class="cam-month-second-half d-half" value="' + value + '1' + '"><span class="d-half-text">半月</span></div>' +
                                             '</li>';
                            }
                            this.$calendarWrap.find('.cam-calendar-s').eq(i)
                                .find('.cam-calendar-s-title').find('.calendar-cdropdown-wrapper').replaceWith(yearHtml);
                                
                            this.$calendarWrap.find('.cam-calendar-s').eq(i).find('ul.month-list').html(monthItems);
                        }
                        this.calculate();
                        break;
                }
            },

            // 星期几
            fillDow: function () {
                var dowCnt = this.weekStart,
                    html = '<div class="dow-list clearfix">';

                if (this.options.calendarWeeks) {
                    var cell = '<span class="cw">&nbsp;</span>';
                    html += cell;
                }
                while (dowCnt < this.weekStart + 7) {
                    html += '<span class="dow">' +CalendarGlobal.daysMin[(dowCnt++) % 7] + '</span>';
                }
                html += '</div>';
                return html;
            },

            //隐藏日历
            hide: function () {
                if (!this.isShown) return;
                if (!this.$calendarWrap.is(':visible')) return;
                this.$calendarWrap.hide();
                if (this.options.onClose) {
                	this.options.onClose.apply(this);
                }
            },

            setPosition: function () {
                //必须设置显示的日历的position否则计算出的calendarWidth是错误的
                this.$calendarWrap.css({
                    position: 'absolute',
                    zIndex: this.zIndex
                });
                var calendarWidth = this.$calendarWrap.outerWidth(),
                    calendarHeight = this.$calendarWrap.outerHeight(),
                    height = this.$el.outerHeight(),
                    width = this.$el.outerWidth(),
                    winWidth = $(window).width(),
                    winHeight = $(window).height(),
                    scrollTop = $(window).scrollTop(),
                    offset = this.$el.offset();

                if (this.position) {
                    if (typeof $.isFunction(this.options)) {
                        offset = $.extend(offset, this.position.apply(this, arguments));
                    } else {
                        offset = $.extend(offset, this.position);
                    }
                } else {
                    offset.left = this.$el.offset().left + width / 2 - calendarWidth / 2;
                    //默认放向下放
                    offset.top = this.$el.offset().top + this.$el.outerHeight() + 10;
//                    if ((scrollTop + winHeight - (offset.top + height)) >= calendarHeight) {
//                        offset.top = this.$el.offset().top + this.$el.outerHeight() + 10;
//                    } else {
//                        offset.top = offset.top - scrollTop - calendarHeight - 10;
//                    }
                }
                this.$calendarWrap.css({
                    left: offset.left,
                    top: offset.top
                });
            },

            show: function () {
            	if (!$('body').find(this.$calendarWrap).length) {
                    this.$calendarWrap.appendTo(this.appendTo ? $(this.appendTo) : $('body'));
            	}
                this.setPosition();
                this.$calendarWrap.show();
                if ( this.$calendarWrap.is(':visible') ){
                	if (this.showMode == 'week') {
                    	if (!this.$calendarWrap.find('.calendar-weeks').data('jsp')) {
                    		this.$calendarWrap.find('.calendar-weeks').jScrollPane({verticalGutter: 0});
                    	}
                	}
                }
                this.isShown = true;
            },

            //传入数据
            setData: function (data) {
                var self = this;
                this.data = data;
                this.excludeData = this.options.excludeData ? this.options.excludeData : [];
                if (this.showMode == 'day') {
                    this.showYears = _.chain(data).map(function (v, i) { return v.split('-')[0]; }).uniq().value().sort().reverse();
                    this.yearMonthMap = [];
                    _.each(this.showYears, function (v, i) {
                        var item = {};
                        item.year = v;
                        item.activeMonths = _.chain(self.data)
                                                        .filter(function (value) {
                                                            return value.split('-')[0] == v;
                                                        })
                                                        .map(function (value) {
                                                            return value.split('-')[1];
                                                        }).uniq().value().sort();

                        self.yearMonthMap.push(item);
                    });
                } else if (this.showMode == 'week') {
                    var validYears = _.chain(this.data)
                                            .map(function (v) {
                                                return v.slice(0, 4);
                                            })
                                            .uniq()
                                            .value();
                    this.monthWeekMap = _.filter(this.options.monthWeekMap, function (obj) {
                        return _.indexOf(validYears, obj.year) > -1;
                    });
                } else if (this.showMode == 'month') {

                	this.showYears = _.chain(data).map(function (v, i) { return v.slice(0, 4); }).uniq().value().sort(function (a, b) {
                        return b - a;
                    });
                    this.yearMonthMap = [];
                    _.each(this.showYears, function (v, i) {
                        var item = {};
                        item.year = v;
                        item.activeMonths = _.chain(self.data)
                                                        .filter(function (value) {
                                                            return value.slice(0, 4) == v;
                                                        })
                                                        .map(function (value) {
                                                            return value.slice(4, 6);
                                                        }).uniq().value().sort();

                        self.yearMonthMap.push(item);
                    });
                }
                //this.excludeData = data ? data.slice(2) : [];
                // this.showRange = this.getRange();
                this.render();
                if (this.visible) {
                    this.$calendarWrap.appendTo(this.appendTo ? $(this.appendTo) : $('body'));
                }
                this.calculate();
            },

            reset: function (options) {
            	var self = this;
            	this.$el.val('');
                this.stopListening();
                this.isShown = false;
                this.data = options.data;
                this.excludeData = options.excludeData ? options.excludeData : [];
                // this.excludeData = options.data ? options.data.slice(2) : [];
                // this.selectedDates = [];
                // this.showRange = this.getRange();
                if (this.showMode == 'day') {
                    this.showYears = _.chain(self.data).map(function (v, i) { return v.split('-')[0]; }).uniq().value().sort();
                    this.yearMonthMap = [];
                    _.each(this.showYears, function (v, i) {
                        var item = {};
                        item.year = v;
                        item.activeMonths = _.chain(self.data)
                                                        .filter(function (value) {
                                                            return value.split('-')[0] == v;
                                                        })
                                                        .map(function (value) {
                                                            return value.split('-')[1];
                                                        }).uniq().value().sort();

                        self.yearMonthMap.push(item);
                    });
                } else if (this.showMode == 'week') {
                    var validYears = _.chain(this.data)
                                            .map(function (v) {
                                                return v.slice(0, 4);
                                            })
                                            .uniq()
                                            .value();
                    this.monthWeekMap = _.filter(this.options.monthWeekMap, function (obj) {
                        return _.indexOf(validYears, obj.year) > -1;
                    });
                } else if (this.showMode == 'month') {
                	this.showYears = _.chain(this.data).map(function (v, i) { return v.slice(0, 4); }).uniq().value().sort().reverse();
                    this.yearMonthMap = [];
                    _.each(this.showYears, function (v, i) {
                        var item = {};
                        item.year = v;
                        item.activeMonths = _.chain(self.data)
                                                        .filter(function (value) {
                                                            return value.slice(0, 4) == v;
                                                        })
                                                        .map(function (value) {
                                                            return value.slice(4, 6);
                                                        }).uniq().value().sort();

                        self.yearMonthMap.push(item);
                    });
                }
                this.render();
                this.calculate();
                this.$calendarWrap.remove();
                this.bindEvents();
            },

            getMonthByWeek: function (year, week) {
                //var year = this.
            },

            // 计算应该显示的日历
            getRange: function () {
                var maxDate;
                //当是周的时候显示的是月份的周
                if (this.showMode == 'week') {
                    if (this.data[1] == '') {
                        maxDate = (new Date()).getFullYear() + '' + (new Date()).getMonth() + 1 < 10 ? '0' + (new Date()).getMonth() + 1 : (new Date()).getMonth() + 1;
                    } else {
                        var year = +this.data[1].substring(0, 4),
                           week = +this.data[1].substring(4),
                           // First Thursday of year, year from thursday
                           yth = Number(yth = UTCDate(year, 0, 1)) + (7 + 4 - yth.getUTCDay()) % 7 * 864e5,
                           month = '' + ((new Date((week - 1) * 7 * 864e5 + yth)).getUTCMonth() + 1);

                        maxDate = year + '' + month;
                    }

                    var leftMonth, middleMonth, year, month;
                    year = +maxDate.substring(0, 4);
                    month = +maxDate.substring(4);
                    //当月份诸如201102,201101的时候进行计算
                    if (month <= 2) {
                        if (month == 2) {
                            leftMonth = +(year - 1 + '' + month + 10);
                            middleMonth = +(maxDate - 1);
                        } else {
                            leftMonth = +(year - 1 + '' + month + 10);
                            middleMonth = +(year - 1 + '' + month + 11);
                        }
                    } else {
                        leftMonth = maxDate - 2 + '';
                        middleMonth = maxDate - 1 + '';
                    }

                    if (this.count == 1) {
                        return [maxDate];
                    } else {
                        return [leftMonth, middleMonth, maxDate];
                    }
                } else {
                    if (this.data[1]) {
                        maxDate = this.data[1].substring(0, 4);
                    } else {
                        maxDate = (new Date()).getFullYear() + '';
                    }
                }

                if (this.count == 1) {
                    return [maxDate];
                } else {
                    return [maxDate - 2 + '', maxDate - 1 + '', maxDate];
                }
            },

            // 渲染
            render: function (data) {
                var calendar_wrap = '<div class="cam-calendar">',
                                    itemsHtml = '', self = this;

                switch (this.showMode) {
                    case 'month':
                    	 var yearHtml = '', month, monthHtml = '', days = '', activeMonth = +(_.last(this.yearMonthMap[0].activeMonths));
                         for (var i = 0; i < this.showYears.length; i++) {
                        	 if (i == 0) {
                                 yearHtml += '<li class="selected" data-value="'+this.showYears[i]+'">' + this.showYears[i] + '</li>';
                        	 } else {
                                 yearHtml += '<li data-value="'+this.showYears[i]+'">' + this.showYears[i] + '</li>';
                        	 }
                         }
                         for (month = 1; month <= 12; month++) {
                        	 var value = month < 10 ? '0' + month : '' + month;
                             monthHtml += '<li data-value="'+(value)+'">' + value + '</li>';
                         }
                         
                         this.controlHtml.addClass('calendar-type-month');
                         if (!this.controlHtml.find('.year-picker').find('label').length) {
                             this.controlHtml.find('.year-picker').prepend('<label>Year</label>');
                         }
                         this.controlHtml.find('.year-picker .cdropdown-label').text(this.showYears[0]);
                         this.controlHtml.find('.year-picker .cdropdown-list ul').html(yearHtml);
                         if (!this.controlHtml.find('.month-picker').find('label').length) {
                        	 this.controlHtml.find('.month-picker').prepend('<label>Month</label>');
                         }
                         this.controlHtml.find('.month-picker .cdropdown-label').text(activeMonth < 10 ? '0' + activeMonth : '' + activeMonth).data('value', activeMonth);
                         this.controlHtml.find('.month-picker .cdropdown-list ul').html(monthHtml);

                         this.viewDate.setUTCFullYear(this.showYears[0]);
                         this.viewDate.setUTCMonth(activeMonth - 1);
                         this.$calendarWrap.addClass('calendar-type-month-wrapper');
                        break;

                    case 'halfMonth':
                        for (var i = 0; i < this.showRange.length; i++) {
                            var year = this.showRange[i], monthItems = '', yearHtml;

                            yearHtml = '<div class="calendar-cdropdown-wrapper calendar-menu-year clearfix">' +
                                                '<div class="calendar-menu-text">' +
                                                    '<div class="calendar-menu-text-s">' + year + '</div>' +
                                                    '<div class="calendar-icon"><div class="calendar-icon-border"><i class="calendar-icon-arr"></i></div></div>' +
                                                '</div>' +
                                                '年' +
                                                '<div class="cdropdown">' +
                                                    '<div class="cdropdown-items">' +
                                                        this.fillYears(year + '') +
                                                    '</div>' +
                                                    '<div class="scroll-ctrl">' +
                                                        '<div class="cam-scroll-axis"></div>' +
                                                        '<div class="cam-scroll-slider">' +
                                                            '<div class="cam-scroll-s-top"></div>' +
                                                            '<div class="cam-scroll-s-bottom"></div>' +
                                                            '<div class="cam-scroll-s-block"></div>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
                                            '</div>';

                            for (var j = 1; j <= 12; j++) {
                                var value = year + (j < 10 ? '0' + j : j + '');
                                monthItems += '<li class="cam-calendar-halfmonth" value="' + value + '">' +
                                                    '<span class="m-text">' + j + '</span>' +
                                                    '<div class="split-line"></div>' +
                                                    '<div class="cam-month-first-half d-half" value="' + value + '0' + '"><span class="d-half-text">半月</span></div>' + '<div class="cam-month-second-half d-half" value="' + value + '1' + '"><span class="d-half-text">半月</span></div>' +
                                             '</li>';
                            }
                            itemsHtml += '<div class="cam-calendar-s cam-calendar-type-halfmonth cam-calendar-' + (i + 1) + '" id="cam-calendar-' + (i + 1) + '">' +
                                            '<div class="cam-calendar-s-title">' + yearHtml + '</div>' +
                                            '<ul class="month-list">' + monthItems + '</ul>' +
                                         '</div>';
                        }
                        this.$calendarWrap.addClass('calendar-type-halfMonth-wrapper');
                        break;

                    case 'week':
                        var yearHtml = '', month, monthHtml = '', weeks = '';
                        for (var i = 0; i < this.monthWeekMap.length; i++) {
                        	if (i == this.monthWeekMap.length - 1) {
                                yearHtml += '<li class="selected" data-value="'+this.monthWeekMap[i].year+'">' + this.monthWeekMap[i].year + '</li>';
                        	} else {
                                yearHtml += '<li data-value="'+this.monthWeekMap[i].year+'">' + this.monthWeekMap[i].year + '</li>';
                        	}
                        }
                        this.controlHtml.find('.year-picker .cdropdown-label').text(this.monthWeekMap[this.monthWeekMap.length - 1].year);
                        this.controlHtml.find('.year-picker .cdropdown-list ul').html(yearHtml);
                        this.viewDate.setUTCFullYear(this.monthWeekMap[this.monthWeekMap.length - 1].year);
                        weeks = this.fillWeeks();
                        itemsHtml += '<div class="calendar-weeks">' +
                             '<div class="calendar-rows">' + weeks + '</div>' +
                            '</div>' +
                        '</div>';
                        this.$calendarWrap.addClass('calendar-type-week-wrapper');
                        break;

                    case 'day':
                        var yearHtml = '', month, monthHtml = '', days = '', activeMonth = +(_.last(this.yearMonthMap[this.yearMonthMap.length - 1].activeMonths));
                        for (var i = 0; i < this.showYears.length; i++) {
                            yearHtml += '<li data-value="'+this.showYears[i]+'">' + this.showYears[i] + '</li>';
                        }
                        for (month = 0; month < 12; month++) {
                            monthHtml += '<li data-value="'+(month+1)+'">' + CalendarGlobal.monthsShort[month] + '</li>';
                        }
                        this.controlHtml.find('.year-picker .cdropdown-label').text(this.showYears[this.showYears.length - 1]);
                        this.controlHtml.find('.year-picker .cdropdown-list ul').html(yearHtml);
                        this.controlHtml.find('.month-picker .cdropdown-label').text(CalendarGlobal.monthsShort[activeMonth - 1]).data('value', activeMonth);
                        this.controlHtml.find('.month-picker .cdropdown-list ul').html(monthHtml);

                        this.viewDate.setUTCFullYear(this.showYears[this.showYears.length - 1]);
                        this.viewDate.setUTCMonth(activeMonth - 1);
                        days = this.fill();
                        itemsHtml += '<div class="calendar-days">' +
                            this.fillDow() +
                             '<div class="calendar-rows">' + days + '</div>' +
                            '</div>' +
                        '</div>';
                        this.$calendarWrap.addClass('calendar-type-day-wrapper');
                        break;
                }
                calendar_wrap += itemsHtml;
                calendar_wrap += '</div>';
                if (this.close) {
                    calendar_wrap += '<div class="cam-calendar-close" title="关闭"></div>';
                }
                if (this.buttons) {
                    calendar_wrap += '<div class="cam-calendar-bottom">';
                    $.each(this.buttons, function (i, val) {
                        val.id = val.id || val.value;
                        self._callbacks = {};
                        self._callbacks[val.id] = val.callback;
                        calendar_wrap += '<button class="btn-calendar" data-id="' + val.id + '">' + val.value + '</button>';
                    });
                    calendar_wrap += '</div>';
                }

                calendar_wrap += '</div>';
                this.$calendarWrap.html(calendar_wrap);
                this.$calendarWrap.find('.cam-calendar').prepend(this.controlHtml.clone(true, true));
                this.$calendarWrap.find('.cam-calendar').prepend('<span class="icon-arrow"></span>');
                // if (this.showMode == 'day') {
                    
                // } else {

                // }
                if (!this.hasData) {
                    this.$calendarWrap.addClass('cam-calendar-normal');
                }
                if (!this.showControls) {
                    //this.$calendarWrap.find('.calendar-head').hide();
                }
               
            },

            reRender: function () {
                var yearHtml = '', month, monthHtml = '', itemsHtml = '', days = '', weeks = '', activeMonth;

                        if (this.showMode == 'day') {
                            var year = this.$calendarWrap.find('.year-picker .cdropdown-label').text();
                            activeMonth = this.$calendarWrap.find('.month-picker .cdropdown-label').data('value');
                            days = this.fill();
                            this.$calendarWrap.find('.calendar-days .calendar-rows').html(days);
                        } else if (this.showMode == 'week') {
                            var year = this.$calendarWrap.find('.year-picker .cdropdown-label').text();
                            weeks = this.fillWeeks();
                            if (this.$calendarWrap.find('.calendar-weeks').data('jsp')) {
                                this.$calendarWrap.find('.calendar-weeks').data('jsp').destroy();
                            }
                            this.$calendarWrap.find('.calendar-weeks .calendar-rows').html(weeks);
                            if ( this.$calendarWrap.is(':visible') ) {
                                this.$calendarWrap.find('.calendar-weeks').jScrollPane({verticalGutter: 0});
                            }
                        } else {
                        	var year = this.$calendarWrap.find('.year-picker .cdropdown-label').text();
                            activeMonth = this.$calendarWrap.find('.month-picker .cdropdown-label').data('value');
                        }
            },

            // 填充周
            fillWeeks: function () {
                var i, html = [], year = this.viewDate.getUTCFullYear(), monthWeekMap = _.find(this.monthWeekMap, function (obj) {
                    return obj.year == year;
                }).weeks, j;

                for (i = 0; i < 12; i++) {
                    if (!monthWeekMap[i]) continue;
                    var startWeek, endWeek;
                    if (i == 0) {
                        startWeek = 1;
                    } else {
                        if (monthWeekMap[i - 1]) {
                            startWeek = +(monthWeekMap[i - 1].slice(4)) + 1;
                        } else {
                            startWeek = +(monthWeekMap[i].slice(4)) - 4;
                        }
                    }

                    endWeek = +(monthWeekMap[i].slice(4));
                    html.push('<div class="calendar-row clearfix">');
                    html.push('<span class="month">' + CalendarGlobal.monthsShort[i] + '</span>');
                    html.push('<ul class="weeks">');
                    for (j = startWeek; j <= endWeek; j++) {
                        var weekno = year + '' + (j < 10 ? '0' + j : '' +j);
                        if (_.indexOf(this.data, weekno) == -1) {
                            html.push('<li class="weekno disable">' + j + '</li>');
                        } else {
                            html.push('<li class="weekno" data-value="'+weekno+'">' + j + '</li>');
                        }
                    }
                    html.push('</ul>');
                    html.push('</div>');
                }

                return html.join('');
            },

            //填充年
            fillYears: function () {
                var html = [],
                    now = new UTCToday(),
                    tYear = now.getUTCFullYear();

                html.push('<ul>');
                for (var year = tYear; year >= 1900; year--) {
                    html.push('<li data-type="year" data-value="' + year + '">' + year + '</li>');
                }

                html.push('</ul>');
                return html.join('');
            },

            //填充天
            fillDays: function () {
                
            },

            //填充月
            fillMonths: function () {
                var html = [];

                html.push('<ul>');
                for (var month = 1; month < 13; month++) {
                    html.push('<li data-type="month" data-value="' + month + '">' + month + '</li>');
                }

                html.push('</ul>');
                return html.join('');
            },

            //根据月计算周
            calucateWeekByMonth: function(month) {

            },

            getClassNames: function (date) {
                var cls = [],
                    year = this.viewDate.getUTCFullYear(),
                    month = this.viewDate.getUTCMonth(),
                    today = new Date();

                if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)) {
                    cls.push('old');
                    if (month === 0) {
                        month = 11;
                        year -= 1;
                    } else {
                        month -= 1;
                    }
                    // 判断是否该月是否可以切换
                    if ( !(_.find(self.yearMonthMap, function (obj) { return obj.year == year && _.indexOf(obj.activeMonths, month + 1) > -1;})) ) {
                        cls.push('disable');
                    }
                }
                else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)) {
                    cls.push('new');
                }
                if (_.contains(this.dates, date)) {
                    cls.push('active');
                }
                // if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
                //     cls.push('focused');
                // Compare internal UTC date with local today, not UTC today
                if (this.options.todayHighlight &&
                    date.getUTCFullYear() === today.getFullYear() &&
                    date.getUTCMonth() === today.getMonth() &&
                    date.getUTCDate() === today.getDate()) {
                    cls.push('today');
                }

                // if (this.dates.contains(date) !== -1)
                //     cls.push('active');
                // if (date.valueOf() < this.o.startDate || date.valueOf() > this.o.endDate ||
                //     $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1) {
                //     cls.push('disabled');
                // }
                // if (this.range) {
                //     if (date > this.range[0] && date < this.range[this.range.length - 1]) {
                //         cls.push('range');
                //     }
                //     if ($.inArray(date.valueOf(), this.range) !== -1) {
                //         cls.push('selected');
                //     }
                // }
                return cls;
            },

            //填充周
            fill: function (date) {
                var d = new Date(this.viewDate),
                    year = d.getUTCFullYear(),
                    month = d.getUTCMonth(), rangeDays, temp = new Date();

                var prevMonth = UTCDate(year, month - 1, 28),
                    day = helper.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
                prevMonth.setUTCDate(day);
                rangeDays = (prevMonth.getUTCDay() - this.weekStart + 7) % 7 + helper.getDaysInMonth(prevMonth.getUTCFullYear(), month);
                prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
                var nextMonth = new Date(prevMonth);
                nextMonth.setUTCDate(nextMonth.getUTCDate() + rangeDays);
                nextMonth = nextMonth.valueOf();
                var html = [];
                var clsName;

                while (prevMonth.valueOf() <= nextMonth) {
                    if (prevMonth.getUTCDay() === this.weekStart) {
                        html.push('<div class="calendar-row clearfix">');
                        if (this.options.calendarWeeks) {
                                                // ISO 8601: First week contains first thursday.
                            // ISO also states week starts on Monday, but we can be more abstract here.
                            var
                                // Start of current week: based on weekstart/current date
                                ws = new Date(+prevMonth + (this.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
                                // Thursday of this week
                                th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
                                // First Thursday of year, year from thursday
                                yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay()) % 7 * 864e5),
                                // Calendar week: ms between thursdays, div ms per day, div 7 days
                                calWeek = (th - yth) / 864e5 / 7 + 1;
                                html.push('<span class="cw calendar-grid">' + calWeek + '</span>');
                        }
                    }
                    clsName = this.getClassNames(prevMonth);
                    clsName.push('day calendar-grid');
                    html.push('<span class="' + clsName.join(' ') + '">' + prevMonth.getUTCDate() + '</span>');
                    if (prevMonth.getUTCDay() === this.weekEnd) {
                        html.push('</div>');
                    }
                    prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
                }
                if (html[html.length - 1] != '</div>') {
                    html.push('</div>');
                }
                //html.push('</div>');
                return html.join('');
            },

            afterRender: function () {
                var that = this;
            },

            select: function (e) {
                var $target = $(e.currentTarget),
                    sel_date,
                    year, month, day;

                if ($target.hasClass('active') || $target.hasClass('disable')) {
                    return;
                }
                if (this.showMode == 'day') {
                    this.$calendarWrap.find('.day').removeClass('active');
                    $target.addClass('active');
                    year = this.$calendarWrap.find('.year-picker .cdropdown-label').text();
                    month = this.$calendarWrap.find('.month-picker .cdropdown-label').data('value') - 1;
                    day = $target.text();
                    if ( $target.hasClass('old') ) {
                        if (month === 0) {
                            month = 11;
                            year -= 1;
                        } else {
                            month -= 1;
                        }
                    }
                    sel_date = this.$calendarWrap.find('.year-picker .cdropdown-label').text() + '/' + this.$calendarWrap.find('.month-picker .cdropdown-label').data('value') + '/' + $target.text();

                    this.dates = [];
                    this.dates.push(UTCDate(year, month, day));
                    this._setDate(UTCDate(year, month, day));
                } else if (this.showMode == 'week') {
                    var weekno = $target.data('value') + '';
                    this.$calendarWrap.find('.weekno').removeClass('active');
                    $target.addClass('active');
                    year = this.$calendarWrap.find('.year-picker .cdropdown-label').text();
                    this.dates = [];
                    this.dates.push(weekno.slice(0, 4) + '/' + weekno.slice(4));
                    this.$el.val(weekno.slice(0, 4) + '/' + weekno.slice(4));
                }

                if (this.options.onSelect) {
                    this.options.onSelect.apply(this);
                }
                
                return false;
            },
            
            mouseOver: function (e) {
            	var $target = $(e.currentTarget),
            		event = e.type;
            	
            	if (e.type == 'mouseenter') {
            		
            	}
            	$target[e.type == 'mouseenter' ? 'addClass' : 'removeClass']('hover');
            	return false;
            },
            
            setRange: function (range) {
                if (!range || !range.length)
                    delete this.range;
                else
                    this.range = $.map(range, function (d) {
                        return d.valueOf();
                    });
                var days = this.fill();
                this.$calendarWrap.find('.calendar-days .calendar-rows').replaceWith(days);
            },

            getUTCDate: function () {
                return new Date(_.last(this.dates));
            },

            //赋值
            makeValue: function () {
                var dateRange, self = this;
                this.selectedDates.sort();
                dateRange = this.selectedDates.length <= 1 ?
                    this.selectedDates.join('') : this.selectedDates[0] + '~' + this.selectedDates[this.selectedDates.length - 1];

                //把日期的所有日期全部设为红色
                if (this.selectedDates.length >= 1) {
                    if (this.hasData) {
                        switch (self.showMode) {
                            case 'month':
                                this.$calendarWrap.find('.cam-calendar-s li.clickable').each(function (i, el) {
                                    var dateValue = ($(this).attr('value')).toString();
                                    if (self.selectedDates.length === 1) {
                                        if (dateValue == self.selectedDates[0]) {
                                            if (!($(this).hasClass('active'))) {
                                                $(this).addClass('active');
                                            }
                                        } else {
                                            $(this).removeClass('active');
                                        }
                                    } else {
                                        if (self.selectedDates[0] <= dateValue && dateValue <= self.selectedDates[1]) {
                                            if (!($(this).hasClass('active'))) {
                                                $(this).addClass('active');
                                            }
                                        } else {
                                            $(this).removeClass('active');
                                        }
                                    }
                                });
                                break;

                            case 'halfMonth':
                                this.$calendarWrap.find('.cam-calendar-s .d-half').not('.disable').each(function (i, el) {
                                    var dateValue = ($(this).attr('value')).toString();
                                    if (self.selectedDates.length === 1) {
                                        if (dateValue == self.selectedDates[0]) {
                                            if (!($(this).hasClass('active'))) {
                                                $(this).addClass('active');
                                                $(this).parent().addClass('active');
                                            }
                                        } else {
                                            $(this).removeClass('active');
                                            $(this).parent().removeClass('active');
                                        }
                                    } else {
                                        if (self.selectedDates[0] <= dateValue && dateValue <= self.selectedDates[1]) {
                                            if (!($(this).hasClass('active'))) {
                                                $(this).addClass('active');
                                                
                                            }
                                            $(this).parent().toggleClass('active', true);
                                        } else {
                                            $(this).removeClass('active');
                                            $(this).parent().removeClass('active');
                                        }
                                    }
                                });
                                break;

                            case 'week':
                                this.$calendarWrap.find('.cam-calendar-s .calendar-rows .calendar-row').each(function (i, el) {
                                    var dateValue = ($(this).attr('value')).toString();
                                    if (self.selectedDates.length === 1) {
                                        if (dateValue == self.selectedDates[0]) {
                                            if (!($(this).hasClass('active'))) {
                                                $(this).addClass('active');
                                            }
                                        } else {
                                            $(this).removeClass('active');
                                        }
                                    } else {
                                        if (self.selectedDates[0] <= dateValue && dateValue <= self.selectedDates[1]) {
                                            if (!($(this).hasClass('active'))) {
                                                $(this).addClass('active');
                                            }
                                        } else {
                                            $(this).removeClass('active');
                                        }
                                    }
                                });
                                break;
                        }
                    } else {
                        if (this.showMode == 'week') {
                            this.$calendarWrap.find('.cam-calendar-s .calendar-row').each(function (i, el) {
                                var dateValue = ($(this).attr('value')).toString();
                                if (self.selectedDates.length === 1) {
                                    if (dateValue == self.selectedDates[0]) {
                                        if (!($(this).hasClass('active'))) {
                                            $(this).addClass('active');
                                        }
                                    } else {
                                        $(this).removeClass('active');
                                    }
                                } else {
                                    if (self.selectedDates[0] <= dateValue && dateValue <= self.selectedDates[1]) {
                                        if (!($(this).hasClass('active'))) {
                                            $(this).addClass('active');
                                        }
                                    } else {
                                        $(this).removeClass('active');
                                    }
                                }
                            });
                        } else {
                            this.$calendarWrap.find('.cam-calendar-s li').each(function (i, el) {
                                var dateValue = ($(this).attr('value')).toString();
                                if (self.selectedDates.length === 1) {
                                    if (dateValue == self.selectedDates[0]) {
                                        if (!($(this).hasClass('active'))) {
                                            $(this).addClass('active');
                                        }
                                    } else {
                                        $(this).removeClass('active');
                                    }
                                } else {
                                    if (self.selectedDates[0] <= dateValue && dateValue <= self.selectedDates[1]) {
                                        if (!($(this).hasClass('active'))) {
                                            $(this).addClass('active');
                                        }
                                    } else {
                                        $(this).removeClass('active');
                                    }
                                }
                            });
                        }
                    }
                }
                this.$el.val(dateRange);
            },

            calculate: function () {
                var self = this;
                if (this.hasData) {
                    switch (this.showMode) {
                    	case 'month':
	                        this.$calendarWrap.find('.month-picker .cdropdown-list ul li').each(function () {
	                            var $this = $(this),
	                                year = self.$calendarWrap.find('.year-picker .cdropdown-label').text(),
	                                month = +$this.data('value') < 10 ? '0' + ( +$this.data('value') ) : '' + ( +$this.data('value') );
	                            
	                            if ( !(_.find(self.yearMonthMap, function (obj) { return obj.year == year && _.indexOf(obj.activeMonths, month) > -1;})) ) {
	                                $this.addClass('disable');
	                            }
	                        });
	                        this.$calendarWrap.find('.month-picker .cdropdown-list ul li').not('disable').filter(function () {
	                        	return $(this).data('value') == self.$calendarWrap.find('.month-picker .cdropdown-t .cdropdown-label').text();
	                        }).addClass('selected');
                        break;
                        
                        case 'day':
                            this.$calendarWrap.find('.month-picker .cdropdown-list ul li').each(function () {
                                var $this = $(this),
                                    year = self.$calendarWrap.find('.year-picker .cdropdown-label').text(),
                                    month = $this.data('value') < 10 ? '0' + $this.data('value') : '' + $this.data('value');

                                if ( !(_.find(self.yearMonthMap, function (obj) { return obj.year == year && _.indexOf(obj.activeMonths, month) > -1;})) ) {
                                    $this.addClass('disable');
                                }
                            });
                            break;

                        case 'week':
                            this.$calendarWrap.find('.cam-calendar-list .calendar-row').each(function (i, el) {
                                var $this = $(this), value = $this.attr('value') + '', compareDates;
                                compareDates = self.data;
                                if (!((value >= compareDates[0] && value <= compareDates[1]) && !~_.indexOf(self.excludeData, value))) {
                                    $this.addClass('disable');
                                }
                            });
                            break;
                    }
                }
            },

            reInit: function () {
                var self = this;
                this.render();
                this.calculate();
                return this;
            },

            //点击最近三月，一月，半年设置状态
            makeActive: function () {
                var that = this;
                if (this.showMode == 'month') {
                    this.$calendarWrap
                        .find('.cam-calendar-month.clickable')
                        .each(function (i, el) {
                            var $this = $(this),
                                value = $this.attr('value');

                            //当已经选日期和对应的日期一致设置激活状态
                            if (that.selectedDates.length) {
                                if (that.selectedDates.length === 1) {
                                    if (value == that.selectedDates[0]) {
                                        $this.addClass('active');
                                    }
                                } else {
                                    if (that.selectedDates[0] <= value && value <= that.selectedDates[1]) {
                                        $this.addClass('active');
                                    }
                                }
                            }
                        });
                } else if (this.showMode == 'halfMonth') {
                    this.$calendarWrap
                        .find('.cam-calendar-halfmonth .d-half')
                        .not('.disable')
                        .each(function (i, el) {
                            var $this = $(this),
                                value = $this.attr('value');

                            //当已经选日期和对应的日期一致设置激活状态
                            if (that.selectedDates.length) {
                                if (that.selectedDates.length === 1) {
                                    if (value == that.selectedDates[0]) {
                                        $this.addClass('active');
                                        $this.parent().addClass('active');
                                    }
                                } else {
                                    if (that.selectedDates[0] <= value && value <= that.selectedDates[1]) {
                                        $this.addClass('active');
                                        $this.parent().addClass('active');
                                    }
                                }
                            }
                        });
                } else if (this.showMode == 'day') {
                    this.$calendarWrap.find('.')
                } else {

                }
            },

            destroy: function () {
                this.stopListening();
                this.$calendarWrap.remove();
                delete this.$el.data().calendar;
            }
        };

        var old = $.fn.calendar;

        $.fn.calendar = function (options) {
        	var args = Array.apply(null, arguments);
            this.each(function () {
                var $this = $(this), internal_return, data;
                data = $this.data('calendar');
                if ( !data ) $this.data('calendar', (data = new Calendar(this, options)) );
                if (typeof options === 'string' && typeof data[options] === 'function') {
                    internal_return = data[options].apply(data, args);
                    if (internal_return !== undefined)
                        return false;
                }
            });
            return this;
        };

        //防止插件冲突
        $.fn.calendar.noConflict = function () {
            $.fn.calendar = old;
            return this;
        };
});