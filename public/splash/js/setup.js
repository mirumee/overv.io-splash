(function ($) {
    var $helpLinks = $('a.help-image');
    $helpLinks.find('img').hide();
    $helpLinks.click(function (e) {
        var $a = $(e.currentTarget);
        $a.find('img').toggle();
        e.preventDefault();
    });

    function getUUID() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    $('code').each(function (index, codeEl) {
        var code = codeEl.textContent;
        while (code.indexOf('<%=uuid%>') != -1) {
            var uuid = getUUID();
            code = code.replace('<%=uuid%>', uuid);
        }
        codeEl.textContent = code;
    });
})($);
