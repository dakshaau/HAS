/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function checkConnection() {

}

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
        $(document).ready(function() {
            //$("#navigator.notification.alert").modal('hide');
            $("[name='my-checkbox']").bootstrapSwitch();
            //url1 = 'http://192.168.1.5:8080';
            /*function alertDismissed() {
                // do something
            }*/

            /*navigator.notification.alert(
                'You are the winner!', // message
                navigator.notification.alertDismissed, // callback
                'Game Over', // title
                'Done' // buttonName
            );*/

            var networkState = navigator.connection.type;
            if (networkState != Connection.WIFI) {
                //$("#navigator.notification.alert").modal('show');
                navigator.notification.vibrate([100, 100, 100]);
                navigator.notification.alert('TURN YOUR WIFI ON!', function() {
                    navigator.app.exitApp();
                }, 'Error!', 'OK');
            } else {

                url1 = 'http://192.168.137.1:8080/'

                $.ajax({
                    url: url1,
                    data: JSON.stringify({
                        action: 'CHECK'
                    }),
                    type: 'post',
                    async: 'true',
                    contentType: 'application/json',
                    dataType: 'json',
                    timeout: 2000,
                    success: function(result) {
                        if(result.message == "0"){
                            $("#rl1").bootstrapSwitch('state',false);
                            $("#rl2").bootstrapSwitch('state',false);
                            $("#rl3").bootstrapSwitch('state',false);
                        }
                        else if(result.message == "1"){
                            $("#rl1").bootstrapSwitch('state',false);
                            $("#rl2").bootstrapSwitch('state',false);
                            $("#rl3").bootstrapSwitch('state',true);
                        }
                        else if(result.message == "2"){
                            $("#rl1").bootstrapSwitch('state',false);
                            $("#rl2").bootstrapSwitch('state',true);
                            $("#rl3").bootstrapSwitch('state',false);
                        }
                        else if(result.message == "3"){
                            $("#rl1").bootstrapSwitch('state',false);
                            $("#rl2").bootstrapSwitch('state',true);
                            $("#rl3").bootstrapSwitch('state',true);
                        }
                        else if(result.message == "4"){
                            $("#rl1").bootstrapSwitch('state',true);
                            $("#rl2").bootstrapSwitch('state',false);
                            $("#rl3").bootstrapSwitch('state',false);
                        }
                        else if(result.message == "5"){
                            $("#rl1").bootstrapSwitch('state',true);
                            $("#rl2").bootstrapSwitch('state',false);
                            $("#rl3").bootstrapSwitch('state',true);
                        }
                        else if(result.message == "6"){
                            $("#rl1").bootstrapSwitch('state',true);
                            $("#rl2").bootstrapSwitch('state',true);
                            $("#rl3").bootstrapSwitch('state',false);
                        }
                        else if(result.message == "7"){
                            $("#rl1").bootstrapSwitch('state',true);
                            $("#rl2").bootstrapSwitch('state',true);
                            $("#rl3").bootstrapSwitch('state',true);
                        }

                        $("#rl1").on('switchChange.bootstrapSwitch', function(event, state) {
                            if (state) {
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
                                            navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        } else {
                                            console.log('failure');
                                            navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR!', 'OK');
                                    }
                                });
                            } else {
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
                                            navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        } else {
                                            console.log('failure');
                                            navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR!', 'OK');
                                    }
                                });
                            }
                        });

                        $("#rl2").on('switchChange.bootstrapSwitch', function(event, state) {
                            if (state) {
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
                                            navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        } else {
                                            console.log('failure');
                                            navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR!', 'OK');
                                    }
                                });
                            } else {
                                $.ajax({
                                    url: url1,
                                    data: JSON.stringify({
                                        action: 'Relay 2 off'
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
                                            navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        } else {
                                            console.log('failure');
                                            navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR!', 'OK');
                                    }
                                });
                            }
                        });

                        $("#rl3").on('switchChange.bootstrapSwitch', function(event, state) {
                            if (state) {
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
                                            navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        } else {
                                            console.log('failure');
                                            navigator.notification.alert(':P!', navigator.notification.alertDismissed);
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR!', 'OK');
                                    }
                                });
                            } else {
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
                                            navigator.notification.alert(result.message, function() {}, 'Server Says:', 'Got it!');
                                        } else {
                                            console.log('failure');
                                            navigator.notification.alert(':P!', function() {}, 'Error!', 'OK');
                                        }
                                    },
                                    error: function(request, error) {
                                        // This callback function will trigger on unsuccessful action              
                                        navigator.notification.alert('Network error has occurred please try again!', function() {}, 'ERROR!', 'OK');
                                    }
                                });
                            }
                        });
                    },
                    error: function(request, error) {
                        navigator.notification.vibrate([100, 100, 100]);
                        navigator.notification.alert("Cannot connect to HAS, Try Again!\nRequest : "+request+"\nError : "+error , function() {
                            navigator.app.exitApp();
                        }, 'No Connection', 'Close App');
                    }
                });


                //$("#trial").html("JQuery working!");


            }
        });
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
