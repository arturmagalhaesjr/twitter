var Messages = {
    endPoint: "http://socialbase.magalhaes.tech/api",
    secondsToRefresh: 30,
    lastTimeout: null,

    init: function () {
        this.getMessages();

        $('.form-add').submit(function (event) {
            event.preventDefault();
            Messages.postAction();
            return false;
        });

        $('#message').keyup(Messages.messageErrorHandler).keypress(Messages.messageErrorHandler).keypress(Messages.countHandler);
        Messages.countHandler();
    },

    getMessages: function () {


        $('#loading').html('Carregando...').fadeIn();

        if(Messages.lastTimeout) {
            clearTimeout(Messages.lastTimeout);
        }

        $.get(this.endPoint + "/messages.json?limit=10000", function (r) {
            r.reverse();

            $('#loading').fadeOut();

            var list = $('<ul></ul>');
            list.addClass('list-unstyled');
            list.attr('id', 'list-messages');

            for (var i in r) {
                list.append(Messages.createMessageItem(r[i]));
            }
            $('.messages').html(list);

            $('#messages-count').html(r.length);

            Messages.lastTimeout = setTimeout(function () {
                Messages.getMessages();
            }, Messages.secondsToRefresh * 1000);
        });
    },

    createMessageItem: function (obj) {
        var item = $('<li></li>');

        var message = $('<p></p>');
        message.html(obj.message);

        var groupButtons = $('<div></div>');
        groupButtons.addClass('controls');


        var buttonDelete = $('<a></a>');
        buttonDelete.addClass('btn btn-xs btn-danger').html('Excluir').click(function () {
            Messages.deleteAction(obj);
        });

        var buttonUpdate = $('<a></a>');
        buttonUpdate.addClass('btn btn-xs btn-warning').html('Atualizar');

        groupButtons.append(buttonUpdate).append(buttonDelete);

        item.append(groupButtons).append(message);
        return item;
    },

    postAction: function (obj) {
        var message = $('#message').val();
        // POST /messages.json parametro message
        $.post(Messages.endPoint + "/messages.json", {message: message}, function (r) {
            Messages.getMessages();
            $('#message').val('').focus();
        });
    },

    deleteAction: function (obj) {
        $.ajax(
            {
                type: 'DELETE',
                dataType:'json',
                url: Messages.endPoint + "/messages/" + obj.id + ".json",
                data: {_method: "DELETE"},
                success: function () {
                    Messages.getMessages();
                }
            }
        );
    },

    countHandler: function (event) {
        $('#char-count').html($('#message').val().length);
    },

    messageErrorHandler: function (event) {
        var message = $('#message').val();

        if (message.length > 140) {
            $('#message').parent().addClass('has-error');
            $('button').attr('disabled', 'disabled');
        } else {
            $('#message').parent().removeClass('has-error');
            $('button').attr('disabled', null);
        }
    }
};


$(function () {
    Messages.init();
});
