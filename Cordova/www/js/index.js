var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

        //navigator.notification.alert("app started");
        //console.log('deveice ready');
        //$("#navigator.notification.alert").modal('hide');
        url1 = 'http://10.0.0.2:8080';
        /*function alertDismissed() {
            // do something
        }*/
        var logged_user = '';
        var reg_users = [];
        var networkState = navigator.connection.type;
        if (networkState != Connection.WIFI) {
            //$("#navigator.notification.alert").modal('show');
            navigator.notification.vibrate([100, 100, 100]);
            navigator.notification.alert('TURN YOUR WIFI ON!', function() {
                navigator.app.exitApp();
            }, 'Error', 'OK');
        } else {


            url1 = 'http://10.0.0.2:8080/'

            $.ajax({
                url: url1,
                data: JSON.stringify({
                    action: 'CHECK'
                }),
                type: 'post',
                async: 'true',
                contentType: 'application/json',
                dataType: 'json',
                timeout: 5000,
                success: function(result) {
                    if (logged_user == '') {
                        //navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                        navigator.notification.alert('Login Required!', function() {
                            $.mobile.changePage('#page2', {
                                transition: 'slide'
                            });
                            $('#uname').val('');
                            $('#pswd').val('');

                        }, 'ERROR', 'OK');
                    }

                    if (result.message == "0") {
                        $("#flip-1").val('off').flipswitch('refresh');
                        $("#flip-2").val('off').flipswitch('refresh');
                    } else if (result.message == "1") {
                        $("#flip-1").val('off').flipswitch('refresh');
                        $("#flip-2").val('on').flipswitch('refresh');
                    } else if (result.message == "2") {
                        $("#flip-1").val('on').flipswitch('refresh');
                        $("#flip-2").val('off').flipswitch('refresh');
                    } else if (result.message == "3") {
                        $("#flip-1").val('on').flipswitch('refresh');
                        $("#flip-2").val('on').flipswitch('refresh');
                    }

                    $('#mic').on('click', function() {
                        var maxMatches = 5;
                        var promptString = "Light On, Fan On, Lock Open, etc.";
                        var language = "en-US";
                        window.plugins.speechrecognizer.startRecognize(function(result) {
                            //navigator.notification.alert(result,function(){}, 'Alert','K');
                            var flagl = false,
                                flagln = false;
                            var flagf = false,
                                flagfn = false;
                            var lock = false;
                            for (var i = 0; i < 5; i++) {
                                res = result[i].toLowerCase();
                                if (res == 'light on' || res == 'lights on') {
                                    flagl = true;
                                    break;
                                } else if (res == 'fun on' || res == 'fan on') {
                                    flagf = true;
                                    break;
                                } else if (res == 'light of' || res == 'lights of' || res == 'light off' || res == 'lights off') {
                                    flagln = true;
                                    break;
                                } else if (res == 'fan of' || res == 'fun of' || res == 'fan off' || res == 'fun off') {
                                    flagfn = true;
                                    break;
                                } else if (res == 'lock open') {
                                    lock = true;
                                    break;
                                }
                            }
                            var str = '';
                            if (flagl) {
                                str = 'Light On';
                                $('#flip-2').val('on').flipswitch('refresh');
                            } else if (flagf) {
                                str = 'Fan On';
                                $('#flip-1').val('on').flipswitch('refresh');
                            } else if (flagln) {
                                str = 'Light Off';
                                $('#flip-2').val('off').flipswitch('refresh');
                            } else if (flagfn) {
                                str = 'Fan Off';
                                $('#flip-1').val('off').flipswitch('refresh');
                            } else if (lock) {
                                str = 'Lock Open';
                                $.ajax({
                                    url: url1,
                                    data: JSON.stringify({
                                        action: 'Relay 2 on'
                                    }),
                                    type: 'post',
                                    async: 'true',
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    timeout: 500,
                                    beforeSend: function() {
                                        // This callback function will trigger before data is sent
                                        $.mobile.loading('show', {
                                            theme: "a",
                                            text: "Please wait...",
                                            textonly: true,
                                            textVisible: true
                                        }); // This will show ajax spinner
                                    },
                                    complete: function() {
                                        // This callback function will trigger on data sent/received complete
                                        $.mobile.loading('hide'); // This will hide ajax spinner
                                    },
                                    success: function(result) {
                                        if (result.message) {
                                            console.log('success!');
                                            // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        } else {
                                            console.log('failure');
                                            //navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR', 'OK');
                                    }
                                });
                            } else
                                str = 'Try Again!'
                            $('#command').val(str).delay(1000).val('');

                        }, function(errorMessage) {
                            navigator.notification.alert("No Internet!", function() {}, 'Error', 'Close');
                            //console.log("Error message: " + errorMessage,function(){},'Error','K');
                        }, maxMatches, promptString, language);
                    });

                    $(document).on('change', function(obj) {
                        if (obj.target == document.getElementById('flip-1')) {
                            var abc = $('#flip-1');
                            if (abc.val() == 'on') {
                                $.ajax({
                                    url: url1,
                                    data: JSON.stringify({
                                        action: 'Relay 1 on'
                                    }),
                                    type: 'post',
                                    async: 'true',
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    timeout: 500,
                                    beforeSend: function() {
                                        // This callback function will trigger before data is sent
                                        $.mobile.loading('show', {
                                            theme: "a",
                                            text: "Please wait...",
                                            textonly: true,
                                            textVisible: true
                                        }); // This will show ajax spinner
                                    },
                                    complete: function() {
                                        // This callback function will trigger on data sent/received complete
                                        $.mobile.loading('hide'); // This will hide ajax spinner
                                    },
                                    success: function(result) {
                                        if (result.message) {
                                            console.log('success!');
                                            // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        } else {
                                            console.log('failure');
                                            //navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR', 'OK');
                                    }
                                });
                            } else if (abc.val() == 'off') {
                                $.ajax({
                                    url: url1,
                                    data: JSON.stringify({
                                        action: 'Relay 1 off'
                                    }),
                                    type: 'post',
                                    async: 'true',
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    timeout: 500,
                                    beforeSend: function() {
                                        // This callback function will trigger before data is sent
                                        $.mobile.loading('show', {
                                            theme: "a",
                                            text: "Please wait...",
                                            textonly: true,
                                            textVisible: true
                                        }); // This will show ajax spinner
                                    },
                                    complete: function() {
                                        // This callback function will trigger on data sent/received complete
                                        $.mobile.loading('hide'); // This will hide ajax spinner
                                    },
                                    success: function(result) {
                                        if (result.message) {
                                            console.log('success!');
                                            // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        } else {
                                            console.log('failure');
                                            //navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR', 'OK');
                                    }
                                });
                            }
                        } else if (obj.target == document.getElementById('flip-2')) {
                            var abc = $('#flip-2');
                            if (abc.val() == 'on') {
                                $.ajax({
                                    url: url1,
                                    data: JSON.stringify({
                                        action: 'Relay 3 on'
                                    }),
                                    type: 'post',
                                    async: 'true',
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    timeout: 500,
                                    beforeSend: function() {
                                        // This callback function will trigger before data is sent
                                        $.mobile.loading('show', {
                                            theme: "a",
                                            text: "Please wait...",
                                            textonly: true,
                                            textVisible: true
                                        }); // This will show ajax spinner
                                    },
                                    complete: function() {
                                        // This callback function will trigger on data sent/received complete
                                        $.mobile.loading('hide'); // This will hide ajax spinner
                                    },
                                    success: function(result) {
                                        if (result.message) {
                                            console.log('success!');
                                            // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        } else {
                                            console.log('failure');
                                            //navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR', 'OK');
                                    }
                                });
                            } else if (abc.val() == 'off') {
                                $.ajax({
                                    url: url1,
                                    data: JSON.stringify({
                                        action: 'Relay 3 off'
                                    }),
                                    type: 'post',
                                    async: 'true',
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    timeout: 500,
                                    beforeSend: function() {
                                        // This callback function will trigger before data is sent
                                        $.mobile.loading('show', {
                                            theme: "a",
                                            text: "Please wait...",
                                            textonly: true,
                                            textVisible: true
                                        }); // This will show ajax spinner
                                    },
                                    complete: function() {
                                        // This callback function will trigger on data sent/received complete
                                        $.mobile.loading('hide'); // This will hide ajax spinner
                                    },
                                    success: function(result) {
                                        if (result.message) {
                                            console.log('success!');
                                            // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        } else {
                                            console.log('failure');
                                            //navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR', 'OK');
                                    }
                                });
                            }
                        }
                        //alert('Value Changed!');

                    });

                    document.getElementById('but-1').addEventListener('click', function() {
                        $.ajax({
                            url: url1,
                            data: JSON.stringify({
                                action: 'Relay 2 on'
                            }),
                            type: 'post',
                            async: 'true',
                            contentType: 'application/json',
                            dataType: 'json',
                            timeout: 500,
                            beforeSend: function() {
                                // This callback function will trigger before data is sent
                                $.mobile.loading('show', {
                                    theme: "a",
                                    text: "Please wait...",
                                    textonly: true,
                                    textVisible: true
                                }); // This will show ajax spinner
                            },
                            complete: function() {
                                // This callback function will trigger on data sent/received complete
                                $.mobile.loading('hide'); // This will hide ajax spinner
                            },
                            success: function(result) {
                                if (result.message) {
                                    console.log('success!');
                                    // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                } else {
                                    console.log('failure');
                                    //navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                                }
                            },
                            error: function(request, error) {
                                // This callback function will trigger on unsuccessful action              
                                navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR', 'OK');
                            }
                        });
                    });


                },
                error: function(request, error) {
                    navigator.notification.vibrate([100, 100, 100]);
                    navigator.notification.alert("Cannot connect to HAS, Try Again!", function() {
                        navigator.app.exitApp();
                    }, 'No Connection', 'Close App');
                }
            });


            var pictureSource; // picture source
            var destinationType; // sets the format of returned value

            // Wait for device API libraries to load
            //

            pictureSource = navigator.camera.PictureSourceType;
            destinationType = navigator.camera.DestinationType;




            // Called when a photo is successfully retrieved
            //
            function onPhotoDataSuccess(imageData) {
                // Uncomment to view the base64-encoded image data
                // console.log(imageData);

                // Get image handle
                //
                //var smallImage = $('#image');

                // Unhide image elements
                //
                //smallImage.style.display = 'block';

                // Show the captured photo
                // The in-line CSS rules are used to resize the image
                //
                $.ajax({
                    url: 'http://10.0.0.2:8080/',
                    data: JSON.stringify({
                        action: 'loginF',
                        data: imageData
                    }),
                    type: 'post',
                    async: 'true',
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout: 260000,
                    beforeSend: function() {
                        // This callback function will trigger before data is sent
                        $.mobile.loading('show', {
                            theme: "a",
                            text: "Please wait...",
                            textonly: false,
                            textVisible: true
                        }); // This will show ajax spinner
                    },
                    complete: function() {
                        // This callback function will trigger on data sent/received complete
                        $.mobile.loading('hide'); // This will hide ajax spinner
                    },
                    success: function(result) {
                        if (result.status == 'True') {
                            user = result.uname;
                            pass = result.pswd;
                            console.log('success!');
                            $.ajax({
                                url: 'http://10.0.0.2:8080/',
                                data: JSON.stringify({
                                    action: 'login',
                                    username: user,
                                    password: pass
                                }),
                                type: 'post',
                                async: 'true',
                                contentType: 'application/json',
                                dataType: 'json',
                                timeout: 5000,
                                success: function(result) {
                                    if (result.stat == 'True') {
                                        console.log('success!');
                                        //navigator.notification.alert('Good Login!',function(){},'Success','Close')
                                        logged_user = user;
                                        $('#loginBut').html('Logout');
                                        but = document.getElementById('loginBut');
                                        but.removeAttribute('data-transition');
                                        but.setAttribute('href', '#');

                                        $.mobile.changePage('#page1', {
                                            transition: 'slide',
                                            reverse: true
                                        });
                                        // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                    }
                                },
                                error: function(request, error) {
                                    // This callback function will trigger on unsuccessful action              
                                    navigator.notification.alert('Network error has occurred please try again\nOR\nTry username password!', function() {}, 'ERROR', 'OK');
                                }
                            });
                            //navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                        } else {
                            console.log('failure');
                            navigator.notification.alert('Unable to recognize\nTry Again\nOR\nTry username password', function() {}, 'Error!', 'OK');
                        }
                    },
                    error: function(request, error) {
                        // This callback function will trigger on unsuccessful action              
                        navigator.notification.alert('Network error has occurred please try again\nOR\nTry username password!', function() {}, 'ERROR', 'OK');
                    }
                });
                //smallImage.attr('src' ,"data:image/jpeg;base64," + imageData);
                //$('#popim').attr('src',smallImage.attr('src'));
            }

            // A button will call this function
            //
            function capturePhoto() {
                // Take picture using device camera and retrieve image as base64-encoded string
                navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
                    quality: 100,
                    destinationType: destinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: false,
                    mediaType: Camera.MediaType.PICTURE,
                    cameraDirection: Camera.Direction.FRONT
                });
            }

            // A button will call this function
            //

            // Called if something bad happens.
            //
            function onFail(message) {
                navigator.notificitaion.alert('Failed because: ' + message, function() {}, 'error', 'close');
            }

            document.getElementById('face').addEventListener('click', function() {
                capturePhoto();
            });

            //window.history.forward();

            /* $(window).on('swipeleft', function(obj) {
                 if (obj.target == document.getElementById('page1')) {
                     $.mobile.changePage('#page2', {
                         transition: "slide"
                     });
                 } else if (obj.target == document.getElementById('page2')) {
                     $.mobile.changePage('#page3', {
                         transition: "slide"
                     });
                 }
             });

             $(window).on('swiperight', function(obj) {
                 //console.log(obj.target);
                 if (obj.target == document.getElementById('page2')) {
                     $.mobile.changePage('#page1', {
                         transition: "slide",
                         reverse: true
                     });
                     $('#flip-1').val("arrive").flipswitch('refresh');
                 } else if (obj.target == document.getElementById('page3')) {
                     $.mobile.changePage('#page2', {
                         transition: "slide",
                         reverse: true
                     });
                     //$('#flip-1').val("arrive").flipswitch('refresh');
                 }
             });*/



            $(document).on('backbutton', function() {
                navigator.notification.confirm(
                    'Exit HAS Remote?', // message
                    function(buton) {
                        if (buton == 1) {
                            $.ajax({
                                url: 'http://10.0.0.2:8080/',
                                data: JSON.stringify({
                                    action: 'logout',
                                    username: logged_user
                                }),
                                type: 'post',
                                async: 'true',
                                contentType: 'application/json',
                                dataType: 'json',
                                timeout: 1000,
                                beforeSend: function() {
                                    // This callback function will trigger before data is sent
                                    //navigator.notification.alert("beforeSend",function(){},'info','OK');
                                    $.mobile.loading('show', {
                                        theme: "a",
                                        text: "Please wait...",
                                        textonly: true,
                                        textVisible: true
                                    }); // This will show ajax spinner
                                },
                                complete: function() {
                                    // This callback function will trigger on data sent/received complete
                                    //navigator.notification.alert("complete",function(){},'info','OK');
                                    $.mobile.loading('hide'); // This will hide ajax spinner
                                },
                                success: function(result) {
                                    navigator.app.exitApp();
                                },
                                error: function(request, error) {
                                    // This callback function will trigger on unsuccessful action              
                                    navigator.app.exitApp();
                                }
                            });

                        }
                    } // callback to invoke with index of button pressed
                    // title
                    // buttonLabels
                );

            });

            document.getElementById('homeC').addEventListener('click', function() {
                $('#uname').val('');
                $('#pswd').val('');
            });

            document.getElementById('loginBut').addEventListener('click', function() {
                button = $('#loginBut');
                //navigator.notification.alert('Alert : '+button.html(),null,'OK','OK');
                if (button.html() == 'Login') {
                    $('#uname').val('');
                    $('#pswd').val('');
                } else {
                    $.ajax({
                        url: 'http://10.0.0.2:8080/',
                        data: JSON.stringify({
                            action: 'logout',
                            username: logged_user
                        }),
                        type: 'post',
                        async: 'true',
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: 1000,
                        beforeSend: function() {
                            // This callback function will trigger before data is sent
                            //navigator.notification.alert("beforeSend",function(){},'info','OK');
                            $.mobile.loading('show', {
                                theme: "a",
                                text: "Please wait...",
                                textonly: true,
                                textVisible: true
                            }); // This will show ajax spinner
                        },
                        complete: function() {
                            // This callback function will trigger on data sent/received complete
                            //navigator.notification.alert("complete",function(){},'info','OK');
                            $.mobile.loading('hide'); // This will hide ajax spinner
                        },
                        success: function(result) {
                            if (result.stat == 'True') {
                                console.log('success!');
                                //navigator.notification.alert('Good Login!',function(){},'Success','Close')
                                logged_user = '';
                                $('#loginBut').html('Login');
                                but = document.getElementById('loginBut');
                                but.setAttribute('data-transition', 'slide');
                                but.setAttribute('href', '#page2');
                                // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                            } else {
                                console.log('failure');
                                navigator.notification.alert('Already Logged Out!', function() {}, 'Error', 'Close')
                                logged_user = '';
                                $('#loginBut').html('Login');
                                but = document.getElementById('loginBut');
                                but.setAttribute('data-transition', 'slide');
                                but.setAttribute('href', '#page2');
                                //navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                            }
                        },
                        error: function(request, error) {
                            // This callback function will trigger on unsuccessful action              
                            navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR', 'OK');
                        }
                    });
                }
            });

            document.getElementById('regB').addEventListener('click', function() {
                $('#ureg').val('');
                $('#preg').val('');
                $('#pcreg').val('');
                $('#usname').val('');
                for (i = 0; i < 4; i++) {
                    anchors = document.getElementsByName('pic')[i];
                    anchor = anchors.getElementsByTagName('img')[0];
                    anchor.src = 'img/camera-black.svg';
                    anchor.removeAttribute('style');
                    anchor.removeAttribute('data');
                    anchor.setAttribute('used', 'no');
                    anchors.setAttribute('href', '#');
                }
                $.ajax({
                    url: 'http://10.0.0.2:8080/',
                    data: JSON.stringify({
                        action: 'getUsers'
                    }),
                    type: 'post',
                    async: 'true',
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout: 1000,
                    beforeSend: function() {
                        // This callback function will trigger before data is sent
                        //navigator.notification.alert("beforeSend",function(){},'info','OK');
                        $.mobile.loading('show', {
                            theme: "a",
                            text: "Please wait...",
                            textonly: true,
                            textVisible: true
                        }); // This will show ajax spinner
                    },
                    complete: function() {
                        // This callback function will trigger on data sent/received complete
                        //navigator.notification.alert("complete",function(){},'info','OK');
                        $.mobile.loading('hide'); // This will hide ajax spinner
                    },
                    success: function(result) {
                        //navigator.notification.alert('Usrs : '+result.users,null,'Info');
                        reg_users = result.users;
                    },
                    error: function(request, error) {
                        // This callback function will trigger on unsuccessful action              
                        navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR', 'OK');
                    }
                });

            });

            document.getElementById('regcont').addEventListener('click', function() {
                unameVal = $('#ureg').val();
                var flag = true;
                for (var i = 0; i < reg_users.length; i++) {
                    if (unameVal == reg_users[i]) {
                        flag = false;
                        break;
                    }
                }
                if ($('#ureg').val() == '' || $('#preg').val() == '' || $('#pcreg').val() == '' || $('#usname').val() == '') {
                    navigator.notification.alert('Complete all entries', function() {}, 'Incomplete', 'OK');
                } else if ($('#preg').val() != $('#pcreg').val()) {
                    navigator.notification.alert('Passwords do not match', function() {}, 'Error', 'OK');
                } else if (!flag) {
                    navigator.notification.alert('Username ' + unameVal + ' taken', null, 'Error!');
                } else {
                    $.mobile.changePage('#reg2', {
                        transition: 'slide'
                    });
                }
            });

            document.getElementById('regsub').addEventListener('click', function() {
                var count = 0;
                var img = [];
                ureg = $('#ureg').val();
                preg = $('#preg').val();
                usname = $('#usname').val();
                for (var i = 0; i < 4; i++) {
                    anchors = document.getElementsByName('pic')[i];
                    anchor = anchors.getElementsByTagName('img')[0];
                    if (anchor.getAttribute('used') != 'no')
                        count++;
                    img.push(anchor.getAttribute('data'));
                }
                //navigator.notification.alert('regsub clicked',null,'Error');
                if (count == 0) {
                    $.ajax({
                        url: 'http://10.0.0.2:8080/',
                        data: JSON.stringify({
                            action: 'register',
                            uname: ureg,
                            pswd: preg,
                            name: usname,
                            pic: 'False'
                        }),
                        type: 'post',
                        async: 'true',
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: 4000,
                        beforeSend: function() {
                            // This callback function will trigger before data is sent
                            //navigator.notification.alert("beforeSend",function(){},'info','OK');
                            $.mobile.loading('show', {
                                theme: "a",
                                text: "Please wait...",
                                textonly: false,
                                textVisible: true
                            }); // This will show ajax spinner
                        },
                        complete: function() {
                            // This callback function will trigger on data sent/received complete
                            //navigator.notification.alert("complete",function(){},'info','OK');
                            $.mobile.loading('hide'); // This will hide ajax spinner
                        },
                        success: function(result) {
                            if (result.stat == 'True') {
                                console.log('success!');
                                //navigator.notification.alert('Good Login!',function(){},'Success','Close')
                                $.mobile.changePage('#page1', {
                                    transition: 'slide',
                                    reverse: true
                                });
                                /*user = $('#ureg').val();
                                pass = $('#preg').val();
                                console.log('success!');
                                $.ajax({
                                    url: 'http://10.0.0.2:8080/',
                                    data: JSON.stringify({
                                        action: 'login',
                                        username: user,
                                        password: pass
                                    }),
                                    type: 'post',
                                    async: 'true',
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    timeout: 5000,
                                    success: function(result) {
                                        if (result.stat == 'True') {
                                            console.log('success!');
                                            //navigator.notification.alert('Good Login!',function(){},'Success','Close')
                                            logged_user = user();
                                            $('#loginBut').html('Logout');
                                            but = document.getElementById('loginBut');
                                            but.removeAttribute('data-transition');
                                            but.setAttribute('href', '#');

                                            $.mobile.changePage('#page1', {
                                                transition: 'slide',
                                                reverse: true
                                            });
                                            // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred while logging in \nPlease try again manually!', function() {
                                            $.mobile.changePage('#page1', {
                                                transition: 'slide',
                                                reverse: true
                                            });
                                        }, 'ERROR', 'OK');
                                    }
                                });*/
                                // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                            } else {
                                console.log('failure');
                                navigator.notification.alert('Unable to Register!', function() {}, 'Error', 'Close')
                                    //navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                            }
                        },
                        error: function(request, error) {
                            // This callback function will trigger on unsuccessful action              
                            navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR', 'OK');
                        }
                    });
                } else if (count == 4) {
                    $.ajax({
                        url: 'http://10.0.0.2:8080/',
                        data: JSON.stringify({
                            action: 'register',
                            uname: ureg,
                            pswd: preg,
                            name: usname,
                            pic: 'True',
                            img1: img[0],
                            img2: img[1],
                            img3: img[2],
                            img4: img[3]
                        }),
                        type: 'post',
                        async: 'true',
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: 3600000,
                        beforeSend: function() {
                            // This callback function will trigger before data is sent
                            //navigator.notification.alert("beforeSend",function(){},'info','OK');
                            $.mobile.loading('show', {
                                theme: "a",
                                text: "Please wait...",
                                textonly: false,
                                textVisible: true
                            }); // This will show ajax spinner
                        },
                        complete: function() {
                            // This callback function will trigger on data sent/received complete
                            //navigator.notification.alert("complete",function(){},'info','OK');
                            $.mobile.loading('hide'); // This will hide ajax spinner
                        },
                        success: function(result) {
                            if (result.stat == 'True') {
                                console.log('success!');
                                //navigator.notification.alert('Good Login!',function(){},'Success','Close')
                                $.mobile.changePage('#page1', {
                                    transition: 'slide',
                                    reverse: true
                                });
                                /*user = $('#ureg').val();
                                pass = $('#preg').val();
                                console.log('success!');
                                $.ajax({
                                    url: 'http://10.0.0.2:8080/',
                                    data: JSON.stringify({
                                        action: 'login',
                                        username: user,
                                        password: pass
                                    }),
                                    type: 'post',
                                    async: 'true',
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    timeout: 5000,
                                    success: function(result) {
                                        if (result.stat == 'True') {
                                            console.log('success!');
                                            //navigator.notification.alert('Good Login!',function(){},'Success','Close')
                                            logged_user = user;
                                            $('#loginBut').html('Logout');
                                            but = document.getElementById('loginBut');
                                            but.removeAttribute('data-transition');
                                            but.setAttribute('href', '#');

                                            $.mobile.changePage('#page1', {
                                                transition: 'slide',
                                                reverse: true
                                            });
                                            // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred while logging in \nPlease try again manually!', function() {
                                            $.mobile.changePage('#page1', {
                                                transition: 'slide',
                                                reverse: true
                                            });
                                        }, 'ERROR', 'OK');
                                    }
                                });*/
                                // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                            } else {
                                console.log('failure');
                                navigator.notification.alert('Unable to Register!', function() {}, 'Error', 'Close')
                                    //navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                            }
                        },
                        error: function(request, error) {
                            // This callback function will trigger on unsuccessful action              
                            navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR', 'OK');
                        }
                    });
                } else {
                    navigator.notification.alert('Provide all 4 Samples', null, 'Error!');
                }
            });

            document.getElementById('loginSub').addEventListener('click', function() {
                if ($('#uname').val() == '' || $('#pswd').val() == '') {
                    navigator.notification.alert("Username/Password cannot be empty", function() {}, 'Error', 'Close');
                } else {
                    uname = $('#uname');
                    pswd = $('#pswd');
                    //navigator.notification.alert("uname : "+uname.val()+"\npswd : "+pswd.val(),function(){},'Error','OK');
                    $.ajax({
                        url: 'http://10.0.0.2:8080/',
                        data: JSON.stringify({
                            action: 'login',
                            username: uname.val(),
                            password: pswd.val()
                        }),
                        type: 'post',
                        async: 'true',
                        contentType: 'application/json',
                        dataType: 'json',
                        timeout: 1000,
                        beforeSend: function() {
                            // This callback function will trigger before data is sent
                            //navigator.notification.alert("beforeSend",function(){},'info','OK');
                            $.mobile.loading('show', {
                                theme: "a",
                                text: "Please wait...",
                                textonly: true,
                                textVisible: true
                            }); // This will show ajax spinner
                        },
                        complete: function() {
                            // This callback function will trigger on data sent/received complete
                            //navigator.notification.alert("complete",function(){},'info','OK');
                            $.mobile.loading('hide'); // This will hide ajax spinner
                        },
                        success: function(result) {
                            if (result.stat == 'True') {
                                console.log('success!');
                                //navigator.notification.alert('Good Login!',function(){},'Success','Close')
                                logged_user = uname.val();
                                $('#loginBut').html('Logout');
                                but = document.getElementById('loginBut');
                                but.removeAttribute('data-transition');
                                but.setAttribute('href', '#');

                                $.mobile.changePage('#page1', {
                                    transition: 'slide',
                                    reverse: true
                                });
                                // navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                            } else {
                                console.log('failure');
                                navigator.notification.alert('Invalid Login!', function() {}, 'Error', 'Close')
                                    //navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                            }
                        },
                        error: function(request, error) {
                            // This callback function will trigger on unsuccessful action              
                            navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR', 'OK');
                        }
                    });
                }
            });

            document.getElementById('reg2').addEventListener('click', function(obj) {
                anchors = document.getElementsByName('pic');
                if (obj.target == anchors[0] || obj.target == anchors[0].getElementsByTagName('img')[0]) {
                    anchor = anchors[0].getElementsByTagName('img')[0];
                    if (anchor.getAttribute('src') == 'img/camera-black.svg') {
                        navigator.camera.getPicture(function(imageData) {
                            anchor.setAttribute('data', imageData);
                            anchor.setAttribute('style', 'width:60px;');
                            anchor.setAttribute('data', imageData);
                            anchor.setAttribute('src', 'data:image/jpeg;base64,' + imageData);
                            anchor.setAttribute('used', 'yes')
                            anchors[0].setAttribute('href', '#impop');
                            anchors[0].setAttribute('data-rel', 'popup');
                            anchors[0].setAttribute('data-position-to', '#reg2');
                        }, onFail, {
                            quality: 100,
                            destinationType: destinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            allowEdit: false,
                            mediaType: Camera.MediaType.PICTURE,
                            cameraDirection: Camera.Direction.FRONT
                        });
                    } else {
                        $('#popim').attr('src', anchor.getAttribute('src'));
                    }
                } else if (obj.target == anchors[1] || obj.target == anchors[1].getElementsByTagName('img')[0]) {
                    anchor = anchors[1].getElementsByTagName('img')[0];
                    if (anchor.getAttribute('src') == 'img/camera-black.svg') {
                        navigator.camera.getPicture(function(imageData) {
                            anchor.setAttribute('data', imageData);
                            anchor.setAttribute('style', 'width:60px;');
                            anchor.setAttribute('src', 'data:image/jpeg;base64,' + imageData);
                            anchor.setAttribute('used', 'yes')
                            anchors[1].setAttribute('href', '#impop');
                            anchors[1].setAttribute('data-rel', 'popup');
                            anchors[1].setAttribute('data-position-to', '#reg2');
                        }, onFail, {
                            quality: 100,
                            destinationType: destinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            allowEdit: false,
                            mediaType: Camera.MediaType.PICTURE,
                            cameraDirection: Camera.Direction.FRONT
                        });
                    } else {
                        $('#popim').attr('src', anchor.getAttribute('src'));
                    }
                } else if (obj.target == anchors[2] || obj.target == anchors[2].getElementsByTagName('img')[0]) {
                    anchor = anchors[2].getElementsByTagName('img')[0];
                    if (anchor.getAttribute('src') == 'img/camera-black.svg') {
                        navigator.camera.getPicture(function(imageData) {
                            anchor.setAttribute('data', imageData);
                            anchor.setAttribute('style', 'width:60px;');
                            anchor.setAttribute('src', 'data:image/jpeg;base64,' + imageData);
                            anchor.setAttribute('used', 'yes')
                            anchors[2].setAttribute('href', '#impop');
                            anchors[2].setAttribute('data-rel', 'popup');
                            anchors[2].setAttribute('data-position-to', '#reg2');
                        }, onFail, {
                            quality: 100,
                            destinationType: destinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            allowEdit: false,
                            mediaType: Camera.MediaType.PICTURE,
                            cameraDirection: Camera.Direction.FRONT
                        });
                    } else {
                        $('#popim').attr('src', anchor.getAttribute('src'));
                    }
                } else if (obj.target == anchors[3] || obj.target == anchors[3].getElementsByTagName('img')[0]) {
                    anchor = anchors[3].getElementsByTagName('img')[0];
                    if (anchor.getAttribute('src') == 'img/camera-black.svg') {
                        navigator.camera.getPicture(function(imageData) {
                            anchor.setAttribute('data', imageData);
                            anchor.setAttribute('style', 'width:60px;');
                            anchor.setAttribute('src', 'data:image/jpeg;base64,' + imageData);
                            anchor.setAttribute('used', 'yes')
                            anchors[3].setAttribute('href', '#impop');
                            anchors[3].setAttribute('data-rel', 'popup');
                            anchors[3].setAttribute('data-position-to', '#reg2');
                        }, onFail, {
                            quality: 100,
                            destinationType: destinationType.DATA_URL,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            allowEdit: false,
                            mediaType: Camera.MediaType.PICTURE,
                            cameraDirection: Camera.Direction.FRONT
                        });
                    } else {
                        $('#popim').attr('src', anchor.getAttribute('src'));
                    }
                }

            });



            //$("#trial").html("JQuery working!");

        }

        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();


/*$(document).ready(function(){
    document.getElementById('but-1').addEventListener('click',function() {
    alert('button clicked');
});    
});

$(document).ready(function(){
       
});
*/
