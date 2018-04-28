let messagesSrv = (()=>{

    function listMessagesByRecipient() {
        let username = sessionStorage.getItem('username');
        let endpoint = `messages?query={"recipient_username":"${username}"}`;


        return remote.get('appdata',endpoint,'kinvey');
    }

    function listMessagesBySender() {
        let username = sessionStorage.getItem('username');
        let endpoint = `messages?query={"sender_username":"${username}"}`;
        return remote.get('appdata',endpoint,'kinvey');
    }

    function sendMessage(data) {
        let endpoint  = 'messages';
        return remote.post('appdata',endpoint,'kinvey',data)
    }

    function deleteMessage(messageId) {
        let endpoint = `messages/${messageId}`;
        return remote.remove('appdata',endpoint,'kinvey')
    }
    return{
        listMessagesByRecipient,
        listMessagesBySender,
        sendMessage,
        deleteMessage

    }

})();