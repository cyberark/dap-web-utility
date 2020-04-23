var term;

$(document).ready(function () {
    $('#app').load("/welcome");
    terminal();
    $('[data-toggle="tooltip"]').tooltip()
    normalizeTerm();
});

$(document).on('click', '.cmd', function(){
    if (!$(this).data("cmd")) {
        thecmd = $("#"+$(this).data("target") ).html();
        term.send( $("<textarea/>").html(thecmd).val() + "\n");
    } else {
        term.send( $(this).data("cmd") + "\n");
    }
});


$(document).on('click', 'nav a', function(){
    $('#app').load($(this).data("page"));
    $(".navbar-collapse").collapse('hide');
});

$(document).on('click', '.gotolink', function(){
    $('#app').load($(this).data("page"));
});

$(document).on('click', '.actionbtn', function(){
    normalizeTerm();
});

$(document).on('click', '#btn_max_term', function(){
    maximizeTerm();
});

$(document).on('keyup',function(evt) {
    if (evt.keyCode == 27) {
        normalizeTerm();
    }
});

$(document).on('click', '#btn_min_term', function(){
    minimzeTerm();
});

function minimzeTerm() {
    $("#terminal").hide();
    $("#terminal_title").hide();
    $("#btn_min_term").hide()
    $("#btn_max_term").hide()

    $('.actionbtn').show();
}
function maximizeTerm() {
    if (!$(".terminal").hasClass("fullscreen")) {
        $(".terminal").addClass("fullscreen");
        $(".navbar").hide();
        term.write("\n\nPlease press  to exit full screen\n")
        term.send("\n");
    }
}

function normalizeTerm() {
    $("#terminal").show();
    $("#terminal_title").show();
    $("#btn_min_term").show()
    $("#btn_max_term").show()
    $('.actionbtn').hide();
    $(".navbar").show();
    $(".terminal").removeClass("fullscreen");
}

function terminal() {
    Terminal.applyAddon(attach);
    Terminal.applyAddon(fit);
    Terminal.applyAddon(fullscreen);
    
    term = new Terminal({
        useStyle: true,
        convertEol: true,
        screenKeys: true,
        cursorBlink: true,
        visualBell: true,
        colors: Terminal.xtermColors
    });

    term.open(document.getElementById('terminal'));
    term.fit();

    var id = "secure";
    var host = window.location.origin;
    var socket = io.connect(host);
    socket.emit('exec', id, $('#terminal').width(), $('#terminal').height());
    term.on('data', (data) => {
        socket.emit('cmd', data);
    });

    socket.on('show', (data) => {
        term.write(data);
    });

    socket.on('end', (status) => {
        $('#terminal').empty();
        socket.disconnect();
    });
}