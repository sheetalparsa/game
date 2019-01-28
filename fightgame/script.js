angular.module('game', [])
    .controller('gameController', ['$scope', '$http', function ($scope, $http) {
        this.makeNewHero = function () {
            // console.log("here");
            var _this = this
            
            $http.get("http://localhost:3000/createhero")
                .then(function(response) {
                    let data = response.data;

                    //alert(JSON.stringify(typeof(reponse.data)))
                    _this.showFight = false;
                    _this.showChamp = false;
                    _this.showNewHero = true;
                    
                    _this.newHero = {
                        name: String(data.hero),
                        //img: "https://vignette.wikia.nocookie.net/batman/images/f/f7/The_Batman.jpg/"
                        img : "./images/batman.jpg"
                    };
                    //alert(JSON.stringify(data.hero))
                    //console.log(typeof(data.hero))
            });
           
        };
        this.fight = function () {
            var _this = this

            $http.get("http://localhost:3000/fighttodeath")
                .then(function(response) {
                    let data = response.data;
                    if (data.status == true) {
                        _this.showFight = true;
                        _this.showChamp = false;
                        _this.showNewHero = false;
                        
                        _this.hero1 = {
                            name: String(data.fightBetween[0]),
                            img: "./images/batman.jpg"
                        };
                        _this.hero2 = {
                            name: String(data.fightBetween[1]),
                            img: "./images/batman.jpg"
                        };
                        _this.heroAlive = {
                            name : String(data.alive)
                        }
                    } else {
                        alert("Cannot find two alive candidates")
                    }
                    //alert(JSON.stringify(data.hero))
                    //alert(JSON.stringify(data.champion))
            });
        };
        this.champion = function () {
            
            var _this = this
            $http.get("http://localhost:3000/champion")
                .then(function(response) {
                    let data = response.data;
                    //alert(String($scope))
                    _this.showFight = false;
                    _this.showChamp = true;
                    _this.showNewHero = false;
                    _this.champ = {
                        name: String(data.champion),
                        img: "./images/batman.jpg"
                    };
                    //alert(_this.champ.name)
                    //document.getElementById("gc")
                    //champ.name = String(data.champion)
            });
        };
    }])