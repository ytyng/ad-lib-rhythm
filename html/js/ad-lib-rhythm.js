$(function () {

    var noteImages = [
        // 画像URL, 出現割合
        ['images/note-00.png', 2],
        ['images/note-01.png', 2],
        //['images/note-10.png', 1],
        ['images/note-11.png', 2],
        ['images/note-1-.png', 2],
        ['images/note-3.png', 1]
    ];

    var totalIncidence = 0;
    // 合計出現割合を計算
    for (var i = 0; i < noteImages.length; i++) {
        totalIncidence += noteImages[i][1];
    }

    /**
     * 音符URLを1つ選択
     * @returns {*}
     */
    function selectNoteImage() {
        var r = Math.floor(Math.random() * totalIncidence);
        var incidenceStack = 0;
        for (var i = 0; i < noteImages.length; i++) {
            var nextIncidenceStack = incidenceStack + noteImages[i][1];
            if (incidenceStack <= r && r < nextIncidenceStack) {
                return noteImages[i][0];
            }
            incidenceStack = nextIncidenceStack;
        }
        alert("selectNote Error: r=" + r);
    }

    var animating = false;

    var helpMessage = $('#help-message');

    $(document.body).bind("click touchend", function (event) {

        if (helpMessage.is(':visible')) {
            helpMessage.fadeOut();
        }

        if (animating) {
            return false;
        }

        var sections = $('div.section');
        if (sections.length >= 2) {
            animating = true;
            var firstSection = sections.filter(":first");
            firstSection.animate({
                marginTop: firstSection.height() * -1

            }, 500, 'linear', function () {
                firstSection.remove();
                animating = false;
            });
        }

        var div = $('<div />').addClass('section');
        for (var bar = 0; bar < 2; bar++) {
            var span = $('<span />').addClass('bar');

            for (var i = 0; i < 4; i++) {
                var imageUrl = selectNoteImage();
                var img = $('<img />').addClass('note').attr('src', imageUrl);
                span.append(img);
            }
            div.append(span);

        }
        $(document.body).append(div);
        return false;
    });
});
