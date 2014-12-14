$(function () {

    var noteSizeW = 200;
    var noteSizeH = 250;

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

    /**
     * getクエリから値を取得
     */
    function getParameterByName(name, def) {
        if (!def) def = null;
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? def : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    /**
     * note のスタイルを作成
     */
    function calculateNoteStyle(body, rowsInPage, barsInRow, notesInBar) {
        var barWidth = body.width() / barsInRow - 2;  // 2: left and right border width
        var barHeight = body.height() / rowsInPage - 2;  // 2: top and bottom border height
        var boxWidth = barWidth / notesInBar;
        // boxWidthに内接する最大の大きさ
        var wRatio = boxWidth / noteSizeW;
        var hRatio = barHeight / noteSizeH;
        var ratio = Math.min(wRatio, hRatio);
        return {
            "width": Math.floor(noteSizeW * ratio) + "px",
            "height": Math.floor(noteSizeH * ratio) + "px",
            "margin-top": (barHeight - (noteSizeH * ratio)) / 2 + "px"
        }
    }

    var animating = false;

    var helpMessage = $('#help-message');
    var body = $(document.body);

    function displayNextRow() {
        // hide help message (first time)
        if (helpMessage.is(':visible')) {
            helpMessage.fadeOut();
        }

        // overflow animation with lock
        if (animating) {
            return false;
        }
        var rowsInPage = getParameterByName('r', 2);
        var rows = $('div.row');
        if (rows.length >= rowsInPage) {
            animating = true;
            var firstRow = rows.filter(":first");
            firstRow.animate({
                marginTop: firstRow.height() * -1
            }, 500, 'linear', function () {
                firstRow.remove();
                animating = false;
            });
        }

        // generate rows
        var barsInRow = getParameterByName('b', 2);
        var div = $('<div />').addClass('row').css({height: 100 / rowsInPage + "%"});
        var notesInBar = 4;

        // calculate note size
        var noteStyle = calculateNoteStyle(body, rowsInPage, barsInRow, notesInBar);

        // generate notes and append
        for (var bar = 0; bar < barsInRow; bar++) {
            var span = $('<span />').addClass('bar').css({width: 100 / barsInRow + "%"});

            for (var i = 0; i < notesInBar; i++) {
                var imageUrl = selectNoteImage();
                var img = $('<img />').addClass('note').attr('src', imageUrl).css(noteStyle);
                span.append(img);
            }
            div.append(span);

        }
        body.append(div);
        return false;
    }
    body.bind("click touchend keydown", displayNextRow);
});
