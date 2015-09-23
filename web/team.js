var webSocket = new WebSocket("ws://localhost:8001");
angular.module('teamApp', [])
  .controller('TeamController', function($scope) {
    var teamController = this;
    teamController.data = {};
 
    teamController.score = function() {
      webSocket.send(JSON.stringify({
        event : "score"
       }));
    };
    teamController.cruzeirenseConnect = function() {
      teamController.team = "Cruzeiro";
      webSocket.send(JSON.stringify({
        event : "cruzeirenseConnect"
       }));
    };
    teamController.atleticoConnect = function() {
      teamController.team = "Atletico";
      webSocket.send(JSON.stringify({
        event : "atleticoConnect"
       }));
    };
    webSocket.onmessage = function(menssage){
      var obj = JSON.parse(menssage.data);
      if(obj.data && obj.data.scores){
        teamController.data = obj.data;
        $scope.$apply();
      }
    };
  });