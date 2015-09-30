/*jslint browser: true*/
/*global $*/
$(function () {
    'use strict';

    var stringSplice = function(orig, index, toRemove, str) {
        return (orig.slice(0, index) + str + orig.slice(index + Math.abs(toRemove)));
    };

    (function() {
        var placeholder = $('.hero h1 span');
        var typedCursor;
        var names = ['smart', 'modern', 'lean'];
        var currentName = 0;
        var name = names[currentName];
        function regenerateTypedDelays(names) {
            var name;
            var typedNames = [];
            var pos;
            var delay;
            var origName;
            for (var index in names) {
                origName = names[index];
                pos = Math.floor(origName.length);
                delay = 40 + Math.round(Math.random()*70);
                origName = stringSplice(origName, pos, 0, '^' + delay)
                typedNames.push(origName);
            }
            return typedNames;
        }
        function animateTeam() {
            placeholder.typed({
                strings: regenerateTypedDelays(names),
                typeSpeed: 20,
                backDelay: 3000,
                loop: true,
                preStringTyped: function() {
                    typedCursor = typedCursor || $('.hero h1 .typed-cursor');
                    name = names[currentName];
                    placeholder.attr('class', name);
                    typedCursor.attr('class', 'typed-cursor ' + name);
                    currentName = (currentName + 1) % names.length;
                }
            });
        }
        animateTeam();
    })();

    var controller = new ScrollMagic.Controller();

    (function() {
        var scene = new ScrollMagic.Scene({
            offset: 26
        });
        scene.setPin('.navbar', {
            pushNeighbours: false
        });
        scene.addTo(controller);
    })();


    var hero = $('.hero');
    var navBar = $('.navbar-default');
    var target = $('.tickets .target');
    var targetLimit = target.offset().top + target.outerHeight() - window.innerHeight;
    var heroLimit = hero.offset().top + hero.outerHeight() - navBar.outerHeight();
    var ticketProgress = 0;
    var lastPos = null;
    var tickets = $('.tickets .ticket');
    var ticketData = [];
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    function updateTickets(scrollPos) {
        targetLimit = target.offset().top + target.outerHeight() - window.innerHeight;
        var ticketProgress = Math.min(scrollPos / targetLimit, 1);
        tickets.each(function (index) {
            var data = ticketData[index];
            var offsetX = data.offsetX * (1 - ticketProgress);
            var offsetY = data.offsetY * (1 - ticketProgress);
            var rotation = data.rotation * (1 - ticketProgress);
            $(this).css({
                transform: 'translate3d(' + offsetX + 'px, ' + offsetY + 'px, 0) rotate3D(0, 0, 1,' + rotation + 'deg)'
            });
        });
    }

    function updatePerspective(scrollPos) {
        var pos = scrollPos + window.innerHeight / 2;
        $('.three-dee').css({
            'perspective-origin': '50% ' + pos + 'px',
            '-webkit-perspective-origin': '50% ' + pos + 'px'
        });
    }

    function handleScroll() {
        var scrollPos = $(window).scrollTop();
        var pos = Math.min(scrollPos, Math.max(heroLimit, targetLimit));
        if (pos !== lastPos) {
            updateTickets(scrollPos);
            updatePerspective(scrollPos);
            lastPos = pos;
        }
    }

    function onFrame() {
        handleScroll();
        requestAnimationFrame(onFrame);
    }

    if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(onFrame);
    } else {
        $(window).on('scroll', handleScroll);
    }

    var verticalOffset = window.innerHeight * 0.8;
    var verticalSpread = window.innerHeight * 0.2;
    var horizontalOffset = window.innerWidth * 0.3;
    var horizontalSpread = window.innerWidth * 0.1;
    var targetMiddle = target.offset().left + (target.outerWidth() >> 1);
    tickets.each(function(index) {
        var ticket = $(this);
        var ticketMiddle = ticket.offset().left + (ticket.outerWidth() >> 1);
        var orientation = (ticketMiddle > targetMiddle) ? 1 : -1;
        ticketData[index] = {
            offsetX: (Math.random() * horizontalSpread + horizontalOffset) * orientation,
            offsetY: Math.random() * verticalSpread - verticalOffset,
            rotation: Math.random() * 300 - 150
        };
    });
    updateTickets();

    function animate(elem) {
        $(elem).addClass('inactive');
        var scene = new ScrollMagic.Scene({
            offset: window.innerHeight * 0.1,
            triggerElement: elem,
            triggerHook: 0.5
        });
        scene.setClassToggle(elem, 'active');
        scene.addTo(controller);
    }
    animate('#sticky1');
    animate('#sticky2');
    animate('#sticky3');
    animate('#sticky4');
    animate('#sticky5');

    $('.btn-share').click(function() {
        window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
        return false;
    });
});
