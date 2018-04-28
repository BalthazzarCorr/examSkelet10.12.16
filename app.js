$(() => {

    const app = Sammy('#app', function () {        /// div to populate and routs
        this.use('Handlebars', 'hbs');
        this.get('index.html', getHomePage);
        this.get('#/home', (ctx) => {
            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            ctx.loadPartials({
                header: './template/common/header.hbs',
                footer: './template/common/footer.hbs'
            }).then(function () {
                this.partial('./template/home.hbs')
            })
        });
        this.get('#/login', (ctx) => {
            if (!auth.isAuth()) {
                ctx.username = sessionStorage.getItem('username');
                ctx.isAuth = auth.isAuth();
                ctx.loadPartials({
                    header: './template/common/header.hbs',
                    footer: './template/common/footer.hbs'
                }).then(function () {
                    this.partial('./template/login.hbs')
                })
            } else {
                ctx.redirect('#/home')
            }
        });
        this.post('#/login', (ctx) => {
            let username = ctx.params.username;
            let password = ctx.params.password;


            auth.login(username, password)
                .then((userData) => {
                    auth.saveSession(userData);
                    displayNotification.showInfo('Login Successful.');
                    ctx.isAuth = auth.isAuth();
                    ctx.redirect('#/home');
                }).catch(displayNotification.handleError);

        });
        this.get('#/logout', (ctx) => {
            auth.logout().then(() => {
                sessionStorage.clear();
                ctx.redirect('#/home')
            }).catch(displayNotification.handleError)
        });
        this.get('#/register', (ctx) => {
            if (!auth.isAuth()) {
                ctx.isAuth = auth.isAuth();
                ctx.loadPartials({
                    header: './template/common/header.hbs',
                    footer: './template/common/footer.hbs'
                }).then(function () {
                    this.partial('./template/register.hbs')
                })
            } else {
                ctx.redirect('#/home')
            }
        });
        this.post('#/register', (ctx) => {

            let username = ctx.params.username;
            let password = ctx.params.password;
            let name = ctx.params.name;

            auth.register(username, password, name)
                .then((userData) => {
                    auth.saveSession(userData);
                    displayNotification.showInfo('User registration successful!');
                    ctx.redirect('#/home');
                })
                .catch(displayNotification.handleError);
        });
        this.get('#/mymessages', (ctx) => {


            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            messagesSrv.listMessagesByRecipient().then((messages) => {
                messages.forEach((m) => {
                    m.date = formatDate(m._kmd.lmt);
                    m.sender = formatSender(m.sender_name, m.sender_username);
                });

                ctx.messages = messages;

                ctx.username = sessionStorage.getItem('username');
                ctx.isAuth = auth.isAuth();
                ctx.loadPartials({
                    header: './template/common/header.hbs',
                    footer: './template/common/footer.hbs',
                    message:'./template/message.hbs'
                })
                    .then(function () {
                    this.partial('./template/myMessages.hbs')
                })

            });


        });
        this.get('#/send', (ctx) => {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            ctx.username = sessionStorage.getItem('username');   ctx.isAuth = auth.isAuth();

            auth.listAllUsers()
                .then(userList => {
                   ctx.userList = userList;
                    console.log(userList);
                    ctx.loadPartials({
                        header: './template/common/header.hbs',
                        footer: './template/common/footer.hbs',
                    }).then(function () {
                        this.partial('./template/sentMessage.hbs')
                    })
                });

        });
        this.get('#/archive', (ctx) => {
            ctx.username = sessionStorage.getItem('username');

            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }

            messagesSrv.listMessagesBySender()
                .then((messages) => {
                    messages.forEach((m) => {
                        m.date = formatDate(m._kmd.lmt);
                        m.reciver = m.recipient_username;
                    });

                    ctx.messages = messages;

                    ctx.isAuth = auth.isAuth();
                    ctx.loadPartials({
                        header: './template/common/header.hbs',
                        footer: './template/common/footer.hbs',
                        message: './template/messageArhive.hbs'
                    }).then(function () {
                        this.partial('./template/archiveSent.hbs')
                    })
                }).catch(displayNotification.handleError);

        });


        function formatDate(dateISO8601) {
            let date = new Date(dateISO8601);
            if (Number.isNaN(date.getDate()))
                return '';
            return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
                "." + date.getFullYear() + ' ' + date.getHours() + ':' +
                padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

            function padZeros(num) {
                return ('0' + num).slice(-2);
            }
        }

        function formatSender(name, username) {
            if (!name)
                return username;
            else
                return username + ' (' + name + ')';
        }

        function getHomePage(ctx) {

            if (!auth.isAuth()) {
                ctx.isAuth = auth.isAuth();
                ctx.loadPartials({
                    header: './template/common/header.hbs',
                    footer: './template/common/footer.hbs'
                }).then(function () {
                    this.partial('./template/home.hbs')
                })
            } else {
                ctx.redirect('#/home')
            }
        }
    });

    app.run();
});