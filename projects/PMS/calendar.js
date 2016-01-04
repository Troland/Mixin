/**
 * User: Tristan
 * Date: 14-7-18
 * Time: 上午11:10
 */
//Todo:点击轨道的时候进行移动
(function (factory) {
    if (typeof define === 'function' && define.amd) {
       // AMD. Register as an anonymous module.
       define(['jquery', 'underscore', 'mousewheel'], factory);
    } else if (typeof module === 'object' && module.exports) {
       // Node/CommonJS
       module.exports = factory( require('jquery'), require('underscore'), require('mousewheel') );
    } else {
       // Browser globals
       factory(jQuery, _);
    }
}(function ($, _) {
    'use strict';
    var helper;
    var defaults = {
        lang: 'zh-CN',
        spliter: '~', //当为范围的时候的分隔符
        count: 3, //日历个数
        hasData: true, //是否传入数据
        prevClass: '.cam-calendar-ctrl-prev',   //向上翻
        nextClass: '.cam-calendar-ctrl-next',   //向下翻
        visible: true, //是否显示
        showControls: false, //是否显示控制
        close: true,  //是否显示关闭
        showMode: 'month', //month:月,halfMonth:半月,week：周
        type: 'range', //默认range为选择范围,single为选择单个
        appendTo: null, //挂载到指定的目标元素
        weekStart: 1,  //一周默认从星期一开始
        zIndex: 3,
        onSelect: null, //点击选择的时候触发事件
        onClose: null //关闭触发事件
    };

    //打印消息
    function log() {

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

    //模板
    var templates = {
        control: '<div class="calendar-head">' +
                    '<a href="javascript:void(0);" class="btn-calendar-search js-lastMonth">最近一个月</a>' +
                    '<a href="javascript:void(0);" class="btn-calendar-search js-lastThreemonths">最近三个月</a>' +
                    '<a href="javascript:void(0);" class="btn-calendar-search js-lastHalfyear">最近半年</a>' +
                  '</div>'
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
            this.hasData = this.options.hasData;
            this.appendTo = this.options.appendTo;
            this.selectedDates = [];
            this.zIndex = this.options.zIndex;
            this.position = this.options.position;
            this.count = this.options.count;
            this.$calendarWrap = $('<div class="cam-calendar-wrapper" />');
            this.showControls = this.options.showControls;
            this.viewDate = UTCToday();
            this.weekStart = this.options.weekStart;
            this.weekEnd = ((this.weekStart + 6) % 7);
            this.buttons = this.options.buttons;
            //周的时候显示的是最近三周，六周，十二周
            this.controlHtml =
                '<div class="calendar-head">' +
                    '<a href="javascript:void(0);" class="btn-calendar-search js-last-1">' + (this.showMode == 'week' ? '最近三周' : '最近一个月') + '</a>' +
                    '<a href="javascript:void(0);" class="btn-calendar-search js-last-2">' + (this.showMode == 'week' ? '最近六周' : '最近三个月') + '</a>' +
                    '<a href="javascript:void(0);" class="btn-calendar-search js-last-3">' + (this.showMode == 'week' ? '最近12周' : '最近半年') + '</a>' +
                '</div>';
            this.setData(this.options.data);
            this.$calendarWrap.on('click', '.btn-calendar[data-id]', $.proxy(this.button, this));
            this.$calendarWrap.on('click', this.options.prevClass, $.proxy(this.move, this));
            this.$calendarWrap.on('click', this.options.nextClass, $.proxy(this.move, this));
            if (!this.visible) {
                //日历关闭
                $(document).on('click.calendar', function (e) {
                    if (!(self.$el.is(e.target) ||
                                self.$el.find(e.target).length ||
                                self.$calendarWrap.is(e.target) ||
                                self.$calendarWrap.find(e.target).length)) {

                        self.hide();
                    }
                });

                this.$el.on('mousedown', function () {
                    //判断日历是否已经插入
                    if (!self.isShown) {
                        self.show();
                        self.setPosition();
                        self.isShown = true;
                    }

                    if (!self.$calendarWrap.is(':visible')) {
                        self.$calendarWrap.show();
                    }
                    if ($(this).val()) {
                        if (!self.visible) {
                            //self.$calendarWrap.off('mouseleave').one('mouseleave', function () {
                            //    if (self.options.onClose) {
                            //        self.options.onClose.apply(self);
                            //    }
                            //    self.$calendarWrap.hide();
                            //});
                            //self.$calendarWrap.on('mouseleave', '.calendar-rows .calendar-row', function (e) {
                            //    if ($(this).hasClass('disable')) {
                            //        return;
                            //    }

                            //    $(this).removeClass('hover');
                            //    return false;
                            //});
                        }
                    }
                });
            }
            if (this.close) {
                this.$calendarWrap.on('click', '.cam-calendar-close', function () {
                    if (self.options.onClose) {
                        self.options.onClose.apply(self);
                    }
                    self.$calendarWrap.hide();
                });
            }
            this.$calendarWrap.on('click', '.js-last-1', function (e) {
                self.filter(1);
                return false;
            });
            this.$calendarWrap.on('click', '.js-last-2', function (e) {
                self.filter(2);
                return false;
            });
            this.$calendarWrap.on('click', '.js-last-3', function (e) {
                self.filter(3);
                return false;
            });
            this.bindEvents();
            return this;
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
                        break;
                }
            } else {
                this.$calendarWrap.on('click', 'ul li', $.proxy(this.select, this));
            }

            if (this.showMode == 'halfMonth') {
                this.$calendarWrap.on('click', '.calendar-menu-text', function (e) {
                    $(this).next('.dropdown').toggle();
                    if ($(this).next('.dropdown').find('.cam-scroll-slider').length && !$(this).next('.dropdown').find('.cam-scroll-slider').height()) {
                        var ratio = $(this).next('.dropdown').find('.dropdown-items').height() / ($(this).next('.dropdown').find('.dropdown-items ul li').eq(0).height() * ($(this).next('.dropdown').find('.dropdown-items ul li').size()));
                        $(this).next('.dropdown').find('.cam-scroll-slider').height(Math.floor(ratio * ($(this).next('.dropdown').find('.scroll-ctrl').height())) - 2);
                    }
                });
                this.$calendarWrap.on('mousedown', '.cam-scroll-slider', function (e) {
                    var $drag = $(this),
                        startY = e.pageY - $drag.position().left,
                        maxScrollHeight = $drag.closest('.scroll-ctrl').height() - $drag.height();

                    // Stop IE from allowing text selection
                    $('html').bind('dragstart.jsp selectstart.jsp', self.nil);

                    //var startX = e.pageX - $target.position().top;

                    //Todo:计算有些问题
                    $('html').bind(
                        'mousemove.jsp',
                        function (e) {
                            var offsetTop = e.pageY - startY,
                                ratio = offsetTop / maxScrollHeight,
                                years = $drag.closest('.scroll-ctrl').prev('.dropdown-items').find('li').size(),
                                itemHeight = $drag.closest('.scroll-ctrl').prev('.dropdown-items').find('li').eq(0).height(),
                                containerHeight = $drag.closest('.scroll-ctrl').prev('.dropdown-items').height();

                            //当竖直方向的位移超过最可滑动距离返回
                            if (offsetTop > maxScrollHeight) {
                                return;
                            }
                            //当竖直方向的位移小于0则为0
                            if (offsetTop < 0) {
                                offsetTop = 0;
                                $drag.closest('.scroll-ctrl').prev('.dropdown-items').scrollTop(0);
                            } else {
                                $drag.closest('.scroll-ctrl').prev('.dropdown-items').scrollTop(ratio * (itemHeight * years - containerHeight));
                                $drag.css('top', offsetTop);
                            }
                            return false;
                        }
                    ).bind('mouseup.jsp mouseleave.jsp', self.cancelDrag);
                    return false;
                });
                this.$calendarWrap.on('mousemove', '.cam-scroll-slider', function (e) {
                    var $this = $(this),
                        offsetTop = $this.position().top,
                        ratio = offsetTop / $this.closest('.scroll-ctrl').height(),
                        years = $this.closest('.scroll-ctrl').prev('.dropdown-items').find('li').size(),
                        itemHeight = $this.closest('.scroll-ctrl').prev('.dropdown-items').find('li').eq(0).height(),
                        containerHeight = $this.closest('.scroll-ctrl').prev('.dropdown-items').height();

                    $this.closest('.scroll-ctrl').prev('.dropdown-items').scrollTop(ratio * (itemHeight * years - containerHeight));
                });

                $(document).on('click.cdropdown', function (e) {
                    if (!$(e.target).parents('.calendar-dropdown-wrapper').length) {
                        self.$calendarWrap.find('.cam-calendar-type-halfmonth .dropdown').hide();
                    }
                });
                this.$calendarWrap.on('mouseenter mouseleave', '.scroll-ctrl', function (e) {
                    var $target = $(e.currentTarget);
                    if (e.type == 'mouseenter') {
                        $target.addClass('hover');
                    } else {
                        $target.removeClass('hover');
                    }
                });

                this.$calendarWrap.on('click', '.dropdown-items li', function (e) {
                    $(this).closest('.dropdown').hide();
                    if (_.indexOf(self.showRange, $(this).data('value')) > -1) {
                        return;
                    }
                    var pos = $(e.currentTarget).closest('.cam-calendar-s').index();
                    $(this).closest('.dropdown').hide().prev('.calendar-menu-text').find('.calendar-menu-text-s').text($(this).text());
                    self.updateDate(pos, $(this).data('value'), 2);
                    return false;
                });
            }
            if (this.showMode == 'week') {
                this.$calendarWrap.on('click', '.calendar-rows .calendar-row', $.proxy(this.select, this));
                this.$calendarWrap.on('mouseenter mouseleave', '.calendar-rows .calendar-row', function (e) {
                    if ($(this).hasClass('disable')) {
                        return;
                    }
                    $(this).toggleClass('hover', e.type == 'mouseenter' ? true : false);
                    return false;
                });
                this.$calendarWrap.on('click', '.calendar-menu-text', function (e) {
                    $(this).next('.dropdown').toggle();
                    if ($(this).next('.dropdown').find('.cam-scroll-slider').length && !$(this).next('.dropdown').find('.cam-scroll-slider').height()) {
                        var ratio = $(this).next('.dropdown').find('.dropdown-items').height() / ($(this).next('.dropdown').find('.dropdown-items ul li').eq(0).height() * ($(this).next('.dropdown').find('.dropdown-items ul li').size()));
                        $(this).next('.dropdown').find('.cam-scroll-slider').height(Math.floor(ratio * ($(this).next('.dropdown').find('.scroll-ctrl').height())) - 2);
                    }
                });
                this.$calendarWrap.on('mousedown', '.cam-scroll-slider', function (e) {
                    var $drag = $(this),
                        startY = e.pageY - $drag.position().top,
                        maxScrollHeight = $drag.closest('.scroll-ctrl').height() - $drag.height();

                    // Stop IE from allowing text selection
                    $('html').bind('dragstart.jsp selectstart.jsp', self.nil);

                    //var startX = e.pageX - $target.position().top;

                    //Todo:计算有些问题
                    $('html').bind(
                        'mousemove.jsp',
                        function (e) {
                            var offsetTop = e.pageY - startY,
                                ratio = offsetTop / maxScrollHeight,
                                years = $drag.closest('.scroll-ctrl').prev('.dropdown-items').find('li').size(),
                                itemHeight = $drag.closest('.scroll-ctrl').prev('.dropdown-items').find('li').eq(0).height(),
                                containerHeight = $drag.closest('.scroll-ctrl').prev('.dropdown-items').height();

                            //当竖直方向的位移超过最可滑动距离返回
                            if (offsetTop > maxScrollHeight) {
                                return;
                            }
                            //当竖直方向的位移小于0则为0
                            if (offsetTop < 0) {
                                offsetTop = 0;
                                $drag.closest('.scroll-ctrl').prev('.dropdown-items').scrollTop(0);
                            } else {
                                $drag.closest('.scroll-ctrl').prev('.dropdown-items').scrollTop(ratio * (itemHeight * years - containerHeight));
                                $drag.css('top', offsetTop);
                            }
                            return false;
                        }
                    ).bind('mouseup.jsp mouseleave.jsp', self.cancelDrag);
                    return false;
                });
                this.$calendarWrap.on('mousemove', '.cam-scroll-slider', function (e) {
                    var $this = $(this),
                        offsetTop = $this.position().top,
                        ratio = offsetTop / $this.closest('.scroll-ctrl').height(),
                        years = $this.closest('.scroll-ctrl').prev('.dropdown-items').find('li').size(),
                        itemHeight = $this.closest('.scroll-ctrl').prev('.dropdown-items').find('li').eq(0).height(),
                        containerHeight = $this.closest('.scroll-ctrl').prev('.dropdown-items').height();

                    $this.closest('.scroll-ctrl').prev('.dropdown-items').scrollTop(ratio * (itemHeight * years - containerHeight));
                });
                $(document).on('click.cdropdown', function (e) {
                    if (!$(e.target).parents('.calendar-dropdown-wrapper').length) {
                        self.$calendarWrap.find('.cam-calendar-type-week .dropdown').hide();
                    }
                });
                this.$calendarWrap.on('mouseenter mouseleave', '.scroll-ctrl', function (e) {
                    var $target = $(e.currentTarget);
                    if (e.type == 'mouseenter') {
                        $target.addClass('hover');
                    } else {
                        $target.removeClass('hover');
                    }
                });
                this.$calendarWrap.on('click', '.dropdown-items li', function (e) {
                    var $this = $(this),
                        type = $this.data('type'),
                        $ctitle = $this.closest('.cam-calendar-s-title'), value = $this.data('value'), pos = $this.closest('.cam-calendar-s').index();

                    if (type == 'year') {
                        $ctitle.data('year', value);
                    } else {
                        $ctitle.data('month', value);
                    }

                    $(this).closest('.dropdown').hide().prev('.calendar-menu-text').find('.calendar-menu-text-s').text(value);
                    self.updateDate(pos, $ctitle.data('year') + '' + $ctitle.data('month'), 1);
                });
            }

            //年滚动
            if (this.showMode == 'halfMonth' || this.showMode == 'week') {
                this.initMouseWheel();
                this.$calendarWrap.on('click', '.cam-scroll-axis', function (e) {

                });
            }
        },

        stopListening: function () {
            var self = this;
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

                this.$calendarWrap.off('click', '.dropdown-items li');
            }
            if (this.showMode == 'week') {
                this.$calendarWrap.off('click', '.calendar-rows .calendar-row');
                this.$calendarWrap.off('mouseenter', '.calendar-rows .calendar-row');
                this.$calendarWrap.off('mouseleave', '.calendar-rows .calendar-row');
                this.$calendarWrap.off('click', '.calendar-menu-text');
                this.$calendarWrap.off('mousedown', '.cam-scroll-slider');
                this.$calendarWrap.off('mousemove', '.cam-scroll-slider');
                $(document).off('click.cdropdown');
                this.$calendarWrap.off('mouseenter mouseleave', '.scroll-ctrl');
                this.$calendarWrap.off('click', '.dropdown-items li');
            }

            //年滚动
            if (this.showMode == 'halfMonth' || this.showMode == 'week') {
                this.$calendarWrap.off('mousewheel.cam', '.calendar-menu-year .dropdown-items');
            }
        },

        button: function (e) {
            var $target = $(e.target),
                fn = this._callbacks[$target.data('id')];

            return fn.call(this) !== false ? this.$calendarWrap.hide() : this;
        },

        initMouseWheel: function () {

            this.$calendarWrap.on('mousewheel.cam', '.calendar-menu-year .dropdown-items', function (event, delta, deltaX, deltaY) {
                var factor = event.deltaFactor,
                    $this = $(this),
                    itemHeight = $this.find('li').eq(0).height(),
                    years = $this.find('li').size(),
                    containerHeight = $this.height(),
                    $drag = $this.next('.scroll-ctrl').find('.cam-scroll-slider'),
                    maxScrollHeight = $drag.closest('.scroll-ctrl').height() - $drag.height(), offsetTop, ratio;

                $this.scrollTop($this.scrollTop() - deltaY * factor);
                ratio = $this.scrollTop() / (itemHeight * years - containerHeight);
                $drag.css('top', ratio * maxScrollHeight);
                return false;
            });
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
        processMonths: function (date, count) {
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
        updateDate: function (pos, date, type) {
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
                        yearHtml = '<div class="calendar-dropdown-wrapper calendar-menu-year">' +
                                        '<div class="calendar-menu-text">' +
                                            '<div class="calendar-menu-text-s">' + year + '</div>' +
                                            '<div class="calendar-icon"><div class="calendar-icon-border"><i class="calendar-icon-arr"></i></div></div>' +
                                        '</div>' + '年'
                                        +
                                        '<div class="dropdown">' +
                                            '<div class="dropdown-items">' +
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
                            .find('.cam-calendar-s-title').find('.calendar-dropdown-wrapper').replaceWith(yearHtml);

                        this.$calendarWrap.find('.cam-calendar-s').eq(i).find('ul.month-list').html(monthItems);
                    }
                    this.calculate();
                    break;
            }
            this.renderActive();
        },
        //设置初始日期
        setValue: function (v) {
            this.selectedDates = v;
            this.renderActive();
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
                if ((scrollTop + winHeight - (offset.top + height)) >= calendarHeight) {
                    offset.top = this.$el.offset().top + this.$el.outerHeight() + 10;
                } else {
                    offset.top = offset.top - scrollTop - calendarHeight - 10;
                }
            }
            this.$calendarWrap.css({
                left: offset.left,
                top: offset.top
            });
        },

        show: function () {
            this.$calendarWrap.appendTo(this.appendTo ? $(this.appendTo) : $('body'));
            //判断输入框有没有值
            if (this.$el.val()) {
                var defaultValue = this.$el.val().split('~');
                this.selectedDates = defaultValue;
                this.renderActive();
            }
        },

        //传入数据
        setData: function (data) {
            this.data = data ? (data.length ? data.slice(0, 2) : ['', '']) : ['', ''];
            this.excludeData = data ? (data.length ? data.slice(2) : []) : [];
            this.showRange = this.getRange();
            this.render();
            if (this.visible) {
                this.$calendarWrap.appendTo(this.appendTo ? $(this.appendTo) : $('body'));
            }
            this.calculate();
        },

        reset: function (options) {
            this.$el.val('');
            this.stopListening();
            this.data = options.data ? options.data.slice(0, 2) : ['', ''];
            this.excludeData = options.data ? options.data.slice(2) : [];
            this.selectedDates = [];
            this.showRange = this.getRange();
            this.render();
            this.calculate();
            this.bindEvents();
            //this.makeActive();
        },

        getMonthByWeek: function (year, week) {
            //var year = this.
        },

        // 计算应该显示的日历
        getRange: function () {
            var maxDate;
            //当是周的时候显示的是月份的周
            if (this.showMode == 'week') {
                if (!this.data[1]) {
                    maxDate = (new Date()).getFullYear() + '' + ((new Date()).getMonth() + 1 < 10 ? '0' + ((new Date()).getMonth() + 1) : '' + ((new Date()).getMonth() + 1));
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

        //过滤1:最近一月,2:最后三月,3:最近半年
        filter: function (type) {
            var now = new Date(),
                nowYear = now.getFullYear(),
                nowMonth = now.getMonth() + 1;

            this.showRange = this.getRange();
            this.selectedDates = [];
            switch (type) {
                case 1:
                    if (this.showMode == 'month') {
                        this.selectedDates[0] = nowYear + '' + (nowMonth < 10 ? '0' + nowMonth : '' + nowMonth);
                        if (!(this.selectedDates[0] >= this.data[0] && this.selectedDates[0] <= this.data[1])) {
                            this.selectedDates = [];
                        }
                    } else if (this.showMode == 'halfMonth') {
                        this.selectedDates[0] = nowYear + '' + (nowMonth < 10 ? '0' + nowMonth : '' + nowMonth) + '0';
                        this.selectedDates[1] = nowYear + '' + (nowMonth < 10 ? '0' + nowMonth : '' + nowMonth) + '1';
                        //和获得的数据做比对
                        if (this.selectedDates[0] > this.data[1]) {
                            this.selectedDates = [];
                        } else if (this.selectedDates[0] < this.data[0]) {
                            this.selectedDates[0] = this.data[0];
                        } else if (this.selectedDates[1] > this.data[1]) {
                            this.selectedDates[1] = this.data[1];
                        }
                    } else {

                    }

                    break;

                case 2:
                    if (this.showMode == 'month') {
                        this.selectedDates[1] = nowYear + '' + (nowMonth < 10 ? '0' + nowMonth : '' + nowMonth);
                        if (nowMonth - 3 < 0) {
                            nowMonth = nowMonth + 10;
                            nowYear = nowYear - 1;
                        }
                        this.selectedDates[0] = nowYear + '' + (nowMonth - 2 < 10 ? '0' + (nowMonth - 2) : '' + (nowMonth - 2));
                    } else if (this.showMode == 'halfMonth') {
                        this.selectedDates[1] = nowYear + '' + (nowMonth < 10 ? '0' + nowMonth : '' + nowMonth) + '1';
                        if (nowMonth - 3 < 0) {
                            nowMonth = nowMonth + 10;
                            nowYear = nowYear - 1;
                        }
                        this.selectedDates[0] = nowYear + '' + (nowMonth - 2 < 10 ? '0' + (nowMonth - 2) : '' + (nowMonth - 2)) + '0';
                    } else {

                    }

                    //和获得的数据做比对
                    if (this.selectedDates[0] > this.data[1]) {
                        this.selectedDates = [];
                    } else if (this.selectedDates[0] < this.data[0]) {
                        this.selectedDates[0] = this.data[0];
                    } else if (this.selectedDates[1] > this.data[1]) {
                        this.selectedDates[1] = this.data[1];
                    }
                    break;

                case 3:
                    if (this.showMode == 'month') {
                        this.selectedDates[1] = nowYear + '' + (nowMonth < 10 ? '0' + nowMonth : '' + nowMonth);
                        if (nowMonth - 6 < 0) {
                            nowMonth = nowMonth + 7;
                            nowYear = nowYear - 1;
                        }
                        this.selectedDates[0] = nowYear + '' + (nowMonth - 5 < 10 ? '0' + (nowMonth - 5) : '' + (nowMonth - 5));
                    } else if (this.showMode == 'halfMonth') {
                        this.selectedDates[1] = nowYear + '' + (nowMonth < 10 ? '0' + nowMonth : '' + nowMonth) + '1';
                        if (nowMonth - 6 < 0) {
                            nowMonth = nowMonth + 7;
                            nowYear = nowYear - 1;
                        }
                        this.selectedDates[0] = nowYear + '' + (nowMonth - 5 < 10 ? '0' + (nowMonth - 5) : '' + (nowMonth - 5)) + '0';
                    } else {

                    }

                    //和获得的数据做比对
                    if (this.selectedDates[0] > this.data[1]) {
                        this.selectedDates = [];
                    } else if (this.selectedDates[0] < this.data[0]) {
                        this.selectedDates[0] = this.data[0];
                    } else if (this.selectedDates[1] > this.data[1]) {
                        this.selectedDates[1] = this.data[1];
                    }

                    break;
            }
            this.render();
            this.calculate();
            this.makeActive();
            this.makeValue();
        },

        // 渲染
        render: function (data) {
            var calendar_wrap = '<div class="cam-calendar">' +
                                  this.controlHtml +
                                 '<div class="cam-calendar-list clearfix">',
                                itemsHtml = '', self = this;

            switch (this.showMode) {
                case 'month':
                    for (var i = 0; i < this.showRange.length; i++) {
                        var year = this.showRange[i], monthItems = '', singleHtml = '', calendarTitle;
                        for (var j = 1; j <= 12; j++) {
                            var value = year + (j < 10 ? '0' + j : j + '');
                            monthItems += '<li class="cam-calendar-month" value="' + value + '">' +
                                j + '月' +
                                '</li>';
                        }
                        itemsHtml += '<div class="cam-calendar-s cam-calendar-type-month cam-calendar-' + (i + 1) + '" id="cam-calendar-' + (i + 1) + '">' +
                                        '<div class="cam-calendar-s-title">' +
                                                '<span>' + this.showRange[i] + '年' + '</span>' +
                                        '</div>' +
                                        '<ul>' + monthItems + '</ul>' +
                                     '</div>';
                    }
                    break;

                case 'halfMonth':
                    for (var i = 0; i < this.showRange.length; i++) {
                        var year = this.showRange[i], monthItems = '', yearHtml;

                        yearHtml = '<div class="calendar-dropdown-wrapper calendar-menu-year clearfix">' +
                                            '<div class="calendar-menu-text">' +
                                                '<div class="calendar-menu-text-s">' + year + '</div>' +
                                                '<div class="calendar-icon"><div class="calendar-icon-border"><i class="calendar-icon-arr"></i></div></div>' +
                                            '</div>' +
                                            '年' +
                                            '<div class="dropdown">' +
                                                '<div class="dropdown-items">' +
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
                    break;

                case 'week':
                    for (var i = 0; i < this.showRange.length; i++) {
                        var theDate = '' + this.showRange[i], yearHtml = '',
                            monthHtml = '', days = '';

                        yearHtml += '<div class="calendar-dropdown-wrapper calendar-menu-year clearfix">' +
                                            '<div class="calendar-menu-text">' +
                                                '<div class="calendar-menu-text-s">' + theDate.substring(0, 4) + '</div>' +
                                                '<div class="calendar-icon"><div class="calendar-icon-border"><i class="calendar-icon-arr"></i></div></div>' +
                                            '</div>' +
                                            '年' +
                                            '<div class="dropdown">' +
                                                '<div class="dropdown-items">' +
                                                    this.fillYears(theDate.substring(0, 4)) +
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

                        monthHtml += '<div class="calendar-dropdown-wrapper calendar-menu-month clearfix">' +
                                            '<div class="calendar-menu-text">' +
                                                '<div class="calendar-menu-text-s">' + theDate.substring(4) + '</div>' +
                                                '<div class="calendar-icon"><div class="calendar-icon-border"><i class="calendar-icon-arr"></i></div></div>' +
                                            '</div>' +
                                            '月' +
                                            '<div class="dropdown">' +
                                                '<div class="dropdown-items">' +
                                                    this.fillMonths() +
                                                '</div>' +
                                            '</div>' +
                                      '</div>';

                        days += this.fill(theDate);
                        itemsHtml += '<div class="cam-calendar-s cam-calendar-type-week cam-calendar-' + (i + 1) + '" id="cam-calendar-' + (i + 1) + '">' +
                                        '<div class="clearfix cam-calendar-s-title" data-year="' + theDate.substring(0, 4) + '" data-month="' + theDate.substring(4) + '">' + monthHtml + yearHtml + '</div>' +
                                        '<div class="week-tb">' +
                                            '<div class="week-tb-head calendar-row clearfix">' +
                                                '<span class="calendar-grid"></span><span class="calendar-grid">一</span><span class="calendar-grid">二</span><span class="calendar-grid">三</span><span class="calendar-grid">四</span><span class="calendar-grid">五</span><span class="calendar-grid">六</span><span class="calendar-grid">日</span>' +
                                             '</div>' +
                                             '<div class="calendar-rows">' + days + '</div>' +
                                        '</div>' +
                                     '</div>';
                    }
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
            if (this.count == 1) {
                this.$calendarWrap.find('.cam-calendar-list').addClass('calendar-single-type');
            }
            this.$calendarWrap.find('.cam-calendar-s')
                .first().find('.cam-calendar-s-title').prepend('<i class="icon-prev-ctrl cam-calendar-ctrl-prev"></i>');
            this.$calendarWrap.find('.cam-calendar-s')
                .last().find('.cam-calendar-s-title').prepend('<i class="icon-next-ctrl cam-calendar-ctrl-next"></i>');
            if (!this.hasData) {
                this.$calendarWrap.addClass('cam-calendar-normal');
            }
            if (!this.showControls) {
                this.$calendarWrap.find('.calendar-head').hide();
            }
            //var cWidth = 0;
            //this.$calendarWrap.find('.cam-calendar-list').find('.cam-calendar-s').each(function () {
            //    cWidth += $(this).outerWidth(true);
            //});
            //this.$calendarWrap.find('.cam-calendar-list').width(cWidth);
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
        calucateWeekByMonth: function (month) {

        },

        //填充周
        fill: function (date) {
            var year = +(date.substring(0, 4)),
                month = +(date.substring(4)) - 1, rangeDays, temp = new Date();

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
                        calWeek = ((th - yth) / 864e5 / 7 + 1) < 10 ? '0' + ((th - yth) / 864e5 / 7 + 1) : ((th - yth) / 864e5 / 7 + 1);

                    html.push('<div class="calendar-row clearfix" value="' + year + calWeek + '">');
                    html.push('<span class="cw calendar-grid">' + calWeek + '</span>');
                }
                //clsName = this.getClassNames(prevMonth);
                clsName = [];
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

        getClassNames: function () {

        },

        afterRender: function () {
            var that = this;
        },

        select: function (e) {
            var $target = $(e.currentTarget),
                sel_date = $target.attr('value').toString(),
                self = this,
                cachedDates = [],
                year, month;

            if ($target.hasClass('disable')) {
                return;
            }
            this.$el.val();

            $target.toggleClass('active');

            if ($target.hasClass('active')) {
                if (this.options.type == 'single') {
                    this.selectedDates = [];
                    this.selectedDates[0] = sel_date;
                } else {
                    if (this.selectedDates.length == 2) {
                        this.selectedDates = [];
                        this.selectedDates.push(sel_date);
                    } else {
                        this.selectedDates.push(sel_date);
                        this.selectedDates.sort();
                    }
                }
            } else {
                if (this.selectedDates.length > 1) {
                    this.selectedDates = [];
                    if (this.options.type != 'single') {
                        this.selectedDates[0] = sel_date;
                    }
                } else {
                    this.selectedDates = [];
                }
            }

            this.makeValue();
            if (this.showMode == 'halfMonth') {
                $target.parent().toggleClass('active', !!$target.parent().find('.d-half.active').length);
            }
            if (this.options.onSelect) {
                this.options.onSelect.apply(this);
            }

            if (!this.visible) {
                this.$calendarWrap.off('mouseleave').one('mouseleave', function () {
                    //if (self.options.onClose) {
                    //    self.options.onClose.apply(this);
                    //}

                    //self.$calendarWrap.hide();
                });
                this.$calendarWrap.on('mouseleave', '.calendar-rows .calendar-row', function (e) {
                    if ($(this).hasClass('disable')) {
                        return;
                    }

                    $(this).removeClass('hover');
                    return false;
                });
            }
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
                        this.$calendarWrap.find('.cam-calendar-list ul li').each(function (i, el) {
                            var $this = $(this), value = $this.attr('value'), compareDates;
                            compareDates = self.data;
                            if ((value >= compareDates[0] && value <= compareDates[1]) && !~_.indexOf(self.excludeData, value)) {
                                $this.addClass('clickable');
                            }
                        });
                        break;

                    case 'halfMonth':
                        this.$calendarWrap.find('.cam-calendar-list .d-half').each(function (i, el) {
                            var $this = $(this),
                                value = $this.attr('value') + '',
                                compareDates;

                            compareDates = self.data;
                            if (!((value >= compareDates[0] && value <= compareDates[1]) && !~_.indexOf(self.excludeData, value))) {
                                $this.addClass('disable');
                            }
                        });

                        this.$calendarWrap.find('.cam-calendar-halfmonth').each(function (i, el) {
                            var $this = $(this);

                            if ($this.find('.d-half.disable').length == 2) {
                                $this.addClass('disable');
                            }
                        });
                        break;

                    case 'week':
                        this.$calendarWrap.find('.cam-calendar-list .calendar-row').each(function (i, el) {
                            var $this = $(this), value = $this.attr('value') + '', compareDates;
                            compareDates = self.data;
                            if (value.length < 6) {
                                value = value.slice(0, 4) + '0' + value.slice(4);
                            }

                            if (!((value >= compareDates[0] && value <= compareDates[1]) && !~_.indexOf(self.excludeData, value))) {
                                $this.addClass('disable');
                            }
                        });
                        break;
                }
            }
        },
        //设置已选日期状态
        renderActive: function () {
            var self = this;
            switch (this.showMode) {
                case 'month':
                    this.$calendarWrap.find('.cam-calendar-list ul li').each(function (i, el) {
                        var $this = $(this), value = $this.attr('value'), compareDates;
                        compareDates = self.selectedDates.length ? self.selectedDates : [];
                        if (compareDates.length) {
                            if (compareDates.length == 2) {
                                if ((value >= compareDates[0] && value <= compareDates[1])) {
                                    $this.toggleClass('active', true);
                                }
                            } else {
                                if (value == compareDates[0]) {
                                    $this.toggleClass('active', true);
                                }
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
                                    $(this).parent().addClass('active');
                                }
                            } else {
                                $(this).removeClass('active');
                                $(this).parent().removeClass('active');
                            }
                        }
                    });
                    break;

                case 'week':
                    this.$calendarWrap.find('.cam-calendar-list .cam-calendar-s .week-tb .calendar-row').each(function (i, el) {
                        var $this = $(this), value = $this.attr('value'), compareDates;
                        compareDates = self.selectedDates.length ? self.selectedDates : [];
                        if (compareDates.length) {
                            if (compareDates.length == 2) {
                                if ((value >= compareDates[0] && value <= compareDates[1])) {
                                    $this.toggleClass('active', true);
                                }
                            } else {
                                if (value == compareDates[0]) {
                                    $this.toggleClass('active', true);
                                }
                            }
                        }
                    });
                    //for (var i = 0; i < this.showRange.length; i++) {
                    //    var theDate = '' + this.showRange[i], days = '';

                    //    days += this.fill(theDate);

                    //    this.$calendarWrap.find('.cam-calendar-s').eq(i).find('.calendar-rows').html(days);
                    //    this.$calendarWrap.find('.cam-calendar-s').eq(i)
                    //        .find('.cam-calendar-s-title .calendar-menu-year .calendar-menu-text-s').text(theDate.slice(0, 4));
                    //    this.$calendarWrap.find('.cam-calendar-s').eq(i)
                    //        .find('.cam-calendar-s-title .calendar-menu-month .calendar-menu-text-s').text(theDate.slice(4));
                    //    this.$calendarWrap.find('.cam-calendar-s').eq(i)
                    //        .find('.cam-calendar-s-title').data('year', theDate.slice(0, 4)).data('month', theDate.slice(4));
                    //}
                    break;
            }
        },

        move: function (e) {
            var $target = $(e.target),
                self = this,
                direction = $target.hasClass('cam-calendar-ctrl-next') ? 'next' : 'prev';

            if ($target.hasClass('disable')) {
                return;
            }
            switch (direction) {
                case 'prev':
                    if (this.showMode == 'week') {
                        if (this.count == 1) {
                            this.showRange[0] = this.processMonths(this.showRange[0], -1);
                        } else {
                            for (var i = 0; i < 3; i++) {
                                this.showRange[i] = this.processMonths(this.showRange[i], -1);
                            }
                        }
                    } else {
                        if (this.count == 1) {
                            this.showRange[0] = (Number(this.showRange[0] - 1)).toString();
                        } else {
                            for (var i = 0; i < 3; i++) {
                                this.showRange[i] = (Number(this.showRange[i] - 1)).toString();
                            }
                        }
                    }

                    break;

                case 'next':

                    if (this.showMode == 'week') {
                        if (this.count == 1) {
                            this.showRange[0] = this.processMonths(this.showRange[0], 1);
                        } else {
                            for (var i = 0; i < 3; i++) {
                                this.showRange[i] = this.processMonths(this.showRange[i], 1);
                            }
                        }
                    } else {
                        if (this.count == 1) {
                            this.showRange[0] = (Number(this.showRange[0]) + 1).toString();
                        } else {
                            for (var i = 0; i < 3; i++) {
                                this.showRange[i] = (Number(this.showRange[i]) + 1).toString();
                            }
                        }
                    }
                    break;
            }
            switch (this.showMode) {
                case 'month':
                    for (var i = 0; i < this.showRange.length; i++) {
                        var year = this.showRange[i], monthItems = '', singleHtml = '', calendarTitle;

                        for (var j = 1; j <= 12; j++) {
                            var value = year + (j < 10 ? '0' + j : j + '');
                            monthItems += '<li value="' + value + '">' +
                                j + '月' +
                                '</li>';
                        }

                        this.$calendarWrap.find('.cam-calendar-s').eq(i)
                            .find('.cam-calendar-s-title span').text(year)
                            .end()
                            .find('ul').html(monthItems);
                    }
                    break;

                case 'halfMonth':
                    for (var i = 0; i < this.showRange.length; i++) {
                        var year = this.showRange[i], monthItems = '', yearHtml;
                        yearHtml = '<div class="calendar-dropdown-wrapper calendar-menu-year clearfix">' +
                                        '<div class="calendar-menu-text">' +
                                            '<div class="calendar-menu-text-s">' + year + '</div>' +
                                            '<div class="calendar-icon"><div class="calendar-icon-border"><i class="calendar-icon-arr"></i></div></div>' +
                                        '</div>' +
                                        '年' +
                                        '<div class="dropdown">' +
                                            '<div class="dropdown-items">' +
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
                            .find('.cam-calendar-s-title').find('.calendar-dropdown-wrapper').replaceWith(yearHtml);

                        this.$calendarWrap.find('.cam-calendar-s').eq(i).find('ul.month-list').html(monthItems);
                    }
                    break;

                case 'week':
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
                    break;
            }
            this.calculate();
            this.renderActive();

            return this;
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
            } else {

            }

        },

        destroy: function () {
            this.hide();
            this.stopListening();
            if (!this.visible) {
                //日历关闭
                $(document).off('click.calendar');

                this.$el.off('mousedown');
            }
            if (this.close) {
                this.$calendarWrap.off('click', '.cam-calendar-close');
            }
            this.$calendarWrap.off('click', '.js-last-1');
            this.$calendarWrap.on('click', '.js-last-2');
            this.$calendarWrap.on('click', '.js-last-3');
            this.$calendarWrap.remove();
            delete this.$el.data().calendar;
        }
    };

    var old = $.fn.calendar;

    $.fn.calendar = function (options) {
        this.each(function () {
            var $this = $(this);
            if (!$this.data('calendar')) $this.data('calendar', new Calendar(this, options))
        });
    };

    //防止插件冲突
    $.fn.calendar.noConflict = function () {
        $.fn.calendar = old;
        return this;
    };

    return Calendar;
}));
