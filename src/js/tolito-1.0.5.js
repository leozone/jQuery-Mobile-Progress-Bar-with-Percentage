(function ($, undefined) {
    $.widget("mobile.progressbar", {
        options: {
            outerTheme: null,
            innerTheme: null,
            mini: false,
            value: 0,
            max: 100,
            counter: true,
            indefinite: false
        },
        min: 0,
        _create: function () {
            var control = this.element,
                parentTheme = $.mobile.getInheritedTheme(control, "c"),
                outerTheme = this.options.outerTheme || parentTheme,
                innerTheme = this.options.indefinite ? "indefinite" : this.options.innerTheme || parentTheme,
                miniClass = this.options.mini ? " ui-tolito-progressbar-mini" : "",
                counter = this.options.counter;
            this.element.addClass(['ui-tolito-progressbar ', " ui-tolito-progressbar-outer-", outerTheme,
                ' ui-tolito-progressbar-corner-all', miniClass
            ].join(""))
                .attr({
                    role: "progressbar",
                    "min-value": this.min,
                    "max-value": this.options.max,
                    "content-value": this._value()
                });
            if (counter && !this.options.indefinite) {
                this.labelContent = ($("<div></div>")
                    .text(this._value())
                    .addClass('ui-tolito-progressbar-label ui-tolito-progressbar-corner-all'))
                    .appendTo(this.element);
            }
            this.valueContent = ($("<div></div>")
                .addClass(['ui-tolito-progressbar-bg ', " ui-tolito-progressbar-active-", innerTheme,
                ' ui-tolito-progressbar-corner-all'
            ].join("")))
                .appendTo(this.element);
            if (!this.options.indefinite) {
                this._refreshValue();
                this.oldValue = this._value();
            }
        },
        _destroy: function () {
            this.element.removeClass()
                .removeAttr("role")
                .removeAttr("min-value")
                .removeAttr("max-value")
                .removeAttr("content-value");
            if ((typeof this.labelContent !== "undefined")) {
                this.labelContent.remove();
            }
            this.valueContent.remove();
        },
        value: function (newValue) {
            if (newValue === undefined) {
                return this._value();
            }
            this._setOption("value", newValue);
            return this;
        },
        _setOption: function (key, value) {
            this.options.value = value;
            if (key === "value") {
                this._refreshValue();
                if (this._value() === this.options.max) {
                    this.element.trigger("complete");
                }
            }
        },
        _value: function () {
            var val = this.options.value;
            if (typeof val !== "number") {
                val = 0;
            }
            return Math.min(this.options.max, Math.max(this.min, val));
        },
        _percentage: function () {
            return 100 * this._value() / this.options.max;
        },
        _refreshValue: function () {
            var value = this.value();
            this.oldValue = value;
            this.valueContent.css("width", [this._percentage(), '%'].join(""));
            if ((typeof this.labelContent !== "undefined")) {
                this.labelContent.text([this._percentage(), '%'].join(""))
            }
            this.element.attr("content-value", value);
        }
    });

    TolitoConstructor = function (elementId) {
        if (elementId === undefined) {
            throw '[Error]: Tolito element id is undefined';
        }
        this._id = elementId;
        this._defaultOuterTheme = null;
        this._defaultInnerTheme = null;
        this._defaultMax = 100;
        this._defaultStartFrom = 0;
        this._defaultInterval = 100;
        this._isBuilt = false;
        this._mini = false;
        this._isRunning = false;
        this._indefinite = false;
        return this;
    }

    TolitoProgressBar = function (arg) {
        return new TolitoConstructor(arg);
    }

    TolitoConstructor.prototype = {
        logOptions: function () {
            ((typeof console === "undefined") ? {
                log: function () {}
            } : console)
                .log(["id: '", this.getId(), "' outerTheme: '", this.getOuterTheme(), "' innerTheme: '", this.getInnerTheme(),
                "' max: '", this.getMax(), "' mini: '", this.getMini(), "' startFrom: '", this.getStartFrom(),
                "' interval: '", this.getInterval(), "' showCounter: '", this.getShowCounter(), "'", "' indefinite: '",
                this.getIndefinite(), "'"
        ].join(""));
            return this;
        },
        getId: function () {
            return this._id;
        },
        setOuterTheme: function (newTheme) {
            if (this._isBuilt) {
                throw '[Error]: Tolito is already built.';
            } else {
                this._outerTheme = newTheme;
                return this;
            }
        },
        getOuterTheme: function () {
            return this._outerTheme || this._defaultOuterTheme;
        },
        setInnerTheme: function (newInnerTheme) {
            if (this._isBuilt) {
                throw '[Error]: Tolito is already built.';
            } else {
                this._innerTheme = newInnerTheme;
                return this;
            }
        },
        getInnerTheme: function () {
            return this._innerTheme || this._defaultInnerTheme;
        },
        setStartFrom: function (newStartFrom) {
            if (this._isBuilt) {
                throw '[Error]: Tolito is already built.';
            } else {
                this._startFrom = newStartFrom;
                return this;
            }
        },
        getStartFrom: function () {
            return this._startFrom || this._defaultStartFrom;
        },
        setMax: function (newMax) {
            if (this._isBuilt) {
                throw '[Error]: Tolito is already built.';
            } else {
                this._max = newMax;
                return this;
            }
        },
        getMax: function () {
            return this._max || this._defaultMax;
        },
        isMini: function (newMini) {
            if (this._isBuilt) {
                throw '[Error]: Tolito is already built.';
            } else {
                this._mini = newMini;
                return this;
            }
        },
        getMini: function () {
            return this._mini;
        },
        isIndefinite: function (newIndefinite) {
            if (this._isBuilt) {
                throw '[Error]: Tolito is already built.';
            } else {
                this._indefinite = newIndefinite;
                return this;
            }
        },
        getIndefinite: function () {
            return this._indefinite;
        },
        showCounter: function (newShowCounter) {
            if (this._isBuilt) {
                throw '[Error]: Tolito is already built.';
            } else {
                this._showCounter = newShowCounter;
                return this;
            }
        },
        getShowCounter: function () {
            return this._showCounter;
        },
        setInterval: function (newInterval) {
            if (this._isBuilt) {
                throw '[Error]: Tolito is already built.';
            } else {
                this._interval = newInterval;
                return this;
            }
        },
        getInterval: function () {
            return this._interval || this._defaultInterval;
        },
        build: function () {
            if (this._isBuilt) {
                throw '[Error]: Tolito is already built.';
            } else {
                $(['#', this.getId()].join(""))
                    .progressbar({
                        outerTheme: this.getOuterTheme(),
                        innerTheme: this.getInnerTheme(),
                        value: this.getStartFrom(),
                        max: this.getMax(),
                        mini: this.getMini(),
                        indefinite: this.getIndefinite(),
                        counter: this.getShowCounter()
                    });
                this._isBuilt = true;
                return this;
            }
        },
        run: function () {
            if (this._isRunning) {
                throw '[Error]: Tolito is already running.';
            } else if (this._indefinite) {
                throw '[Error]: Tolito is indefinite.';
            } else {
                (function loop(instance) {
                    instance.fillProgressBar = setTimeout((function (inst) {
                        return function () {
                            var thisValue = $(['#', inst.getId()].join(""))
                                .progressbar('option', 'value'),
                                counter = !isNaN(thisValue) ? (thisValue + 1) : 1;
                            if (counter > inst.getMax()) {
                                clearTimeout(inst.fillProgressBar);
                            } else {
                                $(['#', inst.getId()].join(""))
                                    .progressbar({
                                        value: counter
                                    });
                                loop(inst);
                            }
                        }
                    })(instance), instance.getInterval());
                })(this);
                this._isRunning = true;
                return this;
            }
        },
        stop: function () {
            if (!this._isRunning) {
                throw '[Error]: Tolito is already stopped.';
            } else {
                clearTimeout(this.fillProgressBar);
                this._isRunning = false;
                return this;
            }
        },
        setValue: function (val) {
            if (this._indefinite) {
                throw '[Error]: Tolito is indefinite.';
            } else {
                $(['#', this.getId()].join(""))
                    .progressbar({
                        value: val
                    });
                return this;
            }
        },
        destroy: function () {
            if (!this._isBuilt) {
                throw '[Error]: Tolito is not built yet.';
            } else {
                if (this.fillProgressBar) {
                    clearTimeout(this.fillProgressBar);
                }
                $(document)
                    .off('complete', ['#', this.getId()].join(""));
                $(['#', this.getId()].join(""))
                    .progressbar('destroy');
                return null;
            }
        }
    };
})(jQuery);
